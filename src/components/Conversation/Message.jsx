import React from 'react';
import { WTYPE_LITERAL, WTYPE_REPLACE } from '../../ducks/conversation';
import Styles from './Message.scss';

const Message = ({ message }) => (
  <div className={Styles.container}>
    {message.map((word, idx) => {
      switch (word.type) {
        case WTYPE_REPLACE:
          return (<span key={idx} className={Styles.replace} />);
        case WTYPE_LITERAL:
          return (<span key={idx}>{word.text}</span>);
        default:
          return '';
      }
    })}
  </div>
);

export default Message;
