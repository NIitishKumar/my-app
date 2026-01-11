# Admin Login Credentials

## Default Admin Account

A default administrator account has been created for the attendance system.

### Login Details:

- **Email:** `admin@school.com`
- **Password:** `admin123`
- **Role:** `ADMIN`
- **Employee ID:** `ADMIN001`

## Usage

### Login Request:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"admin123"}'
```

### Login Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69638966c468e84e2c345038",
    "email": "admin@school.com",
    "firstName": "System",
    "lastName": "Administrator",
    "name": "System Administrator",
    "role": "ADMIN",
    "employeeId": "ADMIN001",
    "department": "Administration"
  }
}
```

### Using the Token:

Include the JWT token in the Authorization header for all admin-protected requests:

```bash
curl -X GET http://localhost:3000/api/admin/attendance \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

## Admin Permissions

The admin account has access to:

- ✅ All attendance records (view, create, update, delete)
- ✅ Lock/unlock attendance records
- ✅ Bulk import attendance
- ✅ View attendance statistics and reports
- ✅ Export attendance data (Excel/CSV)
- ✅ All teacher permissions

## Security Notes

⚠️ **IMPORTANT:** Change the default password after first login!

### To Change Password:

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"admin123","newPassword":"YOUR_NEW_PASSWORD"}'
```

## Creating Additional Admins

To create additional admin users, you can run the provided script:

```bash
node scripts/createAdmin.js
```

Or manually insert a new admin into the `teachers` collection with `role: 'ADMIN'`.

## Support

For issues or questions, please contact the development team.
