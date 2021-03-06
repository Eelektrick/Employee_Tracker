let mysql = require("mysql");
let inquirer = require("inquirer");
const util = require("util");
let consoleTable = require("console.table");
const { get } = require("http");

let conn = mysql.createConnection({
    host:"localhost",
    port:3306,
    //your username
    user:"root",
    //Please Enter your password
    password:"",
    database:"business_db"
});

function startProgram(){
    inquirer.prompt([
        {
            type: "rawlist",
            name:"choice",
            message:"Which would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "View all employees by Role",
                "View department budget",
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
            case"View all employees by Role":
            ViewByRole();
            break;
            case"View department budget":
            ViewDeptBudget();
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

//view all employees at the job
function ViewAllEmployees(){

    let query = "SELECT e.id , e.first_name, e.last_name, r.title,  d.name as department, r.salary, CONCAT(m.first_name,' ',m.last_name) as manager FROM employee e ";
    query +="LEFT JOIN role r ON e.role_id = r.id ";
    query +="LEFT JOIN department d ON r.department_id = d.id ";
    query +="LEFT JOIN employee m ON m.id = e.manager_id";

    conn.query(query,function(err,res){
        if(err) throw err;

        console.log("Viewing all Employees");
        console.log("-------------------");
        console.table(res);
        
        startProgram();
    });
}

//view employees by department
function ViewByDept(){

    let query = "SELECT d.name AS department, r.title, e.id, e.first_name, e.last_name FROM employee e ";
    query +="LEFT JOIN role r ON (r.id = e.role_id) ";
    query +="LEFT JOIN department d ON (d.id = r.department_id) ";
    query +="ORDER BY d.name";

    conn.query(query,function(err,res){
        if(err) throw err;

        console.log("Viewing Employees by department");
        console.log("-------------------------------");
        console.table(res);

        startProgram();
    });
}

//view employees by manager
function ViewByManager(){

    let query ="SELECT CONCAT(m.first_name,' ',m.last_name) AS manager, d.name AS department, e.id, e.first_name, e.last_name, r.title FROM employee e ";
    query +="LEFT JOIN employee m ON m.id = e.manager_id ";
    query +="INNER JOIN role r ON (r.id = e.role_id && e.manager_id != 'NULL') ";
    query +="INNER JOIN department d ON (d.id = r.department_id) ";
    query +="ORDER BY manager";

    conn.query(query,function(err,res){
        if(err) throw err;

        console.log("Viewing Employees by Manager");
        console.log("---------------------------");
        console.table(res);

        startProgram();
    });    
}

//view employees by their role
function ViewByRole(){
    let query = "SELECT r.id as roleId,  r.title as roleName, r.salary, r.department_id as departmentId, d.name as departmentName FROM employee e "; 
    query += "LEFT JOIN role r on e.role_id = r.id " 
    query +="LEFT JOIN department d on r.department_id = d.id GROUP BY r.id, r.title";
    
    conn.query(query, function (err, res){
        if (err) throw err;
          
        console.log("Viewing By Roles");
        console.log("----------------");
        console.table(res);

        startProgram();
    });
}

//view all departments budget
function ViewDeptBudget(){
    let query = "SELECT d.id ,  d.name as departmentName, SUM(r.salary) as utilizedBudget FROM employee e "; 
    query +="LEFT JOIN role r on e.role_id = r.id "; 
    query +="LEFT JOIN department d on r.department_id = d.id GROUP BY d.id, d.name";
    
    conn.query(query, function(err, res){
        if (err) throw err;

        console.log("Viewing Department Budget");
        console.log("-------------------------");
        console.table(res);

        startProgram();
    });
}

//update employee to new role
async function UpdateRole(){
    let allEmployees = [];
    let rolechoiceA = [];
    let employee = await getAllEmployees();
    let role = await getAllRoles();
  
    for (var i = 0; i < employee.length; i++) {
        allEmployees.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);
    }

    for (var i = 0; i < role.length; i++) {
        rolechoiceA.push(role[i].title);
    }

    inquirer.prompt([
        {
            name: "employee",
            type: "rawlist",
            message: "For which employee, role should be updated?",
            choices: allEmployees
        },
        {
            name: "employeeRole",
            type: "rawlist",
            message: "Please select the role for the selected employee",
            choices: rolechoiceA
        }
    ])
    .then(async function (answer){
        let roleId;
        let newdeptId = await getRoleOnTitle(answer.employeeRole);
        
        newdeptId.find(depId => {
            roleId = depId.id
        });

        var id = answer.employee.split(" ", 2)[1];
    
        conn.query("UPDATE employee SET role_id = '" + roleId + "' WHERE id = '" + id + "'",

            function (err) {
                if (err) throw err;

                console.log("Employee's role got updated successfully!");
                startProgram();
            }
        );
    });
}

//update employees manager
async function UpdateManager(){
    let allEmployees = [];
    let allManagers = ["None"];
    let employee = await getAllEmployees();

    for (var i = 0; i < employee.length; i++) {
      allEmployees.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);
      allManagers.push(employee[i].managerName);
    }
  
    inquirer.prompt([
        {
          name: "employee",
          type: "rawlist",
          message: "For which employee, manager detail to be updated?",
          choices: allEmployees
        },
        {
          name: "manager",
          type: "rawlist",
          message: "Please select the manager for the selected employee...",
          choices: allManagers
        },
    ])
    .then(async function (answer){
  
        if (answer.employee.split(" ", 5)[4] ===  answer.manager.split(" ", 1)[0]) {

          console.log(`Employee and manager should not be same. Please select a different manager`);
          return UpdateManager();
        }

        let mgrName = answer.manager;
        let mgrFirstName = mgrName.split(" ", 1) + "%";
        let id = answer.employee.split(" ", 2)[1];
        let mgrDetails = await getEmployeeOnName(mgrFirstName);
        let mgrId;
        
        mgrDetails.find(managerId => {
          mgrId = managerId.id
        });
  
        if (mgrId === undefined){
  
            conn.query("UPDATE employee SET manager_id = NULL WHERE id = '" + id + "'",
                function (err) {
                    if (err) throw err;
                }
            );
        } 
        else{

            conn.query("UPDATE employee SET manager_id = '" + mgrId + "' WHERE id = '" + id + "'",
                function (err) {
                    if (err) throw err;
                }
            );
        }
        
        console.log("Employee manager details were updated successfully");
        
        startProgram();
    });
}

//add an employee
async function AddEmployee(){
    
    let roleChoice = [];
    let managerChoice = ["None"];

    let role = await getAllRoles();
    let employee = await getAllEmployees();

    for (var i=0; i<role.length; i++){
        roleChoice.push(role[i].title);
    }

    for(var i =0; i<employee.length; i++){
        managerChoice.push(employee[i].managerName);
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

//add a role
async function AddRole(){
    let choiceA = [];

    let dept = await getAllDept();

    for(var i=0; i<dept.length; i++){
        choiceA.push("ID: " + dept[i].id + " Department Name: " + dept[i].name);
    }

    inquirer.prompt([
        {
            name:"roleName",
            type:"input",
            meesage:"Please enter the role you desire",
            validate: inputValidation
        },
        {
            name:"roleSalary",
            type:"input",
            message:"Please enter the salary for the role",
            validate: numberValidation
        },
        {
            name:"deptName",
            type:"rawlist",
            message:"Please attach role to a department",
            choices: choiceA
        }
    ])
    .then(async function(answer){
        let deptId;

        let depName = answer.deptName.split(" ", 5)[4];
        const newDeptId = await getDeptByName(depName);
        newDeptId.find(depId => {
            deptId = depId.id
        });

        conn.query("INSERT INTO role SET ?",
            {
                title: answer.roleName,
                salary: answer.roleSalary,
                department_id: deptId
            },
            function(err){
                if(err) throw err;
                console.log("Role was added successfully");

                startProgram();
            }
        );
    });
}

//add a department
async function AddDept(){

    inquirer.prompt([
        {
            name:"deptName",
            type:"input",
            message:"Please enter the department name you wish to add",
            validate:inputValidation
        }
    ])
    .then(async function(answer){
        conn.query("INSERT INTO department SET ?",
            {
                name: answer.deptName
            },
            function(err){
                if(err) throw err;
                console.log("Department was enter successfully");

                startProgram();
            }
        );
    });
}

//delete employee
async function DeleteEmployee(){
    let choiceA = [];

    let employee = await getAllEmployees();

    for(var i=0; i< employee.length; i++){
        choiceA.push("ID: " + employee[i].id + " Employee Name: " + employee[i].managerName);
    }

    inquirer.prompt([
        {
            name:"employee",
            type:"rawlist",
            message:"Which employee do you wish to remove?",
            choices: choiceA
        }
    ])
    .then(async function(answer){
        let id = answer.employee.split(" ",2)[1];

        conn.query("DELETE FROM employee WHERE ?",
            {
                id: id
            },
            function(err){
                if(err) throw err;
                console.log("Removed Employee successfully");

                startProgram();
            }
        );
    });
}

//Delete Role function
async function DeleteRole(){
    let choiceA = [];

    let roles = await getAllRoles();

    for (var i = 0; i < roles.length; i++) {
        choiceA.push("ID: " + roles[i].id + " Role Name: " + roles[i].title);
    }

    inquirer.prompt([
        {
            name: "employee",
            type: "rawlist",
            message: "Which role do you want to remove?",
            choices: choiceA
        }
    ])
    .then(async function(answer){
        let id = answer.employee.split(" ", 2)[1];

        conn.query("DELETE from role WHERE ?",
            {
                id : id
            },
            function(err, res){
            
                if (err){
                    // Capture the err and tell the user that delete operation cannot be performed as this table is maaped to employee.
                    if(err.errno === 1451) {
                    
                    console.log("There are employees associated with the department. DELETE THEM before trying to delete the role!");
                    
                    return startProgram();
                    } 
                    else throw err;
                } 
                else if(res.affectedRows === 1){                   
                    console.log("Role was removed successfully");

                    return startProgram();
                }
            }       
        );
    });
}

//Delete Department function
async function DeleteDept(){
    var choiceA = [];
    var department = await getAllDept();

    for (var i = 0; i < department.length; i++) {
        choiceA.push("ID: " + department[i].id + " Department Name: " + department[i].name);
    }

    inquirer.prompt([
        {
            name: "employee",
            type: "rawlist",
            message: "Which department you wish to remove?",
            choices: choiceA
        }
    ])
    .then(async function (answer) {

        var id = answer.employee.split(" ", 2)[1];
        console.log(JSON.parse(id));

        conn.query("DELETE from department WHERE ?",
            {
                id : id
            },
    
            function (err, res){
        
                if (err){
                if( err.errno === 1451) {
                
                console.log("There are employees associated with the department. DELETE the employees before trying to delete the department");
                
                return startProgram();
                } else throw err;
                } else if(res.affectedRows === 1) {
            
                    console.log("The Department got removed successfully");
                    return startProgram();
                }
            } 
        );
    });
}

//functions used to find info from the SQL for the other main functions
async function getAllEmployees(){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT id, CONCAT(employee.first_name,' ',employee.last_name) as managerName from employee");
}

async function getAllRoles(){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from role");
}

async function getRoleOnTitle(role){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from role where role.title = ?" , [role]);
}

async function getEmployeeOnName(name){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from employee where employee.first_name LIKE ?" , [name]);
}

async function getAllDept() {
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT id, name from department");  
}

async function getDeptByName(name){
    conn.query = util.promisify(conn.query);
    return await conn.query("SELECT * from department where name = ?" , [name]);
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