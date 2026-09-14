# Sentinel AI 2.0 Data Model

## Collections

- Users
- Chats
- Documents
- SecurityLogs
- Alerts
- Sessions
- Roles

## Notes

- The backend ships with in-memory demo data for local use.
- MongoDB schemas are defined in `backend/models` for production deployment.
- Security logs capture prompt risk scores and blocking decisions for auditability.