import React from 'react';
import { MODE_SHOWN } from '../ducks/vocabulary';
import classNames from './Flashcard.scss';

const Flashcard = ({ name, image, mode, onClick }) => {
  const [artikel, word, plural] = name.split(' ');
  return (
    <div className={`thumbnail ${classNames.container}`} onClick={onClick}>
      <div className={classNames.img_container}>
        <img src={image} alt="cover" />
      </div>
      <div className="caption">
        {mode === MODE_SHOWN && (
          <h3 className={`${classNames[artikel.toLowerCase()]} text-center`}>
            {artikel} {word} {plural}
          </h3>
        )}
        <p className={classNames.touch}>
          <i className="fa fa-hand-pointer-o" /> Touch to {mode === MODE_SHOWN ? 'hide' : 'show'}
        </p>
      </div>
    </div>
  );
};

export default Flashcard;
