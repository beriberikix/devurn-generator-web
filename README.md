# DEV URN Generator

![DEV URN Generator](https://img.shields.io/badge/RFC-9039-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

A comprehensive web application and REST API for generating Device Identifier URNs according to [RFC 9039](https://datatracker.ietf.org/doc/html/rfc9039). Built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Features

- **🌐 Web Interface** - Clean, responsive web UI with light/dark mode
- **🔧 REST API** - Full-featured API for programmatic access
- **📱 Auto-detection** - Smart detection of device identifier types
- **✅ Validation** - Comprehensive input validation for all subtypes
- **📋 Multiple Formats** - Supports various input formats (colons, hyphens, no separators)
- **📖 Documentation** - Built-in API documentation and examples
- **🔒 RFC Compliant** - Full compliance with RFC 9039 specifications

## 📋 Supported Subtypes

| Subtype | Name | Description | Example |
|---------|------|-------------|---------|
| `mac` | MAC/EUI Address | MAC-48, EUI-48, or EUI-64 address | `00:1B:44:11:3A:B7` |
| `ow` | 1-Wire Device | 1-Wire device identifier (64-bit) | `1000008F12AA` |
| `org` | Organization Defined | Organization-specific identifier using PEN | `32473:foo` |
| `os` | Organization Serial | Organization serial number using PEN | `32473:12345` |
| `ops` | Organization Product+Serial | Organization product class and serial using PEN | `32473:switch:12345` |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/devurn-generator-web.git
   cd devurn-generator-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

This app is optimized for Vercel deployment with zero configuration needed.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure everything
   - Click "Deploy"

3. **Your app will be live!** 
   - Vercel provides a URL like `https://your-app-name.vercel.app`
   - API endpoints work automatically at `https://your-app-name.vercel.app/api/*`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from terminal:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Configure project settings (or use defaults)
   - Deploy!

### Environment Variables (Optional)

No environment variables are required for basic functionality. All configuration is built-in.

### Custom Domain (Optional)

After deployment, you can add a custom domain in your Vercel dashboard:
1. Go to your project settings
2. Click "Domains" 
3. Add your custom domain
4. Update your DNS records as instructed

## 💻 Web Interface Usage

### Generator Tab
1. Select the device identifier subtype from the dropdown
2. Enter your device identifier (auto-detection available)
3. Click "Generate DEV URN" 
4. View the generated URN and detailed breakdown
5. Copy the result with one click

### API Documentation Tab
- Complete REST API documentation
- Interactive examples with copy-to-clipboard
- Code examples in multiple languages
- Live endpoint testing

## 🔌 REST API Usage

The API provides four main endpoints for DEV URN operations:

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 📊 List All Subtypes
```bash
# Get all supported subtypes
curl -s http://localhost:3001/api/subtypes
```

#### 🔍 Auto-detect Subtype
```bash
# Detect subtype from device identifier
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"input":"00:1B:44:11:3A:B7"}' \
  http://localhost:3001/api/detect
```

#### ✅ Validate Device Identifier
```bash
# Validate device identifier for specific subtype
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"mac","input":"00:1B:44:11:3A:B7"}' \
  http://localhost:3001/api/validate
```

#### 🏗️ Generate DEV URN
```bash
# Generate DEV URN from device identifier
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"mac","input":"00:1B:44:11:3A:B7"}' \
  http://localhost:3001/api/generate
```

### API Response Examples

#### Generate Response
```json
{
  "urn": "urn:dev:mac:021b44fffe113ab7",
  "subtype": "mac",
  "input": "00:1B:44:11:3A:B7",
  "valid": true
}
```

#### Validation Response
```json
{
  "valid": true,
  "error": null,
  "subtype": "mac",
  "input": "00:1B:44:11:3A:B7",
  "format": "XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX or XXXXXXXXXXXX",
  "example": "00:1B:44:11:3A:B7"
}
```

## 💡 Code Examples

### JavaScript/Node.js
```javascript
// Generate DEV URN
const response = await fetch('http://localhost:3001/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subtype: 'mac',
    input: '00:1B:44:11:3A:B7'
  })
});

const result = await response.json();
console.log(result.urn); // urn:dev:mac:021b44fffe113ab7
```

### Python
```python
import requests

# Generate DEV URN
response = requests.post('http://localhost:3001/api/generate', 
  json={
    'subtype': 'mac',
    'input': '00:1B:44:11:3A:B7'
  }
)

result = response.json()
print(result['urn'])  # urn:dev:mac:021b44fffe113ab7
```

### Go
```go
package main

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
  resp, _ := http.Post("http://localhost:3001/api/generate", 
    "application/json", bytes.NewBuffer(jsonData))
  
  var result map[string]interface{}
  json.NewDecoder(resp.Body).Decode(&result)
  fmt.Println(result["urn"])
}
```

### cURL
```bash
# Different device identifier types
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"ow","input":"1000008F12AA"}' \
  http://localhost:3001/api/generate

curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"org","input":"32473:foo"}' \
  http://localhost:3001/api/generate

curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"ops","input":"32473:switch:12345"}' \
  http://localhost:3001/api/generate
```

## 🧪 Testing Examples

### MAC Addresses (various formats)
```bash
# Colon-separated
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"mac","input":"00:1B:44:11:3A:B7"}' \
  http://localhost:3001/api/generate

# Hyphen-separated  
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"mac","input":"00-1B-44-11-3A-B7"}' \
  http://localhost:3001/api/generate

# No separators
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"mac","input":"001B44113AB7"}' \
  http://localhost:3001/api/generate
```

### 1-Wire Device Identifiers
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"ow","input":"1000008F12AA"}' \
  http://localhost:3001/api/generate
```

### Organization Identifiers
```bash
# Organization defined
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"org","input":"32473:mydevice"}' \
  http://localhost:3001/api/generate

# Organization serial
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"os","input":"32473:12345"}' \
  http://localhost:3001/api/generate

# Organization product+serial
curl -X POST -H "Content-Type: application/json" \
  -d '{"subtype":"ops","input":"32473:router:67890"}' \
  http://localhost:3001/api/generate
```

## 🏗️ Technical Implementation

### Architecture
- **Frontend**: Next.js 15 with TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Theme**: Light/Dark mode with system preference detection
- **API**: Next.js API routes with full REST compliance
- **Validation**: Comprehensive input validation and error handling

### Key Features
- **MAC Address Conversion**: Automatic MAC-48/EUI-48 to EUI-64 conversion with universal/local bit flipping
- **PEN Validation**: Private Enterprise Number validation for organization subtypes  
- **Format Detection**: Smart auto-detection of device identifier formats
- **Error Handling**: Detailed validation errors and HTTP status codes
- **Type Safety**: Full TypeScript implementation

### File Structure
```
src/
├── app/
│   ├── api/           # REST API endpoints
│   ├── layout.tsx     # Root layout with theme provider
│   └── page.tsx       # Main page with tabs
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── DevUrnGenerator.tsx    # Main generator interface
│   ├── ApiDocumentation.tsx   # API documentation
│   ├── theme-provider.tsx     # Theme context
│   └── theme-toggle.tsx       # Theme toggle button
└── lib/
    └── dev-urn.ts     # Core URN generation logic
```

## 📚 References

- [RFC 9039 - Uniform Resource Names for Device Identifiers](https://datatracker.ietf.org/doc/html/rfc9039)
- [IANA URN Namespaces Registry](https://www.iana.org/assignments/urn-namespaces/urn-namespaces.xhtml)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check existing [GitHub Issues](https://github.com/your-username/devurn-generator-web/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce and expected behavior

## 🎯 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```
