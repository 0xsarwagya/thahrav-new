-- Rename columns in product table
ALTER TABLE public.product RENAME COLUMN salePrice TO sale_price;
ALTER TABLE public.product RENAME COLUMN isNew TO is_new;
ALTER TABLE public.product RENAME COLUMN isFeatured TO is_featured;
ALTER TABLE public.product RENAME COLUMN isOnSale TO is_on_sale;
ALTER TABLE public.product RENAME COLUMN inStock TO in_stock;
ALTER TABLE public.product RENAME COLUMN taxRate TO tax_rate;
ALTER TABLE public.product RENAME COLUMN createdAt TO created_at;
ALTER TABLE public.product RENAME COLUMN updatedAt TO updated_at;
