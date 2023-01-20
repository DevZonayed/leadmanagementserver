const BulkEntry = require("../model/BulkEntry");
const Lead = require("../model/Lead");
const Order = require("../model/Order");
const Session = require("../model/Session");
const getOrders = require("../utils/woocommerceApi/admittedStudents");
const AsyncHandler = require("express-async-handler");
const { formatNumToBd } = require("../helper/phoneNumberFormater");
const { getNoDuplicateOrders } = require("../helper/controllerUtils");
const ErrorLog = require("../model/ErrorLog");

async function mapOrder() {
  try {
    let after = Date.now() - 90000000;
    // let after = "2022-11-28";
    let before = Date.now();
    let orders = getNoDuplicateOrders(await getOrders({ after, before }));

    //   Order Validations
    if (orders.length === 0) {
      return;
    }

    //   Extract letest session id
    let sessionId = "63c64bf917c079b798fd166e";
    // let sessionId =
    //   orders[0].meta_data[
    //     orders[0].meta_data.findIndex((data) => data.key === "session_id")
    //   ].value;

    // Getting Sessions
    let session = await Session.findById(sessionId);
    // Create Bulk Entry Report
    const bulkEntry = new BulkEntry({
      title: `Orders for ${new Date(after).toLocaleString("en", {
        dateStyle: "medium",
      })} - ${new Date(before).toLocaleString("en", {
        dateStyle: "medium",
      })}`,
      session: {
        id: session._id,
        sessionNo: session.sessionNo,
      },
      subject: session.subject,
      type: "DYNAMIC",
    });

    let leadIDs = await Promise.all(
      orders.map(
        AsyncHandler(async (item) => {
          // admitted Content
          let modifyedOrder = await Order.findOneAndUpdate(
            {
              orderId: item.id,
            },
            {
              orderId: item.id,
              userInfo: {
                email: item.billing.email,
                phone: item.billing.phone,
                firstName: item.billing.first_name,
                lastName: item.billing.last_name,
                city: item.billing.city,
                postCode: item.billing.postcode,
                country: item.billing.country,
              },
              status: item.status,
              orderAt: item.date_created,
              orderEditAt: item.date_modified,
              orderAtGmt: item.date_created_gmt,
              orderEditAtGmt: item.date_modified_gmt,
              total: item.total,
              discountTotal: item.discount_total,
              paymentMethod: item.payment_method,
              leadIp: item.customer_ip_address,
              products: item.line_items.map((data) => {
                return {
                  title: data.name,
                  quantity: data.quantity,
                  subTotal: +data.subtotal,
                  total: +data.total,
                  price: data.price,
                };
              }),
              session: {
                id: session._id,
                sessionNo: session.sessionNo,
              },
              subject: session.subject,
              classTime: {
                days: item.meta_data[
                  item.meta_data.findIndex((data) => data.key === "billing_day")
                ]?.value,
                time: item.meta_data[
                  item.meta_data.findIndex(
                    (data) => data.key === "billing_time"
                  )
                ]?.value,
              },
            },
            { upsert: true, new: true }
          );

          //   Modify or create Lead
          let modifyedLead = await Lead.findOneAndUpdate(
            {
              $or: [
                { email: modifyedOrder.userInfo.email },
                { phone: formatNumToBd(modifyedOrder.userInfo.phone) },
              ],
            },
            {
              name: `${modifyedOrder.userInfo.firstName} ${modifyedOrder.userInfo.lastName}`,
              $addToSet: {
                email: modifyedOrder.userInfo.email,
                phone: formatNumToBd(modifyedOrder.userInfo.phone),
                orderList: modifyedOrder._id,
                admittedSession: session._id,
                entryType: {
                  type: "Bulk",
                  title: bulkEntry.title,
                  id: bulkEntry._id,
                },
              },
              $push: {
                leadStatus: {
                  leadFrom: "ORDER",
                  leadAt: modifyedOrder.orderAt,
                  leadBy: "Dynamic",
                  session: {
                    id: session._id,
                    sessionNo: session.sessionNo,
                  },
                  subject: session.subject,
                },
              },
            },
            { upsert: true, new: true }
          );

          // Update Bulk Edit
          if (
            modifyedLead.createdAt.toString() ==
            modifyedLead.updatedAt.toString()
          ) {
            //   Add to fresh lead in entry report
            bulkEntry.freshLead = [...bulkEntry.freshLead, modifyedLead._id];
          } else {
            //   Add to Previous lead in entry report
            bulkEntry.previousLead = [
              ...bulkEntry.previousLead,
              modifyedLead._id,
            ];
          }

          //   Modifyed Lead Status

          if (modifyedOrder.status === "processing") {
            // Lead Admition status
            modifyedLead.admitionStatus = {
              isAdmitted: true,
              admittedAt: modifyedOrder.orderEditAt,
            };

            // Add to admitted lead
            bulkEntry.admittedLead = [
              ...new Set([...bulkEntry.admittedLead, modifyedLead._id]),
            ];

            await modifyedLead.save();
          }
          modifyedOrder.leadId = modifyedLead._id;
          await modifyedOrder.save();
          return modifyedLead._id;
        })
      )
    );

    await bulkEntry.save();
    await Session.updateOne(
      { _id: session._id },
      {
        $addToSet: {
          leads: { $each: leadIDs },
        },
      }
    );
  } catch (err) {
    await ErrorLog.create({
      time: Date.now(),
      from: "Dynamic Order Import",
      error: err,
    });
  }
}

module.exports = mapOrder;
