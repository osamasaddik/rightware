# Delivery Operations Backend

Backend system for managing delivery operations, including captains, orders, and real-time tracking.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express** (Web Framework)
- **MongoDB** + **Mongoose** (Database)
- **Socket.IO** (Real-time Communication)
- **Jest** + **Supertest** (Testing)
- **Docker** + **Docker Compose** (Containerization)

## Features

- **Admin Dashboard API**: CRUD for captains and orders, order assignment, and reports
- **Partner API**: Idempotent order creation via API keys with rate limiting
- **Real-time Tracking**: Captain location updates via WebSockets
- **Role-based Access**: Admin JWT and Partner API Key authentication
- **Advanced Filtering**: Search, sort, and pagination for order lists
- **Request Validation**: Comprehensive validation for body, query, and path parameters using express-validator
- **Idempotency**: Unique index on `partnerId` and `externalReference` prevents duplicate orders
- **Rate Limiting**: Partner API limited to 100 requests per 15 minutes per IP
- **Audit Logging**: Console logging for captain activation/deactivation and order assignments
- **Dockerized**: Production-ready Docker setup with multi-stage builds

## Prerequisites

- Node.js 18+
- MongoDB

## Setup & Run

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
4. Seed the database: `npm run seed`
   - **Important**: This will log raw partner API keys to the console. Save them!
5. Start in development mode: `npm run dev`
6. Run tests: `npm test`

### Docker Deployment

1. Build and start containers:
   ```bash
   docker-compose up -d
   ```
2. View logs:
   ```bash
   docker-compose logs -f app
   ```
3. Stop containers:
   ```bash
   docker-compose down
   ```

The Docker setup includes:

- Multi-stage build for optimized image size
- MongoDB with health checks
- Persistent volumes for database and logs
- Production-ready Node.js configuration

## Authentication

- **Admin**: Use `POST /api/admin/auth/login` to get a JWT. Include it as `Authorization: Bearer <token>` in subsequent requests.
- **Partner**: Use the raw API key as `x-api-key: <raw-key>` in the header.

## API Documentation

All endpoints include comprehensive validation for request body, query parameters, and path parameters.

### Postman Collection

A Postman collection is provided in the root directory as `postman_collection.json`. You can import this into Postman to easily test all API endpoints, including Admin, Captain, and Partner routes.

### Admin Routes

#### Authentication

- `POST /api/admin/auth/login`: Admin login
  - Body: `{ email, password }`
  - Returns: JWT token

#### Captain Management

- `GET /api/admin/captains`: List all captains (with pagination, search, sort)
  - Query: `page`, `limit`, `sortBy`, `sortOrder`, `search`
- `POST /api/admin/captains`: Create a new captain
  - Body: `{ name, phone, email, vehicleType, vehicleNumber }`
- `GET /api/admin/captains/:id`: Get captain by ID
- `PUT /api/admin/captains/:id`: Update captain details
  - Body: `{ name?, phone?, email?, vehicleType?, vehicleNumber? }`
- `DELETE /api/admin/captains/:id`: Delete captain
- `PATCH /api/admin/captains/:id/activate`: Activate captain
  - Audit log: `✅ Captain activated - Captain ID: {id}, Name: {name}`
- `PATCH /api/admin/captains/:id/deactivate`: Deactivate captain
  - Audit log: `⛔ Captain deactivated - Captain ID: {id}, Name: {name}`

#### Order Management

- `GET /api/admin/orders`: Advanced order listing (search, filter, sort, pagination)
  - Query: `page`, `limit`, `sortBy`, `sortOrder`, `search`, `status`, `captainId`, `partnerId`
- `POST /api/admin/orders`: Create a new order
  - Body: `{ customerId, pickupLocation, deliveryLocation, items, totalAmount }`
- `GET /api/admin/orders/:id`: Get order by ID
- `PUT /api/admin/orders/:id`: Update order details
  - Body: `{ pickupLocation?, deliveryLocation?, items?, totalAmount? }`
