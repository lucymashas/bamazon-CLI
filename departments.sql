USE bamazon;

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_cost DECIMAL (10,4) NULL,
  PRIMARY KEY (department_id)
);

