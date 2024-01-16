const { execSync, exec } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');


async function startProject() {
    const cide = JSON.parse(readFileSync('./cide.json', { encoding: 'utf8' }));
    if (cide) {
        let start_command = "";
        if (cide.templete === 'node') {
            start_command = "npx tsc && npx nodemon ./dist/server.js";
            writeFileSync('./nodemon.json', `{ "watch": ["server.js"], "exec": "node" }`);
        }
        if (start_command != "") {
            console.log('==============================Cloud Ide CLI Welcomes you==============================');
            console.log(`You are using ` + cide.templete + ` Templete!!!`)
            console.log('');
            console.log(cide.description);
            console.log('');
            console.log(start_command);
            if (execSync(start_command, { stdio: 'inherit' },
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error starting project:', error);
                    }

                    if (stdout) {
                        console.log(stdout)
                    }

                    if (stderr) {
                        console.log(stderr)
                    }
                }
            )) {
                if (cide.name) {
                    console.log(`${cide.name} Started Succesfully!`);
                } else {
                    console.log("Project Started Succesfully!")
                }
            }
        } else {
            console.log("You have entered invalid templete");
        }
    } else {
        console.log("Please Create the cide.json file to run project properly");
    }
}

module.exports = startProject;