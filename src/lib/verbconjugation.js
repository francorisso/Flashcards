import { verbs, superIrrVerbs } from '../data/verbs';

export const getSubjectName = (subjectNumber, alwaysOne = true) => {
  const subjects = [
    null,
    'ich',
    'du',
    ['er', 'sie', 'es'],
    'wir',
    'ihr',
    ['sie', 'Sie'],
  ];
  const res = subjects[subjectNumber];
  if (alwaysOne && Array.isArray(res)) {
    return res[Math.floor(Math.random() * res.length)];
  }
  return res;
};

export const subjects = [
  null,
  'e',
  'st',
  't',
  'en',
  't',
  'en',
];

export default (srcVerb, person) => {
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

  if (verbObject.superIrregular) {
    return `${verbObject.irregularities[person]}`;
  }
  if (verbObject.irregularities[person]) {
    return `${verbObject.irregularities[person]}${subjects[person]}`;
  }
  return `${verbObject.verbRoot}${subjects[person]}`;
};
