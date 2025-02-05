import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
  }],
  total: { type: Number, default: 0 },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
