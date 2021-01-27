import * as React from 'react';
import styled from 'styled-components';
import Menu from './Menu';
import Primary from './tabs/Primary';
import Work from './tabs/Work';
import Flights from './tabs/Flights';
import Trans from './tabs/Trans';
import Good from './tabs/Good';
import Bad from './tabs/Bad';
import {HEBREW_LOOKUP, OVERLAY_MESSAGING, URLS, VIEWS} from '../../constants';
import decode from "../../services/decode-html";

const Box = styled.div`
  font-family: 'Heebo', sans-serif !important;
  width:650px !important;
  height:270px !important;
  line-height: normal  !important;
  flex-direction: row !important;
  display:flex !important;
  background: #E0E3E3 !important;
  opacity:0.97 !important;
  justify-content: space-between !important;
  direction: rtl !important;
  text-align: right !important;
  animation: fadein 1s;
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
`;

const Loading = styled.div`
display:flex;
flex-direction:column;
width:100%;
height:100%;
justify-content: center;
align-items: center;
`;

const LoadingTitle = styled.div`
font-size:24px;
text-align: center;
`;

const LoaderWraper = styled.div`
  height:35px;
`;

const Tab = styled.div`
  width:365px;
  padding-top: 25px;
`;

const Name = styled.div`
color:#15578B;
font-size: 24px;
`;

const Party = styled.div`
font-size: 18px;
`;

const View = styled.div`
    display:flex;
    flex-direction: column;
    margin-top:5px;
    height: 145px;
    padding-left: 5px;
    overflow: auto;
     ::-webkit-scrollbar {
        width: 7px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #88888882;
        border-radius: 5px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #999;
    }
`;

const SideWrapper = styled.div`
display:flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 165px;
margin-right:10px;
`;

const HKImage = styled.div`
border-radius:75px;
border: 3px solid rgba(56, 181, 173);
align-self: center;
  background-image: URL('${prop => prop.src}');
    width: 135px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 135px;
`;

const Logo = styled.img`
    width: 155px;
    margin-top: 10px;
`;

const Link = styled.span`
margin-top:5px;
text-decoration: underline;
cursor: pointer;
width: fit-content;
font-weight:600;
font-size: 14px;
`;


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {details: null, ready: false, view: VIEWS.PRIMARY};
        this.changeView = this.changeView.bind(this);
        this.getView = this.getView.bind(this);
        this.loadAssests = this.loadAssests.bind(this);
        this.myRef = React.createRef();
    }

    async loadAssests() {
        const {details} = this.state;
        await Promise.all(
            [`${URLS.IMAGE_PREFIX}${details.imgSrc}`].map(
                (url) => {
                    return new Promise(resolve => {
                        var img = new Image();
                        img.src = url;
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                }));
        this.setState({ready: true});
    }

    changeView(view) {
        this.setState({view});
    }

    getView() {
        const {view, details} = this.state;
        switch (view) {
            case VIEWS.PRIMARY:
                return <Primary details={details}/>;
            case VIEWS.WORK:
                return <Work details={details}/>;
            case VIEWS.TRANS:
                return <Trans details={details}/>;
            case VIEWS.FLIGHTS:
                return <Flights details={details}/>;
            case VIEWS.GOOD:
                return <Good details={details}/>;
            case VIEWS.BAD:
                return <Bad details={details}/>;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {ready, name} = this.state;
        const {host} = this.props;
        if (name && prevState.name !== name) {
            chrome.runtime.sendMessage({
                action: 'gaEvent',
                ga: {category: 'View', action: 'Hovered', label: name, customDimensions: {cd2: host}}
            });
            chrome.runtime.sendMessage({action: 'getName', name: name}, (response) => {
                Object.keys(response).forEach(key => {
                    response[key] = response[key].replace(/\n\s*\n/g, '\n').replace(/&quot;/g, '\"');
                });
                this.setState({details: response});
                this.loadAssests();
            });
        } else if (ready && prevState.reday !== ready) {
            const node = this.myRef.current;
            if (node) {
                Array.from(node.getElementsByTagName('a')).forEach(e => {
                    if (!e.getAttribute('no_short')) {
                        e.target = '_blank';
                        e.innerText = `[${HEBREW_LOOKUP.ORIGIN}]`;
                    }
                });
            }
        }
    }

    componentDidMount() {
        const {host} = this.props;
        chrome.runtime.sendMessage({
            action: 'gaEvent',
            ga: {category: 'View', action: 'Loaded', customDimensions: {cd2: host}}
        });
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            const {name} = this.state;
            switch (message.action) {
                case OVERLAY_MESSAGING.SHOW_NAME:
                    if (message.name !== name) {
                        this.setState({details: null, name: message.name, ready: false, view: 'primary'});
                    }
                    sendResponse();
                    break;
                case OVERLAY_MESSAGING.HIDE_NAME:
                    if (name && name === message.name) {
                        this.setState({details: null, name: null, ready: false});
                    }
                    sendResponse();
                    break;
            }
            return true;
        });
    }

    render() {
        const {details, ready, view} = this.state;
        return <Box ref={this.myRef}>
            {
                (!details || !ready) ?
                    <Loading>
                        <LoadingTitle>
                            {HEBREW_LOOKUP.LOADING}
                        </LoadingTitle>
                        <LoaderWraper>
                            <img src={chrome.runtime.getURL('images/loader.gif')}/> :
                        </LoaderWraper>
                    </Loading> :
                    <>
                        <Menu view={view} changeView={this.changeView}/>
                        <Tab>
                            <Name> {decode(details[HEBREW_LOOKUP.NAME])}</Name>
                            <Party>{decode(details[HEBREW_LOOKUP.PARTY])}</Party>
                            <View>
                                {this.getView()}
                            </View>
                        </Tab>
                        <SideWrapper>
                            <HKImage src={`${URLS.IMAGE_PREFIX}${details.imgSrc}`}/>
                            <a href={URLS.JOIN} target='_blank' no_short='true'>
                                <Logo src={chrome.runtime.getURL('images/logo.png')}/>
                            </a>
                            <Link title={HEBREW_LOOKUP.ENTER_FOR_INFO}
                                  onClick={() => window.open(URLS.HAKS)}>{HEBREW_LOOKUP.MAPS}</Link>
                        </SideWrapper>
                    </>
            }
        </Box>;
    }
}
