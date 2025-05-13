-- Delete existing data
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM products;
DELETE FROM categories;

-- Reset auto increment
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Bánh mặn', 'Các loại bánh mặn đa dạng, thơm ngon'),
('Bánh mì', 'Bánh mì tươi mới, giòn tan'),
('Bánh bao', 'Bánh bao nhân thịt, nhân chay'),
('Bánh Kem', 'Bánh kem cho mọi dịp đặc biệt'),
('Bánh Ngọt', 'Các loại bánh ngọt hấp dẫn'),
('Bánh Mì Gối/ Sandwich', 'Bánh mì gối và sandwich'),
('Bánh Bông Lan', 'Bánh bông lan các loại'),
('Bánh Bông Lan Trứng Muối', 'Bánh bông lan trứng muối đặc biệt');

-- Insert products for Bánh mặn
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Bánh Mỳ Thịt Xông Khói', 'Bánh mỳ thơm ngon với thịt xông khói', 25000, 1, '/uploads/products/banh-my-thit-xong-khoi.jpg', 100, true),
('Donut Thit Phô Mai', 'Donut nhân thịt và phô mai', 20000, 1, '/uploads/products/donut-thit-pho-mai.jpg', 100, true),
('Phô Mai Bắp', 'Bánh phô mai bắp thơm ngon', 18000, 1, '/uploads/products/pho-mai-bap.jpg', 100, true),
('Pate Gà Cay', 'Bánh pate gà cay đặc biệt', 22000, 1, '/uploads/products/pate-ga-cay.jpg', 100, true),
('Xúc Xích Mè Rang', 'Bánh xúc xích với mè rang', 20000, 1, '/uploads/products/xuc-xich-me-rang.jpg', 100, true),
('Hot Dog Đức', 'Hot dog kiểu Đức', 25000, 1, '/uploads/products/hot-dog-duc.jpg', 100, true),
('Bánh Đùi Gà', 'Bánh hình đùi gà', 22000, 1, '/uploads/products/banh-dui-ga.jpg', 100, true),
('Bông Lan Trứng Muối Gà Cay Vuông', 'Bông lan trứng muối gà cay dạng vuông', 25000, 1, '/uploads/products/bong-lan-trung-muoi-ga-cay-vuong.jpg', 100, true),
('Bông Lan Trứng Muối Gà Cay', 'Bông lan trứng muối gà cay', 25000, 1, '/uploads/products/bong-lan-trung-muoi-ga-cay.jpg', 100, true),
('Bánh Bông Lúa', 'Bánh hình bông lúa', 20000, 1, '/uploads/products/banh-bong-lua.jpg', 100, true),
('Bánh Mặn Hoa Mai', 'Bánh mặn hình hoa mai', 20000, 1, '/uploads/products/banh-man-hoa-mai.jpg', 100, true),
('Pizza Lớn', 'Pizza cỡ lớn', 35000, 1, '/uploads/products/pizza-lon.jpg', 100, true),
('Hồ Lô Xúc Xích', 'Bánh hồ lô nhân xúc xích', 22000, 1, '/uploads/products/ho-lo-xuc-xich.jpg', 100, true),
('Bông Lan Trứng Muối', 'Bông lan trứng muối truyền thống', 25000, 1, '/uploads/products/bong-lan-trung-muoi.jpg', 100, true),
('Pateso', 'Bánh pateso', 20000, 1, '/uploads/products/pateso.jpg', 100, true),
('Bánh Khô Thịt', 'Bánh khô thịt', 20000, 1, '/uploads/products/banh-kho-thit.jpg', 100, true),
('Que Gà Cay', 'Bánh que gà cay', 18000, 1, '/uploads/products/que-ga-cay.jpg', 100, true),
('Pizza Nhỏ', 'Pizza cỡ nhỏ', 25000, 1, '/uploads/products/pizza-nho.jpg', 100, true),
('Bánh Mặn Vuông', 'Bánh mặn dạng vuông', 20000, 1, '/uploads/products/banh-man-vuong.jpg', 100, true),
('Bánh Mặn Tròn', 'Bánh mặn dạng tròn', 20000, 1, '/uploads/products/banh-man-tron.jpg', 100, true),
('Bánh Mặn Chiên', 'Bánh mặn chiên', 20000, 1, '/uploads/products/banh-man-chien.jpg', 100, true),
('Bông Lan Mặn', 'Bông lan mặn', 22000, 1, '/uploads/products/bong-lan-man.jpg', 100, true);

