# Validators

This folder contains all validation logic extracted from route files for better code organization and reusability.

## Structure

```
validators/
├── admin/
│   ├── auth.validator.ts       # Admin login validation
│   ├── captain.validator.ts    # Captain CRUD validation
│   ├── order.validator.ts      # Admin order validation
│   ├── assignment.validator.ts # Captain assignment validation
│   └── report.validator.ts     # Report query validation
├── captain/
│   ├── auth.validator.ts       # Captain login validation
│   └── order.validator.ts      # Captain order status validation
└── partner/
    └── order.validator.ts      # Partner order creation validation
```

## Usage

Import validators in route files:

```typescript
import { loginValidator } from "../../validators/admin/auth.validator";
import { validate } from "../../middleware/validate";

router.post("/login", [...loginValidator, validate], controller.login);
```

## Benefits

- Centralized validation logic
- Easy to reuse across different routes
- Better maintainability
- Cleaner route files
