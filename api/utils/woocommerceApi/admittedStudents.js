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

    let data = [];

    for (let i = 1; i < 1000; i++) {
      if (i === 1) {
        data = [];
      }
      let response = await api.get("orders", { per_page: 100, page: i });
      data = [
        ...new Set([
          ...data,
          ...JSON.parse(CircularJSON.stringify(response))?.data,
        ]),
      ];
      if (JSON.parse(CircularJSON.stringify(response))?.data.length < 100) {
        break;
      }
    }

    return data;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getOrders;
