let mysql = require("mysql");
let inquirer = require("inquirer");
const util = require("util");

let conn = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"business_db"
});

conn.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + conn.threadId + "\n");
    function startProgram();
});

function startProgram(){
    inquirer.prompt([
        {
            type: "list",
            name:"choice",
            message:"Which would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Exit"
            ]
        }
    ])
    .then(response =>{
        switch(response.choice){
            case"View all employees":
            ViewAllEmployees();
            break;
            case"View all employees by department":
            ViewByDept();
            break;
            case"View all employees by manager":
            ViewByManager();
            break;
            case"Add Employee":
            AddEmployee();
            break;
            case"Remove Employee":
            RemoveEmployee();
            break;
            case"Update Employee Role":
            UpdateRole();
            break;
            case"Update Employee Manager":
            UpdateManager();
            break;
            case"Exit":
            console.log("Good Bye");
            conn.end();
            break;
        }
    })
};