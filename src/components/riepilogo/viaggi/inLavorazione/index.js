import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { range, map, groupBy, keys, flatten, head, isNil, isEmpty, append, filter, includes, length } from 'ramda';
import styles from './index.module.scss';
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
import ViaggiService from '../../../../services/viaggi';
import OspitiService from '../../../../services/ospiti';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ButtonGroup from '@material-ui/core/ButtonGroup';

import Badge from "@material-ui/core/Badge";
import green from '@material-ui/core/colors/green';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImage } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@material-ui/core/IconButton';

// https://www.robinwieruch.de/react-css-styling

class RiepilogoViaggiInLavorazione extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viaggi: [],
            updatedViaggi: [],
            open: -1,
            openCheckIn: -1,
            ospiti: []
        };
        this.viaggiService= new ViaggiService();
        this.ospitiService= new OspitiService();
        this.handleClickItemViaggio= this.handleClickItemViaggio.bind(this);
        this.handleClickItemViaggioCheckIn= this.handleClickItemViaggioCheckIn.bind(this);
        this.getTitleItemViaggio= this.getTitleItemViaggio.bind(this);
        this.updateStatoViaggio= this.updateStatoViaggio.bind(this);
        this.updateStatoViaggioCheckIn= this.updateStatoViaggioCheckIn.bind(this);
        this.downloadDocumentoOspite= this.downloadDocumentoOspite.bind(this);
        this.downloadFile= this.downloadFile.bind(this);
    }

    getTitleItemViaggio(viaggio){
        return "utente: " + viaggio.emailUtente + ", da: " + moment(new Date(Date.parse(viaggio.dataInizio))).format('L') + ", a: " + moment(new Date(Date.parse(viaggio.dataFine))).format('L');
    }

    handleClickItemViaggio(index){
        this.setState({
            open: this.state.open==index? -1 : index,
            openCheckIn: -1
        })
    }

    async handleClickItemViaggioCheckIn(viaggio, index){
        const open= this.state.openCheckIn==index? -1 : index;
        const ospiti= open==-1? [] : await this.ospitiService.get(viaggio.emailUtente, viaggio.viaggioCheckIn.idOspiti);

        this.setState({
            openCheckIn: open,
            ospiti: ospiti
        })
    }
    
    async updateStatoViaggio(viaggio, stato, motivoRifiuto){
        const response= await this.viaggiService.updateStato(viaggio.emailUtente, viaggio.id, stato, motivoRifiuto);
        if (response) {
            const updatedViaggi= !isNil(viaggio.viaggioCheckIn) && viaggio.viaggioCheckIn.stato!='IN_LAVORAZIONE'? append(viaggio.id, this.state.updatedViaggi) : this.state.updatedViaggi;
            const viaggi= filter(item => !includes(item.id, updatedViaggi), this.state.viaggi);
            
            this.setState({
                open: -1,
                openCheckIn: -1,
                updatedViaggi: updatedViaggi,
                viaggi: viaggi
            });

            if (length(viaggi)==0){
                this.props.handleUpdateAll();
            }
        }
    }
    
    downloadFile(blob, fileName){
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        const clickHandler = () => {
            setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
            }, 0);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
    }

    async downloadDocumentoOspite(viaggio, ospite, lato){
        const blobDocumento= await this.ospitiService.getDocumentoOspite(viaggio.emailUtente, ospite.id, lato, ospite.documento.tipoDocumento);
        this.downloadFile(blobDocumento, ospite.documento.tipoDocumento + "_" + lato + "_" + ospite.cognome + "_" + ospite.nome);
    }

    async updateStatoViaggioCheckIn(viaggio, statoCheckIn, motivoRifiutoCheckIn){
        const response= await this.viaggiService.updateStato(viaggio.emailUtente, viaggio.id, viaggio.stato, viaggio.motivoRifiuto, statoCheckIn, motivoRifiutoCheckIn);
        if (response) {
            const updatedViaggi= viaggio.stato!='IN_LAVORAZIONE' && statoCheckIn!='IN_LAVORAZIONE' ? append(viaggio.id, this.state.updatedViaggi) : this.state.updatedViaggi;
            const viaggi= filter(item => !includes(item.id, updatedViaggi), this.state.viaggi);

            this.setState({
                open: -1,
                openCheckIn: -1,
                updatedViaggi: updatedViaggi,
                viaggi: viaggi
            });

            if (length(viaggi)==0){
                this.props.handleUpdateAll();
            }
        }
    }

    componentDidMount(){
        this.setState({
            viaggi: this.props.viaggi
        })
    }

    render() {
        const self= this;
        return (
            <Box m={1}>
                {
                    <List>
                        {
                            self.state.viaggi.map(function(value,index){
                                return (
                                <Box>
                                    <ListItem button onClick={() => self.handleClickItemViaggio(index)}>
                                        <ListItemText primary={self.getTitleItemViaggio(value)} />
                                        <ListItemText secondary={isNil(value.viaggioCheckIn)? 'CHECKIN non disponibile' : 'CHECKIN disponibile'} />
                                        {self.state.open==index ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={self.state.open==index} timeout="auto" unmountOnExit>
                                        <Box className={styles.buttonGroupContainer}>
                                            <ButtonGroup color="primary">
                                                <Button disabled={value.stato!="IN_LAVORAZIONE"} onClick={() => self.updateStatoViaggio(value, 'VALIDO')} variant={value.stato=="VALIDO"? 'contained' : 'outlined'} color={value.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>Convalida</Button>
                                                <Button disabled variant={value.stato=="IN_LAVORAZIONE"? 'contained' : 'outlined'} color={value.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>In lavorazione</Button>
                                                <Button disabled={value.stato!="IN_LAVORAZIONE"} onClick={() => self.updateStatoViaggio(value, 'ANNULLATO')} variant={value.stato=="ANNULLATO"? 'contained' : 'outlined'} color={value.stato=="ANNULLATO"? 'secondary' : 'primary'}>Annulla</Button>
                                            </ButtonGroup>
                                        </Box>
                                        <List>
                                            <ListItemText primary={"Trattamento: " + value.tipoTrattamento} />
                                            {value.viaggioCheckIn && 
                                                <ListItem button onClick={() => self.handleClickItemViaggioCheckIn(value, index)}>
                                                    <ListItemText primary="Info checkin" />
                                                    {self.state.openCheckIn==index ? <ExpandLess /> : <ExpandMore />}
                                                </ListItem>
                                            }
                                        </List>
                                        <Collapse in={self.state.openCheckIn==index} timeout="auto" unmountOnExit>
                                            <Box className={styles.buttonGroupContainer}>
                                                <ButtonGroup color="primary">
                                                    <Button disabled={value.viaggioCheckIn.stato!="IN_LAVORAZIONE"} onClick={() => self.updateStatoViaggioCheckIn(value, 'VALIDO')} variant={value.viaggioCheckIn.stato=="VALIDO"? 'contained' : 'outlined'} color={value.viaggioCheckIn.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>Convalida</Button>
                                                    <Button disabled variant={value.viaggioCheckIn.stato=="IN_LAVORAZIONE"? 'contained' : 'outlined'} color={value.viaggioCheckIn.stato=="IN_LAVORAZIONE"? 'secondary' : 'primary'}>In lavorazione</Button>
                                                    <Button disabled={value.viaggioCheckIn.stato!="IN_LAVORAZIONE"} onClick={() => self.updateStatoViaggioCheckIn(value, 'ANNULLATO')} variant={value.viaggioCheckIn.stato=="ANNULLATO"? 'contained' : 'outlined'} color={value.viaggioCheckIn.stato=="ANNULLATO"? 'secondary' : 'primary'}>Annulla</Button>
                                                </ButtonGroup>
                                            </Box>
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center">Nome</TableCell>
                                                            <TableCell align="center">Cognome</TableCell>
                                                            <TableCell align="center">Data nascita</TableCell>
                                                            <TableCell align="center">Tipo documento</TableCell>
                                                            <TableCell align="center">Numero documento</TableCell>
                                                            <TableCell align="center">Data rilascio</TableCell>
                                                            <TableCell align="center">Data scadenza</TableCell>
                                                            <TableCell align="center">Fronte</TableCell>
                                                            <TableCell align="center">Retro</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            self.state.ospiti.map(function(ospite,indexOspite){
                                                                return (<TableRow key={indexOspite}>
                                                                            <TableCell component="th" scope="row">{ospite.nome}</TableCell>
                                                                            <TableCell align="center">{ospite.cognome}</TableCell>
                                                                            <TableCell align="center">{new Date(ospite.dataNascita).toLocaleDateString()}</TableCell>
                                                                            <TableCell align="center">{ospite.documento.tipoDocumento}</TableCell>
                                                                            <TableCell align="center">{ospite.documento.numeroDocumento}</TableCell>
                                                                            <TableCell align="center">{ospite.documento.dataRilascio}</TableCell>
                                                                            <TableCell align="center">{ospite.documento.dataScadenza}</TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton onClick={() => self.downloadDocumentoOspite(value, ospite, 'fronte')}>
                                                                                    <FontAwesomeIcon icon={faFileImage} />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton onClick={() => self.downloadDocumentoOspite(value, ospite, 'retro')}>
                                                                                    <FontAwesomeIcon icon={faFileImage} />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Collapse>
                                        {/*
                                        <div className={styles.pacchettiContainer}>
                                            {
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
                                           
                                        </div> */}
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


RiepilogoViaggiInLavorazione.propTypes = {
    data: PropTypes.string.isRequired,
    viaggi: PropTypes.array.isRequired,
    handleUpdateAll: PropTypes.func.isRequired
}

//https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default RiepilogoViaggiInLavorazione;