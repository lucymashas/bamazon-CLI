DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL (10,4) NULL,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Sony 65 CLASS LED (2160p Smart 4K Ultra HD TV)","TV & Home Theater", 1499.99,10),
       ("Apple TV 4K - 64GB", "Streaming Media Players", 199.99, 10),
       ("Sony - PlayStation 4 Pro Console", "Video Games", 399.99, 20),
       ("Garmin - fēnix 3 GPS Watch - Gray/Black", "Fitness", 349.99, 10),
       ("Apple Watch Series 3 Space Grey Aluminum", "Smart Watches & Accessories", 429.00, 10),
       ("Fitbit - Ionic Smartwatch - Charcoal/smoke gray", "Fitness", 299.95, 5),
       ("Canon - EOS 80D DSLR Camera with 18-135mm IS USM Lens - Black", "Digital Cameras", 1499.99, 5),
       ("GoPro - HERO6 Black 4K Action Camera - black", "Digital Cameras", 399.99, 5),
       ("Bose® - SoundTouch® 30 Series III Wireless Music System - Black", "Audio", 499.99, 5),
       ("Bose® - SoundTouch® 10 x 2 Wireless Starter Pack - Black", "Audio", 399.99, 5);


