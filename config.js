/*module.exports = {
    'secret': 'myfirstwwwapp'
};*/
module.exports = {
   server: {
            host: 'localhost',
            port: 3000
    },
    db: {
        database: 'trd',
        username: 'root',
        password: 'zaqwsX1',
        options: {
                   host: 'localhost',
                   dialect: 'mysql',
                   pool: {max: 5,
                          min: 0,
                          idle: 10000
                         }
                  }
    },
    key: {
        privateKey: 'My1First2WwW2App1',
        tokenExpiry: 60*60*24 // expires in 24 hours
    },
    email: {
        username: "elenachepygina@gmail.com",
        password: "gtktyf75",
        accountName: "WTrd",
        verifyEmailUrl: "verifyEmail"
    }
};
