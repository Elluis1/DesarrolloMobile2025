module.exports = {
  beforeCreate: async (event) => {
    strapi.log.info("🔥 Lifecycle ejecutándose");
    strapi.log.info("🟦 EVENT STATE:", JSON.stringify(event.state, null, 2));
    strapi.log.info("🟨 EVENT PARAMS:", JSON.stringify(event.params, null, 2));
  },
};
