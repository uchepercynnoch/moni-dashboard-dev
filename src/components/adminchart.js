import React, { PureComponent } from "react";
import { createAxiosInstance, getUserData } from "../util";
import { Typography, Paper, Chip } from "@material-ui/core";
import StatCard from "../components/statcard";
import MembershipTag from "./membershipTag";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import SplitButton from "./customdropdown";

const data = [
    {
        name: "Landmark Hotel",
        reservoir: 1000
        // pv: 2400,
    },
    {
        name: "Landmark Beach",
        reservoir: 3000
        // pv: 1398,
    }
];

export default class AdminChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pieData: [],
            statsData: [],
            activeIndex: 0,
            selectedVendor: "Landmark Hotel"
        };
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index
        });
    };

    componentWillMount() {
        createAxiosInstance()
            .get(`/analytics/stats?id=${getUserData().vendor}`)
            .then(res => {})
            .catch(error => {});
    }

    handleSelectionChanged = index => {
        console.log(data[index].name);
    }

    render() {
        const containerStyle = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap"
        };

        const statCardContainer = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            backgroundColor: "#ecf0f1",
        };
        const statsStyle = {
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "100%",
            width: "50%",
            padding: "10px",
        };

        const chipStyle = {
            color: "white",
            backgroundColor: "#070E2E",
        };

        const chartWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        };
        
        return (
            <div style={containerStyle}>
                <div style={chartWrapperStyle}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="reservoir" fill="#8884d8" background={{ fill: "#eee" }} />
                        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                    </BarChart>
                </div>

                <div style={statsStyle}>
                    {/* <Chip style={chipStyle} label={`${this.state.selectedVendor} Statistics`} /> */}
                    <SplitButton onSelect={this.handleSelectionChanged} style={chipStyle} options={data} />
                    <MembershipTag type="blue" label="Blue Membership" />
                    <div style={statCardContainer}>
                        <StatCard tag="Expected Revenue" value="1500" />
                        <StatCard tag="Actual Revenue" value="10000" />
                        <StatCard tag="Reservoir" value="10000" />
                    </div>
                    <MembershipTag type="gold" label="Gold Membership" />
                    <div style={statCardContainer}>
                        <StatCard tag="Expected Revenue" value="1500" />
                        <StatCard tag="Actual Revenue" value="10000" />
                        <StatCard tag="Reservoir" value="10000" />
                    </div>
                    <MembershipTag type="platinum" label="Platinum Membership" />
                    <div style={statCardContainer}>
                        <StatCard tag="Expected Revenue" value="1500" />
                        <StatCard tag="Actual Revenue" value="10000" />
                        <StatCard tag="Reservoir" value="10000" />
                    </div>
                </div>
            </div>
        );
    }
}
