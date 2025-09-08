import { NextResponse } from 'next/server';
import { SUBTYPES } from '@/lib/dev-urn';

export async function GET() {
  try {
    const subtypesArray = Object.entries(SUBTYPES).map(([key, value]) => ({
      subtype: key,
      name: value.name,
      description: value.description,
      format: value.format,
      example: value.example
    }));

    return NextResponse.json({
      subtypes: subtypesArray,
      count: subtypesArray.length,
      rfc: 'RFC 9039',
      namespace: 'urn:dev'
    });

  } catch (error) {
    console.error('Subtypes API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}