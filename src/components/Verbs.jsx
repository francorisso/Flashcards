import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  load as loadAction,
} from '../ducks/verbs';
// import classNames from './Verbs.scss';

class Verbs extends Component {
  componentDidMount() {
    this.props.load();
  }

  render() {
    const { verbs } = this.props;
    return (
      <div>
        <h2>Irregular verbs</h2>
        <ul>
          {verbs.map(verb =>
            <li>
              <a href={`/verb/${verb}`}>{verb[0].toUpperCase()}{verb.slice(1)}</a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ verbs }) {
  return {
    verbs: verbs.get('verbs').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: () => dispatch(loadAction()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Verbs);
