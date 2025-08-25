import { NextRequest, NextResponse } from 'next/server';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'aehp3j-xw.myshopify.com';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storefrontApiVersion = '2024-01';
const storefrontEndpoint = `https://${domain}/api/${storefrontApiVersion}/graphql.json`;

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!storefrontAccessToken) {
      return NextResponse.json(
        { error: 'Storefront Access Token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(storefrontEndpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shopify Storefront API Error:', data);
      return NextResponse.json(
        { error: data.errors?.[0]?.message || 'API Error' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Shopify Storefront route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}