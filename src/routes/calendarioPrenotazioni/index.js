import React from 'react';
import Grid from '@material-ui/core/Grid';
import { range, map, groupBy, keys, flatten, head, isNil, isEmpty, filter, length } from 'ramda';
import styles from '../calendarioPrenotazioni/index.module.scss';
import { makeStyles } from "@material-ui/core/styles";

//import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PrenotazioniService from '../../services/prenotazioni';
import Badge from "@material-ui/core/Badge";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import IconButton from '@material-ui/core/IconButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faArrowsAltH } from '@fortawesome/free-solid-svg-icons'

import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import lime from '@material-ui/core/colors/lime';

// https://www.robinwieruch.de/react-css-styling

import { connect } from 'react-redux';

import * as PrenotazioniDelGiornoActionCreators from '../../actions/prenotazioniDelGiornoActionCreators';
import BadgeValido from '../../components/badge/valido';
import BadgeInLavorazione from '../../components/badge/inLavorazione';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

class CalendarioPrenotazioni extends React.Component {

    constructor(props) {
        super(props);

        this.prenotazioniService= new PrenotazioniService();
        this.getDay= this.getDay.bind(this);
        this.getNumPrenotazioniValide= this.getNumPrenotazioniValide.bind(this);
        this.getNumPrenotazioniInLavorazione= this.getNumPrenotazioniInLavorazione.bind(this);
        this.goToDettaglioPrenotazione= this.goToDettaglioPrenotazione.bind(this);
        this.navToPeriod= this.navToPeriod.bind(this);
        this.getAnnoMeseFromState= this.getAnnoMeseFromState.bind(this);
        this.calcolaNumDays= this.calcolaNumDays.bind(this);
        this.refreshPrenotazioni= this.refreshPrenotazioni.bind(this);
        this.calcolaNuovoPeriodoCalendario= this.calcolaNuovoPeriodoCalendario.bind(this);

        const today= new Date();
        const numDaysOfMonth= this.calcolaNumDays(today.getFullYear(),today.getMonth()+1);

        this.state = {
            today: today,
            numDaysOfMonth: numDaysOfMonth,
            numDays: map((index) => {}, range(0,numDaysOfMonth)),
            numMonth: today.getMonth()+1,
            numYear: today.getFullYear(),
            calendar: {},
            navigation: 1
        };
    }

    calcolaNumDays(numYear,numMonth){
        return new Date(numYear, numMonth, 0).getDate();
    }

    getAnnoMeseFromState(numYear,numMonth){
        return numYear + "-" + (numMonth<10? '0' + numMonth : numMonth);
    }

    goToDettaglioPrenotazione(numDay){
        // todo route to dettaglio prenotazione
        if (isNil(this.state.calendar[numDay]) || isEmpty(this.state.calendar[numDay])){
            return;
        }
        const prenotazioni= map(item => item.prenotazione, this.state.calendar[numDay]);

        const data= head(map(item => item.data, this.state.calendar[numDay]));
        const { dispatch } = this.props;
        let action = PrenotazioniDelGiornoActionCreators.set({prenotazioni: prenotazioni, data: data});
        dispatch(action);
        this.props.history.push('/prenotazioniDelGiorno');
    }

    getDay(numDay){
        const day= numDay<10? '0' + numDay : '' + numDay;
        const month= this.state.numMonth<10? '0' + this.state.numMonth : '' + this.state.numMonth;
        return (this.state.today.getFullYear()==this.state.numYear)? day + '/' + month : day + '/' + month + '/' + this.state.numYear;
    }

    getNumPrenotazioniValide(numDay){
        return this.state.calendar[numDay]? length(filter((item) => item.prenotazione.stato=='VALIDA', this.state.calendar[numDay])) : 0;
    }

    getNumPrenotazioniInLavorazione(numDay){
        return this.state.calendar[numDay]? length(filter((item) => item.prenotazione.stato=='IN_LAVORAZIONE', this.state.calendar[numDay])) : 0;
    }

