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

function fullfillmentCenter(quantity,selected){
  console.log(quantity,selected);
  connection.query(
    "UPDATE products SET ? WHERE ?",[
      {item_id: quantity},
      {stock_quantity: selected}
    ],
    function(error){
      if (error) throw err;
      console.log("Your Order Has Been Placed Successfully!");
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
          type: "rawlist",
          name: "choice",
          message: "Select the item you want to buy",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < result.length; i++) {
              choiceArray.push(result[i].item_id);
            }
            return choiceArray;
          }
          },
          {
          type: "input",
          name: "quantity",
          message: "\nHow Many Items Would You Like To Purchase?"
          }
      ])
      .then(function(answer) {
        var selectedItem;
        for (var i = 0; i < result.length; i++) {
          if (answer.choice == result[i].item_id) {
            selectedItem = result[i].product_name;
            console.log("\nPurchase Summary:  " + answer.quantity + " - " + selectedItem);
//Check to see if the store has the required inventory
            if (result[i].stock_quantity <= answer.quantity){
              console.log("\nInsufficient quantity! (The Store Does Not Have the Inventory to Fill Your Order");
            }
            else{
              var newQuantity = result[i].stock_quantity - answer.quantity;
              fullfillmentCenter(newQuantity,result[i].item_id);
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
    for (var i = 0; i < result.length; i++) {
      productIdArray.push(result[i].item_id);
      console.log(result[i].item_id + "     " + result[i].product_name + "   Price:  " + result[i].price);
    }
    console.log("\n")
    selectItem();
  });
}

