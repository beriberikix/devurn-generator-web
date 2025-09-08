import { NextRequest, NextResponse } from 'next/server';
import { validateInput, SubtypeKey, SUBTYPES } from '@/lib/dev-urn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subtype, input } = body;

    if (!subtype || input === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: subtype and input' },
        { status: 400 }
      );
    }

    if (!SUBTYPES[subtype as SubtypeKey]) {
      return NextResponse.json(
        { error: `Invalid subtype: ${subtype}` },
        { status: 400 }
      );
    }

    const validation = validateInput(subtype as SubtypeKey, input);
    
    return NextResponse.json({
      valid: validation.isValid,
      error: validation.error || null,
      subtype,
      input,
      format: SUBTYPES[subtype as SubtypeKey].format,
      example: SUBTYPES[subtype as SubtypeKey].example
    });

  } catch (error) {
    console.error('Validate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'POST to /api/validate with { subtype, input } to validate a device identifier',
      example: {
        subtype: 'mac',
        input: '00:1B:44:11:3A:B7'
      }
    },
    { status: 200 }
  );
}