export default {
    routes: [
      {
        method: "POST",
        path: "/cart/create",
        handler: "cart.createCart",
        policies: [],
      },
      {
        method: "GET",
        path: "/cart/user/:userId",
        handler: "cart.getCartByUser",
        policies: [],
      },
      {
        method: "POST",
        path: "/cart/user/:userId/add",
        handler: "cart.addToCart",
        policies: [],
      },
    ],
  };
  