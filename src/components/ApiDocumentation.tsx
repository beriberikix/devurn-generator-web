'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Code, Terminal, Globe } from 'lucide-react';

export default function ApiDocumentation() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';

  const endpoints = [
    {
      id: 'subtypes',
      method: 'GET',
      path: '/api/subtypes',
      title: 'List Subtypes',
      description: 'Get all supported DEV URN subtypes',
      curl: `curl -s ${baseUrl}/api/subtypes`,
      response: `{
  "subtypes": [
    {
      "subtype": "mac",
      "name": "MAC/EUI Address",
      "description": "MAC-48, EUI-48, or EUI-64 address",
      "format": "XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX or XXXXXXXXXXXX",
      "example": "00:1B:44:11:3A:B7"
    }
  ],
  "count": 5,
  "rfc": "RFC 9039",
  "namespace": "urn:dev"
}`
    },
    {
      id: 'detect',
      method: 'POST',
      path: '/api/detect',
      title: 'Detect Subtype',
      description: 'Auto-detect subtype from device identifier',
      curl: `curl -s -X POST -H "Content-Type: application/json" \\
  -d '{"input":"00:1B:44:11:3A:B7"}' \\
  ${baseUrl}/api/detect`,
      response: `{
  "input": "00:1B:44:11:3A:B7",
  "detectedSubtype": "mac",
  "subtypeInfo": {
    "name": "MAC/EUI Address",
    "description": "MAC-48, EUI-48, or EUI-64 address",
    "format": "XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX or XXXXXXXXXXXX",
    "example": "00:1B:44:11:3A:B7"
  },
  "success": true
}`
    },
    {
      id: 'validate',
      method: 'POST',
      path: '/api/validate',
      title: 'Validate Identifier',
      description: 'Validate device identifier for specific subtype',
      curl: `curl -s -X POST -H "Content-Type: application/json" \\
  -d '{"subtype":"mac","input":"00:1B:44:11:3A:B7"}' \\
  ${baseUrl}/api/validate`,
      response: `{
  "valid": true,
  "error": null,
  "subtype": "mac",
  "input": "00:1B:44:11:3A:B7",
  "format": "XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX or XXXXXXXXXXXX",
  "example": "00:1B:44:11:3A:B7"
}`
    },
    {
      id: 'generate',
      method: 'POST',
      path: '/api/generate',
      title: 'Generate URN',
      description: 'Generate DEV URN from device identifier',
      curl: `curl -s -X POST -H "Content-Type: application/json" \\
  -d '{"subtype":"mac","input":"00:1B:44:11:3A:B7"}' \\
  ${baseUrl}/api/generate`,
      response: `{
  "urn": "urn:dev:mac:021b44fffe113ab7",
  "subtype": "mac",
  "input": "00:1B:44:11:3A:B7",
  "valid": true
}`
    }
  ];

  const examples = [
    {
      title: 'JavaScript/Node.js',
      language: 'javascript',
      code: `// Generate DEV URN
const response = await fetch('${baseUrl}/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subtype: 'mac',
    input: '00:1B:44:11:3A:B7'
  })
});

const result = await response.json();
console.log(result.urn); // urn:dev:mac:021b44fffe113ab7`
    },
    {
      title: 'Python',
      language: 'python',
      code: `import requests

# Generate DEV URN
response = requests.post('${baseUrl}/api/generate', 
  json={
    'subtype': 'mac',
    'input': '00:1B:44:11:3A:B7'
  }
)

result = response.json()
print(result['urn'])  # urn:dev:mac:021b44fffe113ab7`
    },
    {
      title: 'Go',
      language: 'go',
      code: `package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "net/http"
)

func main() {
  payload := map[string]string{
    "subtype": "mac",
    "input":   "00:1B:44:11:3A:B7",
  }
  
  jsonData, _ := json.Marshal(payload)
  resp, _ := http.Post("${baseUrl}/api/generate", 
    "application/json", bytes.NewBuffer(jsonData))
  
  var result map[string]interface{}
  json.NewDecoder(resp.Body).Decode(&result)
  fmt.Println(result["urn"])
}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* API Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            REST API Documentation
          </CardTitle>
          <CardDescription>
            Programmatic access to DEV URN generation and validation functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            <span className="font-medium">Base URL:</span>
            <code className="bg-muted px-2 py-1 rounded font-mono">{baseUrl}</code>
          </div>
          <div className="text-sm text-muted-foreground">
            All endpoints return JSON responses. POST endpoints require Content-Type: application/json.
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      {endpoints.map((endpoint) => (
        <Card key={endpoint.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                {endpoint.method}
              </Badge>
              <code className="text-base">{endpoint.path}</code>
            </CardTitle>
            <CardDescription>{endpoint.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-4 w-4" />
                <span className="font-medium">cURL Example</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(endpoint.curl, endpoint.id)}
                >
                  {copiedEndpoint === endpoint.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea
                value={endpoint.curl}
                readOnly
                className="font-mono text-sm resize-none"
                rows={endpoint.curl.split('\n').length}
              />
            </div>
            
            <div>
              <div className="font-medium mb-2">Response Example</div>
              <Textarea
                value={endpoint.response}
                readOnly
                className="font-mono text-sm resize-none"
                rows={endpoint.response.split('\n').length}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>
            Examples of using the API in different programming languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {examples.map((example, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{example.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(example.code, `example-${index}`)}
                >
                  {copiedEndpoint === `example-${index}` ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea
                value={example.code}
                readOnly
                className="font-mono text-sm resize-none"
                rows={example.code.split('\n').length}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Examples</CardTitle>
          <CardDescription>More examples with different device identifier types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {[
              { subtype: 'ow', input: '1000008F12AA', description: '1-Wire Device' },
              { subtype: 'org', input: '32473:foo', description: 'Organization Defined' },
              { subtype: 'os', input: '32473:12345', description: 'Organization Serial' },
              { subtype: 'ops', input: '32473:switch:12345', description: 'Organization Product+Serial' }
            ].map((ex, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="font-medium mb-2">{ex.description}</div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Input:</span> <code className="bg-muted px-2 py-1 rounded">{ex.input}</code>
                  </div>
                  <div className="font-mono text-xs bg-muted p-2 rounded">
                    curl -X POST -H &quot;Content-Type: application/json&quot; \<br/>
                    &nbsp;&nbsp;-d &apos;{`{&quot;subtype&quot;:&quot;${ex.subtype}&quot;,&quot;input&quot;:&quot;${ex.input}&quot;}`}&apos; \<br/>
                    &nbsp;&nbsp;{baseUrl}/api/generate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}