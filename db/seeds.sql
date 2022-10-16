USE employees;

INSERT INTO department
(name)
VALUES
('Sales'),
('IT'),
('Legal'),
('Engineering'); 


INSERT INTO role
(title, salary, department_id)
VALUES
('Sales Lead', 75000, 1),
('IT Support', 100000, 2),
('Lawer', 30000, 3),
('Engineer', 150000, 4);


INSERT INTO employee
(first_name, last_name, role_id, manager_id )
VALUES
('Andy', 'Cline', 1, NULL),
('Linda', 'Ray', 2, NULL),
('Jhon', 'Doe', 1, 1),
('Nick', 'Vue', 4, 2);



