import { createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import deepOrange from '@material-ui/core/colors/deepOrange';

export const defaultChartColor = deepOrange[300];
export const theme = createMuiTheme({
    palette: {
        primary: {
            light: orange[300],
            main: orange[500],
            dark: orange[700],
            contrastText: "#fff"
        }
    },
    typography: {
        // useNextVariants: true,
    }
});
