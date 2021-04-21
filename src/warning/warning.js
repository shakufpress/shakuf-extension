import * as React from 'react';
import { SHAKUF_WARNING_ELEMENT_ID } from '../content/content';
// import { ReactComponent as XSvg } from '../images/x.svg';
// import { ReactComponent as WarningSvg } from '../images/warning.svg';
import {COLORS} from '../constants/index'

const Warning = () => {
  return (
    <div
      style={{
        height: '150px',
        zIndex: 4000,
        display: 'flex',
        alignItems: 'stretch',
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
      }}
      id={SHAKUF_WARNING_ELEMENT_ID}
    >
      <div
        style={{
          flex: 0.2,
          backgroundColor: 'red',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <object
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 30,
            width: 30,
            margin: 5
          }}
          type='image/svg+xml'
          data={chrome.runtime.getURL('../images/x.svg')}
          width='50'
          height='50'
        ></object>
        <button style={{
          color: 'white',
          backgroundColor: COLORS.button_red
        }}>
        <object
          // style={{
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   height: 30,
          //   width: 30,
          //   margin: 5
          // }}
          type='image/svg+xml'
          data={chrome.runtime.getURL('../images/arrow-left.svg')}
          width='50'
          height='50'
        ></object>
          צא מהכתבה</button>
        <button>אני רוצה להשאר בכתבה</button>
      </div>
      <div
        style={{
          flex: 0.8,
          backgroundColor: 'yellow',
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDiretion: 'column',
            alignItems: 'flex-end',
            flex: 1,
          }}
        >
          <span >זהירות</span>
          <span>נראה שהכתבה הזו היא בעצם פרסומת ולא תוכן עיתונאי.</span>
          <a href=''>להסבר</a>
          <span>אזהרה זו מוצגת מכיוון שהתקנת את התוסף</span>
        </div>
        <object
          style={{
            width: 100,
            height: 100,
            margin: 20
          }}
          type='image/svg+xml'
          data={chrome.runtime.getURL('../images/warning.svg')}
        ></object>
        {/* <WarningSvg style={{}} /> */}
      </div>
    </div>
  );
};

export default Warning;
