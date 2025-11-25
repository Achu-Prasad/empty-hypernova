# How to Find Your Supabase Credentials

## Quick Answer:
- **Publishable Key = Anon Key** (they're the same thing!)
- Use your publishable key for `VITE_SUPABASE_ANON_KEY`

---

## Finding Your Project URL

### Method 1: API Settings (Recommended)
1. Open https://app.supabase.com
2. Click on your project
3. Click **Settings** (⚙️ gear icon) in left sidebar
4. Click **API**
5. At the top, you'll see:
   ```
   Project URL
   https://xxxxxxxxxxxxx.supabase.co
   ```
6. Copy this entire URL

### Method 2: General Settings
1. Go to **Settings** (⚙️) → **General**
2. Look for **Reference ID** (example: `abcdefghijklmnop`)
3. Your URL is: `https://[reference-id].supabase.co`

### Method 3: Browser Address Bar
1. While in your Supabase project dashboard
2. Look at your browser's address bar
3. It shows: `https://app.supabase.com/project/xxxxxxxxxxxxx/...`
4. The `xxxxxxxxxxxxx` part is your project reference
5. Your URL is: `https://xxxxxxxxxxxxx.supabase.co`

---

## Finding Your Publishable/Anon Key

### Location:
1. Open https://app.supabase.com
2. Click on your project
3. Click **Settings** (⚙️) → **API**
4. Scroll down to **Project API keys** section
5. You'll see a table with keys:

```
┌─────────────────┬────────────────────────────────────┐
│ Name            │ Key                                │
├─────────────────┼────────────────────────────────────┤
│ anon            │ eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp... │
│ public          │ (same as anon)                     │
│ service_role    │ eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp... │
└─────────────────┴────────────────────────────────────┘
```

6. Copy the **anon** or **public** key (they're identical)
   - It's a very long string
   - Starts with `eyJ`
   - Might be labeled as "publishable" in newer Supabase versions

### ⚠️ Important:
- **DO NOT** use the `service_role` key - that's for server-side only!
- Use the `anon` / `public` / `publishable` key

---

## What Each Key Looks Like

### Project URL Example:
```
https://xyzabcdefghijklmnop.supabase.co
```
- Always starts with `https://`
- Always ends with `.supabase.co`
- Has a random string in the middle

### Publishable/Anon Key Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdGRxZGJ5Y3l0aHlxdGRxZGJ5IiwiYXVkIjoiYXV0aGVudGljYXRlZCIsImV4cCI6MTk4MzY3NjgwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Very long string (200+ characters)
- Starts with `eyJ`
- Contains dots (`.`) separating sections
- This is a JWT (JSON Web Token)

---

## Fill in Your .env File

Once you have both values:

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
# Before:
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_publishable_key_here

# After (example):
VITE_SUPABASE_URL=https://xyzabcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdGRxZGJ5Y3l0aHlxdGRxZGJ5IiwiYXVkIjoiYXV0aGVudGljYXRlZCIsImV4cCI6MTk4MzY3NjgwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Save the file
4. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## Still Can't Find Them?

### If you can't find the API settings:
1. Make sure you're logged into Supabase
2. Make sure you've selected a project (not on the organization page)
3. Try refreshing the page
4. Check if you have the right permissions (you need to be project owner/admin)

### If the Settings menu is missing:
- You might be on the old Supabase dashboard
- Try going directly to: `https://app.supabase.com/project/[your-project-id]/settings/api`

### Need more help?
- Take a screenshot of your Supabase dashboard
- Check Supabase docs: https://supabase.com/docs/guides/api#api-url-and-keys
- Ask in Supabase Discord: https://discord.supabase.com

---

## Security Reminder

⚠️ **Never commit your .env file to Git!**

The `.env` file is already in `.gitignore`, but double-check:

```bash
# Check if .env is ignored
git status

# If you see .env listed, add it to .gitignore:
echo ".env" >> .gitignore
```

Your publishable/anon key is safe to use in the browser (it's designed for client-side use), but you should still keep it private and not share it publicly.
