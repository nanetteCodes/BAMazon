INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Avocado", "Produce", 1.50, 500),
	   ("Ipad Mini", "Electronics", 499.99, 100),
	   ("Basketball Net", "Sporting Goods", 5.50, 30),
	   ("Beats Headphones", "Electronics", 299.99, 600),
	   ("Ketchup", "Condiments", 3.00, 846),
	   ("Tabasco Sauce", "Condiments", 4.30, 498),
	   ("Apple", "Produce", 0.75, 900),
	   ("Orange", "Produce",1.00, 563);

USE bamazon_db;
SELECT id FROM products;
SELECT * FROM products Where id = 1;
