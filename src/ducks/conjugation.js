import Immutable from 'immutable';
import { verbs, superIrrVerbs } from '../data/verbs';

const NAMESPACE = 'deutsch-lernen/conjugation';

export const LOAD = `${NAMESPACE}/load`;

const initState = Immutable.Map({
  verb: '',
  conjugation: Immutable.List([]),
});
export default function reducer(state = initState, action) {
  switch (action.type) {
    case LOAD:
      return state
        .set('verb', action.verb)
        .set('conjugation', Immutable.List(action.conjugation));
    default:
      return state;
  }
}

export const subjects = {
  ich: 'e',
  du: 'st',
  'er/sie/es': 't',
  wir: 'en',
  ihr: 't',
  'sie/Sie': 'en',
};
export function load(srcVerb) {
  let verb = null;
  const verbObject = {
    verb: srcVerb,
    verbRoot: srcVerb.slice(0, -2),
    irregularities: {},
    superIrregular: false,
  };
  if (superIrrVerbs[srcVerb]) {
    verb = srcVerb;
    verbObject.superIrregular = true;
    verbObject.irregularities = superIrrVerbs[srcVerb];
  } else {
    verb = verbs.find(iverb => iverb.replace(/<([a-z]*).*>/, '$1') === srcVerb);
    if (!verb) {
      verb = srcVerb;
    }
    verbObject.verb = `${srcVerb.slice(0, -2)}en`;
    const irrIdx = verb.indexOf('<');
    if (irrIdx !== -1) {
      const closingIdx = verb.indexOf('>');
      const irr = verb.slice(irrIdx + 1, closingIdx).split(',');
      verbObject.verbRoot = `${verb.slice(0, irrIdx)}${irr[0]}${verb.slice(closingIdx + 1, -2)}`;
      for (let i = 1; i < irr.length; i++) {
        const [pos, change] = irr[i].split(':');
        verbObject.irregularities[parseInt(pos, 10)] = `${verb.slice(0, irrIdx)}${change}${verb.slice(closingIdx + 1, -2)}`;
      }
    }
  }
  const conjugation = Object.keys(subjects).map((subj, idx) => {
    if (verbObject.superIrregular) {
      return `${verbObject.irregularities[idx]}`;
    }
    if (verbObject.irregularities[idx + 1]) {
      return `${verbObject.irregularities[idx + 1]}${subjects[subj]}`;
    }
    return `${verbObject.verbRoot}${subjects[subj]}`;
  });
  return {
    type: LOAD,
    verb: verbObject.verb,
    conjugation,
  };
}
