var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify')


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


function viewDeptProductsSale(){
connection.query(
  "SELECT departments.department_id,departments.department_name,departments.over_head_cost,products.product_sales FROM departments INNER JOIN products on products.item_id = departments.department_id",
  function(err, result) {
    if (err) throw err;
    var spacer="";
    console.log('\n' + "\tItem ID" + "\tDepartment Name" +"\t\tOver Head Cost" + "\t\tProduct Sales"+ "\tTotal Profits");
    for (var i=0; i<result.length;i++){
      if (result[i].product_sales != null ){
        var totalProfit = parseFloat(result[i].over_head_cost - result[i].product_sales);
        console.log('\t\t' + "------------------------------------------------------------------------------")
      }else{
        totalProfit = 0;
      }
      console.log('\t' + result[i].department_id,'\t' + result[i].department_name,'\t\t' + result[i].over_head_cost, '\t\t' + result[i].product_sales,'\t\t' + totalProfit);
      
    }
    console.log("\n")
    start();
  })
}

function createNewDepartment(){
  inquirer
      .prompt([
        {
          type: "input",
          name: "deptName",
          message: "Enter the Departments Name",
        },
        {
          type: "input",
          name: "overHeadCost",
          message: "Enter Over Head Cost",
        },
      ])
      .then(function(answer){
        connection.query(
          "INSERT INTO departments SET ?",
          {
            departments_name:  answer.deptName,
            departments_over_head_cost: answer.overHeadCost,
          },
          function (error, results) {4
              if (error) throw error;
              console.log(answer.deptName + "Has Been added.\n");
              start();
        })
    })
  }


function start(){
  inquirer
  .prompt([
    {
      type: 'rawlist',
      name: 'menuOptions',
      message: 'Select From The Menu Options',
      choices: [
        'View Products Sales by Department',
        'Create New Department',
        'Exit Application'
      ]
    }
  ]).then(function(answer){
      switch (answer.menuOptions){
        case "View Products Sales by Department":
          viewDeptProductsSale();
          break;
        case "Create New Departartment":
          createNewDepartment();
          break;
        case "Exit Application":
          connection.end();
          break;
      }
      
    });
}


