import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/BasketSlice";
import LoadingComponent from "../../app/layouts/LoadingComponent";

const stripePromise = loadStripe('pk_test_51OI7zNHkJFoNnDDkQ2742nPR9KGiVIut7Sbw4WhnwyoSuVMWDXX3QbAZIhB0IFF6tNJz3sWeeLkV6LtT8Pjl7Pco00LoQxmQSh');

export default function CheckoutWrapper(){

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentsIntent().then((basket) => dispatch(setBasket(basket))).catch(err => console.log(err)).finally(() => setLoading(false));
    }, [dispatch]);
    
    if(loading)
        return <LoadingComponent message="Loading checkout..." />
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}