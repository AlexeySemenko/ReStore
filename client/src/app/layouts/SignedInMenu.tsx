import { Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/basket/BasketSlice";
import { Link } from "react-router-dom";
import { Person } from "@mui/icons-material";

export default function SignedInMenu() {

    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.account!)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const theme = useTheme();
    const isMD = useMediaQuery(theme.breakpoints.down('md'));

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {!isMD ? (
            <Button onClick={handleClick} color='inherit' sx={{typography:'h6'}}>
                {user?.email}
            </Button>
            ): (
            <IconButton  onClick={handleClick} color='inherit'>
                <Person />
            </IconButton>
            )
            }
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} to='/orders'>My orders</MenuItem>
                <MenuItem onClick={() => {
                    dispatch(signOut());
                    dispatch(clearBasket());
                }}>Logout</MenuItem>
            </Menu>
        </>
    );
}