const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendOrderConfirmation, sendAdminNotification } = require('./email');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be greater than 0.'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: metadata || {},
      payment_method_types: ['card'], // Explicitly specify payment methods
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error.message
    });
  }
});

// Confirm payment intent
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({
        error: 'Payment intent ID and payment method ID are required'
      });
    }

    // Confirm the payment
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    res.json({
      status: paymentIntent.status,
      paymentIntent: paymentIntent,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      message: error.message
    });
  }
});

// Get payment intent status
router.get('/payment-intent/:id', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    res.status(500).json({
      error: 'Failed to retrieve payment intent',
      message: error.message
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        let paymentIntent = event.data.object;

        // For thin payloads, fetch the full payment intent
        if (!paymentIntent.metadata || !paymentIntent.amount) {
          console.log('Thin payload detected, fetching full payment intent...');
          paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
        }

        console.log('PaymentIntent was successful:', paymentIntent.id);

        // Send order confirmation email to customer
        const orderData = {
          customer_email: paymentIntent.metadata.customer_email,
          customer_name: paymentIntent.metadata.customer_name,
          company: paymentIntent.metadata.company,
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
          project_details: paymentIntent.metadata.project_details
        };

        // Send emails asynchronously (don't block webhook response)
        sendOrderConfirmation(orderData).catch(err =>
          console.error('Failed to send order confirmation:', err)
        );

        sendAdminNotification(orderData).catch(err =>
          console.error('Failed to send admin notification:', err)
        );

        break;
      case 'payment_intent.payment_failed':
        let failedPayment = event.data.object;

        // For thin payloads, fetch the full payment intent
        if (!failedPayment.metadata) {
          console.log('Thin payload detected for failed payment, fetching full payment intent...');
          failedPayment = await stripe.paymentIntents.retrieve(failedPayment.id);
        }

        console.log('PaymentIntent failed:', failedPayment.id);
        // TODO: Handle failed payment - could send failure notification
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    // Still return success to Stripe to avoid retries
  }

  res.json({ received: true });
});

module.exports = router;
