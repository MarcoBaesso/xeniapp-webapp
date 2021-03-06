import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHammer } from '@fortawesome/free-solid-svg-icons'
import Badge from "@material-ui/core/Badge";
import yellow from '@material-ui/core/colors/yellow';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing.unit * 2
    },
    customBadge: {
        backgroundColor: yellow[400],
        color: "white"
    }
}));
  

export default function BadgeInLavorazione(props){
    const classes = useStyles();

    return (<Badge badgeContent={props.badgeContent} classes={{ badge: classes.customBadge }}>
        <FontAwesomeIcon icon={faHammer} />
    </Badge>);
}