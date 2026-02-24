import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const integration = await prisma.apiIntegration.findFirst({
      where: { id, tenantId: session.tenantId },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!integration) return NextResponse.json({ error: 'Integration not found' }, { status: 404 });

    return NextResponse.json(integration);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch integration' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, status, apiKey, secretKey, environment, baseUrl, webhookUrl } = body;

    const integration = await prisma.apiIntegration.update({
      where: { id },
      data: {
        name,
        status,
        apiKey,
        secretKey,
        environment,
        baseUrl,
        webhookUrl
      }
    });

    await prisma.apiActivity.create({
      data: {
        apiId: id,
        type: 'Settings Updated',
        description: `Settings for ${integration.name} were updated.`
      }
    });

    return NextResponse.json(integration);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.apiIntegration.delete({ where: { id } });
    return NextResponse.json({ message: 'Integration deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete integration' }, { status: 500 });
  }
}
