import Immutable from 'immutable';
import conversations from '../data/conversations';
import conjugate from '../lib/verbconjugation';

const NAMESPACE = 'deutsch-lernen/conversation';

export const LOAD = `${NAMESPACE}/load`;
export const WTYPE_LITERAL = `${NAMESPACE}/wtype_literal`;
export const WTYPE_REPLACE = `${NAMESPACE}/wtype_replace`;
export const REMOVE_ITEM = `${NAMESPACE}/remove_item`;
export const CHECK_SELECTION = `${NAMESPACE}/check_selection`;

const initState = Immutable.Map({
  messages: Immutable.List([]),
});
export default function reducer(state = initState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('messages', Immutable.List(action.messages));
    case REMOVE_ITEM: {
      const messages = state
        .get('messages')
        .toJS();
      // TODO OMFG!!! FIX THIS! STOP CODING WHEN YOU'RE TIRED!
      for (let mIdx = 0; mIdx < messages.length; mIdx++) {
        for (let wIdx = 0; wIdx < messages[mIdx].length; wIdx++) {
          if (messages[mIdx][wIdx].type === WTYPE_REPLACE) {
            messages[mIdx][wIdx].type = WTYPE_LITERAL;
            return state.set('messages', Immutable.List(messages));
          }
        }
      }
      return state;
    }
    default:
      return state;
  }
}

function isVerb(word) {
  const [, definer] = word.split('::');
  return definer && definer.toLowerCase() === 'verb';
}

function conjugateVerb(verbStructure) {
  const [verb, , person] = verbStructure.split('::');
  return conjugate(verb, person);
}

export function load() {
  // TODO: improve efficiency
  // TODO: here I should ask to an API for specific conversation based on some parameter
  // like category (small talk, w-fragen, verbs)
  return (dispatch) => {
    const conversation = conversations[Math.floor(Math.random() * conversations.length)];
    const messages = [];
    for (let message of conversation) {
      const result = [];
      while (message.length > 0) {
        const idx = message.indexOf('<');
        if (idx === -1) {
          result.push({
            type: WTYPE_LITERAL,
            text: message,
          });
          message = '';
        } else {
          const closingIdx = message.indexOf('>');
          if (closingIdx < 0) {
            throw new Error('WRONG TEXT!');
          }
          if (idx > 0) {
            result.push({
              type: WTYPE_LITERAL,
              text: message.slice(0, idx),
            });
          }
          let literal = message.slice(idx + 1, closingIdx);
          if (isVerb(literal)) {
            literal = conjugateVerb(literal);
          }
          result.push({
            type: WTYPE_REPLACE,
            text: literal,
          });
          message = message.slice(closingIdx + 1);
        }
      }
      messages.push(result);
    }
    dispatch({
      type: LOAD,
      messages,
    });
  };
}

export function checkSelection(selectedWord) {
  return (dispatch, getState) => {
    dispatch({
      type: CHECK_SELECTION,
      selectedWord,
    });
    const messages = getState().conversation.get('messages').toJS();
    for (const message of messages) {
      for (const word of message) {
        if (word.type === WTYPE_REPLACE) {
          if (word.text === selectedWord.text) {
            dispatch({
              type: REMOVE_ITEM,
            });
          }
          return;
        }
      }
    }
  };
}
