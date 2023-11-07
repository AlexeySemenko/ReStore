import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
    isDarkMode: boolean,
    darkModeChange: () => void
}

export default function Header({ isDarkMode, darkModeChange }: Props) {

   
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6">
                    RE-STORE
                </Typography>
                <Switch
                    checked={isDarkMode}
                    onChange={darkModeChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Toolbar>
        </AppBar>
    )
}