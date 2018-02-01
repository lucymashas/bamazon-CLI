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
  console.log( "Stock Quantity " + "ID " + '\t' + "Product Description\n");
  for (var i = 0; i < result.length; i++) {
    console.log('\t' + result[i].stock_quantity + '\t' + result[i].item_id + '\t' + result[i].product_name + '\t' + '\t' + "Price:  " + result[i].price);
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
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name:  answer.itemName,
            department_name: answer.itemDepartment,
            price: answer.itemPrice,
            stock_quantity: answer.itemQuantity
          },
          function (error, results) {4
              if (error) throw error;
              console.log("\nProduct has been added to inventory!");
              start();
        })
    })
  }

function updateInventory(item_id_selected,stockQuantity){
  sql = "UPDATE products SET stock_quantity = stockQuantity WHERE item_id = item_id_selected";
  connection.query(sql, function(err, result){
    if (err) throw err;
    console.log("\n" + item_id_selected + "     Has been updated, New Stock Quantity:  " + stockQuantity + "\n")
  })
}


function addInventory(){
  //query the products table to show item ids to select from
  connection.query("SELECT * FROM products", function(err, result){
    if (err) throw err;
    function choicesArr(products){
      var choiceArray = [];
      for (var i = 0; i < products.length; i++) {
        // console.log("inside choice Array for loop ", typeof (products[i].item_id));
        choiceArray.push(`${products[i].item_id} Item ${products[i].product_name}`);
      }
      return choiceArray;
    }
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "choice",
          message: "Select the item you want to Re-Stock",
          choices: choicesArr(result)
        },
        {
          type: "input",
          name: "reStockAmount",
          message: "How many more items are you adding to the existing inventory?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          } 
        }
      ])
      .then(function(answer){
        var item_id_selected = answer.choice.split(" ");
        for (var i=0; i < result.length; i++){
          if (result[i].item_id == item_id_selected[0]){
            var quantity = parseInt(answer.reStockAmount) + result[i].stock_quantity;
          }
        }
        updateInventory(parseInt(item_id_selected[0]),quantity);
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
    console.log("\nItems with a stock quantity of less or equal five");
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


