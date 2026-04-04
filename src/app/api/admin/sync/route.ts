import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';
import { syncOneDriveAssignments } from '@/lib/onedrive';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await syncOneDriveAssignments(session.tenantId);
    return NextResponse.json({ message: 'Sync complete', results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to trigger sync', details: error.message }, { status: 500 });
  }
}
