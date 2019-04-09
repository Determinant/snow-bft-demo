import React from 'react';
import 'typeface-roboto';
import MGrid from '@material-ui/core/Grid';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';
import { Theme, withStyles, StyleRules } from '@material-ui/core/styles';
import Color from 'color';

const styles = (theme: Theme): StyleRules => ({
    gridRow: {
        height: 24,
        textAlign: 'center'
    },
    gridCell: {
        height: 20,
        width: 20,
        margin: 2,
        display: 'inline-block'
    }
});

interface GridProps {
    classes: {
        gridRow: string,
        gridCell: string
    },
    data: {d: number[], col: number}[][]
}

class Grid extends React.Component<GridProps> {
    static getColor(s: {d: number[], col: number}) {
        const color = [orange[300], blue[300]];
        let {d, col} = s;
        return Color(color[col]).darken(Math.min(d[col] / 10, 0.6)).hex();
    }
    render() {
        const { classes, data } = this.props;
        return (
            <div style={{margin: '0 auto'}}>
            {
                data.map((row, i) => (
                    <div key={i} className={classes.gridRow}>
                    {
                        row.map((cell, j) => (
                            <div key={j} className={classes.gridCell} style={{backgroundColor: Grid.getColor(cell)}}>
                            </div>
                        ))
                    }
                    </div>
                ))
            }
            </div>
        );
    }
}

export default withStyles(styles)(Grid);
