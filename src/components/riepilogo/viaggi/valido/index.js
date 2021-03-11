import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { head, filter, includes, range, map, groupBy, keys, flatten, isNil, isEmpty, sum } from 'ramda';
import styles from './index.module.scss';
//import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// https://www.robinwieruch.de/react-css-styling


class RiepilogoViaggiValidi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: -1
        };
        this.handleClickItemViaggio= this.handleClickItemViaggio.bind(this);
        this.getTitleItemViaggio= this.getTitleItemViaggio.bind(this);
    }

    handleClickItemViaggio(index){
        this.setState({
            open: this.state.open==index? -1 : index
        })
    }

    async componentDidMount(){
        console.log(this.props.viaggi)
    }

    getTitleItemViaggio(viaggio){
        return moment(new Date(Date.parse(viaggio.dataFine))).format('L');
    }

    //className={style.root}
    render() {
        const self= this;
        return (
            <List className={styles.root}>
                {
                    self.props.viaggi.map(function(viaggio, index) {
                        return (<Box>
                            <ListItem button onClick={() => self.handleClickItemViaggio(index)}>
                                <ListItemText primary={self.getTitleItemViaggio(viaggio)} />
                                <ListItemText secondary={viaggio.tipoTrattamento} />
                                {viaggio.viaggioCheckIn && <ListItemText secondary="CheckIn disponibile" />}
                                {//self.state.open==index ? <ExpandLess /> : <ExpandMore />
                                }
                            </ListItem>
                            <Collapse in={self.state.open==index} timeout="auto" unmountOnExit>

                            </Collapse>
                        </Box>)
                        /*
                        return (<div key={keyServizio}>
                            <span>{self.hashServizi[keyServizio].descrizione}</span>
                            {
                                keys(self.state.partitionedData[keyServizio]).map(function(valueOrario, index) {
                                    return (<div key={valueOrario}>{valueOrario} : {self.state.partitionedData[keyServizio][valueOrario].length} </div>)
                                })
                            }
                            </div>)*/
                    })
                }
            </List>
        )
    }
}


RiepilogoViaggiValidi.propTypes = {
    data: PropTypes.string.isRequired,
    viaggi: PropTypes.array.isRequired,
}

export default RiepilogoViaggiValidi;