import React from 'react';
import MGrid from '@material-ui/core/Grid';
import { Theme, withStyles, StyleRules } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import Grid from './Grid';

const styles = (theme: Theme): StyleRules => ({
    inputLabel: {
        fontSize: 16,
        paddingRight: 0,
        textAlign: 'right'
    },
    inputValue: {
        textAlign: 'left'
    },
    buttonSpacer: {
        marginBottom: theme.spacing.unit * 4,
    },
    bottomButtons: {
        marginTop: 10,
        textAlign: 'center',
    },
    slider: {
        padding: '22px 0px',
    }
});

interface SnowProps {
    classes: {
        inputLabel: string,
        inputValue: string,
        buttonSpacer: string,
        bottomButtons: string,
        slider: string
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomSubarray(arr: number[], size: number) {
    let shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
    return shuffled.slice(min);
}

class Snow extends React.Component<SnowProps> {

    static genMatrix(n = 20) {
        let d = [];
        for (let i = 0; i < n; i++)
        {
            let r = [];
            for (let j = 0; j < n; j++)
                r.push({d: [0, 0], col: getRandomInt(2)});
            d.push(r);
        }
        return d;
    }

    state = {
        colorMatrix: Snow.genMatrix(),
        k: 10,
        alpha: 8,
        nodesPerTick: 10,
        maxInactiveTicks: 200,
        ticking: false,
        simulationSpeed: 100
    };

    config = {
        k: 10,
        alpha: 8,
        nodesPerTick: 10,
        maxInactiveTicks: 200,
        inactiveTicks: 0
    };

    getNodeState(n: number, u: number) {
        let r = Math.floor(u / n);
        let c = u % n;
        return this.state.colorMatrix[r][c];
    }

    setNodeState(n: number, u: number, s: {d: number[], col: number}) {
        let r = Math.floor(u / n);
        let c = u % n;
        let m = [...this.state.colorMatrix];
        m[r][c] = s;
        this.setState({colorMatrix: m});
    }

    tick(n: number, m: number) {
        let N = n * n;
        let active = false;
        for (let i = 0; i < m; i++)
        {
            let u = getRandomInt(N);
            let peers = [];
            for (let j = 0; j < N; j++)
                if (j != u) peers.push(j);
            let sample = getRandomSubarray(peers, this.config.k);
            let cnt = [0, 0];
            sample.forEach((v) => {
                let ss = this.getNodeState(n, v);
                cnt[ss.col]++;
            });
            let s = this.getNodeState(n, u);
            for (let c = 0; c < 2; c++)
            {
                if (cnt[c] > this.config.alpha)
                {
                    s.d[c]++;
                    if (s.d[c] > s.d[s.col])
                    {
                        if (s.col != c) active = true;
                        s.col = c;
                        this.setNodeState(n, u, s);
                    }
                }
            }
        }
        return active;
    }

    pauseTick() {
        this.setState({ticking: false});
    }

    startTick() {
        this.config.alpha = this.state.alpha;
        this.config.k = this.state.k;
        this.config.nodesPerTick = this.state.nodesPerTick;
        this.config.inactiveTicks = 0;
        this.config.maxInactiveTicks = this.state.maxInactiveTicks;
        this.autoTick();
    }

    autoTick() {
        this.setState({ticking: true});
        setTimeout(() => {
            let active = this.tick(20, this.config.nodesPerTick);
            console.log(active);
            if (!active)
            {
                if (++this.config.inactiveTicks > this.config.maxInactiveTicks)
                {
                    this.pauseTick();
                    return;
                }
            }
            else
                this.config.inactiveTicks = 0;
            if (this.state.ticking) this.autoTick();
        }, 1000 / this.state.simulationSpeed);
    }

    reset() {
        this.setState({
            colorMatrix: Snow.genMatrix(),
            ticking: false
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <MGrid container spacing={16} style={{minWidth: 600}}>
                <MGrid item lg={6} xs={12}>
                    <Grid data={this.state.colorMatrix} />
                </MGrid>
                <MGrid item lg={4} xs={12}>
                    <Table>
                    <TableBody>
                    <TableRow>
                        <TableCell className={classes.inputLabel}>
                        k =
                        </TableCell>
                        <TableCell>
                        <TextField
                            inputProps={{ className: classes.inputValue } as React.CSSProperties}
                            value={this.state.k}
                            disabled={this.state.ticking}
                            onChange={event => this.setState({k: event.target.value})}/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.inputLabel}>
                        alpha =
                        </TableCell>
                        <TableCell>
                        <TextField
                            inputProps={{ className: classes.inputValue } as React.CSSProperties}
                            value={this.state.alpha}
                            disabled={this.state.ticking}
                            onChange={event => this.setState({alpha: event.target.value})}/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.inputLabel}>
                        nodesPerTick =
                        </TableCell>
                        <TableCell>
                        <TextField
                            inputProps={{ className: classes.inputValue } as React.CSSProperties}
                            value={this.state.nodesPerTick}
                            disabled={this.state.ticking}
                            onChange={event => this.setState({nodesPerTick: event.target.value})}/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.inputLabel}>
                        maxInactiveTicks =
                        </TableCell>
                        <TableCell>
                        <TextField
                            inputProps={{ className: classes.inputValue } as React.CSSProperties}
                            value={this.state.maxInactiveTicks}
                            disabled={this.state.ticking}
                            onChange={event => this.setState({maxInactiveTicks: event.target.value})}/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell className={classes.inputLabel}>
                        simulationSpeed
                    </TableCell>
                    <TableCell>
                    <Slider
                        classes={{ container: classes.slider }}
                        value={this.state.simulationSpeed}
                        min={1}
                        max={1000}
                        onChange={(_, value) => this.setState({simulationSpeed: value})} />
                    </TableCell>
                    </TableRow>
                    </TableBody>
                    </Table>
                    <div className={classes.buttonSpacer} />
                    <div className={classes.bottomButtons}>
                    <MGrid container item spacing={16}>
                        <MGrid item lg={4} xs={12}>
                            <Button
                                variant="contained" color="primary"
                                onClick={event => this.startTick()}
                                disabled={this.state.ticking}>Start</Button>
                        </MGrid>
                        <MGrid item lg={4} xs={12}>
                            <Button
                                variant="contained" color="primary"
                                onClick={event => this.pauseTick()}
                                disabled={!this.state.ticking}>Pause</Button>
                        </MGrid>
                        <MGrid item lg={4} xs={12}>
                            <Button
                                variant="contained" color="primary"
                                onClick={event => this.reset()}>Reset</Button>
                        </MGrid>
                    </MGrid>
                    </div>
                </MGrid>
            </MGrid>
        );
    }
}

export default withStyles(styles)(Snow);
