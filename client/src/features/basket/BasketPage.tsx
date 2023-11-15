import { Box, Button, Grid, IconButton, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "./BasketSlice";

export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState({
        loading: false,
        name: ''
    });

    function handleAddItem(productId: number, name: string){
        setStatus({loading: true, name});
        agent.Basket.addItem(productId)
            .then(basket => dispatch(setBasket(basket.value)))
            .catch(error => console.log(error))
            .finally(() => setStatus({loading: false, name: ''}));
    }

    function handleRemoveItem(productId: number, quantity:number, name: string){
        setStatus({loading: true, name});
        agent.Basket.removeItem(productId, quantity)
            .then(() => dispatch(removeItem({productId, quantity})))
            .catch(error => console.log(error))
            .finally(() => setStatus({loading: false, name: ''}));
    }


    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Proce</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map((row) => (
                            <TableRow
                                key={row.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={row.pictureUrl} alt={row.name} style={{height: 50, marginRight: 20}} />
                                    </Box>
                                </TableCell>
                                <TableCell align="right">${(row.price / 100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton loading={status.loading && status.name === 'rem'+ row.productId} onClick={() => handleRemoveItem(row.productId, 1, 'rem' + row.productId)}  color='error'>
                                        <Remove />
                                    </LoadingButton>
                                    {row.quantity}
                                    <LoadingButton loading={status.loading && status.name === 'add'+ row.productId} onClick={() => handleAddItem(row.productId, 'add' + row.productId) } color='secondary'>
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(row.price / 100 * row.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton loading={status.loading && status.name === 'del'+ row.productId}  color='error'  onClick={() => handleRemoveItem(row.productId, row.quantity, 'del' + row.productId)}>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary />
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