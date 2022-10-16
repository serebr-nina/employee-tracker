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
    console.log('connected to the Employees database')
).promise();

const mainMenu = async () => {
    const options = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View all departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'View all roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'View all employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Exit',
                    value: 'EXIT'
                },
            ]
        }
    ])
    //console.log('choice ' + options.choice);
    switch (options.choice) {
        case 'VIEW_DEPARTMENTS':
            viewDepartments();
            break;
        case 'VIEW_ROLES':
            viewRoles();
            break;
        case 'VIEW_EMPLOYEES':
            viewEmployees();
            break;    
        case 'ADD_DEPARTMENT':
            addDepartment();
            break;
        case 'ADD_ROLE':
            addRole();
            break;
        case 'ADD_EMPLOYEE':
            addEmployee();
            break;
        case 'UPDATE_EMPLOYEE_ROLE':
            updateEmployeeRole();
            break;
        case 'EXIT':
            process.exit();
        default:
            process.exit();
    }
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

const addDepartment = async () => {
    const options = await prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the department's name? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the department's name!");
                    return false;
                }
            }
        }
    ])
    //console.log(options.name);
    const params = [options.name];
    await db.query('INSERT INTO department (name) VALUES (?)', params);
    console.log(`Added Department ${options.name} to the database`);
    mainMenu();
};

const addRole = async () => {
    const [departmentData] = await db.query('SELECT * FROM department');
    //console.log(departmentData);
    //const choices = departmentData.map(x => {x.name});
    const choices = departmentData.map((item) => {
        const choice = {};
        choice.name = item.name;
        choice.value = item.id;
        return choice;
    });
    //console.log(choices);

    const options = await prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the role's name? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the role's name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary? (Required)",
            validate: salaryInput => {
                if (salaryInput && !isNaN(salaryInput)) {
                    return true;
                } else {
                    console.log(" Please enter the role's salary!");
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'department',
            message: "Select the role's department",
            choices: choices
        }
    ])
    //console.log(options.name);
    const params = [options.name, options.salary, options.department];
    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', params);
    console.log(`Added Role ${options.name} to the database`);
    mainMenu();
};

const addEmployee = async () => {
    const [roleData] = await db.query(`SELECT role.id, role.title FROM role`);
    //console.log(roleData);
    //const choices = departmentData.map(x => {x.name});
    const choices1 = roleData.map((item) => {
        const choice = {};
        choice.name = item.title;
        choice.value = item.id;
        return choice;
    });
    const [employeeData] = await db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`);
    //console.log(roleData);
    //const choices = departmentData.map(x => {x.name});
    const choices2 = employeeData.map((item) => {
        const choice = {};
        choice.name = item.name;
        choice.value = item.id;
        return choice;
    });
    //console.log(choices2);

    const options = await prompt([
        {
            type: 'input',
            name: 'first',
            message: "What is the employee's first name? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the employee's first name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last',
            message: "What is the employee's last name? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the employee's last name!");
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'role',
            message: "Select the employee's role",
            choices: choices1
        },
        {
            type: 'list',
            name: 'manager',
            message: "Select the employee's manager",
            choices: choices2
        }
    ])
    //console.log(options.name);
    const params = [options.first, options.last, options.role, options.manager];
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', params);
    console.log(`Added Employee ${options.first} ${options.last} to the database`);
    mainMenu();
};

const updateEmployeeRole = async () => {
    const [roleData] = await db.query(`SELECT role.id, role.title FROM role`);
    //console.log(roleData);
    //const choices = departmentData.map(x => {x.name});
    const choices1 = roleData.map((item) => {
        const choice = {};
        choice.name = item.title;
        choice.value = item.id;
        return choice;
    });
    const [employeeData] = await db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`);
    //console.log(roleData);
    //const choices = departmentData.map(x => {x.name});
    const choices2 = employeeData.map((item) => {
        const choice = {};
        choice.name = item.name;
        choice.value = item.id;
        return choice;
    });
    //console.log(choices2);

    const options = await prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Select the employee to update role",
            choices: choices2
        },
        {
            type: 'list',
            name: 'role',
            message: "Select the employee's new role",
            choices: choices1
        },

    ])
    const employeeName = choices2.find(element => element.value === options.employee);
    const roleName = choices1.find(element => element.value === options.role);
    //console.log(options.name);
    const params = [options.role, options.employee];
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', params);
    console.log(`Updated Employee ${employeeName.name} role to ${roleName.name}`);
    mainMenu();
};

mainMenu();