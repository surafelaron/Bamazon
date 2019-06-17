var mysql = require("mysql");

var inquirer = require ("inquirer");

var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "ziathegreat",
    database: "bamazon"
  });
  connection.connect(function(err){
      if(err) throw err;
      console.log("conection Id: " + connection.threadId);
      productStart();
  });
  function productStart(){
      connection.query("SELECT * FROM product", function(err, res){
          if(err) throw err;
        
        var table = new Table({
            head: ["id", "product_name", "department_name", "price", "stock_quantity"],
            colWidths: [10, 30, 30, 10, 20],
            style: {
                head: ['green'],
                compact: true
            }
        });
        for(var i= 0; i < res.length; i++){
             table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        productSell();
    });
  } 
  function productSell(){
      inquirer.prompt({
          name: "chooseProduct",
          type: "input",
          message: "select the ID of the product your are buying!"
      }).then(function(answer){
          var input = answer.chooseProduct;
          connection.query("SELECT * FROM product WHERE id = ?", input, function(err, res){
              if(err) throw err;
              if(res.length===0){
                  console.log("sorry Item not availabve");
              }else{
                  inquirer.prompt({
                      name: "quantity",
                      type: "input",
                      message: "How many would you like to buy?"
                  }).then(function(result){
                      var quantity = result.quantity;
                      if(quantity > res[0].stock_quantity){
                          console.log("sorry we only have " + res[0].stock_quantity + " number of " + res[0].product_name + "!!")
                      }
                  })
              }
          });
      });
  }

