import React, { Component } from 'react';
import { MODE_SHOWN } from '../ducks/vocabulary';
import ImageZoom from './ImageZoom';
import classNames from './Flashcard.scss';

class Flashcard extends Component {
  render() {
    const { name, image, mode, onClick } = this.props;
    const [artikel, word, plural] = name.split(' ');
    return (
      <div
        className={`thumbnail ${classNames.container}`}
        onClick={onClick}
      >
        <ImageZoom
          className={classNames.img_container}
          image={image}
        />
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
  }
}

export default Flashcard;
