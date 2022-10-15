const { prompt } = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'MoiProchniy#5',
        database: 'employees'
    },
    console.log('connected to the ... database')
).promise();

const mainMenu = async () => {
    const options = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View all employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View all departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'View all roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Exit',
                    value: 'EXIT'
                }
            ]
        }
    ])
    console.log('choice ' + options.choice);
    switch (options.choice) {
        case 'VIEW_EMPLOYEES':
            viewEmployees();
            break;
        case 'VIEW_DEPARTMENTS':
            viewDepartments();
            break;
        case 'VIEW_ROLES':
            viewRoles();
            break;
        case 'EXIT':
            process.exit();
        default:
            process.exit();
    }
};

const viewEmployees = async () => {
    const [employeeData] = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
                                                  role.title, role.salary, department.name AS departmnent,
                                                  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                                            FROM employee 
                                            LEFT JOIN role ON employee.role_id = role.id
                                            LEFT JOIN department ON role.department_id = department.id
                                            LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    console.table(employeeData);
    mainMenu();
};
const viewDepartments = async () => {
    const [departmentData] = await db.query('SELECT * FROM department');
    console.table(departmentData);
    mainMenu();
};
const viewRoles = async () => {
    const [roleData] = await db.query(`SELECT role.id, role.title, role.salary, department.name AS departmnent
                                        FROM role 
                                        LEFT JOIN department ON role.department_id = department.id`);
    console.table(roleData);
    mainMenu();
};
mainMenu();