    async refreshPrenotazioni(numYear,numMonth){
        const numDaysOfMonth= this.calcolaNumDays(numYear,numMonth);

        const prenotazioni= (await this.prenotazioniService.get(['VALIDA', 'IN_LAVORAZIONE'], this.getAnnoMeseFromState(numYear, numMonth))).prenotazioni;

        console.log(prenotazioni);

        const listMapDataPrenotazione= flatten(map((prenotazioneUtente) => {
            return flatten(map(prenotazione => {
                const date= map(item => item, flatten(map(pacchetto => keys(pacchetto.dettaglioPacchetto), prenotazione.pacchetti)));
                return map(data => {
                    return {"data": data, "prenotazione": prenotazioneUtente};
                }, date)} , prenotazioneUtente.dettaglioPrenotazioni));
        }, prenotazioni));

        const calendarData= groupBy((entry) => {
            return new Date(Date.parse(entry.data)).getDate();
        })(listMapDataPrenotazione);

        console.log(calendarData);

        this.setState({
            calendar: calendarData,
            numDaysOfMonth: numDaysOfMonth,
            numDays: map((index) => {}, range(0,numDaysOfMonth)),
            numMonth: numMonth,
            numYear: numYear
        });
    }

    async componentDidMount(){
        this.refreshPrenotazioni(this.state.numYear, this.state.numMonth);
    }

    calcolaNuovoPeriodoCalendario(moveByPosition){
        switch (moveByPosition){
            case 0: {
                return {
                    numMonth: this.state.today.getMonth()+1,
                    numYear: this.state.today.getFullYear()
                };
            }
            case -1: {
                if (this.state.numMonth==1){
                    return {
                        numMonth: 12,
                        numYear: this.state.numYear-1
                    }
                } else {
                    return {
                        numMonth: this.state.numMonth-1,
                        numYear: this.state.numYear
                    }
                }
            }
            case 1: {
                if (this.state.numMonth==12){
                    return {
                        numMonth: 1,
                        numYear: this.state.numYear+1
                    }
                } else {
                    return {
                        numMonth: this.state.numMonth+1,
                        numYear: this.state.numYear
                    }
                }
            }
        }

    }

    navToPeriod(itemToNav){
        //const numMonth= this.state.numMonth;
        //const numYear= this.state.numYear;

        const nuovoPeriodo= this.calcolaNuovoPeriodoCalendario(itemToNav==0? -1 : (itemToNav==2? 1 : 0));

        this.setState({
            navigation: itemToNav
        });
        this.refreshPrenotazioni(nuovoPeriodo.numYear, nuovoPeriodo.numMonth);
    }

    //className={style.root}
    render() {
        const self= this;
        const styles = theme => ({
            margin: {
              margin: theme.spacing.unit * 2
            },
            customBadge: {
              backgroundColor: green,
              color: "white"
            }
          });
        return (
            <div className={styles.root}>
                 <BottomNavigation value={self.state.navigation} onChange={(event, newValue) => self.navToPeriod(newValue)} showLabels>
                    <BottomNavigationAction label="Mese precedente" icon={<FontAwesomeIcon icon={faArrowLeft} />} />
                    <BottomNavigationAction label={self.state.navigation==1? "Mese in corso" : "Torna a mese in corso"} icon={<FontAwesomeIcon icon={faArrowsAltH} />} />
                    <BottomNavigationAction label="Prossimo mese" icon={<FontAwesomeIcon icon={faArrowRight} />} />
                </BottomNavigation>
                <Grid container spacing={0}>
                    {
                        this.state.numDays.map(function(value,index){
                            return (<Grid key={index} item xs={2}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography className={styles.title} color="textSecondary" gutterBottom>
                                                {  self.getDay(index+1) }
                                                </Typography>
                                                
                                                
                                                <IconButton onClick={() => { self.goToDettaglioPrenotazione(index+1); }} onaria-label="valide">
                                                    <BadgeValido badgeContent={self.getNumPrenotazioniValide(index+1)}></BadgeValido>
                                                </IconButton>
                                                <IconButton onClick={() => { self.goToDettaglioPrenotazione(index+1); }} aria-label="in lavorazione">
                                                    <BadgeInLavorazione badgeContent={self.getNumPrenotazioniInLavorazione(index+1)}></BadgeInLavorazione>
                                                </IconButton>
                                                {/*
                                                    <Button onClick={() => { self.goToDettaglioPrenotazione(index+1); }}>
                                                        { self.getNumPrenotazioniValide(index+1) }
                                                    </Button>
                                                */}
                                                {/*
                                                <Typography variant="body2" component="p">
                                                well meaning and kindly.
                                                <br />
                                                {'"a benevolent smile"'}
                                                </Typography>
                                                */}
                                            </CardContent>
                                            {/*<CardActions>
                                                <Button size="small">Dettagli</Button>
                                            </CardActions>
                                            */}
                                        </Card>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </div>
        )
    }
}
//https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect()(CalendarioPrenotazioni);