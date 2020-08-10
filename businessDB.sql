-- drop database if exists currently --
DROP DATABASE IF EXISTS business_db;

-- create new database --
CREATE DATABASE business_db;

-- use the database that is created--
USE business_db;

CREATE TABLE department(
    id INT NOT NULL,
    name VARCHAR(30), -- HOLDS DEPARTMENT NAME--
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL,
    title VARCHAR(30), -- HOLDS ROLE TITLE--
    salary DECIMAL(10,2),
    department_id INT, -- HOLD REFERENCE TO DEPARTMENT ROLE BELONGS TO--
    PRIMARY key(id)
);

CREATE TABLE employee (
    id INT NOT NULL,
    first_name VARCHAR(30), -- EMPLOYEE FIRST NAME--
    last_name VARCHAR(30), -- LAST NAME OF EMPLOYEE--
    role_id INT, -- ROLE EMPLOYEE HAS--
    manager_id INT, -- ID OF MANAGER CAN BE NULL IF NO MANAGER--
    PRIMARY KEY(id)
);