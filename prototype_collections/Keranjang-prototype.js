'use strict';

const Keranjang = Object.create({
  init: function(products=[],maximalProduct){
    this.products = products;
    this.maximalProduct = maximalProduct;
    return this;
  },
  get _isInitialized() {
    if(this.products && this.maximalProduct)
      return true;
    else{
      return false;
    }
  },
  get numberOfProduct() {
    if(!this._isInitialized) throw new Error('Keranjang is not initialized yet');
    return this.products.length;
  },
});


// module.exports = Keranjang;

// Keranjang.init([{nama:'Handuk',harga:5000},{nama:'Baju',harga:5000}],5)
// console.log(Keranjang.numberOfProduct)