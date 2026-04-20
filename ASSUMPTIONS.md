# Assumptions

- **Admins**: Seeded at startup, no registration flow, no role-based hierarchy.
- **Partner API keys**: Hashed in DB, raw key shown once at seed time.
- **Order Status**: Delivered and cancelled orders cannot be re-assigned.
- **Captain Status**: Captain must be both `active` and `online` for assignment.
- **Idempotency**: Duplicate partner orders (same `partnerId` + `externalReference`) are handled by returning the existing order.
- **Phone Validation**: Standard pattern `/^\+?[0-9]{7,15}$/` for all phone numbers.
- **Socket Authentication**: Admin authentication uses the same JWT as the HTTP API.
- **Text Search**: Uses MongoDB `$text` index for efficient searching on order number, customer name, and customer phone.
- **Pagination**: Default values for all list endpoints: `page=1`, `limit=20`, `max limit=100`.
