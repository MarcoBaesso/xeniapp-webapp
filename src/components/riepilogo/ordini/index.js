import React from 'react';
import PropTypes from 'prop-types';
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


class RiepilogoOrdini extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: -1
        };
        this.handleClickItemServizio= this.handleClickItemServizio.bind(this);
        this.getNumPersone= this.getNumPersone.bind(this);
    }

    handleClickItemServizio(index){
        this.setState({
            open: this.state.open==index? -1 : index
        })
    }

    async componentDidMount(){

        // TODO metti la prenotazione anche come singole elemento
        /*
        const orariPacchetti= flatten(map(dettaglioPrenotazione => {
            return map(pacchetto => {
                return {
                    servizio: dettaglioPrenotazione.servizio,
                    pacchetto: pacchetto,
                    fasciaOraria: pacchetto.dettaglioPacchetto[this.props.data]
                }
            }, filter(pacchetto => includes(this.props.data, keys(pacchetto.dettaglioPacchetto)),dettaglioPrenotazione.pacchetti));
        }, flatten(map(item => item.dettaglioPrenotazioni, this.props.prenotazioni))));
        */
       
        const orariPacchetti= flatten(map(prenotazione => {
            return map(dettaglioPrenotazione => {
                return map(pacchetto => {
                    return {
                        servizio: dettaglioPrenotazione.servizio,
                        pacchetto: pacchetto,
                        fasciaOraria: pacchetto.dettaglioPacchetto[this.props.data],
                        prenotazione: prenotazione
                    }
                }, filter(pacchetto => includes(this.props.data, keys(pacchetto.dettaglioPacchetto)),dettaglioPrenotazione.pacchetti));
            },
            prenotazione.dettaglioPrenotazioni);
        }, this.props.prenotazioni));
        
        const groupByIdServizio= groupBy(item => {
            return item.servizio.id;
        }, orariPacchetti);

        const hashServizi= map(item => head(item), groupBy(item => {
            return item.id;
        }, map(item => item.servizio, orariPacchetti)));

        const partitionedData= map(servizioPartitionData => {
            return groupBy(item => item.fasciaOraria, servizioPartitionData);
        }, groupByIdServizio);

        this.hashServizi= hashServizi;

        this.setState({
            partitionedData: partitionedData
        })

        console.log(partitionedData)
    }

    getNumPersone(keyServizio, keyOrario){
        return sum(map(item => item.pacchetto.numOrdini, this.state.partitionedData[keyServizio][keyOrario]))
    }

    //className={style.root}
    render() {
        const self= this;
        return (
            <List className={styles.root}>
                {
                    keys(self.state.partitionedData).map(function(keyServizio, index) {
                        return (<Box>
                            <ListItem button onClick={() => self.handleClickItemServizio(index)}>
                                <ListItemText primary={self.hashServizi[keyServizio].descrizione} />
                                {self.state.open==index ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={self.state.open==index} timeout="auto" unmountOnExit>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Fascia oraria</TableCell>
                                                <TableCell align="center">Num persone</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                keys(self.state.partitionedData[keyServizio]).map(function(keyOrario, index) {
                                                    return (<TableRow key={index}>
                                                                <TableCell component="th" scope="row">{keyOrario}</TableCell>
                                                                <TableCell align="center">{self.getNumPersone(keyServizio, keyOrario)}</TableCell>
                                                            </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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


RiepilogoOrdini.propTypes = {
    data: PropTypes.string.isRequired,
    prenotazioni: PropTypes.array.isRequired,
}

export default RiepilogoOrdini;