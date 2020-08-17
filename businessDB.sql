-- drop database if exists currently --
DROP DATABASE IF EXISTS business_db;

-- create new database --
CREATE DATABASE business_db;

-- use the database that is created--
USE business_db;

CREATE TABLE department(
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL, -- HOLDS DEPARTMENT NAME--
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL, -- HOLDS ROLE TITLE--
    salary DECIMAL(10,2) NOT NULL,
    department_id INT UNSIGNED NOT NULL, -- HOLD REFERENCE TO DEPARTMENT ROLE BELONGS TO--
    PRIMARY key(id),
    CONSTRAINT FK_departmentId FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL, -- EMPLOYEE FIRST NAME--
    last_name VARCHAR(30) NOT NULL, -- LAST NAME OF EMPLOYEE--
    role_id INT NOT NULL, -- ROLE EMPLOYEE HAS--
    manager_id INT UNSIGNED, -- ID OF MANAGER CAN BE NULL IF NO MANAGER--
    PRIMARY KEY(id),
    CONSTRAINT FK_managerId FOREIGN KEY(manager_id) REFERENCES employee(id)
);

-- USE business_db;--

/* Insert  Rows into department table */

INSERT INTO department (name)
VALUES ("Engineer");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing", 50000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountants", 45000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Business Analyst", 75000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Officer", 55000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Potter", 1, NULL);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Taylor", "Hart", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Johnson", 3, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Ramsey", 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Neal", "Huggins", 5, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jared", "Hooker", 6, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Raylen", "Harder", 1, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Shelby", 4, 6);