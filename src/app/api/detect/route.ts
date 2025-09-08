import { NextRequest, NextResponse } from 'next/server';
import { detectSubtype, SUBTYPES } from '@/lib/dev-urn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (input === undefined) {
      return NextResponse.json(
        { error: 'Missing required field: input' },
        { status: 400 }
      );
    }

    const detectedSubtype = detectSubtype(input);
    
    return NextResponse.json({
      input,
      detectedSubtype: detectedSubtype || null,
      subtypeInfo: detectedSubtype ? {
        name: SUBTYPES[detectedSubtype].name,
        description: SUBTYPES[detectedSubtype].description,
        format: SUBTYPES[detectedSubtype].format,
        example: SUBTYPES[detectedSubtype].example
      } : null,
      success: detectedSubtype !== null
    });

  } catch (error) {
    console.error('Detect API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'POST to /api/detect with { input } to auto-detect the subtype of a device identifier',
      examples: [
        { input: '00:1B:44:11:3A:B7', expectedSubtype: 'mac' },
        { input: '1000008F12AA', expectedSubtype: 'mac' },
        { input: '32473:foo', expectedSubtype: 'org' },
        { input: '32473:switch:12345', expectedSubtype: 'ops' }
      ]
    },
    { status: 200 }
  );
}