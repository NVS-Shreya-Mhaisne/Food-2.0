import dotenv from "dotenv";
dotenv.config();  

import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("Stripe Key Loaded:", !!process.env.STRIPE_SECRET_KEY);
const INR_TO_USD = 82;
const convertInrToUsd = (inrAmount) => {
  return Math.round((inrAmount / INR_TO_USD) * 100); 
};

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  try {
    const userId = req.userId;   // coming from middleware
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order." });
    }

    // Save order
    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare line items
    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: convertInrToUsd(Number(item.price)), // ensure number
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: convertInrToUsd(40),
      },
      quantity: 1,
    });

    // Create Stripe session
    const isMockStripe = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder");

    if (isMockStripe) {
      console.log("Stripe mock mode: redirecting directly to verify order");
      return res.json({
        success: true,
        session_url: `${frontend_url || "http://localhost:5173"}/verify?success=true&orderId=${newOrder._id}`
      });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${frontend_url || "http://localhost:5173"}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url || "http://localhost:5173"}/verify?success=false&orderId=${newOrder._id}`,
      });

      return res.json({ success: true, session_url: session.url });
    } catch (stripeErr) {
      console.warn("Stripe API failed, falling back to simulated checkout:", stripeErr.message);
      return res.json({
        success: true,
        session_url: `${frontend_url || "http://localhost:5173"}/verify?success=true&orderId=${newOrder._id}`
      });
    }
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const verifyOrder = async (req,res)=>{
  const{orderId,success}=req.body;
  try {
    if (success=="true") {
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true,message:"Paid"});
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"Not Paid"});
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

const listOrders = async (req,res)=>{
  try {
    const orders=await orderModel.find({});
    res.json({success:true,data:orders});
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};

const updateStatus = async (req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"Status Updated"});
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};

const removeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Customer order deleted successfully" });
  } catch (error) {
    console.error("Remove Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder };