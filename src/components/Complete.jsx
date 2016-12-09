import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classnames from 'classnames';
import Styles from './Complete.scss';
import {
  load as loadAction,
  check as checkAction,
  WTYPE_VERB,
} from '../ducks/complete';

const TextField = ({ input, label, meta: { touched, error } }) => (
  <span>
    <input {...input} className={classnames({ [Styles.invalid]: touched && error })} /> ({label})
  </span>
);

class Complete extends Component {
  componentDidMount() {
    this.props.load();
  }

  componentWillUpdate(nextProps) {
    const { submitSucceeded } = nextProps;
    if (submitSucceeded) {
      setTimeout(() => {
        this.props.reset();
        this.props.load();
      }, 3000);
    }
  }

  render() {
    const {
      items,
      handleSubmit,
      pristine,
      submitting,
      submitFailed,
      submitSucceeded,
    } = this.props;
    return (
      <form onSubmit={handleSubmit(checkAction)}>
        {submitFailed && <div className="alert alert-danger">Wrong!!!</div>}
        {submitSucceeded && <div className="alert alert-success">You're awesome! Loading other...</div>}
        <div className="form-group">
          {items && items.map((item, idx) => {
            switch (item.type) {
              case WTYPE_VERB:
                return (
                  <Field
                    name={item.id}
                    component={TextField}
                    key={item.id}
                    label={item.verb}
                  />
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
        <div className="form-group">
          <button className="btn" type="submit" disabled={pristine || submitting || submitSucceeded}>
            Richtig?
          </button>
        </div>
      </form>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'complete',
    enableReinitialize: false,
  })(Complete)
);
