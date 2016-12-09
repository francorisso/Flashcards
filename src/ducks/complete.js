import Immutable from 'immutable';
import { SubmissionError } from 'redux-form';
import completeSentences from '../data/complete-conjugation';
import conjugate, { getSubjectName } from '../lib/verbconjugation';

const NAMESPACE = 'deutsch-lernen/complete';

export const LOAD = `${NAMESPACE}/load`;
export const WTYPE_LITERAL = `${NAMESPACE}/wtype_literal`;
export const WTYPE_VERB = `${NAMESPACE}/wtype_verb`;
export const WTYPE_SUBJECT = `${NAMESPACE}/wtype_subject`;
export const CHECK = `${NAMESPACE}/check`;
export const CHECK_WRONG = `${NAMESPACE}/check_wrong`;
export const CHECK_RIGHT = `${NAMESPACE}/check_right`;

const initState = Immutable.Map({
  items: Immutable.List([]),
});
export default function reducer(state = initState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('items', Immutable.List(action.items));
    case CHECK:
      // TODO add if its correct or wrong
      return state;
    default:
      return state;
  }
}

function isVerb(word) {
  const [definer] = word.split('::');
  return definer && definer.toLowerCase() === 'verb';
}

function isSubject(word) {
  const [definer] = word.split('::');
  return definer && definer.toLowerCase() === 'subject';
}

function createVerbItem(word, id) {
  const [, verb] = word.split('::');
  if (verb) {
    return {
      type: WTYPE_VERB,
      id,
      verb,
      value: null,
    };
  }
  // TODO random verb
  return null;
}

function createSubjectItem(word) {
  // eslint-disable-next-line prefer-const
  let [, verb, subject] = word.split('::');
  if (!subject) {
    subject = Math.ceil(Math.random() * 6);
  }
  return {
    type: WTYPE_SUBJECT,
    verb,
    subject,
    value: getSubjectName(parseInt(subject, 10)),
  };
}

export function load() {
  // TODO: improve efficiency
  // TODO: here I should ask to an API for specific conversation based on some parameter
  // like category (small talk, w-fragen, verbs)
  return (dispatch) => {
    let sentence = completeSentences[Math.floor(Math.random() * completeSentences.length)];
    const items = [];
    while (sentence.length > 0) {
      const idx = sentence.indexOf('<');
      if (idx === -1) {
        items.push({
          type: WTYPE_LITERAL,
          value: sentence,
        });
        sentence = '';
      } else {
        if (idx > 0) {
          items.push({
            type: WTYPE_LITERAL,
            value: sentence.slice(0, idx),
          });
        }
        const closingIdx = sentence.indexOf('>');
        if (closingIdx < idx) {
          throw new Error('WRONG TEXT, check your syntax!');
        }
        const specialWord = sentence.slice(idx + 1, closingIdx);
        let item = null;
        if (isVerb(specialWord)) {
          item = createVerbItem(specialWord, `verb_${idx}`);
          for (let it = items.length - 1; it >= 0; it--) {
            const itemAux = items[it];
            if (itemAux.type === WTYPE_SUBJECT) {
              item.value = conjugate(item.verb, itemAux.subject);
            }
          }
        } else if (isSubject(specialWord)) {
          item = createSubjectItem(specialWord);
          for (let it = items.length - 1; it >= 0; it--) {
            const itemAux = items[it];
            if (itemAux.type === WTYPE_VERB && itemAux.value === null) {
              itemAux.value = conjugate(itemAux.verb, item.subject);
            }
          }
        }
        if (item) {
          items.push(item);
        }
        sentence = sentence.slice(closingIdx + 1);
      }
    }
    dispatch({
      type: LOAD,
      items,
    });
  };
}

export function check(fields, dispatch, props) {
  return new Promise((resolve) => {
    const items = props.items;
    for (const item of items) {
      if (item.type === WTYPE_VERB) {
        if (fields[item.id].toLowerCase() !== item.value.toLowerCase()) {
          dispatch({
            type: CHECK_WRONG,
          });
          throw new SubmissionError({ [item.id]: 'incorrect field', _error: 'Fail' });
        }
      }
    }
    resolve();
  });
}
