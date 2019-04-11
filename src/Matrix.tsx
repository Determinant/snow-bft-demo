import React from 'react';
import 'typeface-roboto';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';
import Color from 'color';
import './Matrix.css';

interface MatrixProps {
    onClickNode: (i: number, j: number) => void
    onHoverNode: (i: number, j: number) => void
    data: { d: number[], col: number }[][]
}

export function getNodeColor(d: number, col: number) {
    const color = [orange[300], blue[300]];
    let base = Color(color[col]).hsl().array();
    base[2] = 80;
    return Color.hsl(base).darken(Math.min(d / 15, 0.5)).hex();
}

class Matrix extends React.Component<MatrixProps> {
    static getColor(s: { d: number[], col: number }) {
        return getNodeColor(s.d[s.col], s.col);
    }
    mouseDown = false;
    mousePos = { x: -1, y: -1 };
    render() {
        const { data, onClickNode, onHoverNode } = this.props;
        const { mr, mc, l } = data.length <= 20 ?
            { mr: 'matrixRow', mc: 'matrixCell', l: 24 } :
            { mr: 'smallMatrixRow', mc: 'smallMatrixCell', l: 15 };
        return (
            <div className={`matrix ${mr} ${mc}`}
                onMouseDown={event => {
                    event.preventDefault();
                    this.mouseDown = true;
                    onClickNode(this.mousePos.y, this.mousePos.x);
                }}
                onMouseUp={event => {
                    event.preventDefault();
                    this.mouseDown = false;
                }}
                onMouseOver={event => {
                    const bounds = (event.currentTarget as Element).getBoundingClientRect();
                    const x = Math.floor((event.clientX - bounds.left) / l);
                    const y = Math.floor((event.clientY - bounds.top) / l);
                    console.log(y, x, this.mouseDown);
                    const t = this.mousePos;
                    this.mousePos = {x, y};
                    if (!this.mouseDown) return;
                    if (t.x !== x || t.y !== y)
                    {
                        onHoverNode(y, x);
                    }
                }}>
                {data.map((row, i) => (
                    <div key={i}>
                    {row.map((cell, j) => (
                            <div key={j}
                                style={{backgroundColor: Matrix.getColor(cell)}}>
                            </div>
                        ))}
                    </div>
                ))}
            </div>);
    }
}

export default Matrix;
