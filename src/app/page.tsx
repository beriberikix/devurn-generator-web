import DevUrnGenerator from '@/components/DevUrnGenerator';
import ApiDocumentation from '@/components/ApiDocumentation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              DEV URN Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Generate Device Identifier URNs according to RFC 9039
            </p>
          </div>
          
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generator">Generator</TabsTrigger>
              <TabsTrigger value="api">API Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator" className="mt-6">
              <DevUrnGenerator />
            </TabsContent>
            
            <TabsContent value="api" className="mt-6">
              <ApiDocumentation />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
