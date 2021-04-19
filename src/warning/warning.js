import * as React from 'react';
import {SHAKUF_WARNING_ELEMENT_ID} from '../content/content'

const Warning = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        height: '150px',
        backgroundColor: 'yellow',
        zIndex: 4000,
      }}
      id={SHAKUF_WARNING_ELEMENT_ID}
    ></div>
  );
};

export default Warning;
