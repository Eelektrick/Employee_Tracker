let mysql = require("mysql");
let inquirer = require("inquirer");
const util = require("util");
let consoleTable = require("console.table");

let conn = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    //Enter your password
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
                "Update Employee Role",
                "Update Employee Manager",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Delete Employee",
                "Delete Role",
                "Delete Department",
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
            case"Update Employee Role":
            UpdateRole();
            break;
            case"Update Employee Manager":
            UpdateManager();
            break;
            case"Add Employee":
            AddEmployee();
            break;
            case"Add Role":
            AddRole();
            break;
            case"Add Department":
            AddDept();
            break;
            case"Delete Employee":
            DeleteEmployee();
            break;
            case"Delete Role":
            DeleteRole();
            break;
            case"Delete Department":
            DeleteDept();
            break;
            case"Exit":
            console.log("Good Bye");
            conn.end();
            break;
        }
    })
};

function ViewAllEmployees(){

    let query = "SELECT e.id , e.first_name, e.last_name, r.title,  d.name as department, r.salary, CONCAT(m.first_name,' ',m.last_name) as manager FROM employee e ";
    query +="LEFT JOIN role r ON e.role_id = r.id";
    query +="LEFT JOIN department d ON r.department_id = d.id";
    query +="LEFT JOIN employee m ON m.id = e.manager_id";

    conn.query(query,function(err,res){
        if(err) throw err;

        console.log("Viewing all Employees");
        console.log("-------------------");
        console.table(res);
        
        startProgram();
    });
}

function ViewByDept(){
    let query = "SELECT d.name AS department, r.title, e.id, e.first_name, e.last_name FROM employee e";
    query +="LEFT JOIN role r ON (r.id = e.role_id)";
    query +="LEFT JOIN department d ON (d.id = r.department_id)";
    query +="ORDER BY d.name";

    conn.query(query,function(err,res){
        if(err) throw err;

        console.log("Viewing Employees by department");
        console.log("-------------------------------");
        console.table(res);
    });
}

function ViewByManager(){
    
}

function UpdateRole(){
    
}

function UpdateManager(){
    
}

function AddEmployee(){
    
}

function AddRole(){

}

function AddDept(){

}

function DeleteEmployee(){
    
}

function DeleteRole(){

}

function DeleteDept(){

}

startProgram();