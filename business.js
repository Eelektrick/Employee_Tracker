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

    let query ="SELECT CONCAT(m.first_name,' ',m.last_name) AS manager, d.name AS department, e.id, e.first_name, e.last_name, r.title FROM employee e";
    query +="LEFT JOIN employee m ON m.id = e.manager_id";
    query +="INNER JOIN role r ON (r.id = e.role_id && e.manager_id != 'NULL')";
    query +="INNER JOIN department d ON (d.id = r.department_id)";
    query +="ORDER BY";

    conn.query(query,function(err,res){
        if(err) throw err;

        console.log("Viewing Employees by Manager");
        console.log("---------------------------");
        console.table(res);
    });    
}

function UpdateRole(){
    
}

function UpdateManager(){
    
}

async function AddEmployee(){
    
    let roleChoice = [];
    let managerChoice = ["None"];

    let role = await getAllRoles();
    let employee = await getAllEmployees();

    for (var i=0; i<role.length; i++){
        roleChoice.push(role[i].title);
    }

    inquirer.prompt([
        {
            name:"firstName",
            type:"input",
            message:"PLease enter employee's first name",
            validate:inputValidation
        },
        {
            name:"lastName",
            type:"input",
            message:"Please enter employee's last name",
            validate:inputValidation
        },
        {
            name:"role",
            type:"rawlist",
            choices: roleChoice
        },
        {
            name:"managerName",
            type:"rawlist",
            choices:managerChoice
        }
    ])
    .then(async function(answer){

        let newDeptId = await getRoleOnTitle(answer.role);
        let roleId;
        let managerId;

        newDeptId.find(depId => {
            roleId = depId.id
        });

        let managerName = answer.managerName;
        let firstName = managerName.split(" ",1) + "%";

        let newManangerId = await getEmployeeOnName(firstName);

        newManangerId.find(mngrId =>{
            managerId = mngrId.id
        });

        conn.query("INSERT INTO employee SET ?",
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: roleId,
                manager_id: managerId
            },
            function(err){
                if (err) throw err;
                console.log("Employee information was inserted successfully")

                startProgram();
            }
        );
    });
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

async function getAllEmployees(){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT  id, CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee");
}

async function getAllRoles(){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from role");
}

async function getRoleOnTitle(){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from role where role.title = ?" , [role]);
}

async function getEmployeeOnName(){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from employee where employee.first_name LIKE ?" , [name]);
}

//Validate information
function inputValidation(value) {
    if (value != "" && value.match('[a-zA-Z][a-zA-Z]+$')) return true;
    else return "Please enter correct info";
}
  
function numberValidation(value){
   
    if (value != "" && value.match(/^[1-9]\d*$/)) return true;
    else return "Please enter correct info"; 
}

startProgram();