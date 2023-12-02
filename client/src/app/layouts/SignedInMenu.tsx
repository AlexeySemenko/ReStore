import { IconButton, Menu, MenuItem } from "@mui/material";
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

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            
            <IconButton  onClick={handleClick} color='inherit' title={user?.email}>
                <Person />
            </IconButton>

            {user ? (
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
            ) : (
                
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem component={Link} to='/login'>Login</MenuItem>
                <MenuItem component={Link} to='/register'>Register</MenuItem>
            </Menu>
            )}
        </>
    );
}