var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var colors = require('colors');
var id = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  menu();
});
//prompt asking users what to do
function menu() {
  inquirer.prompt([{
    type: "confirm",
    message: "Would you like to see our inventory?".magenta,
    name: "choice",
    default: true

  }]).then(function(inqRes) {
    if (inqRes.choice === true) {
      console.log("Here is what's for sale...".magenta);
      chooseItem();
    } else {
      console.log("\r\n" + "Come again Soon!".rainbow + "\r\n");
      connection.end();
    }
  });
}
//choose item by id
function chooseItem() {
  connection.query("SELECT * FROM products",
    function(err, res) {
      if (err) throw err;
      var t = new Table;
      res.forEach(function(product) {
        t.cell('Product Id', product.id)
        t.cell('Description', product.product_name)
        t.cell('Price, USD', product.price, Table.number(2))
        t.cell('Stock Quantity', product.stock_quantity)
        t.newRow()
      })
      console.log(t.toString())

      inquirer.prompt([{
          type: "input",
          message: "choose the item id you want to purchase.".grey,
          name: "itemChoice",
          filter: Number
        },
        {
          type: "input",
          message: "how many would you like?".grey,
          name: "quantity",
          filter: Number
        }
      ]).then(function(inqRes) {
        var idChoice = (inqRes.itemChoice);
        var quantity = (inqRes.quantity);
        // Query db to confirm that the given item ID exists in the desired quantity
        var stockAmount = 'SELECT * FROM products WHERE ?';
        connection.query(stockAmount, {
            id: inqRes.itemChoice
          },
          function(err, res) {
            if (err) throw err;
            if (quantity <= res[0].stock_quantity) {
              var updateAmount = res[0].stock_quantity - inqRes.quantity;
              connection.query('UPDATE bamazon_db.Products SET ? WHERE ?', [{
                  stock_quantity: updateAmount
                },
                {
                  id: inqRes.itemChoice
                }
              ], function(err, res) {
                console.log('-----> Placing order <-----')
                console.log('SUCCESS Database updated'.rainbow);
              });
              connection.end();
              //updateProduct();
            } else {
              console.log('-----> Sorry, insufecient quantity < -------'.red);
              menu()
            }
          }); //err, res 2
      }); //then
    }); //err, res 1
} //choose item
