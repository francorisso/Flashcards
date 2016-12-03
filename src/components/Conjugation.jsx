import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  load as loadAction,
  subjects,
} from '../ducks/conjugation';
// import classNames from './Conjugation.scss';

const conjugationSubjects = Object.keys(subjects);

class Conjugation extends Component {
  componentDidMount() {
    this.props.load(this.props.srcVerb);
  }

  render() {
    const { verb, conjugation } = this.props;
    return (
      <div>
        <a href="/verbs">Back</a>
        <h2>{verb}</h2>
        <ul>
          {conjugation && conjugation.map((verbConj, idx) =>
            <li><strong>{conjugationSubjects[idx]}</strong>: {verbConj}</li>
          )}
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ conjugation }, ownProps) {
  return {
    srcVerb: ownProps.params.verb,
    verb: conjugation.get('verb'),
    conjugation: conjugation.get('conjugation').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: (srcVerb) => dispatch(loadAction(srcVerb)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conjugation);
