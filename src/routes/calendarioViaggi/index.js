import React from 'react';
import Grid from '@material-ui/core/Grid';
import { range, map, groupBy, keys, flatten, head, isNil, isEmpty } from 'ramda';
import styles from '../calendarioViaggi/index.module.scss';
//import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ViaggiService from '../../services/viaggi';
// https://www.robinwieruch.de/react-css-styling

import { connect } from 'react-redux';

//import * as PrenotazioniDelGiornoActionCreators from '../../actions/prenotazioniDelGiornoActionCreators';

class CalendarioViaggi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numDays: [],
            calendar: {}
        };
        this.prenotazioni= [];
        this.viaggiService= new ViaggiService();
        this.getDay= this.getDay.bind(this);
        this.getNumPrenotazioni= this.getNumPrenotazioni.bind(this);
        this.goToDettaglioPrenotazione= this.goToDettaglioPrenotazione.bind(this);
    }

    goToDettaglioPrenotazione(numDay){
        // todo route to dettaglio prenotazione
        if (isNil(this.state.calendar[numDay]) || isEmpty(this.state.calendar[numDay])){
            return;
        }
        const prenotazioni= map(item => item.prenotazione, this.state.calendar[numDay]);

        const date= head(map(item => item.date, this.state.calendar[numDay]));
        const { dispatch } = this.props;
        /*
        let action = PrenotazioniDelGiornoActionCreators.set({prenotazioni: prenotazioni, date: date});
        dispatch(action);
        this.props.history.push('/prenotazioniDelGiorno');*/
    }

    getDay(numDay){
        const day= numDay<10? '0' + numDay : '' + numDay;
        const month= this.state.numMonth<10? '0' + this.state.numMonth : '' + this.state.numMonth;
        return day + '/' + month;
    }

    getNumPrenotazioni(numDay){
        return this.state.calendar[numDay]? this.state.calendar[numDay].length : 0;
    }

    async componentDidMount(){
        const today= new Date();
        const numMonth= today.getMonth()+1;
        const annoMese= today.getFullYear() + '-' + (numMonth<10? '0' + numMonth : numMonth);
        const numDays= new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
        this.viaggi= (await this.viaggiService.get(['VALIDO'],annoMese)).viaggi;

        console.log(this.viaggi);
/*
        const listMapDataPrenotazione= flatten(map((prenotazioneUtente) => {
            return flatten(map(prenotazione => {
                const date= map(item => item, flatten(map(pacchetto => keys(pacchetto.dettaglioPacchetto), prenotazione.pacchetti)));
                return map(data => {
                    return {"date": data, "prenotazione": prenotazioneUtente};
                }, date)} , prenotazioneUtente.dettaglioPrenotazioni));
        }, this.prenotazioni));

        const calendarData= groupBy((entry) => {
            return new Date(Date.parse(entry.date)).getDate();
        })(listMapDataPrenotazione);

        this.setState({
            numDays: map((index) => {}, range(0,numDays)),
            numMonth: numMonth,
            calendar: calendarData
        });*/
        
    }
    //className={style.root}
    render() {
        const self= this;
        return (
            <div className={styles.root}>
                {/*
                <Grid container spacing={1}>
                    {
                        this.state.numDays.map(function(value,index){
                            return (<Grid key={index} item xs={2}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography className={styles.title} color="textSecondary" gutterBottom>
                                                {  self.getDay(index+1) }
                                                </Typography>
                                                
                                                <Button onClick={() => { self.goToDettaglioPrenotazione(index+1); }}>
                                                    { self.getNumPrenotazioni(index+1) }
                                                </Button>
                                                
                                                <Typography className={styles.pos} color="textSecondary">
                                                prenotazioni
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                </Grid>
                            );
                        })
                    }
                </Grid>
                */
                }
            </div>
        )
    }
}
//https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect()(CalendarioViaggi);