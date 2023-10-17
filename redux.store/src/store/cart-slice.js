import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    changed: false,
  },
  reducers: {
    replaceCart(state, action) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
    },
    addItemToCart(state, action) {
      state.totalQuantity += 1;
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.changed = true;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        })
      } else {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      state.totalQuantity -= 1;
      const existingItem = state.items.find((item) => item.id === id);
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity -= 1;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    }
  }
});

export const fetchCartData = () => {
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      message: 'Fetching cart data!',
      title: 'Fetching...',
    }));
    const fetchRequest = async () => {
      const response = await fetch('https://react-http-164-default-rtdb.firebaseio.com/cart.json');
  
      if (!response.ok) {
        throw new Error('Error in saving the cart data!');
      }
  
      return response.json();
    }
  
    try {
      const cartData = await fetchRequest();
      dispatch(cartSlice.actions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity,
      }));
      dispatch(uiActions.showNotification({
        status: 'success',
        message: 'Fetched cart data successfully!',
        title: 'Success!',
      }));
    } catch (error) {
      dispatch(uiActions.showNotification({
        status: 'error',
        message: 'Error in fetching cart data!',
        title: 'Error!',
      }));
    }
  }

}

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      message: 'Sending cart data!',
      title: 'Sending...',
    }));

    const sendRequest = async () => {
      const response = await fetch('https://react-http-164-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        body: JSON.stringify({
          items: cart.items,
          totalQuantity: cart.totalQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Error in saving the cart data!');
      }
    }

    try {
      await sendRequest();
      dispatch(uiActions.showNotification({
        status: 'success',
        message: 'Sent cart data successfully!',
        title: 'Success!',
      }));
    } catch (error) {
      dispatch(uiActions.showNotification({
        status: 'error',
        message: 'Error in sending cart data!',
        title: 'Error!',
      }));
    }
  }
}

export const cartActions = cartSlice.actions;

export default cartSlice;