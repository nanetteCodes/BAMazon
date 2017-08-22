var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var colors = require('colors');
//variable for holding table information
var t = new Table;

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

function menu() {
  inquirer.prompt([{
    type: "list",
    message: "What would you like to do?".yellow,
    choices: ["View Items for Sale", "View Low Inventory",
      "Add to Inventory", "Add New Product"
    ],
    name: "choice"
  }]).then(function(inqRes) {
    if (inqRes.choice === "View Items for Sale") {
      console.log("\r\n" + "Here is what's for sale...".white + "\r\n");
      viewItems()
    }
    if (inqRes.choice === "View Low Inventory") {
      console.log("\r\n" + "Here is what's running low...".white + "\r\n");
      viewLowInv();
    }
    if (inqRes.choice === "Add to Inventory") {
      console.log("\r\n" + "Add to inventory...".white + "\r\n");
      viewItems1();
    }
    if (inqRes.choice === "Add New Product") {
      console.log("\r\n" + "Add a new product...".white + "\r\n");
      addProduct();
    }
  });
}
// view item function ----------------------------------------------
function viewItems() {
  connection.query("SELECT * FROM products",
    function(err, res) {
      if (err) throw err;
      res.forEach(function(product) {
        t.cell('Product Id', product.id)
        t.cell('Description', product.product_name)
        t.cell('Department', product.department_name)
        t.cell('Price, USD', product.price, Table.number(2))
        t.cell('Stock Quantity', product.stock_quantity)
        t.newRow()
      })
      console.log(t.toString())
      connection.end();
    });
}
//view low invitory function --------------------------------------
function viewLowInv() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 15",
    function(err, res) {
      if (err) throw err;
      res.forEach(function(product) {
        t.cell('Product Id', product.id)
        t.cell('Description', product.product_name)
        t.cell('Department', product.department_name)
        t.cell('Price, USD', product.price, Table.number(2))
        t.cell('Stock Quantity', product.stock_quantity)
        t.newRow()
      })
      console.log(t.toString())
      connection.end();
    });
}
//Add inventory function -----------------------------------------
 //view first
function viewItems1() {
  connection.query("SELECT * FROM products",
    function(err, res) {
      if (err) throw err;
      res.forEach(function(product) {
        t.cell('Product Id', product.id)
        t.cell('Description', product.product_name)
        t.cell('Department', product.department_name)
        t.cell('Price, USD', product.price, Table.number(2))
        t.cell('Stock Quantity', product.stock_quantity)
        t.newRow()
      })
      console.log(t.toString())
      addInv();
    });
}
 //add stock
function addInv() {
  inquirer.prompt([{
    type: "input",
    message: "choose the item id you want to add to.".yellow,
    name: "itemChoice",
    filter: Number
  }, {
    type: "input",
    message: "how much do you want to add?".yellow,
    name: "quantity",
    filter: Number
  }]).then(function(inqRes) {
    var quantity = (inqRes.quantity);
    var stockAmount = 'SELECT * FROM products WHERE ?';
    connection.query(stockAmount, {
        id: inqRes.itemChoice
      },
      function(err, res) {
        if (err) throw err;
        else {
          var updateAmount = res[0].stock_quantity + inqRes.quantity;
          connection.query('UPDATE bamazon_db.Products SET ? WHERE ?', [{
            stock_quantity: updateAmount
          }, {
            id: inqRes.itemChoice
          }], function(err, res) {
            console.log('-----> Adding Inventory <-----')
            console.log('SUCCESS Database updated'.rainbow);
          });
          connection.end();
        } //else
      }); //err res2
  }); //inqres
} //addInv
//Add New Items function ----------------------------------------------------
function addProduct() {
  // Prompt the user to enter information about the new product
  inquirer.prompt([{
      type: "input",
      name: 'product',
      message: 'Enter new product name.'.yellow,
    },
    {
      type: 'input',
      name: 'department',
      message: 'Which department does the new product belong to?'.yellow,
    },
    {
      type: 'input',
      name: 'price',
      message: 'What is the price per unit?'.green,
      filter: Number
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many items are in stock?'.green,
      filter: Number
    }
  ]).then(function(inqRes) {
    input(inqRes.product, inqRes.department, parseInt(inqRes.price), parseInt(inqRes.quantity));
  }); //inqRes
  function input(product, department, price, quantity) {
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: product,
        department_name: department,
        price: price,
        stock_quantity: quantity
      },
      function(err, res) {
        console.log('-----> Adding New Item <-----');
        console.log('SUCCESS Database updated'.rainbow);
      }); //err,res
  } //input
  connection.end();
} //add product
