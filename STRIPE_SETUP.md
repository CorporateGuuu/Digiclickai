# Stripe Payment Integration Setup

## 🚀 Quick Setup

### 1. Get Stripe API Keys
1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers → API Keys
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables
Update your `.env` file with your Stripe keys:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Update Frontend
In `checkout.html`, replace the placeholder key:

```javascript
const stripe = Stripe('pk_test_your_actual_publishable_key_here');
```

### 4. Configure Email (Optional)
For email notifications, update:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@yourcompany.com
```

## 🧪 Testing with Stripe Test Cards

Use these test card numbers to simulate payments:

### ✅ Successful Payments
- **4242 4242 4242 4242** - Visa (succeeds)
- **4000 0025 0000 3155** - Visa (3D Secure required)
- **5555 5555 5555 4444** - Mastercard (succeeds)

### ❌ Failed Payments
- **4000 0000 0000 0002** - Card declined
- **4000 0000 0000 0069** - Expired card
- **4000 0000 0000 0127** - Incorrect CVC

### Test Details
- **Expiry:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)
- **Name:** Any name

## 🔧 Webhook Setup (Production)

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret to your `.env` file

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on Gmail
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password) in `.env`

### Alternative Email Services
- **SendGrid**: More reliable for production
- **Mailgun**: Good alternative
- **AWS SES**: For enterprise setups

## 🔒 Security Features

- ✅ PCI-compliant (Stripe handles card data)
- ✅ SSL encryption required
- ✅ Webhook signature verification
- ✅ Input validation and sanitization
- ✅ Secure API key management

## 🚦 Testing the Integration

1. Start the server: `npm start`
2. Visit: `http://localhost:3000/pricing.html`
3. Click "Get Started" on Enterprise Plan
4. Fill out the checkout form
5. Use test card: `4242 4242 4242 4242`
6. Complete payment

## 📋 Production Deployment

### Environment Variables for Production
```env
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Additional Production Steps
1. Set up proper domain with SSL
2. Configure production webhook endpoints
3. Set up monitoring and error logging
4. Implement proper email service (not Gmail)
5. Add payment analytics and reporting

## 🐛 Troubleshooting

### Common Issues

**Payment fails with "Invalid API Key"**
- Check that your Stripe keys are correct and not mixed up
- Ensure you're using test keys for testing, live keys for production

**Webhook signature verification fails**
- Make sure the webhook secret matches exactly
- Check that the webhook endpoint is accessible

**Emails not sending**
- Verify Gmail credentials and app password
- Check spam folder
- Consider using a dedicated email service

**CORS errors**
- Ensure your frontend is served from the same domain or CORS is properly configured

## 📞 Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

For integration issues:
- Check server logs for error messages
- Verify all environment variables are set
- Test with Stripe's dashboard → Payments
