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

import RiepilogoOrdini from '../../components/riepilogo/ordini';
import { connect } from 'react-redux';

class PrenotazioniDelGiorno extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: -1,
            viewRiepilogo: false
        };
        this.checkDettaglioPrenotazioneIsAvailable= this.checkDettaglioPrenotazioneIsAvailable.bind(this);
    }

    checkDettaglioPrenotazioneIsAvailable(data){
        if (isNil(data) || isNil(data.prenotazioniDelGiorno) || isEmpty(data.prenotazioniDelGiorno)){
            this.props.history.push('/calendarioPrenotazioni');
            return false;
        }
        return true;
    }

    shouldComponentUpdate(propsSuccessive, stateSuccessivo){
        return this.checkDettaglioPrenotazioneIsAvailable(propsSuccessive);
    }

    async componentDidMount(){
        this.setState({
            viewRiepilogo: this.checkDettaglioPrenotazioneIsAvailable(this.props)
        });
    }

    //className={style.root}
    render() {
        const self= this;
        return (
            self.state.viewRiepilogo &&
            <RiepilogoOrdini data={self.props.prenotazioniDelGiorno.data} prenotazioni={self.props.prenotazioniDelGiorno.prenotazioni}></RiepilogoOrdini>
        )
    }
}

function mapStateToProps(state) {
    const { prenotazioniDelGiorno } = state
    return { prenotazioniDelGiorno: prenotazioniDelGiorno }
}

export default connect(mapStateToProps)(PrenotazioniDelGiorno);