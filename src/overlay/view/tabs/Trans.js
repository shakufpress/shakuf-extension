import * as React from 'react';
import Linkify from 'react-linkify'
import {PieChart} from 'react-easy-chart';
import {Title, Content} from '../helpers/commonComponents';
import {HEBREW_LOOKUP} from "../../../constants";

export default class Bad extends React.Component {

    render() {
        const {details} = this.props;
        const votes = details[HEBREW_LOOKUP.VOTING_ON_TRANS].split(',');
        const dataForGraph = {};
        const dataInGraph = [];
        if (votes) {
            votes.forEach(vote => {
                const _vote = vote.replace(/\s/g, '');
                if (dataForGraph[_vote]) {
                    dataForGraph[_vote].value++;
                } else {
                    dataForGraph[_vote] = {value: 1}
                }
            })
            Object.keys(dataForGraph).forEach(e => {
                dataInGraph.push(Object.assign({key: `${e} (${dataForGraph[e].value})`}, {value: dataForGraph[e].value}));
            });
        }

        return <>
            <Title>{HEBREW_LOOKUP.TABS_TITLES.TRANS_FORTUNE}</Title>
            <Content>{details[HEBREW_LOOKUP.FORTUNE_DETAILS] ?
                details[HEBREW_LOOKUP.FORTUNE_DETAILS].split('\n')
                    .map((item, i) => {
                        if (item)
                            return <li key={i}><Linkify>{item}</Linkify></li>;
                    }) : <li>{HEBREW_LOOKUP.MISSING}</li>}
            </Content>
            <Title>{HEBREW_LOOKUP.TABS_TITLES.VOTING_ON_TRANS}</Title>
            {votes && votes.length > 0 ? <PieChart
                labels
                size={150}
                innerHoleSize={30}
                data={dataInGraph}
            /> : HEBREW_LOOKUP.MISSING}
        </>
    }
}
