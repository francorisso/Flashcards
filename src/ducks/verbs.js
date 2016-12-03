import Immutable from 'immutable';
import { verbs } from '../data/verbs';

const NAMESPACE = 'deutsch-lernen/verbs';

export const LOAD = `${NAMESPACE}/load`;

const initState = Immutable.Map({
  verbs: Immutable.List([]),
});
export default function reducer(state = initState, action) {
  switch (action.type) {
    case LOAD:
      return state
        .set('verbs', Immutable.List(action.verbs));
    default:
      return state;
  }
}

export function load() {
  return {
    type: LOAD,
    verbs: verbs.map(verb => verb.replace(/<([a-z]*).*>/, '$1')),
  };
}
