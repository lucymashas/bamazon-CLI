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
  queryInventory();
});

function startOver(){
  inquirer
  .prompt([
    {
    type:"rawlist",
    name:"decision",
    message: "What do you want to do?",
    choices: [ "Exit Application", new inquirer.Separator(), "Place A New Order" ]
    }
  ])
  .then(function(answer){
    console.log(answer.decision);
    if (answer.decision === "Exit Application"){
      connection.end();
    }else{
      queryInventory();
    }
  }) 
}


function fullfillmentCenter(newQuantity,selectedId,price,usersQuantity,prodSales){
  prodSales = price * usersQuantity + prodSales;
  connection.query(
    "UPDATE products SET ? WHERE ?",[
      {stock_quantity: newQuantity,product_sales: prodSales},
      {item_id: selectedId}
    ],
    function(error){
      if (error) throw err;
      console.log("\nYour Order Has Been Placed Successfully!");
      console.log(" _____________________________");
      console.log("\nTotal Cost:  " + price * usersQuantity + "\n\n");
      startOver();
    }
  );
}

function selectItem() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "selection",
          message: "Enter the ID of the item you want to purchase",
          validate: function(value) {
            var found = false;
            for (var i = 0; i < result.length; i++) {
                if (value == result[i].item_id){
                  found = true;
                }
              }
            if (found){
              return true;
            }else{
              return "Enter a Valid Item ID";
            }
          }
        },
        {
          type: "input",
          name: "quantity",
          message: "How Many Items Would You Like To Purchase?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
      ])
      .then(function(answer) {
        var selectedItem;
        for (var i = 0; i < result.length; i++) {
          if (answer.selection == result[i].item_id) {
            selectedItem = result[i].product_name;
            console.log("\nPurchase Summary:  " + answer.quantity + "\t" + selectedItem);
//Check to see if the store has the required inventory
            if (result[i].stock_quantity <= answer.quantity){
              console.log("\nInsufficient quantity! (The Store Does Not Have the Inventory to Fill Your Order");
            }else
            {
              var newQuantity = result[i].stock_quantity - answer.quantity;
              fullfillmentCenter(newQuantity,result[i].item_id,result[i].price,answer.quantity,result[i].product_sales);
            }
          }
        }
        })
    });
  }

  function queryInventory() {
    connection.query("SELECT * FROM products", function(err, result) {
      console.log("\nITEMS AVAILABLE FOR SALE\n")
      var productIdArray = [];
      console.log('\t' + "item ID" + '\t' + "Product Description")
      for (var i = 0; i < result.length; i++) {
        productIdArray.push(result[i].item_id);
        console.log("\t" + result[i].item_id + "\t" + result[i].product_name + "     Price:  " + result[i].price);
      }
      console.log("\n")
      selectItem();
    });
  }

