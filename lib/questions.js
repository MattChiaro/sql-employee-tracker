const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employees_db'
    })

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
// prompts for viewing employees by department
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

module.exports = {
    initialQs,
    addDeptQ,
    addRoleQs,
    addEmpQs,
    viewEmpByMgrQs,
    updateEmpQs,
    updateEmpMgrQs,
    viewEmpByDeptQs
}