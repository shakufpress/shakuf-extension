import * as React from 'react';
import styled from 'styled-components';
import {HEBREW_LOOKUP} from "../../constants";

const MenuWrapper = styled.div`
display:flex;
flex-direction: column;
align-items: center;
margin-left:20px;
background: #B4B6B6;
justify-content:space-evenly;
height:100%;
`;

const MenuItemWrap = styled.div`
  width:100%;
  height: ${270 / 6};
  display:flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0px 10px;
   &:not(:first-child) {
    border-top:1px solid #555555;
    padding-top: 5px;
  }
`;

const MenuItem = styled.i`
    font-size:30px;
  :hover{
  color: rgba(14,58,93,0.76);
  }
  color: ${props => props.active ? '#15578B' : '#000'}
`;

export default class Menu extends React.Component {

    render() {
        const {changeView, view} = this.props;
        return <MenuWrapper>
            <MenuItemWrap>
                <MenuItem title={HEBREW_LOOKUP.GENERAL} className="fas fa-user-circle"
                          onClick={() => changeView('primary')}
                          active={view === 'primary'}></MenuItem>
            </MenuItemWrap>
            <MenuItemWrap>
                <MenuItem title={HEBREW_LOOKUP.TABS_TITLES.WORK_AS_HAK} className="fas fa-briefcase"
                          onClick={() => changeView('work')}
                          active={view === 'work'}></MenuItem>
            </MenuItemWrap>
            <MenuItemWrap>
                <MenuItem title={HEBREW_LOOKUP.TABS_TITLES.FLIGHTS} className="fas fa-plane"
                          onClick={() => changeView('flights')}
                          active={view === 'flights'}></MenuItem>
            </MenuItemWrap>
            <MenuItemWrap>
                <MenuItem title={HEBREW_LOOKUP.TABS_TITLES.TRANS} className="fas fa-balance-scale"
                          onClick={() => changeView('trans')}
                          active={view === 'trans'}></MenuItem>
            </MenuItemWrap>
            <MenuItemWrap>
                <MenuItem title={HEBREW_LOOKUP.TABS_TITLES.TZALASHIM} className="fas fa-award"
                          onClick={() => changeView('good')}
                          active={view === 'good'}></MenuItem>
            </MenuItemWrap>
            <MenuItemWrap>
                <MenuItem title={HEBREW_LOOKUP.TABS_TITLES.TARASHIM} className="fas fa-thumbs-down"
                          onClick={() => changeView('bad')}
                          active={view === 'bad'}></MenuItem>
            </MenuItemWrap>
        </MenuWrapper>
    }
}
