import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

const url = 'https://react-http-7aca5-default-rtdb.firebaseio.com/cart.json';

export const fetchCartData = () => async (dispatch) => {
  const fetchData = async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could'nt fetch cart data!");
    }

    const data = await response.json();

    return data;
  };

  try {
    const cartData = await fetchData();
    dispatch(
      cartActions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity,
      })
    );
  } catch {
    dispatch(
      uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: 'Fetching card data failed.',
      })
    );
  }
};

export const sendCartData = (cart) => async (dispatch) => {
  dispatch(
    uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data.',
    })
  );

  const sendRequest = async () => {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({
        items: cart.items,
        totalQuantity: cart.totalQuantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Sending card data failed.');
    }
  };

  try {
    await sendRequest();
    dispatch(
      uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully.',
      })
    );
  } catch {
    dispatch(
      uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: 'Sending card data failed.',
      })
    );
  }
};