-- Insert products for Bánh mì
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Bánh Mì Que', 'Bánh mì que giòn tan', 8000, 2, '/uploads/products/banh-mi-que.jpg', 100, true),
('Bánh Mì Heo Quay', 'Bánh mì nhân heo quay', 25000, 2, '/uploads/products/banh-mi-heo-quay.jpg', 100, true),
('Hamburger Heo Bò', 'Hamburger nhân heo và bò', 30000, 2, '/uploads/products/hamburger-heo-bo.jpg', 100, true),
('Bánh Mì Thịt Xíu', 'Bánh mì nhân thịt xá xíu', 25000, 2, '/uploads/products/banh-mi-thit-xiu.jpg', 100, true),
('Hamburger Thịt Nướng', 'Hamburger nhân thịt nướng', 30000, 2, '/uploads/products/hamburger-thit-nuong.jpg', 100, true),
('Hamburger Thịt Chả', 'Hamburger nhân thịt và chả', 30000, 2, '/uploads/products/hamburger-thit-cha.jpg', 100, true),
('Bánh Mì Cá Rim', 'Bánh mì nhân cá rim', 25000, 2, '/uploads/products/banh-mi-ca-rim.jpg', 100, true),
('Bánh Mì Chà Bông', 'Bánh mì nhân chà bông', 25000, 2, '/uploads/products/banh-mi-cha-bong.jpg', 100, true),
('Bánh Mì Ốp La 2 Trứng', 'Bánh mì kèm 2 trứng ốp la', 25000, 2, '/uploads/products/banh-mi-op-la.jpg', 100, true),
('Bánh Mì Thịt Nướng', 'Bánh mì nhân thịt nướng', 25000, 2, '/uploads/products/banh-mi-thit-nuong.jpg', 100, true),
('Hamburger Chả Lát', 'Hamburger nhân chả lát', 30000, 2, '/uploads/products/hamburger-cha-lat.jpg', 100, true),
('Bánh Mì Thịt Chả Đặc Biệt', 'Bánh mì thịt chả đặc biệt', 30000, 2, '/uploads/products/banh-mi-thit-cha-dac-biet.jpg', 100, true),
('Bánh Hamburger Không Nhân', 'Hamburger không nhân', 15000, 2, '/uploads/products/hamburger-khong-nhan.jpg', 100, true),
('Bánh Mì HotDog', 'Bánh mì hotdog', 25000, 2, '/uploads/products/banh-mi-hotdog.jpg', 100, true),
('Bánh Mì Chả Thịt', 'Bánh mì nhân chả thịt', 25000, 2, '/uploads/products/banh-mi-cha-thit.jpg', 100, true),
('Bánh Mì Không Nhân', 'Bánh mì không nhân', 5000, 2, '/uploads/products/banh-mi-khong-nhan.jpg', 100, true);

-- Insert products for Bánh bao
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Bánh Bao Nhân Thịt Bò', 'Bánh bao nhân thịt bò', 25000, 3, '/uploads/products/banh-bao-thit-bo.jpg', 100, true),
('Bánh Bao Nhân Thịt Heo', 'Bánh bao nhân thịt heo', 25000, 3, '/uploads/products/banh-bao-thit-heo.jpg', 100, true),
('Bánh Bao Nhân Dừa Chay', 'Bánh bao nhân dừa chay', 20000, 3, '/uploads/products/banh-bao-dua-chay.jpg', 100, true),
('Bánh Bao Lá Dứa', 'Bánh bao vị lá dứa', 20000, 3, '/uploads/products/banh-bao-la-dua.jpg', 100, true);

-- Insert products for Bánh Kem
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Bánh Kem Nam Trái Tim', 'Bánh kem hình trái tim', 200000, 4, '/uploads/products/banh-kem-trai-tim.jpg', 100, true),
('Bánh Kem Xe Moto', 'Bánh kem hình xe moto', 250000, 4, '/uploads/products/banh-kem-xe-moto.jpg', 100, true),
('Bánh Kem Mừng Thọ', 'Bánh kem mừng thọ', 300000, 4, '/uploads/products/banh-kem-mung-tho.jpg', 100, true),
('Bánh Kem Hình Hello Kitty', 'Bánh kem hình Hello Kitty', 250000, 4, '/uploads/products/banh-kem-hello-kitty.jpg', 100, true),
('Bánh Kem Minion Nhỏ', 'Bánh kem hình Minion cỡ nhỏ', 200000, 4, '/uploads/products/banh-kem-minion.jpg', 100, true);

-- Insert products for Bánh Ngọt
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Dừa Cuốn', 'Bánh dừa cuốn', 15000, 5, '/uploads/products/dua-cuon.jpg', 100, true),
('Muffin Vanila', 'Bánh muffin vị vanilla', 20000, 5, '/uploads/products/muffin-vanila.jpg', 100, true),
('Bánh Con Ong', 'Bánh hình con ong', 18000, 5, '/uploads/products/banh-con-ong.jpg', 100, true),
('Bánh Con Sâu', 'Bánh hình con sâu', 18000, 5, '/uploads/products/banh-con-sau.jpg', 100, true),
('Oval Dâu', 'Bánh oval vị dâu', 20000, 5, '/uploads/products/oval-dau.jpg', 100, true);

-- Insert products for Bánh Mì Gối/ Sandwich
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Bánh Mì Hoa Cúc', 'Bánh mì hoa cúc', 30000, 6, '/uploads/products/banh-mi-hoa-cuc.jpg', 100, true),
('Sandwich Lúa Mạch', 'Sandwich từ bột lúa mạch', 35000, 6, '/uploads/products/sandwich-lua-mach.jpg', 100, true);

-- Insert products for Bánh Bông Lan
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('Bông Lan Dừa', 'Bông lan vị dừa', 20000, 7, '/uploads/products/bong-lan-dua.jpg', 100, true),
('Bông Lan Cuộng Sô Cô La', 'Bông lan cuộn vị socola', 25000, 7, '/uploads/products/bong-lan-cuon-socola.jpg', 100, true),
('Bông Lan Cuộn Môn', 'Bông lan cuộn môn', 25000, 7, '/uploads/products/bong-lan-cuon-mon.jpg', 100, true);

-- Insert products for Bánh Bông Lan Trứng Muối
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_available) VALUES
('262BK', 'Bánh bông lan trứng muối 262BK', 30000, 8, '/uploads/products/262bk.jpg', 100, true); 