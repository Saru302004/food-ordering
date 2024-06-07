import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from "stripe";
import { CLIENT_DOMAIN } from "../config/client.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr", // Prices are in INR
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects the amount in the smallest currency unit (paise for INR)
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "inr", // Delivery charges in INR
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200, // Example delivery charge in INR (200 paise = 2 INR)
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${CLIENT_DOMAIN}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${CLIENT_DOMAIN}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log(session.success_url);
    return res.json({
      success: true,
      session_url: session.url,
      message: "Your order has been placed.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error placing order. Please try again later.",
    });
  }
};

// Other functions remain unchanged
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Order Placed." });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Payment failed. Try again later." });
  }
};

// Order list after confirmation
const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Order Fetching failed." });
  }
};

// Admin panel order list
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Order Fetching failed." });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Order status updated." });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to update order. Try again later.",
    });
  }
};

export { placeOrder, verifyOrder, userOrder, listOrders, updateStatus };
