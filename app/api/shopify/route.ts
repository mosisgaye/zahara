
import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'aehp3j-xw.myshopify.com';
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables, useAdmin } = body;
    
    let endpoint: string;
    let headers: HeadersInit;
    
    // Toujours utiliser l'API Admin (pas de token Storefront valide pour le moment)
    endpoint = `https://${SHOPIFY_DOMAIN}/admin/api/2025-07/graphql.json`;
    headers = {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Shopify API Error:', data);
      return NextResponse.json(
        { message: data.errors?.[0]?.message || 'Shopify API error', errors: data.errors },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Shopify proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Shopify' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Shopify API Proxy Ready' });
}
