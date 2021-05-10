import * as React from 'react';
import { SHAKUF_WARNING_ELEMENT_ID } from '../content/content';
import { COLORS } from '../constants/index';

const Warning = ({ ruleDescription }) => {
  const [display, setDisplay] = React.useState(true);

  return (
    <div
      style={{
        height: '150px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'stretch',
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        visibility: display ? 'visible' : 'hidden',
      }}
      id={SHAKUF_WARNING_ELEMENT_ID}
    >
      <div
        style={{
          flex: 0.2,
          backgroundColor: COLORS.light_yellow,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 30,
            width: 30,
            margin: 5,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setDisplay(false)}
        >
          <img
            style={{ width: 13, cursor: 'pointer' }}
            src={chrome.runtime.getURL('../images/x.png')}
          />
        </button>
        <button
          style={{
            color: 'white',
            backgroundColor: COLORS.button_red,
            display: 'flex',
            alignItems: 'center',
            border: 'none',
            borderRadius: 10,
          }}
          onClick={() => window.history.back()}
        >
          <img
            style={{ width: 30, height: 30, margin: 10, cursor: 'pointer' }}
            src={chrome.runtime.getURL('../images/left-arrow.png')}
          />
          <span>צא מהכתבה</span>
        </button>
      </div>
      <div
        style={{
          flex: 0.8,
          backgroundColor: COLORS.yellow,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            flex: 1,
            justifyContent: 'space-evenly',
          }}
        >
          <span style={{ fontSize: 30, color: COLORS.button_red }}>זהירות</span>
          <div>
            <span style={{ fontSize: 20 }}>
              נראה שהכתבה הזו היא בעצם פרסומת ולא תוכן עיתונאי.
            </span>
            <a href='https://www.the7eye.org.il/414216' target='_blank'>
              להסבר
            </a>
          </div>
          <span>
            {ruleDescription || 'אזהרה זו מוצגת מכיוון שהתקנת את התוסף'}
          </span>
        </div>
        <img
          style={{ width: 100, height: 100, margin: 20, cursor: 'pointer' }}
          src={chrome.runtime.getURL('../images/warning.png')}
        />
      </div>
    </div>
  );
};

export default Warning;
