const BACKEND_ADDRESS = 'http://localhost:3000';
let USER_SETTINGS = {};
try{
    USER_SETTINGS = JSON.parse(localStorage.getItem('OPUserSettings')) || {};
}catch{}