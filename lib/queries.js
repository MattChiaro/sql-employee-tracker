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

const viewAllDepts = 'SELECT name FROM department'

const viewAllRoles = 'SELECT title, salary FROM role'

const addDept = 'INSERT INTO department SET ?'

const addRole = 'INSERT INTO role SET ?'

const addEmployee = 'INSERT INTO employee SET ?'

const updateEmployeeRole = 'UPDATE employee SET ? WHERE ?'

const updateEmployeeMgr = 'UPDATE employee SET ? WHERE ?'



module.exports = {
    allEmployeesQuery,
    viewAllDepts,
    viewAllRoles,
    addDept,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeMgr


}