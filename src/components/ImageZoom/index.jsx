import React, { Component } from 'react';
import { onDoubleTap, onMove, onPinch } from './gestures';

const touchManager = (() => {
  const gestures = [
    onPinch,
    onMove,
    onDoubleTap,
  ];
  let touch1 = null;
  let touch2 = null;
  let lastEvent = null;

  const onGesture = (gestureName, state) => {
    let stateMutated = state;
    for (const gesture of gestures) {
      if (gestureName in gesture && typeof gesture[gestureName] === 'function') {
        stateMutated = gesture[gestureName]({ state: stateMutated, touch1, touch2, lastEvent });
      }
    }
    return stateMutated;
  };

  return {
    add(event) {
      lastEvent = event;
      touch1 = touch2 && { ...touch2 };
      const touches = [];
      if (event.targetTouches) {
        for (let touchIdx = 0; touchIdx < event.targetTouches.length; touchIdx++) {
          touches.push({
            x: event.targetTouches[touchIdx].screenX,
            y: event.targetTouches[touchIdx].screenY,
          });
        }
      } else {
        touches.push({
          x: event.screenX,
          y: event.screenY,
        });
      }

      touch2 = {
        target: event.target,
        touches,
        timestamp: Date.now(),
      };
    },

    onClick(state) { return onGesture('onClick', state); },

    onTouchStart(state) { return onGesture('onTouchStart', state); },

    onTouchMove(state) { return onGesture('onTouchMove', state); },

    onTouchEnd(state) { return onGesture('onTouchEnd', state); },
  };
})();

class ImageZoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      zoom: 1,
      left: 0,
      top: 0,
      transition: false,
      transitionFn: null,
      gesture: null,
    };
  }

  componentDidUpdate() {
    if (this.state.transition) {
      setTimeout(() => {
        if (typeof this.state.transitionFn === 'function') {
          this.setState(this.state.transitionFn(this.state));
        }
      }, 50);
    }
  }

  onClick(e) {
    touchManager.add(e);
    const state = touchManager.onClick(this.state);
    this.setState(state);
  }

  onTouchStart(e) {
    touchManager.add(e);
    const state = touchManager.onTouchStart(this.state);
    this.setState(state);
  }

  onTouchMove(e) {
    touchManager.add(e);
    const state = touchManager.onTouchMove(this.state);
    this.setState(state);
  }

  onTouchEnd() {
    const state = touchManager.onTouchEnd(this.state);
    this.setState(state);
  }

  render() {
    const { image, className } = this.props;
    const { left, top, zoom } = this.state;
    return (
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: `${left}px ${top}px`,
        }}
        onClick={e => this.onClick(e)}
        onTouchStart={e => this.onTouchStart(e)}
        onTouchMove={e => this.onTouchMove(e)}
        onTouchEnd={e => this.onTouchEnd(e)}
        className={className}
      />
    );
  }
}

export default ImageZoom;
