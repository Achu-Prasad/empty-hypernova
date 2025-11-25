# Image Upload Feature

This document explains how to use the image upload functionality in your case studies.

## Features

✅ **Upload images from your computer** - Drag & drop or click to upload  
✅ **Automatic Supabase storage** - Images are stored in Supabase Storage  
✅ **Public URLs** - Get shareable links for all uploaded images  
✅ **Auto-save case studies** - Save your content to the database  
✅ **BlockNote integration** - Rich text editor with image support  

## How to Upload Images

### Method 1: Using the Slash Command
1. In the editor, type `/` to open the command menu
2. Select "Image" from the menu
3. Click "Upload" tab
4. Choose an image from your computer
5. The image will automatically upload to Supabase and appear in the editor

### Method 2: Using the Toolbar
1. Click the "+" button in the editor toolbar
2. Select "Image"
3. Click "Upload" tab
4. Choose an image from your computer
5. The image will automatically upload and display

### Method 3: Drag and Drop
1. Drag an image file from your computer
2. Drop it into the editor
3. The image will automatically upload and display

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

## Image Upload Process

When you upload an image, the following happens:

1. **File Selection**: You choose an image from your computer
2. **Upload to Supabase**: The image is uploaded to Supabase Storage bucket `case-study-images`
3. **Unique Filename**: A unique filename is generated (timestamp + random string)
4. **Public URL**: Supabase returns a public URL for the image
5. **Editor Display**: The image is inserted into the editor using the public URL

## Saving Case Studies

Click the **Save** button in the header to save your case study content to the Supabase database.

### What Gets Saved:
- Complete editor content (text, images, formatting)
- Metadata (title, last modified time)
- Case study ID

### Auto-save Indicator:
- The "Last saved" timestamp shows when you last saved
- The save button shows "Saving..." while saving

## Technical Details

### File Storage Structure
```
case-study-images/
└── uploads/
    ├── 1234567890-abc123.jpg
    ├── 1234567890-def456.png
    └── ...
```

### Database Schema
```sql
case_studies
├── id (TEXT, PRIMARY KEY)
├── content (JSONB)
├── metadata (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## API Functions

The following functions are available in `src/lib/supabase.js`:

### `uploadImage(file, bucket)`
Uploads an image to Supabase Storage.

**Parameters:**
- `file` (File): The image file to upload
- `bucket` (string): Storage bucket name (default: 'case-study-images')

**Returns:**
```javascript
{
  url: "https://...",  // Public URL of the uploaded image
  path: "uploads/...", // Storage path
  error: null          // Error message if failed
}
```

### `deleteImage(path, bucket)`
Deletes an image from Supabase Storage.

**Parameters:**
- `path` (string): The file path in storage
- `bucket` (string): Storage bucket name (default: 'case-study-images')

**Returns:**
```javascript
{
  success: true,  // Whether deletion succeeded
  error: null     // Error message if failed
}
```

### `saveCaseStudy(id, content, metadata)`
Saves case study content to the database.

**Parameters:**
- `id` (string): Case study ID
- `content` (object): BlockNote editor content
- `metadata` (object): Additional metadata

**Returns:**
```javascript
{
  success: true,  // Whether save succeeded
  error: null,    // Error message if failed
  data: {...}     // Saved data
}
```

### `loadCaseStudy(id)`
Loads case study content from the database.

**Parameters:**
- `id` (string): Case study ID

**Returns:**
```javascript
{
  content: {...},   // Editor content
  metadata: {...},  // Metadata
  error: null       // Error message if failed
}
```

## Environment Variables

Make sure you have set up your `.env` file with Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### Images not uploading?
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Ensure storage bucket exists and is public
4. Check storage policies allow uploads

### Save button not working?
1. Check browser console for errors
2. Verify `case_studies` table exists
3. Check database policies allow inserts/updates
4. Ensure Supabase credentials are correct

### Images not displaying?
1. Check if the image URL is accessible
2. Verify storage bucket is public
3. Check browser network tab for failed requests
4. Ensure CORS is properly configured

## Best Practices

1. **Optimize images before upload**: Compress large images to reduce storage costs
2. **Use descriptive alt text**: Add alt text for accessibility
3. **Save regularly**: Click save button periodically to avoid losing work
4. **Check file sizes**: Large images may take longer to upload
5. **Use appropriate formats**: JPEG for photos, PNG for graphics with transparency

## Future Enhancements

Potential improvements for the image upload feature:

- [ ] Image compression before upload
- [ ] Progress bar for uploads
- [ ] Batch image upload
- [ ] Image editing (crop, resize, filters)
- [ ] Thumbnail generation
- [ ] Image gallery/library
- [ ] Drag to reorder images
- [ ] Copy image URL to clipboard
- [ ] Delete uploaded images
- [ ] Image CDN integration
