# Quick Start: Supabase Configuration

Follow these steps to get image upload working in your case studies.

## Step 1: Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

## Step 2: Create New Project (2 minutes)

1. Click "New Project"
2. Fill in:
   - **Name**: `portfolio-case-studies` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait ~2 minutes for setup

## Step 3: Get API Keys (1 minute)

1. In your project dashboard, click **Settings** (gear icon)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

## Step 4: Create .env File (1 minute)

1. In your project root, create a file named `.env`
2. Paste this content (replace with your actual values):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 5: Create Storage Bucket (2 minutes)

1. In Supabase dashboard, click **Storage** in left menu
2. Click "Create a new bucket"
3. Enter:
   - **Name**: `case-study-images`
   - **Public bucket**: Toggle **ON** ✅
4. Click "Create bucket"

## Step 6: Set Storage Policies (2 minutes)

1. Click on your `case-study-images` bucket
2. Click **Policies** tab
3. Click "New Policy" → "For full customization"
4. Paste this SQL and click "Review":

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'case-study-images' );

CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'case-study-images' );
```

5. Click "Save policy"

## Step 7: Create Database Table (2 minutes)

1. Click **SQL Editor** in left menu
2. Click "New Query"
3. Paste this SQL:

```sql
CREATE TABLE case_studies (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view"
ON case_studies FOR SELECT
USING (true);

CREATE POLICY "Public can insert"
ON case_studies FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update"
ON case_studies FOR UPDATE
USING (true);
```

4. Click "Run"
5. You should see "Success. No rows returned"

## Step 8: Restart Dev Server (1 minute)

1. Stop your dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 9: Test It! (1 minute)

1. Open http://localhost:5173/case-study/2
2. In the editor, type `/` and select "Image"
3. Click "Upload" tab
4. Choose an image from your computer
5. ✅ Image should upload and display!

## Step 10: Verify in Supabase (1 minute)

### Check uploaded image:
1. Go to **Storage** → `case-study-images`
2. You should see your image in `uploads` folder

### Check saved content:
1. Click the "Save" button in your app
2. Go to **Table Editor** → `case_studies`
3. You should see your saved case study

---

## 🎉 Done!

You now have:
- ✅ Image upload working
- ✅ Images stored in Supabase
- ✅ Case studies saved to database
- ✅ Sticky header fixed

---

## Troubleshooting

### Images not uploading?
- Check browser console (F12) for errors
- Verify `.env` file has correct values
- Make sure storage bucket is **public**
- Check storage policies are created

### "Invalid API key" error?
- Double-check your `.env` file
- Make sure you copied the **anon** key, not the service key
- Restart dev server after creating `.env`

### Save button not working?
- Check browser console for errors
- Verify `case_studies` table exists
- Make sure policies are created

### Still having issues?
See detailed troubleshooting in `SUPABASE_SETUP.md`

---

## Security Note

⚠️ **Current setup is for development only!**

For production, you should:
1. Enable authentication (Supabase Auth)
2. Restrict policies to authenticated users only
3. Add file size limits
4. Add file type validation

See `SUPABASE_SETUP.md` for production security recommendations.
