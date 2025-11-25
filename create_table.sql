
-- 1. Create the case_studies table
CREATE TABLE case_studies (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- 3. Create policies to allow public access (for development only)
-- Policy for viewing case studies
CREATE POLICY "Public can view"
ON case_studies FOR SELECT
USING (true);

-- Policy for inserting new case studies
CREATE POLICY "Public can insert"
ON case_studies FOR INSERT
WITH CHECK (true);

-- Policy for updating existing case studies
CREATE POLICY "Public can update"
ON case_studies FOR UPDATE
USING (true);
