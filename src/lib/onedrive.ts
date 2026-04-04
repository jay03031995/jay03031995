import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import * as msal from '@azure/msal-node';
import { prisma } from './prisma';

const msalConfig = {
    auth: {
        clientId: process.env.ONEDRIVE_CLIENT_ID || 'placeholder',
        authority: `https://login.microsoftonline.com/${process.env.ONEDRIVE_TENANT_ID || 'common'}`,
        clientSecret: process.env.ONEDRIVE_CLIENT_SECRET || 'placeholder',
    }
};

const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
};

// Lazy initialization to avoid build-time errors when env vars are missing
let cca: msal.ConfidentialClientApplication | null = null;

function getCCA() {
    if (!cca) {
        cca = new msal.ConfidentialClientApplication(msalConfig);
    }
    return cca;
}

async function getAccessToken() {
    try {
        const clientApp = getCCA();
        const response = await clientApp.acquireTokenByClientCredential(tokenRequest);
        return response?.accessToken;
    } catch (error) {
        console.error('Error acquiring access token:', error);
        return null;
    }
}

export async function getGraphClient() {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error('Could not get access token');

    return Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
}

export async function syncOneDriveAssignments(tenantId: string) {
    // Check if configured
    if (!process.env.ONEDRIVE_CLIENT_ID || !process.env.ONEDRIVE_CLIENT_SECRET) {
        console.warn('OneDrive is not configured. Skipping sync.');
        return [];
    }

    const client = await getGraphClient();
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const pending = await prisma.contentCalendar.findMany({
        where: {
            tenantId,
            date: { gte: startOfDay, lte: endOfDay },
            status: 'PENDING'
        },
        include: {
            client: {
                include: { editor: true }
            }
        }
    });

    const results = [];

    for (const entry of pending) {
        if (!entry.client.oneDriveFolder || !entry.client.editor) continue;

        try {
            const children = await client.api(`/me/drive/root:/${entry.client.oneDriveFolder}:/children`).get();
            const videos = children.value.filter((f: any) => f.file && !f.name.startsWith('Assigned-'));

            if (videos.length > 0) {
                const videoToAssign = videos[0];
                const newName = `Assigned-${entry.client.editor.name?.replace(/\s+/g, '') || 'Editor'}-${videoToAssign.name}`;

                await client.api(`/me/drive/items/${videoToAssign.id}`).patch({
                    name: newName
                });

                await prisma.contentCalendar.update({
                    where: { id: entry.id },
                    data: {
                        status: 'ASSIGNED',
                        videoUrl: videoToAssign.webUrl
                    }
                });

                results.push({ entryId: entry.id, status: 'SUCCESS', fileName: newName });
            }
        } catch (error: any) {
            console.error(`Error processing entry ${entry.id}:`, error);
            results.push({ entryId: entry.id, status: 'ERROR', message: error.message });
        }
    }

    return results;
}
