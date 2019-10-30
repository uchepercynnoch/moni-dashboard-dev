import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField, Button, Snackbar } from "@material-ui/core";
import "../styles/cashRegistration.css";
import clsx from "clsx";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.main
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: "flex",
        alignItems: "center"
    }
}));

function SnackbarWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>
            ]}
            {...other}
        />
    );
}

const useStyles2 = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1)
    }
}));

export default function TransactionModal(props) {
    const classes = useStyles2();

    const getTotal = items => {
        let total = 0;
        items.forEach(item => {
            total += item.unitPrice;
        });
        return total;
    };

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.Close()} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{"Transaction"}</DialogTitle>
                <DialogContent>
                    <div className="horizontal-align">
                        <TextField
                            className="form-input"
                            id="transactionId"
                            label="Transaction Ref"
                            value={props.transaction.transactionId}
                            margin="normal"
                            className="text-input"
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(true)
                            }}
                        />
                    </div>
                    <div className="horizontal-align">
                        <TextField
                            className="form-input"
                            id="dateOfTransaction"
                            value={props.transaction.dateOfTransaction}
                            margin="normal"
                            label="Date of Transaction"
                            className="text-input"
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(true)
                            }}
                        />
                    </div>

                    <TextField
                        className="form-input"
                        id="servicedBy"
                        label="Cashier"
                        value={props.transaction.servicedBy}
                        margin="normal"
                        className="text-input"
                        type="text"
                        variant="filled"
                        inputProps={{
                            readOnly: Boolean(true)
                        }}
                    />

                    <TextField
                        className="form-input"
                        id="citizen"
                        value={props.transaction.citizen}
                        margin="none"
                        label="Citizen"
                        className="text-input"
                        helperText="landmark citizen"
                        type="text"
                        variant="filled"
                        inputProps={{
                            readOnly: Boolean(true)
                        }}
                    />
                    <TextField
                        className="form-input"
                        style={{ width: "50%" }}
                        id="points"
                        value={props.transaction.points}
                        margin="none"
                        label="Points"
                        className="text-input"
                        type="number"
                        variant="filled"
                        inputProps={{
                            readOnly: Boolean(true)
                        }}
                    />
                    <div>
                        <Paper style={{ width: "50%", backgroundColor: "lightGrey" }}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.transaction.items.map(row => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">₦{row.unitPrice}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell rowSpan={2} />
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={1}>
                                            <b>Total</b>
                                        </TableCell>
                                        <TableCell colSpan={2}>
                                            <span>₦</span>
                                            {getTotal(props.transaction.items)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left"
                        }}
                        open={props.saved}
                        onClose={() => props.closeSnack("success")}
                        autoHideDuration={6000}
                    >
                        <SnackbarWrapper variant="success" message="Saved successfully!" />
                    </Snackbar>
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left"
                        }}
                        open={props.error}
                        onClose={() => props.closeSnack("error")}
                        autoHideDuration={6000}
                    >
                        <SnackbarWrapper
                            variant="error"
                            className={classes.margin}
                            message="An error ocurred! Pls try again"
                        />
                    </Snackbar>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={props.saving}
                        onClick={() => {
                            props.Close();
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
