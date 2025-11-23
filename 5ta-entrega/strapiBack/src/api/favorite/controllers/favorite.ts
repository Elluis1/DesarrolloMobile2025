"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::favorite.favorite", ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body;

    // soporta body.data o body directo
    const payload = body.data || body;

    const { user, product } = payload;

    if (!user || !product) {
      return ctx.badRequest("user y product son requeridos");
    }

    // Buscar si ya existe
    const existing = await strapi.db.query("api::favorite.favorite").findOne({
      where: { user, product },
    });

    // Si ya existe → eliminar (TOGGLE)
    if (existing) {
      await strapi.db.query("api::favorite.favorite").delete({
        where: { id: existing.id },
      });

      return {
        data: {
          removed: true,
          id: existing.id,
          message: "Favorito eliminado",
        },
      };
    }

    // Si no existe → crear
    const favorite = await strapi.db.query("api::favorite.favorite").create({
      data: { user, product },
    });

    return {
      data: {
        created: true,
        favorite,
        message: "Favorito agregado",
      },
    };
  },
}));
