const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

router.post("/create-order", async (req, res) => {
    try {
        console.log("Received request:", req.body); // ✅ Debugging ke liye
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: req.body.amount * 100, // Convert to paisa
            currency: req.body.currency,
            receipt: "order_rcptid_11"
        };

        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error); // ✅ Debugging ke liye
        res.status(500).json({ success: false, message: "Order creation failed", error });
    }
});

module.exports = router;

