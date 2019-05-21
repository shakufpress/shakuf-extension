import * as React from 'react';
import Linkify from 'react-linkify'
import {Title, Content} from '../helpers/commonComponents';
import {HEBREW_LOOKUP} from "../../../constants";


export default class Flights extends React.Component {

    render() {
        const {details} = this.props;
        const irrelevant = details[HEBREW_LOOKUP.COMMITTEE_ATTENDANCE].includes(HEBREW_LOOKUP.IRRELEVANT);
        return <>
            <Title>{HEBREW_LOOKUP.TABS_TITLES.FLIGHTS}</Title>
            <Content>{details[HEBREW_LOOKUP.FLIGHTS_DETAILS] ?
                details[HEBREW_LOOKUP.FLIGHTS_DETAILS].split('\n')
                    .map((item, i) => {
                        if (item)
                            return <li key={i}><Linkify>{item}</Linkify></li>;
                    }) : <li>{
                    irrelevant ? details[HEBREW_LOOKUP.COMMITTEE_ATTENDANCE] : HEBREW_LOOKUP.MISSING
                }</li>}</Content>
            <Content>
            </Content>
        </>
    }
}
