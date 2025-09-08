import DevUrnGenerator from '@/components/DevUrnGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              DEV URN Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Generate Device Identifier URNs according to RFC 9039
            </p>
          </div>
          <DevUrnGenerator />
        </div>
      </div>
    </div>
  );
}
