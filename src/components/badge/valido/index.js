import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Badge from "@material-ui/core/Badge";
import green from '@material-ui/core/colors/green';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing.unit * 2
    },
    customBadge: {
        backgroundColor: green[400],
        color: "white"
    }
}));
  

export default function BadgeValido(props){
    const classes = useStyles();

    return (<Badge badgeContent={props.badgeContent} classes={{ badge: classes.customBadge }}>
        <FontAwesomeIcon icon={faCheck} />
    </Badge>);
}