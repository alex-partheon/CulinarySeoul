-- Update existing brand data with appropriate categories and descriptions
-- This migration assumes there might be existing brands that need to be updated

-- Update the 'millab' brand if it exists
UPDATE brands 
SET 
  business_category = 'CAFE',
  description = '프리미엄 카페 브랜드로 고품질 커피와 디저트를 제공합니다.'
WHERE code = 'millab' OR name = '밀랍';

-- If there are other existing brands without categories, set them to 'OTHER' temporarily
UPDATE brands 
SET business_category = 'OTHER'
WHERE business_category IS NULL;

-- Add validation to ensure all brands have a business category
ALTER TABLE brands 
ADD CONSTRAINT check_business_category_not_empty 
CHECK (business_category IS NOT NULL AND business_category != '');

-- Add helpful comments
COMMENT ON TABLE brands IS 'Brand information including business category and detailed descriptions';
COMMENT ON CONSTRAINT check_business_category_not_empty ON brands IS 'Ensures every brand has a valid business category';