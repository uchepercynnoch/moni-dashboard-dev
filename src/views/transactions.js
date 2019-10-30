import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Button, Chip } from "@material-ui/core";
import { createAxiosInstance, getUserData } from "../util";
import TransactionModal from "../components/transaction";
import { DateRangePicker } from "react-dates";
import Moment from "moment";
import _ from "lodash";

const columns = [
    { field: "transactionId", title: "Transaction Ref", minWidth: 170 },
    {
        field: "dateOfTransaction",
        title: "Date of Transaction",
        minWidth: 100,
        render: rowData => Moment(rowData.dateOfTransaction).format("YYYY-MM-DD")
    },
    {
        field: "servicedBy",
        title: "Cashier",
        minWidth: 170
    },
    {
        field: "type",
        title: "Type",
        render: rowData => (
            <Chip
                label={rowData.type}
                size="small"
                style={{
                    color: "white",
                    backgroundColor: rowData.type === "gain" ? "#2ecc71" : "#e74c3c",
                    marginTop: "20px"
                }}
            />
        )
    },
    {
        field: "citizen",
        title: "Citizen",
        minWidth: 170
    },
    {
        field: "points",
        title: "Gems💎",
        minWidth: 170,
        render: rowData => <div style={loyaltyTagStyle}>{rowData.points}</div>
    }
];

const loyaltyTagStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
};

function createData(obj) {
    console.log(obj.servicedBy.iam);
    return {
        transactionId: obj.transactionId,
        dateOfTransaction: obj.dateOfTransaction,
        servicedBy: obj.servicedBy.iam, // merchant
        type: obj.type,
        points: obj.type === "gain" ? obj.gainedPoints : obj.deductedPoints,
        citizen: obj.citizen.name,
        items: obj.items
    };
}

const useStyles = makeStyles({
    root: {
        width: "95%",
        margin: "10px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    tableWrapper: {
        height: "90%",
        overflow: "auto"
    },
    controls: {
        display: "flex",
        flexDirection: "row",
        margin: "20px"
    }
});

export default function Transaction() {
    const classes = useStyles();
    const [openView, setOpenView] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [fallbackRows, setFallback] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [focused, setFocused] = React.useState(null);
    const [transaction, setTransaction] = React.useState({
        transactionId: "",
        dateOfTransaction: "",
        servicedBy: "",
        type: "",
        points: "",
        citizen: "",
        items: []
    });

    useEffect(() => {
        createAxiosInstance()
            .get(`/transaction/all?id=${getUserData().vendor}`)
            .then(res => {
                const transactions = [];
                res.data.forEach(data => {
                    transactions.push(createData(data));
                });
                // Sort array by date
                const sortedTransactions = _.orderBy(
                    transactions,
                    o => {
                        return Moment(o.dateOfTransaction).format("YYYY-MM-DD");
                    },
                    ["desc"]
                );
                setEndDate(Moment(sortedTransactions[0].dateOfTransaction));
                setFallback(sortedTransactions);
                setRows(sortedTransactions);
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.error);
            });
    }, []);

    const getTransaction = id => {
        createAxiosInstance()
            .get(`/transaction?id=${id}`)
            .then(res => {
                const obj = createData(res.data);
                console.log(obj);
                setTransaction(obj);
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleView = id => {
        setOpenView(true);
        getTransaction(id);
    };

    const visibilityIconFontStyle = {
        fontSize: 16,
        color: "green"
    };

    const tableActions = [
        {
            icon: "visibility",
            tooltip: "View",
            onClick: (event, rowData) => {
                handleView(rowData.transactionId);
            },
            iconProps: {
                style: { ...visibilityIconFontStyle }
            }
        }
    ];

    const localizationOptions = {
        header: {
            actions: "Actions"
        }
    };

    const sortByDate = (startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);

        if (!startDate || !endDate)
            setRows(fallbackRows);

        let result = _.filter(fallbackRows, data => {
            const date = Moment(data.dateOfTransaction);
            const start = Moment(startDate).format("YYYY-MM-DD");
            const end = Moment(endDate).format("YYYY-MM-DD");
            
            console.log(`${Moment(data.dateOfTransaction).format("YYYY-MM-DD")} ${Moment(startDate).format("YYYY-MM-DD")} ${Moment(endDate).format("YYY-MM-DD")}`);
            
            return date.isBetween(start, end) || date.isSame(start) || date.isSame(end);
        });
        setRows(result);
    };

    return (
        <Paper className={classes.root}>
            <div>
                <DateRangePicker
                    startDate={startDate}
                    startDateId="1"
                    endDate={endDate}
                    endDateId="2"
                    onDatesChange={({ startDate, endDate }) => sortByDate(startDate, endDate)}
                    focusedInput={focused}
                    onFocusChange={focused => setFocused(focused)}
                    enableOutsideDays={true}
                    isOutsideRange={() => false}
                />
            </div>
            <div className={classes.tableWrapper}>
                <MaterialTable
                    title="Transactions"
                    columns={columns}
                    data={rows}
                    localization={localizationOptions}
                    actions={tableActions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1
                    }}
                />
                <TransactionModal
                    closeSnack={type => setError(false)}
                    error={error}
                    open={openView}
                    Close={() => setOpenView(false)}
                    transaction={transaction}
                />
            </div>
        </Paper>
    );
}
