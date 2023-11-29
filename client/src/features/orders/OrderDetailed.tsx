import { Box, Button, Grid, Typography } from "@mui/material";
import { Order } from "../../app/models/order";
import BasketTable from "../basket/BasketTable";
import { BasketItem } from "../../app/models/basket";
import BasketSummary from "../basket/BasketSummary";

interface Props{
    order: Order;
    setSelectedOrder: (id: number) => void;
}

export default function OrderDetailed({order, setSelectedOrder}: Props){
    const subtotal = order.orderItems.reduce((sum, itm) => sum + (itm.price * itm.quantity), 0) ?? 0;

    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{py: 1}} gutterBottom variant="h4">Order num: {order.id} - {order.orderStatus}</Typography>
                <Button onClick={() => setSelectedOrder(0)} sx={{mb : 2}} size='small' variant="contained">Back to Orders</Button>
            </Box>
            <BasketTable items={order.orderItems as BasketItem[]} isBasket={false} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary subtotal={subtotal} />
                </Grid>
            </Grid>
        </>
    )
}