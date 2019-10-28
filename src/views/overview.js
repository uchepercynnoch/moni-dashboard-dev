import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { useStyles } from "../styles/dashboard.style";
import Chart from "../components/chart";
import PointsChart from "../components/points.chart";

export default function Overview() {
    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} >
                    <Paper style={{padding: "10px"}}>
                    {/* <Chart/> */}
                <PointsChart/>
                    </Paper>
                </Grid>
                {/* Recent Deposits
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>Deposits </Paper>
                </Grid> */}
                {/* Recent Orders */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        Statistics
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
