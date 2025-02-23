import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QmIz1Cib4H41zlZG8PZKkHzjzNHMo7XmHrCZBn4kisOcQPdDDbwDVYr0MkW3dyaQKuwaZN1doenucQeqaMOexkp003slmBB7j");


const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment("sk_test_51QmIz1Cib4H41zlZv3vU8g791Hv09cR9CzktkZAMj73atALDP37msZ2NeCTkB5Mqt4fAcvvWWDW2840lm79gO9fh0093cm5TAP", {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            console.error("Payment failed:", error);
        } else {
            console.log("Payment successful:", paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay</button>
        </form>
    );
};


export default CheckoutForm