# bamazon-CLI
B amazon is a shopping console line application in Node with three different views: 1) Customer View 2)Manager View and 3) Supervisor View.

Customer View: uses inquirer to prompt the user and mysql to store, update and retrieve information.
When the customer places the order, the application checks inventory and either fulfills the request or provides a message back to the user.  The application is menu driven, the user can exit the application when the user is done shopping.

Manager View: provides a list of options to View Products, View Low Inventory , Add to Existing Inventory, Add New Product or Exit the Application.
`View Products for Sale`, List All Items

`View Low Inventory`, List Low Inventory

`Add to Inventory`, Prompts Manager to re-stock any item currently in inventory

`Add New Product`, Adds a New Product 

Supervisor View:   The supervisor can view all product sale information.  Including Overhead Cost, Total Profit and Product Sales.  The can also add new departments to the store.

