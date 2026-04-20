# Tradeoffs

- **JWT vs Sessions**: JWT is used for its statelessness and simplicity, which is ideal for an internal admin tool. The tradeoff is that server-side revocation is not natively supported.
- **Hashed Partner API Keys**: API keys are hashed in the database for better security than plaintext. A plaintext prefix (`apiKeyPrefix`) is stored to keep DB lookups fast before bcrypt comparison.
- **Admin Seeding vs Registration**: Admins are created at startup or via the seed script rather than a registration flow, which is appropriate for the scope of this project.
- **bcryptjs vs argon2**: `bcryptjs` is used for hashing as it is simple, well-understood, and has fewer native dependencies than `argon2`, which is stronger but adds complexity.
- **MongoDB vs SQL**: MongoDB was chosen for its flexibility with location data and dynamic schemas. The tradeoff is more complex aggregation pipelines for reporting.
- **Single Static API Key vs OAuth2**: Simple API keys are used instead of OAuth2 client credentials flow to reduce implementation complexity for partners.
- **No Location History**: Only the latest location is stored in the database for speed. Location history would require a separate time-series collection with a TTL index.
- **Report Aggregation**: The report is generated using a powerful MongoDB aggregation pipeline. In production, this could be offloaded to a read replica or a materialized view for better performance.
- **In-Memory Mocking vs Test DB**: A separate test database is used for integration testing to ensure correctness against the actual database driver and schema.
