-- Fix RLS policies for delete operations
-- This script updates the policies to properly allow authenticated users to delete works

-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can modify works" ON works;

-- Create new policy with correct authentication check
CREATE POLICY "Authenticated users can modify works"
  ON works FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Also update case studies policy for consistency
DROP POLICY IF EXISTS "Authenticated users can modify case studies" ON case_studies;

CREATE POLICY "Authenticated users can modify case studies"
  ON case_studies FOR ALL
  USING (auth.uid() IS NOT NULL);
