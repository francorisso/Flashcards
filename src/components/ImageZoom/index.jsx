import React, { Component } from 'react';

function calculateDistance({ x1, y1, x2, y2 }) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function midpoint({ x1, y1, x2, y2 }) {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}


const touchManager = (() => {
  const gestures = [
    {
      name: 'tap',
      onTouchMove: ({ state, touch1, touch2 }) => {
        if (
          touch2.timestamp - touch1.timestamp > 500 &&
          touch2.touches.length === 1
        ) {
          console.log('tap');
        }
        return state;
      }
    }
  ];

  let touch1 = null;
  let touch2 = null;

  return {
    add(event, timestamp) {
      [touch1, touch2] = [touch2, { event, timestamp }];
    },

    onTouchMove(state) {
      let stateMutated = state;
      for (const gesture in gestures) {
        stateMutated = gesture.onTouchMove({ state: stateMutated, touch1, touch2 });
      }
      return stateMutated;
    },
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
    };
  }

  onTouchStart(e) {
    const { top, left } = e.target.getBoundingClientRect();
    const xOffset = -this.state.left + e.targetTouches[0].screenX - left;
    const yOffset = -this.state.top + e.targetTouches[0].screenY - top;
    this.setState({
      distance: 0,
      xOffset,
      yOffset
    });

    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }

  onTouchEnd(e) {
    this.setState({
      scrolling: false,
    });
  }

  onTouchMove(e) {
    if (e.touches.length===1 && this.state.zoom===1) {
      console.log('swipe');
      return;
    }
    if (e.touches.length===1 && this.state.zoom!==1) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      const { top, left } = e.target.getBoundingClientRect();
      const xOffset = e.targetTouches[0].screenX - left;
      const yOffset = e.targetTouches[0].screenY - top;
      this.setState({
        left: Math.min(0, (this.state.xOffset - xOffset) * -1),
        top: Math.min(0, (this.state.yOffset - yOffset) * -1)
      });
      return;
    }
    if (e.touches.length<2 || e.targetTouches.length<2) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const distance = this.state.distance;
    const newDistance = calculateDistance({
      x1: e.targetTouches[0].screenX,
      y1: e.targetTouches[0].screenY,
      x2: e.targetTouches[1].screenX,
      y2: e.targetTouches[1].screenY,
    });

    if (!distance) {
      this.setState({
        distance: newDistance,
      });
      return;
    }

    const { zoom } = this.state;
    let newZoom  = 0;
    if (distance < newDistance) {
      newZoom = Math.min(3, zoom + (newDistance / distance) / 10);
      this.setState({
        zoom: newZoom,
        distance: newDistance,
      });
    }
    else {
      newZoom = Math.max(1, zoom - (newDistance / distance) / 10);
      this.setState({
        zoom: newZoom,
        distance: newDistance,
      });
    }

    const [ canvasWidth, canvasHeight ] = [ 300, 300 ];
    const { top, left } = e.target.getBoundingClientRect();
    const midPoint = midpoint({
      x1: e.targetTouches[0].screenX,
      y1: e.targetTouches[0].screenY,
      x2: e.targetTouches[1].screenX,
      y2: e.targetTouches[1].screenY,
    });
    const [xOffset, yOffset] = [midPoint.x - left, midPoint.y - top];
    const [xOffsetPerc, yOffsetPerc] = [(xOffset / canvasWidth), (yOffset / canvasHeight)];
    const [ newLeft, newTop ] = [
      -xOffsetPerc * (canvasWidth * newZoom) + xOffset,
      -yOffsetPerc * (canvasHeight * newZoom) + yOffset
    ];
    this.setState({
      left: newLeft,
      top: newTop
    });
  }

  render () {
    const { image} = this.props;
    const { left, top, zoom } = this.state;
    return (
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: `${left}px ${top}px`,
        }}
        onTouchStart={e => this.onTouchStart(e)}
        onTouchMove={e => this.onTouchMove(e)}
        onTouchEnd={e => this.onTouchEnd(e)}
      />
    );
  }
}

export default ImageZoom;
