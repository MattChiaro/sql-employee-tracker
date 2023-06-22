// housekeeping
const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');
const delay = ms => new Promise(res => setTimeout(res, ms));

// import questions and queries
const questions = require('./lib/questions');
const queries = require('./lib/queries');


// create connection to db
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('\x1b[35m', 'Connected to the employee_db database.'),
    figlet.text('Employee Manager v1', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
    console.log("\x1b[31m", data)
    })
)

async function init() {
    await delay(1000);
    inquirer.prompt(questions.initialQs)
        .then((data) => {
            console.log(`You selected: ${data.action}`)
            switch (data.action) {
                case 'View all departments':
                    db.query(queries.viewAllDepts, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)

                    })
                    init();
                    break;
                case 'View all roles':
                    db.query(queries.viewAllRoles, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'View all employees':
                    db.query(queries.allEmployeesQuery, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'Add a department':
                    inquirer.prompt(questions.addDeptQ)
                        .then((data) => {
                            async function addDept() {
                                db.query(queries.addDept, { name: data.dept }, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Added ${data.dept} to departments.`)
                                    init();
                                })
                            }
                            addDept();
                        })

                    break;
                case 'Add a role':
                    inquirer.prompt(questions.addRoleQs)
                        .then((data) => {
                            async function addRole() {
                                db.query(queries.addRole, { title: data.newRoleTitle, salary: data.newRoleSalary, department_id: data.newRoleDept }, function (err) {
                                    if (err) { console.log(err); }
                                    console.log(`Added ${data.newRoleTitle} to roles.`);
                                    init();
                                })
                            }
                            addRole();

                        })

                    break;
                case 'Add an employee':
                    inquirer.prompt(questions.addEmpQs)
                        .then((data) => {
                            async function addEmployee() {
                                db.query(queries.addEmployee, { first_name: data.newEmpFirst, last_name: data.newEmpLast, role_id: data.newEmpRole, manager_id: data.newEmpManager }, function (err) {
                                    if (err) { console.log(err) }
                                    console.log(`Added ${data.newEmpFirst} ${data.newEmpLast} to employees.`)
                                    init();
                                })
                            }
                            addEmployee();
                        })
                    break;
                case 'Update employee role':
                    inquirer.prompt(questions.updateEmpQs)
                        .then((data) => {
                            async function updateEmpRole() {
                                db.query(queries.updateEmployeeRole, [{ role_id: data.updateRole }, { id: data.updateEmp }], function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Updated employee #${data.updateEmp}'s role to Role #${data.updateRole}.`)
                                    init();
                                })
                            }
                            updateEmpRole();
                        })
                    break;
                case 'View employees by manager':
                    inquirer.prompt(questions.viewEmpByMgrQs)
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
                    inquirer.prompt(questions.viewEmpByDeptQs)
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
                    inquirer.prompt(questions.updateEmpMgrQs)
                        .then((data) => {
                            async function updateEmpMgr() {
                                db.query(queries.updateEmployeeMgr, [{ manager_id: data.updateMgr }, { id: data.updateEmpMgr }], function (err, results) {
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
                    process.exit();
                    break;

            }

        })
}

init();