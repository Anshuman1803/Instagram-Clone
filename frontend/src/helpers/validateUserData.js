const validateUserName = (username) => {
if (username.length !== 10) {
    return false;
  }else{
    return true
  }
};

module.exports = { validateUserName };
