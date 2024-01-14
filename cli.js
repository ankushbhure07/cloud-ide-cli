#!/usr/bin/env node
// above line inform the cmd to excute by node compiler
// cli.js

const { program } = require('commander');
const createProject = require('./createProject');
const startProject = require('./startProject');
const { execSync } = require('child_process');
const readline = require('readline');
const axios = require('axios');
const { resolve } = require('path');
// Set env using Dotenv
require(`dotenv`).config();


// Key to link login on browser and continous check for cli to server logged in or not
const random_key = (Math.random() * 100000).toFixed(0);

// new project for templets ex:- new project node
program
  .command('new <project_name> <template>')
  .description('Create a new project')
  .action((projectName, template) => {
    checkUserLoggedIn(() => {
      createProject(projectName, template)
    });
  });

// start the project 
program
  .command('start')
  .description('Start any Cloud IDE project')
  .action(() => {
    checkUserLoggedIn(() => {
      startProject();
    })
  });


// for every command check user is logged in or not
async function checkUserLoggedIn(callbackProcess) {
  if (!await loginStatusVerify()) {
    // Not loggedin
    console.log('');
    console.log('You are not logged in.');
    console.log('Do you have CloudIDEsys account (yes/no)');
    // If yes the ask for userid password not then ask to register
    // Set input output at line
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let account_ans = new Promise((resolve, reject) => {
      rl.question('> ', (answer) => {
        rl.close();
        resolve(answer);
      });
    }).then((answer) => {
      if (answer.toLocaleLowerCase() === 'yes') {
        // If yes then open browser
        let rl_login = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        console.log('Would you like to Login? (yes/no)');
        rl_login.question('> ', (answer) => {
          if (answer === 'yes') {
            // Open browser for login
            console.log('Opening browser for login...');
            setTimeout(() => {
              openBrowserForAccountCreation(``);
            }, 1000);
          } else {
            // Inform without login nothing is possible
            console.log('Sorry to inform you that, you are not able to use Cloud IDE CLI without login!!!');
          }
          rl_login.close();
        });
      } else {
        console.log('Would you like to create an account? (yes/no)');
        // Set Input Output 
        let rl_register = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })
        // Take input
        rl_register.question('> ', async (answer) => {
          if (answer.toLocaleLowerCase() === 'yes') {
            console.log('Opening browser for account creation...');
            setTimeout(() => {
              openBrowserForAccountCreation(`register?id=${random_key}`, random_key);
            }, 1000);
          } else {
            // Inform without login nothing is possible
            console.log('Sorry to inform you that, you are not able to use Cloud IDE CLI without registration!!!');
          }
          rl_register.close();
        });
      }
    });
  } else {
    callbackProcess();
  }
}

async function openBrowserForAccountCreation(open, random_key) {
  try {
    // URL to navigate
    const url = `https://console.cloudidesys.com/${open}?id=${random_key}`; // Replace with your registration URL or desired URL
    execSync(`start ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error opening browser:', error);
      }
    });
    // Wait for 2 min for login successfull response
    setTimeout(async () => {
      loginStatusVerify().then((response) => {
        if (response) {
          console.log(`Login Successfull ${response.print_name}, Enjoy CloudIDE CLI!`);
        } else {
          console.log("Somthing Went Wrong, Please Try Again!");
        }
      })
    }, (1500 * 60))
  } catch (error) {
    console.log("Somthing Went Wrong, Please Check your internet Connection!");
  }
}

const loginStatusVerify = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let login_response = await axios.get(`https://console.cloudidesys.com/cli?id=${random_key}&usename=${process?.env?.CLOUD_IDE_USERNAME}&secret_key=${process?.env?.CLOUD_IDE_SECRET_KEY}`);
      if (login_response) {
        if (login_response.data.username && login_response.data.secret_key) {
          // Set username and secret key for further processing
          process.env.CLOUD_IDE_USERNAME = login_response.data.username;
          process.env.CLOUD_IDE_SECRET_KEY = login_response.data.secret_key;
          resolve(login_response.data);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log("Somthing Went Wrong, Please Check your internet Connection!");
      resolve(false);
    }
  });
}

program.parse(process.argv);
