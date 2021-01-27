import * as React from 'react';
import Linkify from 'react-linkify'
import {Title, Content, MailLink} from '../helpers/commonComponents';
import {HEBREW_LOOKUP, URLS} from "../../../constants";
import decode from "../../../services/decode-html";


export default class Bad extends React.Component {

    openLink(url) {
        window.open(url);
    }

    render() {
        const {details} = this.props;
        return <>
            <Title>{HEBREW_LOOKUP.TABS_TITLES.TARASHIM}</Title>
            <Content>{details[HEBREW_LOOKUP.TARASHIM] ?
                details[HEBREW_LOOKUP.TARASHIM].split('\n')
                    .map((item, i) => {
                        if (item)
                            return <li key={i}><Linkify>{decode(item)}</Linkify></li>;
                    }) : <div>
                    <div>{HEBREW_LOOKUP.NOT_FOUND}</div>
                    <MailLink
                        onClick={() => this.openLink(URLS.MAIL)}>contact@shakuf.press</MailLink>
                </div>}
            </Content>
        </>
    }
}
