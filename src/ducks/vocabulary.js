import Immutable from 'immutable';

const NAMESPACE = 'deutsch-flashcards/vocabulary';

export const MODE_HIDDEN = `${NAMESPACE}/mode_hidden`;
export const MODE_SHOWN = `${NAMESPACE}/mode_shown`;

export const LOAD = `${NAMESPACE}/load`;
export const SWITCH_MODE = `${NAMESPACE}/switch_mode`;

const initState = Immutable.Map({
  words: Immutable.List([]),
});
export default function reducer(state = initState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('words', Immutable.List(action.words));
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

export function load() {
  const words = [
    {
      id: 1,
      name: 'der Drucker (-)',
      image: 'http://st2.depositphotos.com/1010652/5980/v/450/depositphotos_59806657-Cartoon-printer-cartoon.jpg',
      mode: MODE_HIDDEN,
    },
    {
      id: 2,
      name: 'das Bild (er)',
      image: 'http://www.cuadrostock.com/media/fotos2/pro_63122_1.jpg',
      mode: MODE_HIDDEN,
    }];
  return {
    type: LOAD,
    words,
  };
}
