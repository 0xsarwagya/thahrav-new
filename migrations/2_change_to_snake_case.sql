/*
  # Column Naming Convention Update
  
  1. Changes
    - Converts all camelCase column names to snake_case for consistency
    - Affects the following columns in the product table:
      - salePrice → sale_price
      - isNew → is_new
      - isFeatured → is_featured
      - isOnSale → is_on_sale
      - inStock → in_stock
      - taxRate → tax_rate
      - createdAt → created_at
      - updatedAt → updated_at
  
  2. Purpose
    - Ensures consistent naming convention across the database
    - Follows PostgreSQL best practices for column naming
    - Makes queries more readable and maintainable
*/

-- Rename columns in product table
ALTER TABLE public.product RENAME COLUMN salePrice TO sale_price;
ALTER TABLE public.product RENAME COLUMN isNew TO is_new;
ALTER TABLE public.product RENAME COLUMN isFeatured TO is_featured;
ALTER TABLE public.product RENAME COLUMN isOnSale TO is_on_sale;
ALTER TABLE public.product RENAME COLUMN inStock TO in_stock;
ALTER TABLE public.product RENAME COLUMN taxRate TO tax_rate;
ALTER TABLE public.product RENAME COLUMN createdAt TO created_at;
ALTER TABLE public.product RENAME COLUMN updatedAt TO updated_at;