import React from 'react';
import Grid from '@material-ui/core/Grid';
import { head, filter, includes, range, map, groupBy, keys, flatten, isNil, isEmpty } from 'ramda';
import styles from '../prenotazioniDelGiorno/index.module.scss';
//import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PrenotazioniService from '../../services/prenotazioni';
// https://www.robinwieruch.de/react-css-styling

import { connect } from 'react-redux';

class PrenotazioniDelGiorno extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.checkDettaglioPrenotazioneIsAvailable= this.checkDettaglioPrenotazioneIsAvailable.bind(this);
    }

    checkDettaglioPrenotazioneIsAvailable(data){
        if (isNil(data) || isNil(data.dettaglioPrenotazioni) || isEmpty(data.dettaglioPrenotazioni)){
            this.props.history.push('/prenotazioni');
            return false;
        }
        return true;
    }

    shouldComponentUpdate(propsSuccessive, stateSuccessivo){
        return this.checkDettaglioPrenotazioneIsAvailable(propsSuccessive);
    }

    async componentDidMount(){
        if (this.checkDettaglioPrenotazioneIsAvailable(this.props)){

            const dettaglioPrenotazioni= this.props.dettaglioPrenotazioni;
            const orariPacchetti= flatten(map(dettaglioPrenotazione => {
                return map(pacchetto => {
                    return {
                        servizio: dettaglioPrenotazione.servizio,
                        pacchetto: pacchetto,
                        fasciaOraria: pacchetto.dettaglioPacchetto[dettaglioPrenotazioni.date]
                    }
                }, filter(pacchetto => includes(dettaglioPrenotazioni.date, keys(pacchetto.dettaglioPacchetto)),dettaglioPrenotazione.pacchetti));
            }, flatten(map(item => item.dettaglioPrenotazioni, dettaglioPrenotazioni.prenotazioni))));

            const groupByIdServizio= groupBy(item => {
                return item.servizio.id;
            }, orariPacchetti);

            const hashServizi= map(item => head(item), groupBy(item => {
                return item.id;
            }, map(item => item.servizio, orariPacchetti)));

            console.log(hashServizi);

            const partitionedData= map(servizioPartitionData => {
                return groupBy(item => item.fasciaOraria, servizioPartitionData);
            }, groupByIdServizio);

            console.log(partitionedData);

            this.hashServizi= hashServizi;

            this.setState({
                partitionedData: partitionedData
            })
        }
    }

    //className={style.root}
    render() {
        const self= this;
        return (
            <div className={styles.root}>
                {
                    keys(self.state.partitionedData).map(function(keyServizio, index) {
                        return (<div key={keyServizio}>
                            <span>{self.hashServizi[keyServizio].descrizione}</span>
                            {
                                keys(self.state.partitionedData[keyServizio]).map(function(valueOrario, index) {
                                    return (<div key={valueOrario}>{valueOrario} : {self.state.partitionedData[keyServizio][valueOrario].length} </div>)
                                })
                            }
                            </div>)
                    })
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { dettaglioPrenotazioni } = state
    return { dettaglioPrenotazioni: dettaglioPrenotazioni }
}

export default connect(mapStateToProps)(PrenotazioniDelGiorno);