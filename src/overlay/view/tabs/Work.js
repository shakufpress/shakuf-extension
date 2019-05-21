import * as React from 'react';
import {Title, Content} from '../helpers/commonComponents';
import Linkify from 'react-linkify'
import {HEBREW_LOOKUP} from "../../../constants";

export default class Work extends React.Component {

    render() {
        const {details} = this.props;
        console.log(details);
        return <>
            <Title>{HEBREW_LOOKUP.TABS_TITLES.WORK}</Title>
            <Content>
                {details[HEBREW_LOOKUP.IN_COMMITTEE] ?
                    details[HEBREW_LOOKUP.COMMITTEE_ATTENDANCE].split('\n')
                        .map((item, i) => {
                            if (item)
                                return <li key={i}><Linkify>{item}</Linkify></li>;
                        }) : <li>{HEBREW_LOOKUP.MISSING}</li>}
            </Content>
            <Title>נוכחות במליאה</Title>
            <Content>
                {details[HEBREW_LOOKUP.CONGRESS_ATTENDANCE] ?
                    details[HEBREW_LOOKUP.CONGRESS_ATTENDANCE].split('\n')
                        .map((item, i) => {
                            if (item)
                                return <li key={i}><Linkify>{item}</Linkify></li>;
                        }) : <li>{HEBREW_LOOKUP.MISSING}</li>}
            </Content>
        </>
    }
}
