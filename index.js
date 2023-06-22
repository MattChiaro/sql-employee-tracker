// housekeeping
const inquirer = require('inquirer');
const mysql = require('mysql2');

// create connection to db
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connected to the employee_db database.')
)

// initial prompt that is repeated after each action
const initialQs = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role'
        ]
    }
]

const addDept = [
    {
        type: 'input',
        name: 'dept',
        message: 'Enter the name of the new department:'
    }
]

const addRoleQs = [
    {
        type: 'input',
        name: 'newRoleTitle',
        message: 'Enter the title of the new role:'
    },{
        type: 'input',
        name: 'newRoleSalary',
        message: 'Enter the salary of the new role:'
    }, {
        type: 'list',
        name: 'newRoleDept',
        message: 'Select the department of the new role:',
        choices: [db.query('SELECT name FROM department')]
    }
]

const addEmpQs = [
    {
        type: 'input',
        name: 'newEmpFirst',
        message: "What is the new employee's first name?"
    }, {
        type: 'input',
        name: 'newEmpLast',
        message: "What is the new employee's last name?"
    }, {
        type: 'list',
        name: 'newEmpRole',
        message: "What is the new employee's role?",
        choices: [db.query('SELECT title FROM role')]
    }, {
        type: 'list',
        name: 'newEmpManager',
        message: "Who is the new employee's manager?",
        choices: [db.query('SELECT first_name, last_name FROM employee')]
    }
]

const updateEmpQs = [
    {
        type: 'list',
        name: 'updateEmp',
        message: "Which employee's role would you like to update?",
        choices: [db.query('SELECT first_name, last_name FROM employee')]
    }, {
        type: 'list',
        name: 'updateRole',
        message: "What is the employee's new role?",
        choices: [db.query('SELECT title FROM role')]
    }
]

