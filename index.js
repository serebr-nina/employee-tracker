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
        case 'EXIT':
            process.exit();
        default:
            process.exit();
    }
};

const viewEmployees = async () => {
    const [employeeData] = await db.query('SELECT * FROM employee');
    cTable(employeeData);
    mainMenu();
};
const viewDepartments = async () => {
    console.log('here');
    const [departmentData] = await db.query('SELECT * FROM department');
    console.table(departmentData);
    mainMenu();
};
mainMenu();