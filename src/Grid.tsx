import React from 'react';
import 'typeface-roboto';
import MGrid from '@material-ui/core/Grid';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';
import { Theme, withStyles, StyleRules } from '@material-ui/core/styles';
import Color from 'color';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import './Grid.css';

const styles = (theme: Theme): StyleRules => ({
});

interface GridProps {
    classes: {
    },
    data: {d: number[], col: number}[][]
}

export function getNodeColor(d: number, col: number) {
    const color = [orange[300], blue[300]];
    let base = Color(color[col]).hsl().array();
    base[2] = 80;
    return Color.hsl(base).darken(Math.min(d / 15, 0.5)).hex();
}

class Grid extends React.Component<GridProps> {
    static getColor(s: {d: number[], col: number}) {
        return getNodeColor(s.d[s.col], s.col);
    }
    render() {
        const { classes, data } = this.props;
        const { gr, gc } = data.length <= 20 ?
            { gr: 'gridRow', gc: 'gridCell' } :
            { gr: 'smallGridRow', gc: 'smallGridCell' };
        return (
            <div className={`grid ${gr} ${gc}`}>
            {
                data.map((row, i) => (
                    <div key={i}>
                    {
                        row.map((cell, j) => (
                            <div key={j}
                                style={{backgroundColor: Grid.getColor(cell)}}>
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
