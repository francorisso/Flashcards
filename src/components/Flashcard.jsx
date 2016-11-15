import React from 'react';
import { MODE_SHOWN } from '../ducks/vocabulary';
import classNames from './Flashcard.scss';

const Flashcard = ({ name, image, mode, onClick }) => {
  const [artikel, word, plural] = name.split(' ');
  return (
    <div className="col-xs-4" onClick={onClick}>
      <div className="thumbnail">
        <img src={image} alt="cover" />
        <div className="caption">
          {mode !== MODE_SHOWN && (
            <h3 className={classNames[artikel.toLowerCase()]}>
              {artikel} {word} - {plural}
            </h3>
          )}
          <p>
            Touch to {mode === MODE_SHOWN ? 'hide' : 'show'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
