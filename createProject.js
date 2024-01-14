// createProject.js

const { execSync } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const AdmZip = require('adm-zip');

async function createProject(projectName, template) {
  console.log(`Creating a new ${template} project named ${projectName}`);

  //Destination path
  const destinationPath = path.join(process.cwd(), projectName);

  // Check wether folder already exists
  let directorys_at_current_dir = fs.readdirSync('./');
  if (projectName != directorys_at_current_dir.find((directorys_at_current_dir_row) => directorys_at_current_dir_row === projectName)) {

    // When directory dose't exists
    fs.mkdirSync(destinationPath);

    // Mock API call to fetch project structure for the given template
    await fetchProjectStructureFromAPI(template, projectName, destinationPath);

    // Install dependencies
    installDependencies(projectName);

    console.log(`${template} project created successfully!`);
  } else {
    console.log(`${projectName} already exists!`);
  }
}

async function fetchProjectStructureFromAPI(template, projectName, destinationPath) {
  const apiUrl = `https://console.cloudidesys.com/cli/${template}.zip`; // API endpoint for downloading the zip file

  try {
    const response = await axios({
      method: 'GET',
      url: apiUrl,
      responseType: 'arraybuffer', // Set the response type to arraybuffer
    });

    // Save the downloaded zip file
    const zipFilePath = path.join(destinationPath, `${projectName}.zip`);
    fs.writeFileSync(zipFilePath, response.data);

    // Unzip the downloaded file to create project structure
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(destinationPath, true);

    // Remove the downloaded zip file after extraction
    fs.unlinkSync(zipFilePath);

    console.log(`Project '${projectName}' created successfully for ${template}.`);
  } catch (err) {
    console.error('Error fetching or extracting project structure:', err.message);
  }
}

function installDependencies(projectName) {
  /* Switch to working directory */
  process.chdir(projectName);
  // Mock dependency installation logic
  // Replace this with your actual dependency installation logic
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

module.exports = createProject;
