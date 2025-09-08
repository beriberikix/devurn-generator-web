'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  SUBTYPES, 
  SubtypeKey, 
  validateInput, 
  generateDevUrn, 
  breakdownUrn, 
  detectSubtype,
  UrnBreakdown 
} from '@/lib/dev-urn';
import { Copy, Check, AlertCircle, Info } from 'lucide-react';

export default function DevUrnGenerator() {
  const [selectedSubtype, setSelectedSubtype] = useState<SubtypeKey>('mac');
  const [inputValue, setInputValue] = useState('');
  const [generatedUrn, setGeneratedUrn] = useState('');
  const [urnBreakdown, setUrnBreakdown] = useState<UrnBreakdown | null>(null);
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setValidationError('');
    setGeneratedUrn('');
    setUrnBreakdown(null);
    setAutoDetected(false);

    if (value.trim()) {
      const detected = detectSubtype(value.trim());
      if (detected && detected !== selectedSubtype) {
        setSelectedSubtype(detected);
        setAutoDetected(true);
      }
    }
  };

  const handleSubtypeChange = (subtype: SubtypeKey) => {
    setSelectedSubtype(subtype);
    setValidationError('');
    setGeneratedUrn('');
    setUrnBreakdown(null);
    setAutoDetected(false);
  };

  const generateUrn = () => {
    try {
      const validation = validateInput(selectedSubtype, inputValue);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid input');
        return;
      }

      const urn = generateDevUrn(selectedSubtype, inputValue);
      setGeneratedUrn(urn);
      
      const breakdown = breakdownUrn(urn);
      setUrnBreakdown(breakdown);
      
      setValidationError('');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateUrn();
    }
  };

  const subtypeOptions = Object.entries(SUBTYPES).map(([key, value]) => ({
    value: key as SubtypeKey,
    label: value.name,
    description: value.description
  }));

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate DEV URN</CardTitle>
          <CardDescription>
            Enter a device identifier and select the appropriate subtype to generate a DEV URN.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtype">Subtype</Label>
              <Select value={selectedSubtype} onValueChange={handleSubtypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {subtypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {autoDetected && (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <Info className="h-3 w-3" />
                  Auto-detected subtype
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input">Device Identifier</Label>
              <Input
                id="input"
                placeholder={SUBTYPES[selectedSubtype].example}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className={validationError ? 'border-red-500' : ''}
              />
              {validationError && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {validationError}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <strong>Format:</strong> {SUBTYPES[selectedSubtype].format}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Example:</strong> {SUBTYPES[selectedSubtype].example}
            </div>
          </div>
          
          <Button 
            onClick={generateUrn}
            disabled={!inputValue.trim()}
            className="w-full md:w-auto"
          >
            Generate DEV URN
          </Button>
        </CardContent>
      </Card>

      {/* Result Section */}
      {generatedUrn && (
        <Card>
          <CardHeader>
            <CardTitle>Generated URN</CardTitle>
            <CardDescription>
              Your device identifier has been converted to a DEV URN.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Textarea
                value={generatedUrn}
                readOnly
                className="flex-1 font-mono text-sm resize-none"
                rows={2}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* URN Breakdown Section */}
      {urnBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle>URN Breakdown</CardTitle>
            <CardDescription>
              Detailed breakdown of the generated DEV URN components.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Full URN</Label>
                  <div className="font-mono text-sm p-2 bg-muted rounded">
                    {urnBreakdown.urn}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Namespace</Label>
                  <div className="font-mono text-sm p-2 bg-muted rounded">
                    {urnBreakdown.namespace}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Subtype</Label>
                  <div className="font-mono text-sm p-2 bg-muted rounded">
                    {urnBreakdown.subtype}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Identifier</Label>
                  <div className="font-mono text-sm p-2 bg-muted rounded break-all">
                    {urnBreakdown.identifier}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="text-sm p-2 bg-muted rounded">
                    {urnBreakdown.description}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Expected Format</Label>
                  <div className="text-sm p-2 bg-muted rounded">
                    {urnBreakdown.format}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>About DEV URNs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Device Identifier URNs (DEV URNs) are defined in{' '}
              <a 
                href="https://datatracker.ietf.org/doc/html/rfc9039" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                RFC 9039
              </a>{' '}
              and provide a standardized way to identify devices using various identifier types.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Supported subtypes include MAC addresses, 1-Wire device identifiers, and organization-defined identifiers.
              Each subtype has specific formatting requirements and validation rules.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}