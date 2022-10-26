import {useContext, useState, Fragment} from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import CheckOut from "../Checkout/CheckOut";

const Cart = (props) => {
  const [isCheckout,setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [didSubmit,setDidSubmit] = useState(false);


  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const showCheckoutHandler = () => {
    setIsCheckout(true);
  }

  const submitDataHandler = async (userData) => {
    setIsSubmitting(true);
    await  fetch('https://food-order-maximilian-react-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json',{
      method:'POST',
      body:JSON.stringify({
        user: userData,
        orderedItems:cartCtx.items
      })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.emptyCart();
  }

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (<div className={classes.actions}>
    <button className={classes['button--alt']} onClick={props.onClose}>
      Close
    </button>
    {hasItems && <button onClick={showCheckoutHandler} className={classes.button}>Order</button>}
  </div>)

  const cartModalContent = (<Fragment>
    {cartItems}
    <div className={classes.total}>
      <span>Total Amount</span>
      <span>{totalAmount}</span>
    </div>
    {isCheckout && <CheckOut onConfirm={submitDataHandler} onCancel={props.onClose}/>}
    {!isCheckout && modalActions}

  </Fragment>)

  const isSubmittingModalContent = <p>Sending order data</p>
  const didSubmitModalContent = (<Fragment>
    <p>Successfully sent the order!</p>
    <button className={classes.button} onClick={props.onClose}>
      Close
    </button>

  </Fragment>)

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}

    </Modal>
  );
};

export default Cart;
