import Immutable from 'immutable';
import { words } from '../data/vocabulary';

const NAMESPACE = 'deutsch-flashcards/vocabulary';

export const MODE_HIDDEN = `${NAMESPACE}/mode_hidden`;
export const MODE_SHOWN = `${NAMESPACE}/mode_shown`;
export const TOUCHES_SUM = `${NAMESPACE}/TOUCHES_SUM`;
export const TOUCHES_RESET = `${NAMESPACE}/TOUCHES_RESET`;

export const LOAD = `${NAMESPACE}/load`;
export const SWITCH_MODE = `${NAMESPACE}/switch_mode`;

export const FILTER = `${NAMESPACE}/filter`;

const initState = Immutable.Map({
  words: Immutable.List([]),
  filters: Immutable.Map({}),
  touches: 0,
});
export default function reducer(state = initState, action) {
  switch (action.type) {
    case TOUCHES_SUM:
      return state.set('touches', state.get('touches') + action.value);
    case TOUCHES_RESET:
      return state.set('touches', 0);
    case LOAD:
      return state.set('words', Immutable.List(action.words));
    case FILTER: {
      // TODO FIX BRUTEFORCE
      const filters = state.get('filters');
      return state
        .set('filters', filters.set(action.label, action.value));
    }
    case SWITCH_MODE: {
      // TODO FIX BRUTEFORCE
      const { itemId } = action;
      return state.set('words', Immutable.List(state.get('words').toArray().map((item) => {
        if (item.id === itemId) {
          const mode = item.mode === MODE_HIDDEN ? MODE_SHOWN : MODE_HIDDEN;
          return Object.assign({ ...item }, { mode });
        }
        return item;
      })));
    }
    default:
      return state;
  }
}

export function switchItemState(itemId) {
  return {
    type: SWITCH_MODE,
    itemId,
  };
}

export const GENRE_MALE = 'male';
export const GENRE_FEMALE = 'female';
export const GENRE_NEUTRAL = 'neutral';
const artikelToGenre = {
  die: GENRE_FEMALE,
  der: GENRE_MALE,
  das: GENRE_NEUTRAL,
};
export function load() {
  return (dispatch, getState) => {
    const filters = getState().vocabulary.get('filters').toJS();
    const result = words
      .map((word, idx) => ({
        ...word,
        id: idx,
        image: `http://res.cloudinary.com/inloove/image/upload/w_300,h_300,c_fit/${word.image}.jpg`,
        mode: MODE_HIDDEN,
      }))
      .filter(({ name }) => {
        // TODO so much improvement here
        const [art, , plural] = name.split(' ');
        if (filters.plural && `(${filters.plural})` !== plural) {
          return false;
        }
        if (filters.genre && filters.genre !== artikelToGenre[art]) {
          return false;
        }
        return true;
      });
    dispatch({
      type: LOAD,
      words: result,
    });
  };
}

export function filter(label, value) {
  return (dispatch) => {
    dispatch({
      type: FILTER,
      label,
      value,
    });
    dispatch(load());
  };
}

export function touchSum(value) {
  return {
    type: TOUCHES_SUM,
    value,
  };
}

export function touchReset() {
  return {
    type: TOUCHES_RESET,
  };
}
