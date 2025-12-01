-- Add background_type column to works table
ALTER TABLE works ADD COLUMN IF NOT EXISTS background_type text DEFAULT 'color';

-- Update existing rows to infer type (optional, but good for consistency)
UPDATE works 
SET background_type = CASE 
    WHEN background_video IS NOT NULL AND background_video != '' THEN 'video'
    WHEN background_image IS NOT NULL AND background_image != '' THEN 'image'
    ELSE 'color'
END
WHERE background_type IS NULL OR background_type = 'color';
