# Supabase Setup Guide for Case Study Image Upload

This guide will help you set up Supabase for storing case study images and content.

## Prerequisites
- A Supabase account (sign up at https://supabase.com)

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Your project name (e.g., "Portfolio Case Studies")
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Navigate to **API** section
3. You'll see two important values:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value (under "Project API keys")

## Step 3: Create Environment File

1. In your project root directory, create a file named `.env`
2. Add the following content (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. **IMPORTANT**: Add `.env` to your `.gitignore` file to keep credentials secure

## Step 4: Create Storage Bucket for Images

1. In your Supabase dashboard, click on **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `case-study-images`
   - **Public bucket**: Toggle ON (so images can be accessed publicly)
4. Click "Create bucket"

## Step 5: Set Up Storage Policies

By default, the bucket needs policies to allow uploads. Here's how to set them up:

1. Click on your `case-study-images` bucket
2. Click on "Policies" tab
3. Click "New Policy"
4. Choose "For full customization" or use a template

### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'case-study-images' );
```

### Policy 2: Allow Authenticated Uploads
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'case-study-images' );
```

### Policy 3: Allow Authenticated Updates
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'case-study-images' )
WITH CHECK ( bucket_id = 'case-study-images' );
```

### Policy 4: Allow Authenticated Deletes
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'case-study-images' );
```

**Note**: If you want to allow anonymous uploads (no authentication required), replace `auth.role() = 'authenticated'` with `true` in the policies.

## Step 6: Create Database Table for Case Studies

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click "New Query"
3. Paste the following SQL:

```sql
-- Create case_studies table
CREATE TABLE case_studies (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_case_studies_updated_at ON case_studies(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for case_studies table

-- Allow public read access
CREATE POLICY "Public can view case studies"
ON case_studies FOR SELECT
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert case studies"
ON case_studies FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update case studies"
ON case_studies FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete case studies"
ON case_studies FOR DELETE
USING (true);
```

4. Click "Run" to execute the SQL
5. You should see a success message

## Step 7: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a case study page in your app
3. Try uploading an image using the BlockNote editor:
   - Click the "+" button or type "/" to open the slash menu
   - Select "Image" or use the image upload option
   - Choose an image from your computer
   - The image should upload to Supabase and display in the editor

4. Try saving the case study:
   - Click the "Save" button in the header
   - Check the browser console for success messages
   - Verify in Supabase dashboard under "Table Editor" > "case_studies"

## Step 8: Verify in Supabase Dashboard

### Check Uploaded Images:
1. Go to **Storage** > `case-study-images`
2. You should see your uploaded images in the `uploads` folder

### Check Saved Case Studies:
1. Go to **Table Editor** > `case_studies`
2. You should see your saved case study entries with content and metadata

## Troubleshooting

### Images not uploading?
- Check browser console for errors
- Verify your `.env` file has correct credentials
- Ensure the storage bucket is public
- Check storage policies are correctly set

### Case studies not saving?
- Check browser console for errors
- Verify the `case_studies` table exists
- Check RLS policies are correctly set
- Ensure your Supabase URL and key are correct

### CORS errors?
- Supabase should handle CORS automatically
- If you see CORS errors, check your Supabase project settings

## Security Considerations

For production use, you should:

1. **Implement authentication**: Use Supabase Auth to require users to log in
2. **Restrict uploads**: Only allow authenticated users to upload
3. **Add file size limits**: Implement file size validation
4. **Add file type validation**: Only allow specific image formats
5. **Implement rate limiting**: Prevent abuse of upload functionality

## Additional Features

You can enhance the setup with:

- **Image optimization**: Compress images before upload
- **Thumbnail generation**: Use Supabase Storage transformations
- **CDN**: Enable Supabase CDN for faster image delivery
- **Backup**: Set up automated backups for your database

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
