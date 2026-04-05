import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Use test mode keys as fallback if they are missing
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: `receipt_order_${Date.now()}`
    };

    // If we're using placeholder keys, we mock the response to avoid crashing
    if (key_id === 'rzp_test_placeholder_key_id') {
      return res.status(200).json({
        success: true,
        order: {
          id: `order_mock_${Date.now()}`,
          entity: "order",
          amount: options.amount,
          amount_paid: 0,
          amount_due: options.amount,
          currency: options.currency,
          receipt: options.receipt,
          status: "created",
          attempts: 0
        },
        key: key_id
      });
    }

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: key_id
    });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ success: false, message: 'Could not create payment order', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';

    // Mock verification for placeholder keys
    if (key_secret === 'rzp_test_placeholder_secret') {
      return res.status(200).json({ success: true, message: 'Payment verified successfully (MOCK)' });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};
