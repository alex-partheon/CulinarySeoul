-- Add business_category and description fields to brands table
ALTER TABLE brands 
ADD COLUMN business_category TEXT NOT NULL DEFAULT 'CAFE',
ADD COLUMN description TEXT;

-- Create enum type for business categories
CREATE TYPE business_category_enum AS ENUM (
  'CAFE',
  'RESTAURANT', 
  'BAKERY',
  'FAST_FOOD',
  'FINE_DINING',
  'BAR',
  'DESSERT',
  'FOOD_TRUCK',
  'CATERING',
  'OTHER'
);

-- Update the column to use the enum type
ALTER TABLE brands 
ALTER COLUMN business_category TYPE business_category_enum 
USING business_category::business_category_enum;

-- Add constraint to ensure business_category is not null
ALTER TABLE brands 
ALTER COLUMN business_category SET NOT NULL;

-- Add index for business_category for better query performance
CREATE INDEX idx_brands_business_category ON brands(business_category);

-- Add comment to describe the new fields
COMMENT ON COLUMN brands.business_category IS 'Business category of the brand (cafe, restaurant, etc.)';
COMMENT ON COLUMN brands.description IS 'Detailed description of the brand';

-- Update RLS policies to include new fields (if needed)
-- The existing RLS policies should automatically cover the new fields
-- since they operate at the row level, not column level