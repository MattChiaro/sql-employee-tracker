// housekeeping
const inquirer = require('inquirer');
const mysql = require('mysql2');
const delay = ms => new Promise(res => setTimeout(res, ms));

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
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, name FROM department', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, name }) => ({ name, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
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
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, title FROM role', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, title }) => ({ name: title, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    }, {
        type: 'list',
        name: 'newEmpManager',
        message: "Who is the new employee's manager?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        choices.push({ name: 'None', value: null }); //add the option for no manager
                        resolve(choices);
                    }
                });
            });
        }
    }
]


const updateEmpQs = [
    {
        type: 'list',
        name: 'updateEmp',
        message: "Which employee's role would you like to update?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    }, {
        type: 'list',
        name: 'updateRole',
        message: "What is the employee's new role?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, title FROM role', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, title }) => ({ name: title, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
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

                    })
                    init();
                    break;
                case 'View all roles':
                    db.query('SELECT * FROM role', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'View all employees':
                    db.query('SELECT * FROM employee', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'Add a department':
                    inquirer.prompt(addDept)
                        .then((data) => {
                            async function addDept() {
                                db.query('INSERT INTO department SET ?', { name: data.dept }, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Added ${data.dept} to departments.`)
                                    init();
                                })
                            }
                            addDept();
                        })

                    break;
                case 'Add a role':
                    inquirer.prompt(addRoleQs)
                        .then((data) => {
                            async function addRole() {
                                db.query('INSERT INTO role SET ?', { title: data.newRoleTitle, salary: data.newRoleSalary, department_id: data.newRoleDept }, function (err) {
                                    if (err) { console.log(err); }
                                    console.log(`Added ${data.newRoleTitle} to roles.`);
                                    init();
                                })
                            }
                            addRole();

                        })

                    break;
                case 'Add an employee':
                    inquirer.prompt(addEmpQs)
                        .then((data) => {
                            async function addEmployee() {
                                db.query('INSERT INTO employee SET ?', { first_name: data.newEmpFirst, last_name: data.newEmpLast, role_id: data.newEmpRole, manager_id: data.newEmpManager }, function (err) {
                                    if (err) { console.log(err) }
                                    console.log(`Added ${data.newEmpFirst} ${data.newEmpLast} to employees.`)
                                    init();
                                })
                            }
                            addEmployee();
                        })
                    break;
                case 'Update employee role':
                    inquirer.prompt(updateEmpQs)
                        .then((data) => {
                            async function updateEmpRole() {
                                db.query('UPDATE employee SET ? WHERE ?', [{ role_id: data.updateRole }, { id: data.updateEmp }], function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Updated employee #${data.updateEmp}'s role to Role #${data.updateRole}.`)
                                    init();
                                })
                            }
                            updateEmpRole();
                        })
                    break;

            }

        })
}

init();