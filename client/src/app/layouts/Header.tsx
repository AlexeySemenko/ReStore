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
    '&.active': {
        color: 'text.secondary'
    },
    textDecoration: 'none',
    fontSize: {
        lg: 20,
        md: 20,
        sm: 15,
        xs: 15
      },
    p: {
        xs:0,
        md:1
    }
};

export default function Header({ isDarkMode, darkModeChange }: Props) {

    const {basket} = useAppSelector(state => state.basket);

    const itemsCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <AppBar position="static">
            <Toolbar sx={{display:'flex', justifyContent:'space-between', alignItems:{ md: 'center', xs: 'start'}, p: {md:2, xs:1}}}>
                <Box display='flex' alignItems='center'>
                    <Typography variant="h6" component={NavLink} to='/' sx={navStyles}>
                        RE-STORE
                    </Typography>
                    <Switch checked={isDarkMode} onChange={darkModeChange} />
                </Box>
                
                <List sx={{display: 'flex', flexDirection: { md:'row', xs:'column' }}}>
                    {midLinks.map(({title, path}) => (
                        <ListItem 
                            component={NavLink} 
                            to={path}
                            key={path + '' + title} 
                            sx={navStyles}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                
                <Box display='flex' alignItems='center'>
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