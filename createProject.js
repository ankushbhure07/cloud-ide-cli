// createProject.js

const { execSync } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

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
    installDependencies();

    console.log(`${template} project created successfully!`);
  } else {
    console.log(`${projectName} already exists!`);
  }
}

async function fetchProjectStructureFromAPI(template, projectName, destinationPath) {
  const apiUrl = `https://console.cloudidesys.com/cli/${template}`; // API endpoint for templete strcture

  // try {
  const response = await axios.get(apiUrl);
  const folderStructure = response.data; // Assuming the API returns the folder structure in the response data

  // Create project structure
  createFolderStructure(folderStructure, projectName);

  console.log(`Project '${projectName}' created Successfully for ${template}.`);
  // } catch (err) {
  //   console.error('Error fetching folder structure:', err.message);
  // }
}

function createFolderStructure(folderStructure, workDir) {
  // Create project structure
  for (const [dirPath, files] of Object.entries(folderStructure)) {
    let setWorDir = path.join(workDir, dirPath);
    if (dirPath.indexOf(`.`) >= 0) {
      fs.writeFileSync(setWorDir, files);
    } else {
      fs.mkdirSync(setWorDir);
      createFolderStructure(files, setWorDir);
    }
  }
}

function installDependencies() {
  // Mock dependency installation logic
  // Replace this with your actual dependency installation logic
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

module.exports = createProject;
