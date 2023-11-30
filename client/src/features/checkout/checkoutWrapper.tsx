import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51OI7zNHkJFoNnDDkQ2742nPR9KGiVIut7Sbw4WhnwyoSuVMWDXX3QbAZIhB0IFF6tNJz3sWeeLkV6LtT8Pjl7Pco00LoQxmQSh');

export default function CheckoutWrapper(){
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}