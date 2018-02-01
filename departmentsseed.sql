USE bamazon;

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_cost DECIMAL (10,4) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name,over_head_cost)
VALUES ("TV & Home Theater", 50000.00),
       ("Streaming Media Players", 10000.00),
       ("Video Games", 9000.00),
       ("Smart Watches & Accessories",3000.00),
       ("Fitness",5000.00),
       ("Digital Cameras",13000.00),
       ("Audio",5000.00)