# Delivery Operations Backend

Backend system for managing delivery operations, including captains, orders, and real-time tracking.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express** (Web Framework)
- **MongoDB** + **Mongoose** (Database)
- **Socket.IO** (Real-time Communication)
- **Jest** + **Supertest** (Testing)

## Features

- **Admin Dashboard API**: CRUD for captains and orders, order assignment, and reports.
- **Partner API**: Idempotent order creation via API keys.
- **Real-time Tracking**: Captain location updates via WebSockets.
- **Role-based Access**: Admin JWT and Partner API Key authentication.
- **Advanced Filtering**: Search, sort, and pagination for order lists.

## Prerequisites

- Node.js 18+
- MongoDB

## Setup & Run

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

## Authentication

- **Admin**: Use `POST /api/admin/auth/login` to get a JWT. Include it as `Authorization: Bearer <token>` in subsequent requests.
- **Partner**: Use the raw API key as `x-api-key: <raw-key>` in the header.

## API Documentation

### Admin Routes

- `POST /api/admin/auth/login`: Admin login
- `GET /api/admin/captains`: List all captains
- `POST /api/admin/captains`: Create a new captain
- `GET /api/admin/captains/:id`: Get captain by ID
- `PUT /api/admin/captains/:id`: Update captain details
- `DELETE /api/admin/captains/:id`: Delete captain
- `PATCH /api/admin/captains/:id/activate`: Activate captain
- `PATCH /api/admin/captains/:id/deactivate`: Deactivate captain
- `GET /api/admin/orders`: Advanced order listing (search, filter, sort, pagination)
- `POST /api/admin/orders`: Create a new order
- `GET /api/admin/orders/:id`: Get order by ID
- `PUT /api/admin/orders/:id`: Update order details
- `DELETE /api/admin/orders/:id`: Delete order
- `POST /api/admin/orders/:id/assign`: Assign captain to order
- `DELETE /api/admin/orders/:id/unassign`: Unassign captain from order
- `GET /api/admin/reports/captains/order-volume-drop`: Captain performance report

### Captain Routes

- `POST /api/captain/auth/login`: Captain login (phone-based)
- `GET /api/captain/orders`: Get orders assigned to the captain
- `PATCH /api/captain/orders/:id/status`: Update order status (assigned → picked_up → delivered)

### Partner Routes

- `POST /api/partner/v1/orders`: Create order (idempotent with `externalReference`)

### WebSocket Events

#### Client to Server

- `captain:authenticate`: Authenticate as a captain with JWT token
- `captain:location_update`: Send location updates (lat, lng)
- `admin:join`: Join the admin room to receive location updates

#### Server to Client

- `authenticated`: Confirmation of successful captain authentication
- `admin:joined`: Confirmation of admin joining the room
- `location:updated`: Real-time captain location update broadcast to admins
- `auth_error`: Authentication error message
- `validation_error`: Validation error for location updates
