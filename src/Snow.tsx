import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Theme, withStyles, StyleRules } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Line } from 'react-chartjs-2';
import Color from 'color';

import Matrix, { getNodeColor } from './Matrix';

const styles = (theme: Theme): StyleRules => ({
    inputLabel: {
        fontSize: 16,
        paddingRight: 0,
        textAlign: 'right',
        width: '30%'
    },
    inputValue: {
        textAlign: 'left'
    },
    buttonSpacer: {
        marginBottom: theme.spacing(4),
    },
    bottomButtons: {
        marginTop: 10,
        textAlign: 'center',
    },
    slider: {
        paddingTop: '20px'
    },
    errorHint: {
        fontSize: 16,
        paddingLeft: 16,
        lineHeight: '32px',
        color: theme.palette.secondary.main
    },
    grid: {
        textAlign: 'center'
    }
});

interface SnowProps {
    classes: {
        inputLabel: string,
        inputValue: string,
        buttonSpacer: string,
        bottomButtons: string,
        slider: string,
        errorHint: string,
        grid: string
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

/* Code from: https://stackoverflow.com/a/11935263/544806 */
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

const watchedD = [15, 10, 5, 1];

class Snow extends React.Component<SnowProps> {

    static genMatrix(n: number) {
        let d = [];
        for (let i = 0; i < n; i++)
        {
            let r = [];
            for (let j = 0; j < n; j++)
                r.push({ d: [0, 0], col: getRandomInt(2) });
            d.push(r);
        }
        return d;
    }

    state = {
        colorMatrix: Snow.genMatrix(20),
        n: '20',
        k: '10',
        alpha: '8',
        nodesPerTick: '20',
        maxInactiveTicks: '200',
        loaded: true,
        ticking: false,
        simulationSpeed: 100,
        dialogOpen: false,
        dialogMsg: { title: '', message: '' },
        nError: false,
        kError: false,
        alphaError: false,
        nodesPerTickError: false,
        maxInactiveTicksError: false,
        dcnts: [watchedD.map(() => [] as number[]),
                watchedD.map(() => [] as number[])] as number[][][],
        ticks: [] as number[],
        N: 400
    };

    config = {
        iter: 0,
        n: 20,
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

    setNodeState(n: number, u: number, s: { d: number[], col: number }) {
        let r = Math.floor(u / n);
        let c = u % n;
        let m = [...this.state.colorMatrix];
        m[r][c] = s;
        this.setState({ colorMatrix: m });
    }

    tick(n: number, m: number) {
        let N = n * n;
        let active = false;

        let nodes = [];
        for (let j = 0; j < N; j++) nodes.push(j);
        getRandomSubarray(nodes, m).forEach(v => {
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
                if (cnt[c] >= this.config.alpha)
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
        });

        if (this.config.iter % 10 == 0)
        {
            let dcnts = [];
            for (let c = 0; c < 2; c++)
            {
                dcnts.push(watchedD.map((d, i) => {
                    let dcnt = 0;
                    for (let i = 0; i < n; i++)
                        for (let j = 0; j < n; j++)
                        {
                            const s = this.state.colorMatrix[i][j];
                            if (s.d[c] >= d)
                                dcnt++;
                        }
                    if (c == 0) dcnt = -dcnt;
                    return [...this.state.dcnts[c][i], dcnt].splice(-50);
                }));
            }
            this.setState({
                dcnts: dcnts,
                ticks: [...this.state.ticks, this.config.iter].splice(-50)
            });
        }
        return active;
    }

    pauseTick() {
        this.setState({ ticking: false });
    }

    startTick() {
        const n = Number(this.state.n);
        const N = n * n;
        const k = Number(this.state.k);
        const alpha = Number(this.state.alpha);
        const nodesPerTick = Number(this.state.nodesPerTick);
        const maxInactiveTicks = Number(this.state.maxInactiveTicks);

        if (!Number.isInteger(n) || n < 2 || n > 40)
        {
            this.setState({ nError: true });
            return;
        }
        if (!Number.isInteger(k) || k < 1 || k >= N)
        {
            this.setState({ kError: true });
            return;
        }
        if (!Number.isInteger(alpha) || !(k / 2 < alpha && alpha <= k))
        {
            this.setState({ alphaError: true });
            return;
        }
        if (!Number.isInteger(nodesPerTick) || nodesPerTick < 1 || nodesPerTick > N)
        {
            this.setState({ nodesPerTickError: true });
            return;
        }
        if (!Number.isInteger(maxInactiveTicks) || maxInactiveTicks < 1 || maxInactiveTicks > 1e6)
        {
            this.setState({ maxInactiveTicksError: true });
            return;
        }

        if (!this.state.loaded)
        {
            this.config.iter = 0;
            this.config.n = n;
            this.setState({
                loaded: true,
                colorMatrix: Snow.genMatrix(this.config.n),
                dcnts: [watchedD.map(() => [] as number[]),
                        watchedD.map(() => [] as number[])],
                ticks: [],
                N: n * n
            });
        }
        this.config.alpha = alpha;
        this.config.k = k;
        this.config.nodesPerTick = nodesPerTick;
        this.config.inactiveTicks = 0;
        this.config.maxInactiveTicks = maxInactiveTicks;
        this.autoTick();
    }

    autoTick() {
        this.setState({ ticking: true });
        setTimeout(() => {
            let active = this.tick(this.config.n, this.config.nodesPerTick);
            this.config.iter++;
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
            ticking: false,
            loaded: false
        });
    }

    flipNode(i: number, j: number) {
        let s = this.state.colorMatrix[i][j];
        const n = this.config.n;
        s.col = 1 - s.col;
        this.setNodeState(n, i * n + j, s);
    }

    render() {
        const { classes } = this.props;

        return (
          <Grid container spacing={8} style={{minWidth: 600}}>
            <Grid item lg={6} xs={12} className={classes.grid}>
              <Matrix
                data={this.state.colorMatrix}
                onClickNode={(i: number, j: number) => this.flipNode(i, j)}
                onHoverNode={(i: number, j: number) => this.flipNode(i, j)} />
              <div style={{position: 'relative', height: '40vh'}}>
                <Line data={() => {
                  let datasets = this.state.dcnts.map((dd, c) => dd.map((line, i) => {
                      const base = getNodeColor(watchedD[i], c);
                      return {
                        data: line,
                        label: `${c == 0 ? 'A' : 'B'}(d-${watchedD[i]})`,
                        borderColor: base,
                        backgroundColor: Color(base).fade(0.5).rgb().string(),
                        borderWidth: 2
                      };
                    })).flat();
                  return {
                    datasets,
                    labels: this.state.ticks
                  }
                }}
                options={{
                  scales: { yAxes: [{ ticks: { min: -this.state.N, max: this.state.N }}]},
                  maintainAspectRatio: false
                }} />
              </div>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Typography variant="body1" paragraph>
                This demo shows the Snowball protocol used as the core of a peer-to-peer payment system, Avalanche, introduced in&nbsp;
                <Link href="https://arxiv.org/pdf/1906.08936.pdf" target="_blank" rel="noopener">
                  this paper
                </Link>
                &nbsp;. It visualizes the process of a binary,
                single-decree, probabilistic Snowball consensus that harnesses
                metastability to guarantee safety.
                Little squares represent different nodes, wherein
                the color of each square represents its current
                proposal. Darkness of the color shows the node's
                conviction in that proposal.  Expectedly, all nodes
                will collapse to the same color in the end.
              </Typography>
              <Typography variant="body1" paragraph>
                Try to click or move the mouse when clicked to flip the
                color of squares. Are you able to prevent them from
                going to a single color?
              </Typography>
              <Table size='small'>
              <TableBody>
              <TableRow>
                <TableCell className={classes.inputLabel}>
                n =
                </TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ className: classes.inputValue, maxLength: 2 }}
                    value={this.state.n}
                    disabled={this.state.loaded}
                    style={{width: 40}}
                    error={this.state.nError}
                    onChange={event => this.setState({ n: event.target.value, nError: false })} />
                  <sup>2</sup>
                  {this.state.nError && <span className={classes.errorHint}>n must be in 2..40</span>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.inputLabel}>
                k =
                </TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ className: classes.inputValue, maxLength: 4 }}
                    value={this.state.k}
                    disabled={this.state.ticking}
                    style={{width: 40}}
                    error={this.state.kError}
                    onChange={event => this.setState({ k: event.target.value, kError: false })}/>
                  {this.state.kError && <span className={classes.errorHint}>k must be in 1..(n-1)</span>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.inputLabel}>
                alpha =
                </TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ className: classes.inputValue, maxLength: 4 }}
                    value={this.state.alpha}
                    disabled={this.state.ticking}
                    style={{width: 40}}
                    error={this.state.alphaError}
                    onChange={event => this.setState({ alpha: event.target.value, alphaError: false })}/>
                  {this.state.alphaError && <span className={classes.errorHint}>alpha must be in (k/2, k]</span>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.inputLabel}>
                nodesPerTick =
                </TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ className: classes.inputValue, maxLength: 4 }}
                    value={this.state.nodesPerTick}
                    disabled={this.state.ticking}
                    style={{width: 40}}
                    error={this.state.nodesPerTickError}
                    onChange={event => this.setState({ nodesPerTick: event.target.value, nodesPerTickError: false })}/>
                  {this.state.nodesPerTickError && <span className={classes.errorHint}>nodesPerTick must be in 1..n</span>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.inputLabel}>
                maxInactiveTicks =
                </TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ className: classes.inputValue }}
                    value={this.state.maxInactiveTicks}
                    disabled={this.state.ticking}
                    style={{width: 50}}
                    error={this.state.maxInactiveTicksError}
                    onChange={event => this.setState({ maxInactiveTicks: event.target.value, maxInactiveTicksError: false })}/>
                  {this.state.maxInactiveTicksError && <span className={classes.errorHint}>maxInactiveTicks must be in 1..1000000</span>}
                </TableCell>
              </TableRow>
              <TableRow>
              <TableCell className={classes.inputLabel}>
                simulationSpeed
              </TableCell>
              <TableCell>
                <Slider
                  classes={{ root: classes.slider }}
                  value={this.state.simulationSpeed}
                  min={1}
                  max={1000}
                  onChange={(_, value) => this.setState({ simulationSpeed: value })} />
              </TableCell>
              </TableRow>
              </TableBody>
              </Table>
              <div className={classes.buttonSpacer} />
              <div className={classes.bottomButtons}>
                <Grid container item spacing={1}>
                  <Grid item md={4} xs={12}>
                    <FormGroup>
                      <Button
                        variant="contained" color="primary"
                        onClick={event => this.startTick()}
                        disabled={this.state.ticking}>Run
                      </Button>
                    </FormGroup>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <FormGroup>
                      <Button
                        variant="contained" color="primary"
                        onClick={event => this.pauseTick()}
                        disabled={!this.state.ticking}>Stop
                      </Button>
                    </FormGroup>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <FormGroup>
                      <Button
                        variant="contained" color="primary"
                        onClick={event => this.reset()}>Reset
                      </Button>
                    </FormGroup>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>);
    }
}

export default withStyles(styles)(Snow);
