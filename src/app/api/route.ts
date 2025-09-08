import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'DEV URN Generator API',
    version: '1.0.0',
    description: 'REST API for generating and validating Device Identifier URNs according to RFC 9039',
    rfc: 'RFC 9039',
    namespace: 'urn:dev',
    endpoints: {
      '/api/subtypes': {
        method: 'GET',
        description: 'List all supported DEV URN subtypes',
        response: 'Array of subtype definitions'
      },
      '/api/detect': {
        method: 'POST',
        description: 'Auto-detect subtype from device identifier',
        body: { input: 'string' },
        response: 'Detected subtype and metadata'
      },
      '/api/validate': {
        method: 'POST',
        description: 'Validate a device identifier for a specific subtype',
        body: { subtype: 'string', input: 'string' },
        response: 'Validation result and metadata'
      },
      '/api/generate': {
        method: 'POST',
        description: 'Generate a DEV URN from device identifier',
        body: { subtype: 'string', input: 'string' },
        response: 'Generated URN and metadata'
      }
    },
    examples: {
      detectMac: {
        url: '/api/detect',
        method: 'POST',
        body: { input: '00:1B:44:11:3A:B7' }
      },
      validateMac: {
        url: '/api/validate',
        method: 'POST',
        body: { subtype: 'mac', input: '00:1B:44:11:3A:B7' }
      },
      generateMac: {
        url: '/api/generate',
        method: 'POST',
        body: { subtype: 'mac', input: '00:1B:44:11:3A:B7' }
      }
    }
  });
}