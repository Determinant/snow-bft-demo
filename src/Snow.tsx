import React from 'react';
import MGrid from '@material-ui/core/Grid';
import { Theme, withStyles } from '@material-ui/core/styles';

interface SnowProps {
    classes: {}
}

const styles = (theme: Theme) => ({
    buttonSpacer: {
        marginBottom: theme.spacing.unit * 4,
    },
});

class Snow extends React.Component<SnowProps> {
    render() {
        const { classes } = this.props;

        return (
            <MGrid container spacing={16} style={{minWidth: 700}}>
            </MGrid>
        );
    }
}

export default withStyles(styles)(Snow);
