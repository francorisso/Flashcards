import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  load as loadAction,
  check as checkAction,
  WTYPE_VERB,
  WTYPE_SUBJECT,
} from '../ducks/complete';

class Complete extends Component {
  constructor() {
    super();
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    this.props.load();
  }

  onBlur(e) {
    const { check } = this.props;
    const value = e.target.value;
    check(value);
  }

  render() {
    const { items } = this.props;
    return (
      <div>
        {items && items.map((item, idx) => {
          switch (item.type) {
            case WTYPE_VERB:
              return (
                <span key={idx}>
                  <input
                    type="text"
                    onBlur={this.onBlur}
                    placeholder={item.value}
                  />
                  ( {item.verb} )
                </span>
              );
            default:
              return (<span key={idx}>
                {idx === 0 ?
                  `${item.value[0].toUpperCase()}${item.value.slice(1)}` :
                  item.value
                }
              </span>);
          }
        })}
      </div>
    );
  }
}

function mapStateToProps({ complete }) {
  return {
    items: complete.get('items').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: () => dispatch(loadAction()),
    check: word => dispatch(checkAction(word)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Complete);
