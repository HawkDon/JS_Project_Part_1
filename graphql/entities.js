class User {
    constructor(userName, firstName, lastName, password, email, job){
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.job = job;
    }
}

module.exports = {
    User: User
}