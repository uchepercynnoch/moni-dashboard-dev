import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import { Button, Chip } from "@material-ui/core";
import { createAxiosInstance, getUserData } from "../util";
import TransactionModal from "../components/transaction";

const columns = [
    { field: "transactionId", title: "Transaction Ref", minWidth: 170 },
    { field: "dateOfTransaction", title: "Date of Transaction", minWidth: 100 },
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
        render: rowData => (
            <div style={loyaltyTagStyle}>
                {rowData.points}
            </div>
        )
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
    const [error, setError] = React.useState(false);
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
                setRows(transactions);
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

    return (
        <Paper className={classes.root}>
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
