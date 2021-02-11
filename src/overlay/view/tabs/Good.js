import * as React from 'react';
import Linkify from 'react-linkify'
import {Title, Content, MailLink} from '../helpers/commonComponents';
import {HEBREW_LOOKUP, URLS} from "../../../constants";
import decode from "../../../services/decode-html";

export default class Good extends React.Component {

    openLink(url) {
        window.open(url);
    }

    render() {
        const {details} = this.props;
        return <>
            <Title>צל"שים</Title>
            <Content>{details[HEBREW_LOOKUP.TZALASHIM] ?
                details[HEBREW_LOOKUP.TZALASHIM].split('\n')
                    .map((item, i) => {
                        if (item)
                            return <li key={i}><Linkify>{decode(item)}</Linkify></li>;
                    }) :
                <div>
                    <div>{HEBREW_LOOKUP.NOT_FOUND}</div>
                    <MailLink
                        onClick={() => this.openLink(URLS.MAIL)}>contact@shakuf.press</MailLink>
                </div>
            }
            </Content>
        </>
    }
}
