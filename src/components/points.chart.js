import React, { PureComponent } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Sector } from "recharts";
import { createAxiosInstance, getUserData } from "../util";
import { Typography, Paper } from "@material-ui/core";

const data = [{ name: "Group A", value: 400 }, { name: "Group B", value: 300 }];

export default class PointsChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            data: [],
            totalSales: 0
        };
    }

    componentWillMount() {
        createAxiosInstance()
            .get(`/analytics/stats?id=${getUserData().vendor}`)
            .then(res => {
                const obj = { ...this.state };
                const obj1 = { name: "Points-Earned", value: res.data.totalPointsEarned };
                const obj2 = { name: "Points-Redeemed", value: res.data.totalPointsRedeemed };
                obj.data.push(obj1, obj2);
                obj.totalSales = res.data.totalSales;
                console.log(obj);

                this.setState(obj);
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index
        });
    };

    render() {
        const cardStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "70px",
            width: "200px",
            margin: "10px"
        };
        const containerStyle = {
            display: "flex",
            flexDirection: "row"
        };
        return (
            <div style={containerStyle}>
                {this.state.data.length > 0 ? (
                    <AreaChart
                        width={500}
                        height={300}
                        data={this.state.data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                ) : (
                    "loading..."
                )}

                {this.state.data.length > 0 ? (
                    <div>
                        <Paper style={{ ...cardStyle, backgroundColor: "#1abc9c" }}>
                            <p style={{ margin: "0px" }}>Total Sales</p>
                            <h1 style={{ margin: "0px" }}>{this.state.totalSales}</h1>
                        </Paper>
                        <Paper style={{ ...cardStyle, backgroundColor: "#27ae60" }}>
                            <p style={{ margin: "0px" }}>Total Points Earned</p>
                            <h1 style={{ margin: "0px" }}>{this.state.data[0].value}</h1>
                        </Paper>
                        <Paper style={{ ...cardStyle, backgroundColor: "#c0392b" }}>
                            <p style={{ margin: "0px" }}>Total Points Redeemed</p>
                            <h1 style={{ margin: "0px" }}>{this.state.data[1].value}</h1>
                        </Paper>
                    </div>
                ) : (
                    "loading..."
                )}
            </div>
        );
    }
}
