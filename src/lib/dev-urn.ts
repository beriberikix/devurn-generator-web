export interface DeviceIdentifier {
  subtype: string;
  value: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UrnBreakdown {
  urn: string;
  namespace: string;
  subtype: string;
  identifier: string;
  description: string;
  format: string;
}

export const SUBTYPES = {
  mac: {
    name: 'MAC/EUI Address',
    description: 'MAC-48, EUI-48, or EUI-64 address',
    format: 'XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX or XXXXXXXXXXXX',
    example: '00:1B:44:11:3A:B7'
  },
  ow: {
    name: '1-Wire Device',
    description: '1-Wire device identifier (64-bit)',
    format: '16 hexadecimal characters',
    example: '1000008F12AA'
  },
  org: {
    name: 'Organization Defined',
    description: 'Organization-specific identifier using PEN',
    format: 'PEN:identifier',
    example: '32473:foo'
  },
  os: {
    name: 'Organization Serial',
    description: 'Organization serial number using PEN',
    format: 'PEN:serial',
    example: '32473:12345'
  },
  ops: {
    name: 'Organization Product+Serial',
    description: 'Organization product class and serial using PEN',
    format: 'PEN:product:serial',
    example: '32473:switch:12345'
  }
} as const;

export type SubtypeKey = keyof typeof SUBTYPES;

function normalizeHex(input: string): string {
  return input.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
}

function isValidHex(input: string, expectedLength?: number): boolean {
  const hex = normalizeHex(input);
  if (expectedLength && hex.length !== expectedLength) {
    return false;
  }
  return /^[0-9a-f]*$/.test(hex);
}

function macToEui64(mac: string): string {
  const hex = normalizeHex(mac);
  
  if (hex.length === 12) {
    // Convert MAC-48/EUI-48 to EUI-64
    const prefix = hex.substring(0, 6);
    const suffix = hex.substring(6, 12);
    
    // Insert FFFE in the middle and flip the universal/local bit
    const firstByte = parseInt(prefix.substring(0, 2), 16);
    const modifiedFirstByte = (firstByte ^ 0x02).toString(16).padStart(2, '0');
    
    return modifiedFirstByte + prefix.substring(2) + 'fffe' + suffix;
  } else if (hex.length === 16) {
    // Already EUI-64, just flip the universal/local bit
    const firstByte = parseInt(hex.substring(0, 2), 16);
    const modifiedFirstByte = (firstByte ^ 0x02).toString(16).padStart(2, '0');
    
    return modifiedFirstByte + hex.substring(2);
  }
  
  throw new Error('Invalid MAC address length');
}

function validatePen(pen: string): boolean {
  if (!/^\d+$/.test(pen)) return false;
  const penNumber = parseInt(pen, 10);
  return penNumber > 0 && !pen.startsWith('0');
}

export function validateInput(subtype: SubtypeKey, input: string): ValidationResult {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return { isValid: false, error: 'Input cannot be empty' };
  }

  switch (subtype) {
    case 'mac': {
      const hex = normalizeHex(trimmedInput);
      if (hex.length !== 12 && hex.length !== 16) {
        return { 
          isValid: false, 
          error: 'MAC address must be 12 hex characters (MAC-48/EUI-48) or 16 hex characters (EUI-64)' 
        };
      }
      if (!isValidHex(trimmedInput)) {
        return { isValid: false, error: 'MAC address must contain only hexadecimal characters' };
      }
      return { isValid: true };
    }
    
    case 'ow': {
      const hex = normalizeHex(trimmedInput);
      if (hex.length !== 16) {
        return { isValid: false, error: '1-Wire identifier must be exactly 16 hexadecimal characters' };
      }
      if (!isValidHex(trimmedInput, 16)) {
        return { isValid: false, error: '1-Wire identifier must contain only hexadecimal characters' };
      }
      return { isValid: true };
    }
    
    case 'org': {
      const parts = trimmedInput.split(':');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Format must be PEN:identifier' };
      }
      if (!validatePen(parts[0])) {
        return { isValid: false, error: 'PEN must be a positive integer without leading zeros' };
      }
      if (!parts[1]) {
        return { isValid: false, error: 'Identifier cannot be empty' };
      }
      return { isValid: true };
    }
    
    case 'os': {
      const parts = trimmedInput.split(':');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Format must be PEN:serial' };
      }
      if (!validatePen(parts[0])) {
        return { isValid: false, error: 'PEN must be a positive integer without leading zeros' };
      }
      if (!parts[1]) {
        return { isValid: false, error: 'Serial number cannot be empty' };
      }
      return { isValid: true };
    }
    
    case 'ops': {
      const parts = trimmedInput.split(':');
      if (parts.length !== 3) {
        return { isValid: false, error: 'Format must be PEN:product:serial' };
      }
      if (!validatePen(parts[0])) {
        return { isValid: false, error: 'PEN must be a positive integer without leading zeros' };
      }
      if (!parts[1]) {
        return { isValid: false, error: 'Product class cannot be empty' };
      }
      if (!parts[2]) {
        return { isValid: false, error: 'Serial number cannot be empty' };
      }
      return { isValid: true };
    }
    
    default:
      return { isValid: false, error: 'Unknown subtype' };
  }
}

export function generateDevUrn(subtype: SubtypeKey, input: string): string {
  const validation = validateInput(subtype, input);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const trimmedInput = input.trim();

  switch (subtype) {
    case 'mac': {
      const eui64 = macToEui64(trimmedInput);
      return `urn:dev:mac:${eui64}`;
    }
    
    case 'ow': {
      const hex = normalizeHex(trimmedInput);
      return `urn:dev:ow:${hex}`;
    }
    
    case 'org':
    case 'os':
    case 'ops': {
      return `urn:dev:${subtype}:${trimmedInput}`;
    }
    
    default:
      throw new Error('Unknown subtype');
  }
}

export function breakdownUrn(urn: string): UrnBreakdown {
  const parts = urn.split(':');
  
  if (parts.length < 4 || parts[0] !== 'urn' || parts[1] !== 'dev') {
    throw new Error('Invalid DEV URN format');
  }
  
  const subtype = parts[2] as SubtypeKey;
  const identifier = parts.slice(3).join(':');
  
  if (!SUBTYPES[subtype]) {
    throw new Error(`Unknown subtype: ${subtype}`);
  }
  
  return {
    urn,
    namespace: 'dev',
    subtype,
    identifier,
    description: SUBTYPES[subtype].description,
    format: SUBTYPES[subtype].format
  };
}

export function detectSubtype(input: string): SubtypeKey | null {
  const trimmedInput = input.trim();
  
  // Check for MAC address patterns
  if (/^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/.test(trimmedInput) || 
      /^([0-9a-fA-F]{2}[:-]){7}[0-9a-fA-F]{2}$/.test(trimmedInput) ||
      /^[0-9a-fA-F]{12}$/.test(trimmedInput) ||
      /^[0-9a-fA-F]{16}$/.test(trimmedInput)) {
    // Additional check for 1-Wire (exactly 16 hex chars without separators)
    if (/^[0-9a-fA-F]{16}$/.test(trimmedInput)) {
      // Could be either MAC (EUI-64) or 1-Wire, default to MAC
      return 'mac';
    }
    return 'mac';
  }
  
  // Check for organization patterns (PEN:something)
  if (/^\d+:.+/.test(trimmedInput)) {
    const parts = trimmedInput.split(':');
    if (parts.length === 2) {
      return 'org';
    } else if (parts.length === 3) {
      return 'ops';
    }
  }
  
  return null;
}