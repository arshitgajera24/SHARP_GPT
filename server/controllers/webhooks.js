import Stripe from "stripe"
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";


export const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return response.status(400).send(`Webhook error : ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { transactionId, appId } = session.metadata || {};

                if (appId !== 'sharpgpt') {
                    return response.json({ received: true, message: 'Ignored Event: Invalid App' });
                }

                if (!transactionId) {
                     return response.status(400).send('Webhook Error: Missing transactionId');
                }

                try {
                    const transaction = await Transaction.findOne({
                        _id: transactionId,
                        isPaid: false,
                    });

                    if (!transaction) {
                        return response.json({ received: true, message: 'Transaction already processed or invalid' });
                    }

                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
                    
                    transaction.isPaid = true;
                    await transaction.save();

                } catch (dbError) {
                    return response.status(500).send('Internal Server Error during credit update');
                }
                break;
            }

            default:
                break;
        }

        response.json({ received: true });
    } catch (error) {
        console.error("Webhook Processing Error : ", error.message)
        return response.status(500).send("Interval Server Error : ");
    }
}
