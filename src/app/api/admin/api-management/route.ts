import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const integrations = await prisma.apiIntegration.findMany({
      where: { tenantId: session.tenantId },
      include: {
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json(integrations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, serviceType, apiKey, secretKey, environment, baseUrl, webhookUrl } = body;

    const integration = await prisma.apiIntegration.create({
      data: {
        name,
        serviceType,
        apiKey,
        secretKey,
        environment,
        baseUrl,
        webhookUrl,
        tenantId: session.tenantId,
      }
    });

    await prisma.apiActivity.create({
      data: {
        apiId: integration.id,
        type: 'Connection Established',
        description: `New service ${name} was connected.`
      }
    });

    return NextResponse.json(integration);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 });
  }
}
