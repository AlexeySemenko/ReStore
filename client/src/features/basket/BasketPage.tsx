import { Box, Button, Grid, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket);

    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return (
        <>
           <BasketTable items={basket.items} />
            <Grid container>
                <Grid item md={6} xs={12} />
                <Grid item md={6} xs={12} >
                    <Box sx={{my:{md:0, xs:1}}}>
                        <BasketSummary />
                    </Box>
                    <Button
                        component={Link}
                        to='/checkout'
                        variant='contained'
                        size='large'
                        fullWidth
                        >
                        Checkout
                        
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}