# ⚡ Quick Start Guide

## 1. Create `.env.local` file

Copy `env.example.txt` content and create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 2. Start Backend (Terminal 1)

```bash
cd ../back
npm run dev
```

Wait for: `Server running on port 3000 🚀🍂⭐`

## 3. Start Web App (Terminal 2)

```bash
npm run dev
```

## 4. Open Browser

Navigate to: `http://localhost:3001`

## 5. Test the App

1. Click "Register" to create an account
2. Fill in: Name, Email, Password
3. You'll be auto-logged in and redirected to the dashboard
4. View your income distribution chart
5. Click on the cards to explore

## That's it! 🎉

---

### Default Test User (if backend has seed data)
- Email: `test@example.com`
- Password: `password`

### Troubleshooting
- **Backend not starting?** Check if PostgreSQL is running
- **Port 3001 taken?** Next.js will use the next available port
- **Images not showing?** They should be in `public/` folder (already copied)
