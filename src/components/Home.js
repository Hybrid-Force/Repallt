'use strict';

import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import {
    PerformanceDistributionByPayout,
    TurnoverByPerformanceDistribution,
    ProductivityCompensationByTherapy,
    RevenueMarketByTherapy
} from './Report';

const style = theme => ({
    root: {
        width: '48%',
        marginBottom: 20
    },
    title: {
        padding: 10,
        backgroundColor: theme.palette.primary[500],
        color: theme.palette.common.fullWhite,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2
    },
    content: {
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        overflow: 'hidden'
    }
});

function Tile(props) {
    return (
        <Paper className={props.classes.root}>
            <Typography
                className={props.classes.title}
                align="center"
                type="title"
            >
                {props.title}
            </Typography>
            <div className={props.classes.content}>
                {props.children}
            </div>
        </Paper>
    );
}

Tile = withStyles(style)(Tile);

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <Tile title="Achieve Target and Win Market">
                    <RevenueMarketByTherapy
                        compact={true}
                        aspectRatio="70%"
                    />
                </Tile>
                <Tile title="Competitive Productivity and Compensation">
                    <ProductivityCompensationByTherapy
                        compact={true}
                        aspectRatio="70%"
                    />
                </Tile>
                <Tile title="Pay for Performance">
                    <PerformanceDistributionByPayout
                        compact={true}
                        aspectRatio="70%"
                    />
                </Tile>
                <Tile title="Retain High-Performer">
                    <TurnoverByPerformanceDistribution
                        compact={true}
                        aspectRatio="70%"
                    />
                </Tile>
            </div>
        );
    }
}