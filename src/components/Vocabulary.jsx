import React, { Component } from 'react';
import { connect } from 'react-redux';
import Flashcard from './Flashcard';
import * as vocabularyActions from '../ducks/vocabulary';
import classNames from './Vocabulary.scss';

class Vocabulary extends Component {
  componentDidMount() {
    this.props.load();
  }

  render() {
    const { words, switchItemState } = this.props;
    return (<div className={classNames.container}>
      {words && words.toArray().map(card => (
        <Flashcard
          key={card.id}
          onClick={() => {
            switchItemState(card.id);
          }}
          {...card}
        />
      ))}
    </div>);
  }
}

function mapStateToProps({ vocabulary }) {
  return { words: vocabulary.get('words') };
}

function mapDispatchToProps(dispatch) {
  const { load, switchItemState } = vocabularyActions;
  return {
    load: () => dispatch(load()),
    switchItemState: itemId => dispatch(switchItemState(itemId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vocabulary);
