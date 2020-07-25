'use strict';

const Pribadi = Object.create({
  // isInitialized: false,
  init: function(nik,nama){
      // this.isInitialized = true
      this.nik = nik;
      this.nama = nama;
      return this;
  },
  get _isInitialized() {
        if(this.nik && this.nama)
          return true;
        else{
          return false;
        }
  },
  setGender: function(gender){
      if(!this._isInitialized) 
          throw new Error('Pribadi is not initialized yet');
      this.gender = gender;
      return this
  },
  setTglLahir: function(tglLahir){
      if(!this._isInitialized) 
          throw new Error('Pribadi is not initialized yet');
      this.tglLahir = tglLahir;
      return this
  },
  setTptLahir: function(tglLahir){
      if(!this._isInitialized) 
          throw new Error('Pribadi is not initialized yet');
      this.tptLahir = tptLahir;
      return this
  },
  user:{},
});


module.exports = Pribadi;