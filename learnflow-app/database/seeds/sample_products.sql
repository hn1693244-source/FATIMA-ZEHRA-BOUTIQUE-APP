-- ============================================================================
-- Sample Products for Fatima Zehra Boutique
-- ============================================================================
-- This file contains initial data seeding for development/testing
--
-- Usage:
--   psql $DATABASE_URL < database/seeds/sample_products.sql
--
-- ============================================================================

-- Create categories
INSERT INTO categories (name, description) VALUES
('Dresses', 'Beautiful dresses for every occasion'),
('Tops', 'Elegant tops and blouses'),
('Skirts', 'Stylish skirts'),
('Accessories', 'Fashion accessories and jewelry'),
('Sarees', 'Traditional and modern sarees'),
('Formals', 'Formal wear for special events')
ON CONFLICT DO NOTHING;

-- Create products
INSERT INTO products (name, description, price, category_id, stock_quantity, featured, is_active) VALUES
-- Dresses
('Evening Gown', 'Elegant evening dress with beautiful embroidery', 5000, 1, 15, true, true),
('Casual Sundress', 'Light and comfortable casual dress', 2500, 1, 25, false, true),
('Party Dress', 'Perfect for celebrations and gatherings', 3500, 1, 20, true, true),

-- Tops
('Silk Blouse', 'Premium silk blouse with intricate patterns', 2000, 2, 30, false, true),
('Cotton Top', 'Comfortable and breathable cotton top', 1200, 2, 35, false, true),
('Designer Blouse', 'High-quality designer blouse', 3000, 2, 18, true, true),

-- Skirts
('Midi Skirt', 'Flowing midi skirt in various colors', 2800, 3, 22, false, true),
('Maxi Skirt', 'Long flowing maxi skirt', 3200, 3, 18, true, true),
('Pencil Skirt', 'Fitted professional pencil skirt', 1800, 3, 20, false, true),

-- Accessories
('Pearl Necklace', 'Elegant pearl necklace set', 1500, 4, 25, true, true),
('Diamond Earrings', 'Sparkling diamond earrings', 3500, 4, 10, true, true),
('Designer Bag', 'Premium designer handbag', 4500, 4, 12, true, true),
('Silk Scarf', 'Colorful silk scarf', 800, 4, 40, false, true),

-- Sarees
('Banarasi Saree', 'Traditional Banarasi saree with gold work', 6000, 5, 8, true, true),
('Cotton Saree', 'Comfortable cotton saree', 1800, 5, 15, false, true),
('Designer Saree', 'Modern designer saree', 4500, 5, 10, true, true),

-- Formals
('Business Suit', 'Professional business suit', 5500, 6, 12, false, true),
('Formal Gown', 'Elegant formal gown for events', 7000, 6, 8, true, true),
('Wedding Dress', 'Beautiful wedding dress collection', 8500, 6, 5, true, true)
ON CONFLICT DO NOTHING;

-- Create test user
INSERT INTO users (email, password_hash, full_name, phone, address, is_active) VALUES
('test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUWzpw4a', 'Test User', '+92 300 1234567', '123 Main Street, Karachi, Pakistan', true)
ON CONFLICT (email) DO NOTHING;

-- Verify insertions
SELECT 'Categories:' as check, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products:', COUNT(*) FROM products
UNION ALL
SELECT 'Users:', COUNT(*) FROM users;
