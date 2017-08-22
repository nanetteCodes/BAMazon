CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL (6,2),
stock_quantity INTEGER,
PRIMARY KEY (id)
);