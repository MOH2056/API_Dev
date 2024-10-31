const regexPattern = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
function validateEmail(email) {
    return regexPattern.test(email);

}
validateEmail('xyz321@gmail.com');
validateEmail('youtube@com');

export default validateEmail