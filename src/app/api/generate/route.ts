import { NextRequest, NextResponse } from 'next/server';
import { generateDevUrn, validateInput, SubtypeKey, SUBTYPES } from '@/lib/dev-urn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subtype, input } = body;

    if (!subtype || !input) {
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
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const urn = generateDevUrn(subtype as SubtypeKey, input);
    
    return NextResponse.json({
      urn,
      subtype,
      input: input.trim(),
      valid: true
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'POST to /api/generate with { subtype, input } to generate a DEV URN',
      example: {
        subtype: 'mac',
        input: '00:1B:44:11:3A:B7'
      }
    },
    { status: 200 }
  );
}