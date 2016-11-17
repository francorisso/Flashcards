import React, { Component } from 'react';
import { connect } from 'react-redux';
import Flashcard from './Flashcard';
import Filters from './Vocabulary/Filters';
import * as vocabularyActions from '../ducks/vocabulary';
import classNames from './Vocabulary.scss';

class Vocabulary extends Component {
  componentDidMount() {
    this.props.load();
  }

  render() {
    const { words, filters, switchItemState, filter } = this.props;
    return (
      <div className={classNames.container}>
        <Filters onFilter={filter} filters={filters} />
        <div className={classNames.words}>
          {words && words.toArray().map(card => (
            <Flashcard
              key={card.id}
              onClick={() => {
                switchItemState(card.id);
              }}
              {...card}
            />
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ vocabulary }) {
  return {
    words: vocabulary.get('words'),
    filters: vocabulary.get('filters').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  const { load, switchItemState, filter } = vocabularyActions;
  return {
    load: () => dispatch(load()),
    switchItemState: itemId => dispatch(switchItemState(itemId)),
    filter: (label, value) => dispatch(filter(label, value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vocabulary);
