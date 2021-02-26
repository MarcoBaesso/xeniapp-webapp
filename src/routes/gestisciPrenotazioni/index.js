import React from 'react';
import Grid from '@material-ui/core/Grid';
import { range, map, groupBy, keys, flatten, head, isNil, isEmpty } from 'ramda';
import styles from '../gestisciPrenotazioni/index.module.scss';
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

import * as DettaglioPrenotazioniActionCreators from '../../actions/dettaglioPrenotazioniActionCreators';

class GestisciPrenotazioni extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    async componentDidMount(){
        
        
    }
    //className={style.root}
    render() {
        const self= this;
        return (
            <div className={styles.root}>
                
            </div>
        )
    }
}
//https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect()(GestisciPrenotazioni);