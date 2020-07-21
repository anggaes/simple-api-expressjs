const Pribadi = Object.create({
	_nik: '',
	_nama:'',
	_gender:'',
    _tglLahir:'',
    _tptLahir:'',
    _user:{},
    printTglLahir : function()	{
    	console.log("Angga")
    	console.log(this._tglLahir)
    }

});

module.exports = {Pribadi};