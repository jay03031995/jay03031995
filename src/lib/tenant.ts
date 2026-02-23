import { headers } from 'next/headers';

export async function getTenantId() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Example: subdomain.domain.com
  // In development, it might be localhost:3000
  // const subdomain = host.split('.')[0];

  // For demo purposes, if we're on localhost or there's no subdomain, we might return a default tenant or use a header
  // In a real app, you would look up the tenant in the DB by subdomain/slug
  const tenantId = headersList.get('x-tenant-id');

  return tenantId || 'cl00000000000000000000000'; // Mocked default tenant ID for demo
}
