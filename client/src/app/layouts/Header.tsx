import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'}
]

interface Props {
    isDarkMode: boolean,
    darkModeChange: () => void
}

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active:not(.MuiTypography-root)': {
        color: 'text.secondary'
    },
    textDecoration: 'none',
    fontSize: {
        lg: 20,
        md: 20,
        sm: 15,
        xs: 10
      },
    p: {
        xs:0,
        md:1
    }
};

export default function Header({ isDarkMode, darkModeChange }: Props) {

    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemsCount = basket?.items.reduce((sum:any, item:any) => sum + item.quantity, 0);

    return (
        <AppBar position="static">
            <Toolbar sx={{display:'flex', justifyContent:'space-between', alignItems:{ md: 'center', xs: 'start'}, p: {md:0, xs:0}}}>
                <Box display='flex' alignItems='center'>
                    <Typography variant="h6" component={NavLink} to='/' sx={{...navStyles, p: 1, fontSize: { lg: 20, md: 20, sm: 15, xs: 15}}}>
                        RE-STORE
                    </Typography>
                    <Switch checked={isDarkMode} onChange={darkModeChange} />
                </Box>
                
                <List sx={{display: 'flex', flexDirection: { md:'row', xs:'column' }, ml: {xs:-2, md:-5}}}>
                    {midLinks.map(({title, path}) => (
                        <ListItem 
                            component={NavLink} 
                            to={path}
                            key={path + '' + title} 
                            sx={{...navStyles, p: {md:1, xs:0}}}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                    {user && user.roles?.includes('Admin') &&
                        <ListItem 
                            component={NavLink} 
                            to='/inventory'
                            key='inventory'
                            sx={{...navStyles, p: {md:1, xs:0}}}>
                            INVENTORY
                        </ListItem>
                    }
                </List>
                
                <Box display='flex' alignItems='center' sx={{pr:{md:3, xs:1}}}>
                    <IconButton component={Link} to='/basket' size="large" edge='start' color='inherit' sx={{mh: 1}}>
                        <Badge badgeContent={itemsCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                   
                    <SignedInMenu />
                </Box>
            </Toolbar>
        </AppBar>
    )
}