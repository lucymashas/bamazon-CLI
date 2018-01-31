var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();

});

function display(result){
  for (var i = 0; i < result.length; i++) {
    console.log("   " + result[i].stock_quantity + "   " + result[i].item_id + "   " + result[i].product_name + "   " + "Price:  " + result[i].price);
  }
  console.log("\n")
  start();
}

function addNewProduct(){
  inquirer
      .prompt([
        {
          type: "input",
          name: "itemName",
          message: "Enter the Product Name",
        },
        {
          type: "input",
          name: "itemPrice",
          message: "Enter the Products Price",
        },
        {
          type: "input",
          name: "itemQuantity",
          message: "Enter the Products Quantity",
        },
        {
          type: "input",
          name: "itemDepartment",
          message: "Department Name",
        },
      ])
      .then(function(answer){
        console.log(answer.itemName, answer.itemDepartment,answer.itemPrice,answer.itemQuantity);
        var sql = 'INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (answer.itemName, answer.itemDepartment,answer.itemPrice,answer.itemQuantity)';
        connection.query(sql, function (error, results) {
          if (error) throw error;
          console.log("Product has been added!");
        })
    })
  }


function addInventory(){
  //query the products table to show item ids to select from
  connection.query("SELECT * FROM products", function(err, result){
    if (err) throw err;
    var choiceArray = [];
    for (var i = 0; i < result.length; i++) {
      choiceArray.push(result[i].item_id);
      console.log(choiceArray[i])
    }
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "choice",
          message: "Select the item you want to Re-Stock",
          choices: function(choiceArray){
            for (var i=0; i<choiceArray.length; i++){
              return choiceArray[i];
            }
          }
        }
      ])
      .then(function(answer){
        console.log(answer.choice)
    })
  })
}

function viewLowInventory(){
  connection.query("SELECT * FROM products HAVING stock_quantity <= 5",function(err, result) {
   if (!result.length){
     console.log("\nInventory Count has not drop to lower then 5\n");
     start();
   }else{
     console.log(result);
    console.log("\nItems that stock quantity is less or equal five");
    display(result);
   }
  });
}

function viewProductsSale(){
    connection.query("SELECT * FROM products", function(err, result) {
      console.log("\nITEMS AVAILABLE FOR SALE\n")
      display(result);
    });
}

function start(){
  inquirer
  .prompt([
    {
      type: 'rawlist',
      name: 'menuOptions',
      message: 'Select From The Menu Options',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
      ]
    }
  ]).then(function(answer){
      console.log(answer.menuOptions);
      switch (answer.menuOptions){
        case "View Products for Sale":
          viewProductsSale();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
          case "Add New Product":
          addNewProduct();
          break;
      }
    });
}


