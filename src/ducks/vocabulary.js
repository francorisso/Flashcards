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
  let words = [
    {
      name: 'der Teppich (-)',
      image: 'deutsch_tepich',
    },
    {
      name: 'der Tisch (er)',
      image: 'tisch_fzug1b',
    },
    {
      name: 'der Stuhl (e)',
      image: 'stuhl_wyi23q',
    },
    {
      name: 'das Sofa (e)',
      image: 'sofa_d00ql0',
    },
    {
      name: 'der Sessel (e)',
      image: 'sessel_c93fa8',
    },
    {
      name: 'der Schrank (e)',
      image: 'schrank_yet3s4',
    },
    {
      name: 'die Lampe (e)',
      image: 'lampe_t2awiz',
    },
    {
      name: 'das Bild (e)',
      image: 'bild_w2kl5z',
    },
    {
      name: 'das Bett (e)',
      image: 'bett_d4nbxb',
    },
  ];
  words = words.map((word, idx) => ({
    ...word,
    id: idx,
    image: `http://res.cloudinary.com/inloove/image/upload/w_300,h_300,c_fit/${word.image}.jpg`,
    mode: MODE_HIDDEN,
  }));
  return {
    type: LOAD,
    words,
  };
}
