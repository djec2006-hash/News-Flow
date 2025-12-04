-- Add length_level column to custom_topics table
ALTER TABLE custom_topics 
ADD COLUMN IF NOT EXISTS length_level TEXT NOT NULL DEFAULT 'standard';

-- Add check constraint to ensure only valid values
ALTER TABLE custom_topics 
ADD CONSTRAINT custom_topics_length_level_check 
CHECK (length_level IN ('very_short', 'short', 'standard', 'very_detailed'));

-- Add comment to document the column
COMMENT ON COLUMN custom_topics.length_level IS 'Defines the length/detail level for this topic in generated flows: very_short, short, standard, or very_detailed';
