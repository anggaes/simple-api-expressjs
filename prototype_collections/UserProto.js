'use strict';

const User = Object.create({
  // isInitialized: false,
  init: function(userName,email){
    // this.isInitialized = true
    this.userName = userName;
    this.email = email;
    return this;
  },
  get _isInitialized() {
    if(this.userName && this.email)
      return true;
    else{
      return false;
    }
  },
  setuserName: function(userName){
      if(!this._isInitialized) 
          throw new Error('User is not initialized yet');
      this.userName = userName;
      return this
  },
});


module.exports = {User};