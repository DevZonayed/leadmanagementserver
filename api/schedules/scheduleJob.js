var CronJob = require("cron").CronJob;
const mapOrder = require("../controller/OrderController");

function scheduleJobs() {
  // Mapping Dailty Order ar 3 AM
  // cron.schedule("0 4 * * *", () => {
  //   mapOrder();
  // });
  var job = new CronJob(
    "50 2 * * *",
    function () {
      console.log("You will see this message every second");
    },
    null,
    true,
    "Asia/Dhaka"
  );
}

module.exports = scheduleJobs;
