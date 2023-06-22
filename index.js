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
    console.log('\x1b[35m', 'Connected to the employee_db database.')
)

const allEmployeesQuery = `SELECT 
                         CONCAT(emp.first_name, ' ',emp.last_name) AS Name,
                         role.title AS Title,
                         role.salary AS Salary,
                         department.name AS Department,
                         CONCAT(mgr.first_name, ' ',mgr.last_name) AS Manager
                         FROM employee emp
                     LEFT JOIN role ON emp.role_id = role.id
                     LEFT JOIN department on role.department_id = department.id
                     LEFT JOIN employee mgr ON emp.manager_id = mgr.id;`

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
            'Update employee role',
            'View employees by manager',
            'View employees by department',
            'Update employee manager',
            'Quit'

        ]
    }
]
// prompts for adding a department
const addDeptQ = [
    {
        type: 'input',
        name: 'dept',
        message: 'Enter the name of the new department:'
    }
]
// prompts for adding a role
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
// prompts for adding an employee
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
// prompts for viewing employees by mgr
const viewEmpByMgrQs = [
    {
        type: 'list',
        name: 'manager',
        message: "Which manager's employees would you like to view?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    }
]
// prompts for updating an employee's role
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
// prompts for updating an employee's manager
const updateEmpMgrQs = [
    {
        type: 'list',
        name: 'updateEmpMgr',
        message: "Which employee's manager would you like to update?",
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
        name: 'updateMgr',
        message: "Who is the employee's new manager?",
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
    }
]

const viewEmpByDeptQs = [
    {
        type: 'list',
        name: 'department',
        message: "Which department's employees would you like to view?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, name FROM department', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, name }) => ({ name: name, value: id }));
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
                    db.query('SELECT name FROM department', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)

                    })
                    init();
                    break;
                case 'View all roles':
                    db.query('SELECT title, salary FROM role', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'View all employees':
                    db.query(allEmployeesQuery, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'Add a department':
                    inquirer.prompt(addDeptQ)
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
                case 'View employees by manager':
                    inquirer.prompt(viewEmpByMgrQs)
                        .then((data) => {
                            async function viewByManager() {
                                db.query(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id = ${data.manager}`, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.table(results)
                                    init();
                                })
                            }
                            viewByManager();
                        })
                    break;
                case 'View employees by department':
                    inquirer.prompt(viewEmpByDeptQs)
                        .then((data) => {
                            async function viewByDept() {
                                db.query(`
                                SELECT
                                CONCAT(first_name, ' ', last_name) AS name
                                From employee
                                RIGHT JOIN role ON employee.role_id = role.id
                                WHERE role.department_id = ${data.department}`, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(data.department)
                                    console.table(results)
                                    init();
                                })
                            }
                            viewByDept();
                        })
                    break;
                case 'Update employee manager':
                    inquirer.prompt(updateEmpMgrQs)
                        .then((data) => {
                            async function updateEmpMgr() {
                                db.query('UPDATE employee SET ? WHERE ?', [{ manager_id: data.updateMgr }, { id: data.updateEmpMgr }], function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Updated employee #${data.updateEmpMgr}'s manager to manager #${data.updateMgr}.`)
                                    init();
                                })
                            }
                            updateEmpMgr();
                        })
                    break;
                case 'Quit':
                    console.log('\x1b[35m', 'Goodbye!')
                    db.end();
                    break;

            }

        })
}

init();