function logout(){
    localStorage.removeItem('OPToken');
    window.location.pathname = '/';
}