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
    }, {
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

async function init() {
    await delay(1000);
    inquirer.prompt(initialQs)
        .then((data) => {
            console.log(`You selected: ${data.action}`)
            switch (data.action) {
                case 'View all departments':
                    db.query('SELECT * FROM department', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                        init();
                    })
                    break;
                case 'View all roles':
                    db.query('SELECT * FROM role', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    break;
                case 'View all employees':
                    db.query('SELECT * FROM employee', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    break;
                case 'Add a department':
                    inquirer.prompt(addDept)
                        .then((data) => {
                            db.query('INSERT INTO department SET ?', { name: data.dept }, function (err, results) {
                                if (err) { console.log(err) }
                                console.log(`Added ${data.dept} to departments.`)
                            })
                        })
                    break;
                case 'Add a role':
                    inquirer.prompt(addRoleQs)
                        .then((data) => {
                            db.query('INSERT INTO role SET ?', { title: data.newRoleTitle, salary: data.newRoleSalary, department_id: data.newRoleDept }, function (err, results) {
                                if (err) { console.log(err) }
                                console.log(`Added ${data.newRoleTitle} to roles.`)
                            })
                        })
                    break;
                case 'Add an employee':
                    inquirer.prompt(addEmpQs)
                        .then((data) => {
                            db.query('INSERT INTO employee SET ?', { first_name: data.newEmpFirst, last_name: data.newEmpLast, role_id: data.newEmpRole, manager_id: data.newEmpManager }, function (err, results) {
                                if (err) { console.log(err) }
                                console.log(`Added ${data.newEmpFirst} ${data.newEmpLast} to employees.`)
                            })
                        })
                    break;
                case 'Update employee role':
                    inquirer.prompt(updateEmpQs)
                        .then((data) => {
                            db.query('UPDATE employee SET ? WHERE ?', { role_id: data.updateRole }, { first_name: data.updateEmp }, function (err, results) {
                                if (err) { console.log(err) }
                                console.log(`Updated ${data.updateEmp}'s role to ${data.updateRole}.`)
                            })
                        })
                    break;

            }

        })
}

init();