import React, { Component } from 'react';
import { connect } from 'react-redux';
import shuffleArray from '../lib/shuffle';
import {
  load as loadAction,
  checkSelection as checkSelectionAction,
  WTYPE_LITERAL,
  WTYPE_REPLACE,
} from '../ducks/conversations';
import classNames from './Conversations.scss';

class Conversations extends Component {
  componentDidMount() {
    this.props.load();
  }

  displayMessage(message) {
    return message.map((word) => {
      switch (word.type) {
        case WTYPE_REPLACE:
          return (<strong>_____</strong>);
        case WTYPE_LITERAL:
          return (<span>{word.text}</span>);
        default:
          return '';
      }
    });
  }

  displayReplaceWords(message) {
    const { checkSelection } = this.props;
    const words = shuffleArray(message);
    return words.map((word) => {
      switch (word.type) {
        case WTYPE_REPLACE:
          return (
            <span className={classNames.word} onClick={() => checkSelection(word)}>
              {word.text}
            </span>);
        default:
          return '';
      }
    });
  }

  render() {
    const { messages } = this.props;
    return (
      <div className={classNames.container}>
        <div className={classNames.words}>
          {messages && messages.map((message, idx) => (
            <div key={idx}>{this.displayMessage(message)}</div>
          ))}
          {messages && messages.map((message, idx) => (
            <div key={idx}>{this.displayReplaceWords(message)}</div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ conversations }) {
  return {
    messages: conversations.get('messages').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: () => dispatch(loadAction()),
    checkSelection: word => dispatch(checkSelectionAction(word)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
