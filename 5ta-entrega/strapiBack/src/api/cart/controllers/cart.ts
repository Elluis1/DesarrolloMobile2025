import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::cart.cart", ({ strapi }) => ({
  async createCart(ctx) {
    const { userId } = ctx.request.body;
    if (!userId) ctx.throw(400, "userId is required");

    const cart = await strapi.entityService.create("api::cart.cart", {
      data: { user: userId },
    });

    return { data: cart };
  },

  async getCartByUser(ctx) {
    const { userId } = ctx.params;

    const carts = await strapi.entityService.findMany("api::cart.cart", {
      filters: { user: userId },
      populate: { cart_items: { populate: ["product"] } },
      limit: 1,
    });

    const cart = carts.length ? carts[0] : null;

    return { data: cart };
  },

  async addToCart(ctx) {
    const { userId } = ctx.params;
    const { productId, quantity } = ctx.request.body;

    if (!productId) ctx.throw(400, "productId is required");

    // Buscar carrito
    const carts = await strapi.entityService.findMany("api::cart.cart", {
      filters: { user: userId },
      limit: 1,
    });

    let cart;
    if (carts.length === 0) {
      cart = await strapi.entityService.create("api::cart.cart", {
        data: { user: userId },
      });
    } else {
      cart = carts[0];
    }

    // Crear CartItem con entityService
    const cartItem = await strapi.entityService.create("api::cart-item.cart-item", {
      data: {
        product: productId, // ID directo del producto
        quantity: quantity ?? 1,
        cart: cart.id,      // ID directo del carrito
      },
    });

    return { data: cartItem };
  },
}));
