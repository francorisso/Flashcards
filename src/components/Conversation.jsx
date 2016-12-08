import React, { Component } from 'react';
import { connect } from 'react-redux';
import shuffleArray from '../lib/shuffle';
import {
  load as loadAction,
  checkSelection as checkSelectionAction,
  WTYPE_REPLACE,
} from '../ducks/conversation';
import Message from './Conversation/Message';
import classNames from './Conversation.scss';

class Conversation extends Component {
  componentDidMount() {
    this.props.load();
  }

  displayReplaceWords(message) {
    const { checkSelection } = this.props;
    const words = shuffleArray(message);
    return words.map((word, idx) => {
      switch (word.type) {
        case WTYPE_REPLACE:
          return (
            <span
              key={idx}
              className={classNames.word}
              onClick={() => checkSelection(word)}
            >
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
            <Message message={message} key={idx} />
          ))}
          {messages && messages.map((message, idx) => (
            <div key={idx}>{this.displayReplaceWords(message)}</div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ conversation }) {
  return {
    messages: conversation.get('messages').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: () => dispatch(loadAction()),
    checkSelection: word => dispatch(checkSelectionAction(word)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
