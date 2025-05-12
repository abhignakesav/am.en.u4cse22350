const axios = require('axios');
const readline = require('readline');

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function registerWithService() {
  try {
    console.log('Stock Exchange API Registration');
    console.log('Please provide your information:');
    
    const email = await prompt('Email: ');
    const name = await prompt('Name: ');
    const mobileNo = await prompt('Mobile Number: ');
    const githubUsername = await prompt('GitHub Username: ');
    const rollNo = await prompt('Roll Number: ');
    const collegeName = await prompt('College Name: ');
    const accessCode = await prompt('Access Code: ');
    
    const registrationData = {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      collegeName,
      accessCode
    };
    
    console.log('\nRegistering with the service...');
    
    const response = await axios.post(`${API_BASE_URL}/register`, registrationData);
    
    if (response.data) {
      console.log('\n===== Registration Successful! =====');
      console.log('IMPORTANT: Save these credentials. You will NOT be able to retrieve them again!');
      console.log('\nCredentials:');
      console.log(JSON.stringify(response.data, null, 2));
      
      console.log('\nPlease copy these credentials and use them in your application.');
    } else {
      console.error('Registration failed. No data received from the server.');
    }
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
  } finally {
    rl.close();
  }
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

registerWithService(); 