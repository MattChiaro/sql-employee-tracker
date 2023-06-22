-- populate the sql database with dummy data. This data was provided via a well prompted GPT inquiry.

INSERT INTO department (id, name) VALUES
(1, 'Engineering'),
(2, 'Sales'),
(3, 'Marketing'),
(4, 'Human Resources');

-- Insert roles
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Software Engineer', 60000, 1),
(2, 'Sales Manager', 80000, 2),
(3, 'Marketing Coordinator', 50000, 3),
(4, 'HR Assistant', 40000, 4);

-- Insert employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 1, 1),
(3, 'Michael', 'Johnson', 2, NULL),
(4, 'Emily', 'Williams', 3, 1),
(5, 'David', 'Brown', 3, 4),
(6, 'Sarah', 'Jones', 2, 3),
(7, 'Matthew', 'Taylor', 1, 1),
(8, 'Olivia', 'Miller', 4, 4),
(9, 'Daniel', 'Anderson', 1, 1),
(10, 'Sophia', 'Thomas', 3, 4),
(11, 'James', 'Jackson', 2, 3),
(12, 'Ava', 'White', 1, 1),
(13, 'Joseph', 'Harris', 4, 4),
(14, 'Madison', 'Clark', 2, 3),
(15, 'Benjamin', 'Lewis', 1, 1);