- `DELETE /api/admin/orders/:id`: Delete order

#### Order Assignment

- `POST /api/admin/orders/:id/assign`: Assign captain to order
  - Body: `{ captainId }`
  - Audit log: `📦 Order assigned - Order ID: {orderId}, Captain: {name} ({captainId})`
- `DELETE /api/admin/orders/:id/unassign`: Unassign captain from order
  - Audit log: `🔄 Order unassigned - Order ID: {orderId}`

#### Reports

- `GET /api/admin/reports/captains/order-volume-drop`: Captain performance report
  - Query: `startDate`, `endDate`, `threshold`

### Captain Routes

#### Authentication

- `POST /api/captain/auth/login`: Captain login (phone-based)
  - Body: `{ phone, password }`
  - Returns: JWT token

#### Order Management

- `GET /api/captain/orders`: Get orders assigned to the captain
  - Query: `page`, `limit`, `status`
- `GET /api/captain/orders/:id`: Get specific order details
- `PATCH /api/captain/orders/:id/status`: Update order status
  - Body: `{ status }` (allowed transitions: `assigned` → `picked_up` → `delivered`)

### Partner Routes

All partner routes are rate-limited to 100 requests per 15 minutes per IP.

- `GET /api/partner/v1/orders`: List partner's orders
  - Query: `page`, `limit`, `status`
  - Header: `x-api-key: <raw-key>`
- `GET /api/partner/v1/orders/:id`: Get specific order details
  - Header: `x-api-key: <raw-key>`
- `POST /api/partner/v1/orders`: Create order (idempotent)
  - Body: `{ externalReference, customerId, pickupLocation, deliveryLocation, items, totalAmount }`
  - Header: `x-api-key: <raw-key>`
  - Idempotency: Duplicate `externalReference` for same partner returns existing order

### WebSocket Events

Connect to WebSocket server at the same host/port as the HTTP API.

#### Client to Server

- `captain:authenticate`: Authenticate as a captain with JWT token
  ```javascript
  socket.emit("captain:authenticate", { token: "your-jwt-token" });
  ```
- `captain:location_update`: Send location updates (lat, lng)
  ```javascript
  socket.emit("captain:location_update", { lat: 40.7128, lng: -74.006 });
  ```
- `admin:join`: Join the admin room to receive location updates
  ```javascript
  socket.emit("admin:join");
  ```

#### Server to Client

- `authenticated`: Confirmation of successful captain authentication
- `admin:joined`: Confirmation of admin joining the room
- `location:updated`: Real-time captain location update broadcast to admins
  ```javascript
  {
    captainId: 'captain-id',
    location: { lat: 40.7128, lng: -74.0060 },
    timestamp: '2026-04-20T12:00:00.000Z'
  }
  ```
- `auth_error`: Authentication error message
- `validation_error`: Validation error for location updates

## Technical Implementation

### Idempotency

Orders created via the Partner API use a unique compound index on `partnerId` and `externalReference` to prevent duplicate orders. If a partner submits the same `externalReference` twice, the existing order is returned instead of creating a duplicate.

```typescript
OrderSchema.index({ partnerId: 1, externalReference: 1 }, { unique: true, sparse: true });
```

### Rate Limiting

Partner API endpoints are protected with express-rate-limit:

- Window: 15 minutes
- Max requests: 100 per IP
- Response: 429 Too Many Requests

### Validation

All routes use express-validator middleware to validate:

- Request body parameters
- Query string parameters
- URL path parameters

Invalid requests return 400 with detailed error messages.

### Audit Logging

Critical operations are logged to console with emojis for easy identification:

- ✅ Captain activation
- ⛔ Captain deactivation
- 📦 Order assignment
- 🔄 Order unassignment

### Testing

Test suite includes:

- Unit tests for services
- Integration tests for API endpoints
- Authentication and authorization tests
- Located in `src/__tests__/`

## Development Notes

This project was developed with assistance from Kiro, an AI-powered development tool, to rapidly prototype and implement features based on high-level requirements.
