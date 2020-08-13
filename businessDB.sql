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