import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import { useState } from "react";


import { styled, alpha } from "@mui/material/styles";

//drawer elements used
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { signOut } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/basket/BasketSlice";

const midLinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'errors', path: '/about'},
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


const StyledSearch = styled('div')(
    ({theme}) => ({
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    })  
  );
   
  const SearchIconWrapper = styled('div')(
    ({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
   
  const StyledInputBase = styled(InputBase)(
    ({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));
   
  //search as JSX
  const search = (
    <StyledSearch>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase 
        placeholder="Suchen…"
        inputProps={{ 'aria-label': 'search' }}
      />
    </StyledSearch>
  )

export default function Header({ isDarkMode, darkModeChange }: Props) {

    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemsCount = basket?.items.reduce((sum:any, item:any) => sum + item.quantity, 0);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate(); // useNavigate hook for navigation
    const dispatch = useAppDispatch();
    

    const goTo = (url: string) => {
        navigate(url);
        setOpen(false);
    };

    const toggleDrawer = (open : boolean) => (event: any) => {
        if (event.type === 'keydown' 
          && (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
        setOpen(open);
      };

    return (
        <AppBar position="static">

 <Toolbar sx={{display:'flex', justifyContent:'space-between', alignItems:{ md: 'center', xs: 'start'}, px: {md:2, xs:2}, pr: 0, py: 1,pb: 0}}>
 {/* hamburger icon shows the drawer on click */}
 <IconButton 
   edge="start"
   color="inherit"
   aria-label="open drawer"
   onClick={toggleDrawer(true)}
   sx={{ mr: 2, display: { xs: 'block'} }}>   
   <MenuIcon />
 </IconButton>

 {/* The outside of the drawer */}
 <Drawer
   // from which side the drawer slides in
   anchor="left" 

   //if and how easily the drawer can be closed
   variant="temporary"

   //if open is true, drawer is shown
   open={open} 
   
   //function that is called when the drawer should close
   onClose={toggleDrawer} 
   
 >
     
      {/* The inside of the drawer */}
      <Box sx={{
                  p: 2,
                  height: 1,
                }}>
 
                  {/* 
                  when clicking the icon it calls the function toggleDrawer 
                  and closes the drawer by setting the variable open to false
                  */}
                  <Box  sx={{display:'flex', justifyContent:'space-between' , alignItems:{ md: 'center', xs: 'start'}}}>
                    <IconButton sx={{mb: 2}}>
                        <CloseIcon onClick={toggleDrawer(false)} />
                    </IconButton>
                    {user && (
                        <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hi, {user.name}!</Box>
                     )}
                     {!user && <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'primary' }}>RE-Store</Box>}
                     <Switch checked={isDarkMode} onChange={darkModeChange} title="DarkMode" />
                  </Box>
                  <Box sx={{mb: 2}}>
                    <ListItemButton onClick={() => goTo('/catalog')}>
                      <ListItemIcon>
                        <ImageIcon sx={{color: "primary.main"}}/>
                      </ListItemIcon>
                      <ListItemText primary="Products" />
                    </ListItemButton>
 
                    <ListItemButton onClick={() => goTo('/about')}>
                      <ListItemIcon>
                        <DescriptionIcon sx={{color: "primary.main"}}/>
                      </ListItemIcon >
                      <ListItemText primary="Errors" />
                    </ListItemButton>
 
                    <ListItemButton onClick={() => goTo('/contact')}>
                      <ListItemIcon>
                        <FolderIcon sx={{color: "primary.main"}} />
                      </ListItemIcon>
                      <ListItemText primary="Other" />
                    </ListItemButton>
                   
                    {user && user.roles?.includes('Admin') &&
                    <>
                        <Divider />
                        
                        <ListItemButton onClick={() => goTo('/inventory')}>
                        <ListItemIcon>
                          <FolderIcon sx={{color: "primary.main"}} />
                        </ListItemIcon>
                        <ListItemText primary="Inventory" />
                      </ListItemButton>
                      </>
                    }
                  </Box>
                  
                  {search}
 
                  <Box sx={{
                    display: "flex", 
                    justifyContent:"center", 
                    position: "absolute", 
                    bottom: "0", 
                    left: "50%", 
                    transform: "translate(-50%, 0)"}}
                  >
                    {user ? (
                      <Button variant="outlined" sx={{ 
                        m: 1, 
                        px: 2,
                        minWidth: "120px",
                        maxWidth: "250px",
                        display: "flex",
                        justifyContent: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }} 
                      onClick={() => {
                          dispatch(signOut());
                          dispatch(clearBasket());
                      }}>
                        LogOut {user.name}
                      </Button> 
                              
                                ) : (
                      <>
                      <Button variant="contained" sx={{m:1, width: .5}}>
                        Register
                      </Button>
                      <Button variant="outlined" sx={{m:1, width: .5}} component={Link} to='/login' onClick={toggleDrawer(false)}>
                        Login
                      </Button> 
                          
                    </>
                    )}
                </Box>
                </Box>
 </Drawer>

 <Box display='flex' alignItems='center'>
                    <Typography variant="h6" component={NavLink} to='/' sx={{...navStyles, p: 1, fontSize: { lg: 20, md: 20, sm: 15, xs: 15}}}>
                        RE-STORE2
                    </Typography>
                </Box>
                <Box>
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