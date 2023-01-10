const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const CircularJSON = require("circular-json");

async function getOrders() {
  try {
    const api = new WooCommerceRestApi({
      url: "https://sorobindu.com/",
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      version: "wc/v3",
    });

    const data = await api.get("orders", { per_page: 100, page: 1 });

    const obj = CircularJSON.stringify(data);
    return obj;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getOrders;
