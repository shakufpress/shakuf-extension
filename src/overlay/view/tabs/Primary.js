import * as React from 'react';
import styled from 'styled-components';
import {HEBREW_LOOKUP, URLS} from "../../../constants";

const About = styled.span`
font-size: 16px;
margin-top:5px;
`;

const Suggest = styled.span`
margin-top:15px;
font-size: 16px;
color:#15578B;
`;
export default class Primary extends React.Component {

    constructor(props) {
        super(props);
        this.openLink = this.openLink.bind(this);
    }

    openLink() {
        window.open(URLS.HAKS);
    }

    render() {
        const {details} = this.props;
        const isFemale = details[HEBREW_LOOKUP.GENDER] === HEBREW_LOOKUP.FEMALE;
        const address = details[HEBREW_LOOKUP.ADDRESS];

        return <>
            {address &&
            <About>{`${isFemale ? HEBREW_LOOKUP.LIVING_FEMALE : HEBREW_LOOKUP.LIVING_MALE} ${HEBREW_LOOKUP.IN}${address}`}</About>}
            <Suggest>{HEBREW_LOOKUP.MOVE_SUGGESTION}</Suggest>
        </>
    }
}
