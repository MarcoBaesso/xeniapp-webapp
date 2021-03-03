import React from 'react';
import Grid from '@material-ui/core/Grid';
import { range, map, groupBy, keys, flatten, head, isNil, isEmpty } from 'ramda';
import styles from '../gestisciPrenotazioni/index.module.scss';
//import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PrenotazioniService from '../../services/prenotazioni';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ButtonGroup from '@material-ui/core/ButtonGroup';

// https://www.robinwieruch.de/react-css-styling

import { connect } from 'react-redux';

class GestisciPrenotazioni extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            prenotazioni: [],
            open: -1
        };
        this.prenotazioniService= new PrenotazioniService();
        this.handleClickItemPrenotazione= this.handleClickItemPrenotazione.bind(this);
        this.getTitleItemPrenotazione= this.getTitleItemPrenotazione.bind(this);
        this.refreshPrenotazioni= this.refreshPrenotazioni.bind(this);
    }

    getTitleItemPrenotazione(prenotazione){
        return new Date(prenotazione.dataPrenotazione).toLocaleDateString() + " - " + prenotazione.viaggio.emailUtente ;
    }

    handleClickItemPrenotazione(index){
        this.setState({
            open: this.state.open==index? -1 : index
        })
    }
    
    async updateStatoPrenotazione(prenotazione, stato, motivoRifiuto){
        await this.prenotazioniService.updateStato(prenotazione.viaggio.emailUtente, prenotazione.id, stato, motivoRifiuto);
        this.setState({
            open: -1
        });
        this.refreshPrenotazioni();
    }

    async refreshPrenotazioni(){
        const today= new Date();
        const numMonth= 2;//today.getMonth()+1;
        const prenotazioni= (await this.prenotazioniService.get(['IN_LAVORAZIONE'],numMonth)).prenotazioni;
        console.log(prenotazioni);
        this.setState({
            prenotazioni: prenotazioni
        });
    }

    componentDidMount(){
        this.refreshPrenotazioni();
    }
    //className={style.root}
    /*
                        return (<Paper elevation={2} className={styles.} onClick={() => { alert("bo"); }}>
                            {value.dataPrenotazione}
                            <Collapse in={checked}>
                                <Paper elevation={4}>
                                    {value.id}
                                </Paper>
                            </Collapse>
                        </Paper>)
    */
    render() {
        const self= this;
        return (
            <Box m={1}>
                {
                    <List>
                        {
                            self.state.prenotazioni.map(function(value,index){
                                return (
                                <Box>
                                    <ListItem button onClick={() => self.handleClickItemPrenotazione(index)}>
                                        <ListItemText primary={self.getTitleItemPrenotazione(value)} />
                                        {self.state.open==index ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={self.state.open==index} timeout="auto" unmountOnExit>
                                        <Box className={styles.buttonGroupContainer}>
                                            <ButtonGroup color="primary">
                                                <Button onClick={() => self.updateStatoPrenotazione(value, 'VALIDA')} variant={value.stato=="VALIDA"? 'contained' : 'outlined'} color={value.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>Convalida</Button>
                                                <Button disabled variant={value.stato=="IN_LAVORAZIONE"? 'contained' : 'outlined'} color={value.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>In lavorazione</Button>
                                                <Button onClick={() => self.updateStatoPrenotazione(value, 'ANNULLATA')} variant={value.stato=="ANNULLATA"? 'contained' : 'outlined'} color={value.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>Annulla</Button>
                                            </ButtonGroup>
                                        </Box>
                                        <div className={styles.pacchettiContainer}>
                                            <Grid container justify="center" direction="row" justify="center" alignItems="center" spacing={2} xs={6}>
                                                {
                                                    value.dettaglioPrenotazioni.map(function(dettaglioPrenotazione,indexDettaglioPrenotazione){
                                                        return (<Card variant="outlined">
                                                                    <CardContent>
                                                                        <Typography variant="body2" component="p">
                                                                            Info date viaggio: {new Date(value.viaggio.dataInizio).toLocaleDateString()} - {new Date(value.viaggio.dataFine).toLocaleDateString()}
                                                                            <br/>
                                                                            Tipo trattamento: {value.viaggio.tipoTrattamento}
                                                                        </Typography>
                                                                        <Typography color="textPrimary">
                                                                            Prenotazione per: {  dettaglioPrenotazione.servizio.descrizione}
                                                                        </Typography>
                                                                        {
                                                                            dettaglioPrenotazione.pacchetti.map(function(pacchetto,indexPacchetto){
                                                                                return (<TableContainer component={Paper}>
                                                                                    <Table aria-label="simple table">
                                                                                      <TableHead>
                                                                                        <TableRow>
                                                                                          <TableCell align="center">Pacchetto</TableCell>
                                                                                          <TableCell align="center">Num ordini</TableCell>
                                                                                          <TableCell align="center">Prezzo totale</TableCell>
                                                                                          <TableCell align="center">Data</TableCell>
                                                                                          <TableCell align="center">Fascia oraria</TableCell>
                                                                                        </TableRow>
                                                                                      </TableHead>
                                                                                      <TableBody>
                                                                                        {
                                                                                            keys(pacchetto.dettaglioPacchetto).map(function(data,indexDettaglioPacchetto){
                                                                                                    return (<TableRow key={indexDettaglioPacchetto}>
                                                                                                                <TableCell component="th" scope="row">{pacchetto.keyPacchetto}</TableCell>
                                                                                                                <TableCell align="center">{pacchetto.numOrdini}</TableCell>
                                                                                                                <TableCell align="center">{pacchetto.prezzoTotale}</TableCell>
                                                                                                                <TableCell align="center">{new Date(data).toLocaleDateString()}</TableCell>
                                                                                                                <TableCell align="center">{pacchetto.dettaglioPacchetto[data]}</TableCell>
                                                                                                            </TableRow>)
                                                                                                    })
                                                                                        }
                                                                                      </TableBody>
                                                                                    </Table>
                                                                                  </TableContainer>)
                                                                            })
                                                                        }
                                                                    </CardContent>
                                                                </Card>)
                                                    })
                                                }
                                            </Grid>
                                        </div>
                                    </Collapse>
                                </Box>
                                )

                            })
                        }
                    </List>
                }
            </Box>
        )
    }
}
//https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect()(GestisciPrenotazioni);