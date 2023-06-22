# sql-employee-tracker

![language badge](https://img.shields.io/github/languages/top/mattchiaro/sql-employee-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)



## Description

The purpose of this project was to parse the data in a SQL database and display it to the console interactively by building an employee management system.

## Installation

To install, clone the repository by using `git clone` or downloading the zip file. `npm i` will downloading all the necessary dependencies, and `npm start` begins the application from the CLI.

To create and seed the database, you can run `source ./db/schema.sql` and `source ./db/seeds.sql` via the mySQL shell.

## Usage

A video walkthrough of the application is available [here.](https://drive.google.com/file/d/11qXDoI3BHM-ngggJBgM1NJxwOFZDeCqM/view)

![npm-start](./Assets/npm-start.png)
![view-all-employees](./Assets/view-all-employees.png)

## Credits

packages used:
* [inquirer](https://www.npmjs.com/package/inquirer)
* [mySQL2](https://www.npmjs.com/package/mysql2)
* [figlet](https://www.npmjs.com/package/figlet)

Additional resources:
* async/await functionality to delay the display of the initial prompts was aided using [this tutorial.](https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line)
* colorful console messages were accomplished via [this tutorial.](https://www.samanthaming.com/tidbits/40-colorful-console-message/)
* database was seeded via a well-prompted GPT query.


## License

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
