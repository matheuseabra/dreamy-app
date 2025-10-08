# Dreamy Studio API Documentation

## Overview
The Dreamy Studio API provides endpoints for AI image generation, user management, gallery operations, and credit management. All API endpoints are RESTful and return JSON responses.

## Base URL
- Development: `http://localhost:9000`
- Production: `https://api.dreamystudio.com`

## Authentication
Most endpoints require authentication using Bearer tokens from Supabase Auth.

```http
Authorization: Bearer <supabase_jwt_token>
```

## Response Format
All API responses follow this format:

```json
{
  "success": boolean,
  "data"?: any,
  "error"?: string,
  "details"?: string
}
```

## Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `402` - Payment Required (insufficient credits)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting
- General API: 100 requests per 15 minutes
- Generation endpoints: 10 requests per minute
- Auth endpoints: 5 requests per 15 minutes

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "message": "Dreamy API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Authentication Endpoints

### GET /api/auth/me
Get current user profile.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### PATCH /api/auth/me
Update user profile.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Image Generation Endpoints

### POST /api/generate
Generate images using AI models.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "model": "fal-ai/flux/dev",
  "prompt": "A beautiful sunset over mountains",
  "negative_prompt": "blurry, low quality",
  "image_size": "square_hd",
  "num_images": 1,
  "seed": 42,
  "guidance_scale": 7.5,
  "num_inference_steps": 20,
  "sync_mode": false,
  "enable_safety_checker": true,
  "loras": [
    {
      "path": "lora/path",
      "scale": 0.8
    }
  ],
  "image_url": "https://example.com/image.jpg",
  "strength": 0.8,
  "controlnet_conditioning_scale": 1.0,
  "expand_prompt": true,
  "format": "png"
}
```

**Parameters:**
- `model` (required): AI model ID
- `prompt` (required): Text description (max 2000 chars)
- `negative_prompt` (optional): What to avoid (max 1000 chars)
- `image_size` (optional): Image dimensions
- `num_images` (optional): Number of images (1-4, default: 1)
- `seed` (optional): Random seed for reproducibility
- `guidance_scale` (optional): How closely to follow prompt (0-20)
- `num_inference_steps` (optional): Generation steps (1-100)
- `sync_mode` (optional): Wait for completion (default: false)
- `enable_safety_checker` (optional): Enable content filtering
- `loras` (optional): LoRA models to apply
- `image_url` (optional): For image-to-image generation
- `strength` (optional): Image-to-image strength (0-1)
- `controlnet_conditioning_scale` (optional): ControlNet strength (0-2)
- `expand_prompt` (optional): Auto-expand prompt
- `format` (optional): Output format (jpeg, png)

**Response (Sync Mode):**
```json
{
  "success": true,
  "generation": {
    "id": "uuid",
    "status": "completed",
    "images": [
      {
        "id": "uuid",
        "url": "https://example.com/image.jpg",
        "width": 1024,
        "height": 1024
      }
    ]
  }
}
```

**Response (Async Mode):**
```json
{
  "success": true,
  "generation": {
    "id": "uuid",
    "status": "in_queue",
    "falRequestId": "fal_request_id",
    "message": "Generation queued successfully. Use the status endpoint to check progress."
  }
}
```

### GET /api/generate/:id
Get generation status and results.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "generation": {
    "id": "uuid",
    "status": "completed",
    "queuePosition": null,
    "prompt": "A beautiful sunset over mountains",
    "model": "fal-ai/flux/dev",
    "error": null,
    "images": [
      {
        "id": "uuid",
        "url": "https://example.com/image.jpg",
        "width": 1024,
        "height": 1024
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Values:**
- `pending` - Generation created, waiting to start
- `in_queue` - Queued for processing
- `processing` - Currently generating
- `completed` - Successfully completed
- `failed` - Generation failed

### DELETE /api/generate/:id
Cancel a queued or processing generation.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Generation cancelled successfully"
}
```

---

## Gallery Endpoints

### GET /api/gallery
Get user's images with pagination.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (1-100, default: 20)

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "uuid",
      "url": "https://example.com/image.jpg",
      "width": 1024,
      "height": 1024,
      "prompt": "A beautiful sunset over mountains",
      "model": "fal-ai/flux/dev",
      "isFavorited": false,
      "isPublic": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### GET /api/gallery/:id
Get specific image details.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "uuid",
    "url": "https://example.com/image.jpg",
    "width": 1024,
    "height": 1024,
    "isFavorited": false,
    "isPublic": false,
    "generation": {
      "id": "uuid",
      "prompt": "A beautiful sunset over mountains",
      "model": "fal-ai/flux/dev",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PATCH /api/gallery/:id
Update image properties.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "is_favorited": true,
  "is_public": false
}
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "uuid",
    "is_favorited": true,
    "is_public": false,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /api/gallery/:id
Delete an image.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### GET /api/gallery/favorites/list
Get user's favorited images.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "uuid",
      "url": "https://example.com/image.jpg",
      "width": 1024,
      "height": 1024,
      "prompt": "A beautiful sunset over mountains",
      "model": "fal-ai/flux/dev",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Credits Endpoints

### GET /api/credits
Get user's credit balance.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "credits": {
    "remaining": 50,
    "total": 100,
    "lastRefill": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Webhook Endpoints

