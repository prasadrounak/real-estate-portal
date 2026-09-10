CREATE DATABASE IF NOT EXISTS real_estate_portal;
USE real_estate_portal;

DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 phone VARCHAR(30) DEFAULT '',
 password VARCHAR(255) NOT NULL,
 role ENUM('user','admin') DEFAULT 'user',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
 id INT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(200) NOT NULL,
 description TEXT NOT NULL,
 price DECIMAL(15,2) NOT NULL,
 location VARCHAR(150) NOT NULL,
 property_type VARCHAR(50) NOT NULL,
 purpose ENUM('buy','rent') DEFAULT 'buy',
 bedrooms INT DEFAULT 0,
 bathrooms INT DEFAULT 0,
 area INT DEFAULT 0,
 image VARCHAR(700) DEFAULT '',
 owner_id INT NULL,
 status ENUM('pending','active','rejected') DEFAULT 'active',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE favorites (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 property_id INT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_favorite(user_id,property_id),
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE inquiries (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NULL,
 property_id INT NOT NULL,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL,
 phone VARCHAR(30) DEFAULT '',
 message TEXT NOT NULL,
 status ENUM('new','contacted','closed') DEFAULT 'new',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
 FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
);

INSERT INTO users(name,email,phone,password,role) VALUES
('EstateHub Admin','admin@estatehub.com','9999999999',
'$2a$10$0e5J2QqW0WQ2Qy5t7H8mOeZ7v6Q8rYh5F9k0P4gJ8sR7wX2nC6b2u',
'admin');

INSERT INTO properties(title,description,price,location,property_type,purpose,bedrooms,bathrooms,area,image,owner_id,status) VALUES
('Modern 3 BHK Apartment','Spacious apartment with modern interiors, parking and security.',6500000,'Bhubaneswar','Apartment','buy',3,2,1500,'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',1,'active'),
('Luxury Family Villa','Premium villa with garden and modern amenities.',12500000,'Bangalore','Villa','buy',4,4,2800,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',1,'active'),
('2 BHK City Apartment','Comfortable rental apartment near offices and transport.',28000,'Mumbai','Apartment','rent',2,2,1100,'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',1,'active'),
('Residential Corner Plot','Well-located residential plot suitable for a family home.',3500000,'Cuttack','Plot','buy',0,0,2400,'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',1,'active');
