import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { removeBasketItemAsync, addBasketItemAsync } from "./BasketSlice";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { BasketItem } from "../../app/models/basket";

interface Props{
    items: BasketItem[];
    isBasket?: boolean;
}

export default function BasketTable({items, isBasket = true}: Props){
    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Proce</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    {isBasket && 
                        <TableCell align="right"></TableCell>
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((row) => (
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
                            {isBasket && 
                            <LoadingButton loading={status == 'pendingRemoveItem' + row.productId + 'rem'} 
                                onClick={() => dispatch(removeBasketItemAsync({productId: row.productId, name: 'rem'}))}  color='error'>
                                <Remove />
                            </LoadingButton>
                            }
                            {row.quantity}
                            {isBasket &&     
                            <LoadingButton loading={status == 'pendingAddItem' + row.productId} onClick={() => dispatch(addBasketItemAsync({productId: row.productId}))} color='secondary'>
                                <Add />
                            </LoadingButton>
                            }
                        </TableCell>
                        <TableCell align="right">${(row.price / 100 * row.quantity).toFixed(2)}</TableCell>
                        <TableCell align="right">
                        {isBasket && 
                            <LoadingButton loading={status == 'pendingRemoveItem' + row.productId + 'del'}  color='error' 
                                 onClick={() => dispatch(removeBasketItemAsync({
                                    productId: row.productId, quantity: row.quantity, name: 'del'
                                    }))}>
                                <Delete />
                            </LoadingButton>
                        }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}