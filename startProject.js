const { execSync, exec } = require('child_process');
const { readFileSync } = require('fs');

async function startProject() {
    const cide = JSON.parse(readFileSync('./cide.json', { encoding: 'utf8' }));
    if (cide) {
        let start_command = "";
        if (cide.templete === 'node') {
            start_command = "npx tsc && node ./dist/server.js";
        }
        if (start_command != "") {
            if (execSync(start_command,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error starting project:', error);
                    }

                    if(stdout){
                        console.log(stdout)
                    }

                    if(stderr){
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