'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// NOTE: This ensures that things like <Menu> and <Tooltip> components show up while in fullscreen.
// For more, see: https://github.com/mui/material-ui/issues/15618#issuecomment-1062138287
const container = () => document.getElementById('fullscreen');

const theme = createTheme({
  components: {
    MuiMenu: {
      defaultProps: {
        container,
      },
    },
    MuiTooltip: {
      defaultProps: {
        PopperProps: {
          container,
        },
      },
    },
  },
  palette: {
    primary: { main: '#ffffff' },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
