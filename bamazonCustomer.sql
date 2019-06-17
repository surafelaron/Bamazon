CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE product (
    id INT AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INT(20),
    stock_quantity INT (20),
    PRIMARY KEY(id)
);

SELECT * FROM product;