### POST /api/webhooks/fal/:generationId
Fal.ai webhook handler for generation completion.

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "status": "OK",
  "payload": {
    "images": [
      {
        "url": "https://example.com/image.jpg",
        "width": 1024,
        "height": 1024,
        "content_type": "image/png"
      }
    ]
  },
  "seed": 42,
  "has_nsfw_concepts": false,
  "prompt": "A beautiful sunset over mountains"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Generation completed"
}
```

---

## AI Models

### Available Models

| Model ID | Name | Description | Type |
|----------|------|-------------|------|
| `fal-ai/flux/dev` | Flux Dev | High quality text-to-image generation | Text-to-Image |
| `fal-ai/flux/schnell` | Flux Schnell | Fast text-to-image generation | Text-to-Image |
| `fal-ai/flux/dev/image-to-image` | Flux Dev I2I | Image-to-image with Flux Dev | Image-to-Image |
| `fal-ai/flux-1/schnell/redux` | Flux Schnell Redux | Enhanced Flux Schnell model | Text-to-Image |
| `fal-ai/flux-pro/kontext` | Flux Pro Kontext | Professional context-aware generation | Text-to-Image |
| `fal-ai/flux-pro/kontext/max` | Flux Pro Kontext Max | Maximum quality context generation | Text-to-Image |
| `fal-ai/flux-kontext/dev` | Flux Kontext Dev | Development context model | Text-to-Image |
| `fal-ai/flux-kontext-lora` | Flux Kontext LoRA | LoRA-enhanced context model | Text-to-Image |
| `fal-ai/recraft/v3/text-to-image` | Recraft V3 T2I | Advanced text-to-image generation | Text-to-Image |
| `fal-ai/recraft/v3/image-to-image` | Recraft V3 I2I | Advanced image-to-image generation | Image-to-Image |
| `fal-ai/ideogram/v2` | Ideogram V2 | Text rendering and design generation | Text-to-Image |
| `fal-ai/ideogram/v3` | Ideogram V3 | Latest text rendering capabilities | Text-to-Image |
| `fal-ai/nano-banana` | Nano Banana | Lightweight fast generation | Text-to-Image |
| `fal-ai/wan/v2.2-5b/text-to-image` | WAN V2.2 | 5B parameter text-to-image model | Text-to-Image |

### Image Sizes

| Size ID | Dimensions | Aspect Ratio |
|---------|------------|--------------|
| `square_hd` | 1024x1024 | 1:1 |
| `square` | 1024x1024 | 1:1 |
| `portrait_4_3` | 1024x1365 | 3:4 |
| `portrait_16_9` | 1024x1820 | 9:16 |
| `landscape_4_3` | 1365x1024 | 4:3 |
| `landscape_16_9` | 1820x1024 | 16:9 |

---

## Error Handling

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "details": "Prompt is required"
}
```

### Authentication Errors
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### Credit Errors
```json
{
  "success": false,
  "error": "Insufficient credits"
}
```

### Rate Limit Errors
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

### Generation Errors
```json
{
  "success": false,
  "error": "Failed to generate image",
  "details": "Model temporarily unavailable"
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
class DreamyStudioAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  async generateImage(params: GenerateImageParams) {
    return this.request('/api/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getGenerationStatus(id: string) {
    return this.request(`/api/generate/${id}`);
  }

  async getImages(page = 1, limit = 20) {
    return this.request(`/api/gallery?page=${page}&limit=${limit}`);
  }

  async getCredits() {
    return this.request('/api/credits');
  }
}

// Usage
const api = new DreamyStudioAPI('http://localhost:9000', 'your-token');

const result = await api.generateImage({
  model: 'fal-ai/flux/dev',
  prompt: 'A beautiful sunset over mountains',
  image_size: 'square_hd',
  num_images: 1,
});
```

### Python

```python
import requests
import json

class DreamyStudioAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def request(self, endpoint: str, method: str = 'GET', data: dict = None):
        url = f"{self.base_url}{endpoint}"
        
        if method == 'GET':
            response = requests.get(url, headers=self.headers)
        elif method == 'POST':
            response = requests.post(url, headers=self.headers, json=data)
        elif method == 'PATCH':
            response = requests.patch(url, headers=self.headers, json=data)
        elif method == 'DELETE':
            response = requests.delete(url, headers=self.headers)
        
        response.raise_for_status()
        return response.json()

    def generate_image(self, **params):
        return self.request('/api/generate', 'POST', params)

    def get_generation_status(self, generation_id: str):
        return self.request(f'/api/generate/{generation_id}')

    def get_images(self, page: int = 1, limit: int = 20):
        return self.request(f'/api/gallery?page={page}&limit={limit}')

    def get_credits(self):
        return self.request('/api/credits')

# Usage
api = DreamyStudioAPI('http://localhost:9000', 'your-token')

result = api.generate_image(
    model='fal-ai/flux/dev',
    prompt='A beautiful sunset over mountains',
    image_size='square_hd',
    num_images=1
)
```

---

## Testing

### Using curl

```bash
# Health check
curl -X GET http://localhost:9000/health

# Generate image
curl -X POST http://localhost:9000/api/generate \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "fal-ai/flux/dev",
    "prompt": "A beautiful sunset over mountains",
    "image_size": "square_hd",
    "num_images": 1
  }'

# Get generation status
curl -X GET http://localhost:9000/api/generate/generation-id \
  -H "Authorization: Bearer your-token"

# Get images
curl -X GET "http://localhost:9000/api/gallery?page=1&limit=20" \
  -H "Authorization: Bearer your-token"
```

### Using Postman

1. Import the API collection
2. Set the base URL variable
3. Set the authorization token
4. Test individual endpoints

---

## Changelog

### Version 1.0.0
- Initial API release
- Support for Flux, Recraft, and Ideogram models
- User authentication and profile management
- Image generation and gallery management
- Credit system implementation
- Webhook support for async generation

---

## Support

For API support:
- Check the [Development Guide](DEVELOPMENT.md)
- Review the [Environment Setup](ENVIRONMENT.md)
- Create an issue in the repository
- Contact support at api-support@dreamystudio.com
