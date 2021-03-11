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

import RiepilogoViaggiValidi from '../../components/riepilogo/viaggi/valido';
import { connect } from 'react-redux';
import RiepilogoViaggiInLavorazione from '../../components/riepilogo/viaggi/inLavorazione';

class ViaggiDelGiorno extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.checkViaggiDelGiornoIsAvailable= this.checkViaggiDelGiornoIsAvailable.bind(this);
        this.handleUpdateAll= this.handleUpdateAll.bind(this);
    }

    checkViaggiDelGiornoIsAvailable(state){
        if (isNil(state) || isNil(state.viaggiDelGiorno) || isEmpty(state.viaggiDelGiorno)){
            this.props.history.push('/calendarioViaggi');
            return false;
        }
        return true;
    }

     handleUpdateAll(){
        this.props.history.push('/calendarioViaggi');        
    }

    shouldComponentUpdate(propsSuccessive, stateSuccessivo){
        return this.checkViaggiDelGiornoIsAvailable(propsSuccessive);
    }

    //className={style.root}
    render() {
        const self= this;
        return (
            self.props.viaggiDelGiorno.stato=='VALIDO'?
            <RiepilogoViaggiValidi data={self.props.viaggiDelGiorno.data} viaggi={self.props.viaggiDelGiorno.viaggi}></RiepilogoViaggiValidi>
            : (self.props.viaggiDelGiorno.stato=='IN_LAVORAZIONE'?
            <RiepilogoViaggiInLavorazione data={self.props.viaggiDelGiorno.data} viaggi={self.props.viaggiDelGiorno.viaggi} handleUpdateAll={() => this.handleUpdateAll()}></RiepilogoViaggiInLavorazione> : <div></div>)

        )
    }
}

function mapStateToProps(state) {
    const { viaggiDelGiorno } = state
    return { viaggiDelGiorno: viaggiDelGiorno }
}

export default connect(mapStateToProps)(ViaggiDelGiorno);