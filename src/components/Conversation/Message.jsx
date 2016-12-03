import React from 'react';
import { WTYPE_LITERAL, WTYPE_REPLACE } from '../../ducks/conversation';

const Message = ({ message }) => (<div>
  {message.map((word) => {
    switch (word.type) {
      case WTYPE_REPLACE:
        return (<strong>_____</strong>);
      case WTYPE_LITERAL:
      return (<span>{word.text}</span>);
      default:
      return '';
    }
    ))
  }
};

export default Message;
