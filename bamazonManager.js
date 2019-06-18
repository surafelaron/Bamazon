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

  // ask the manager what would he likes to do

  function productStart(){
    console.log("============================");
    console.log("What would you like to do Mr/Mrs Manager?");
    inquirer.prompt({
        name: "choose",
        type: "list",
        message: "choose what you want to do [list], [low_inventory], [add_to_inventory], [add_product]",
        choices: ["list", "low_inventory", "add_to_inventory", "add_product"]
    }).then(function(answer){
        
        switch(answer.choose){
            case "list":
                console.log("Here is your inventory list");
           myList();
           break;
           case "low_inventory":
               console.log("you choosed low inventory");
               lowInvetory();
               break;
               case "add_to_inventory":
                   console.log("you choosed add to invetory");
                   addInvetory();
                   break;
                   case "add_product":
                       console.log("you choose add product");
                       addProduct();
                       break;
        }
     });
  }
  function myList(){
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
  });
  }
  function lowInvetory(){
      connection.query("SELECT * FROM product WHERE stock_quantity < 10", function(err, res){
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
      });
  }

  function addInvetory(){
    inquirer.prompt({
        name: "chooseProduct",
        type: "input",
        message: "select the ID of the product your are adding on items!"
    }).then(function(answer){
        var input = answer.chooseProduct;
        connection.query("SELECT * FROM product WHERE id = ?", input, function(err, res){
            if(err) throw err;
            console.log(res.length);
            if(res.length === 0){
                console.log("sorry Item not availabve");
            }else{
                inquirer.prompt({
                    name: "quantity", 
                    type: "input",
                    message: "How many would you like to add on the specific item?"
                }).then(function(result){
                    var quantity = result.quantity;
                    
                        var newStock = parseInt(res[0].stock_quantity) + parseInt(quantity);
                        connection.query("UPDATE product SET ? WHERE ?",[
                            {
                                stock_quantity: newStock
                            },
                            {
                                id: res[0].id
                            }
                        ],function(err){
                            if(err) throw err;
                           console.log("new stoch quantity: " + newStock);
                            console.log("=====================================");
                            console.log("inventory been added successfully!!!");
                        });
                });
            }
        });
    });
}
function addProduct (){
    inquirer.prompt([{
       name: "add_item",
       message: "what item would you like to add?"
    },
    {
       name: "add_department",
       message: "what is the department you are adding to?"
    },
    {
        name: "price",
        message: "what is the price for the item?"
    },
    {
        name: "quantity",
        message: "how many items?"
    }]).then(function (answer){
        //var itemInput = answer.add_product;
        connection.query("INSERT INTO product SET ?", {
            product_name: answer.add_item,
            department_name: answer.add_department,
            price: answer.price,
            stock_quantity: answer.quantity
        }, function(err){
        if(err) throw err;
            console.log("item added successfully!!");
        });
    });
}