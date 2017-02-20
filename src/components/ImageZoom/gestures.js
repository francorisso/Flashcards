function calculateDistance({ x1, y1, x2, y2 }) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function zoomToPoint({ x, y, left, top, width, height, zoomOld, zoomNew }) {
  const [xOffsetPerc, yOffsetPerc] = [
    x / width,
    y / height,
  ];
  return {
    left: Math.max(-width * zoomNew + width, Math.min(0, left - xOffsetPerc * (width * (zoomNew - zoomOld)))),
    top: Math.max(-height * zoomNew + height, Math.min(0, top - yOffsetPerc * (height * (zoomNew - zoomOld)))),
  };
}

function midpoint({ x1, y1, x2, y2 }) {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}

function transitionMovement({ state, leftTo, topTo, leftStep, topStep }) {
  if (
    (leftStep > 0 && state.left < leftTo) ||
    (topStep > 0 && state.top < topTo) ||
    (leftStep < 0 && state.left > leftTo) ||
    (topStep < 0 && state.top > topTo)
  ) {
    const { left, top, zoom } = state;
    let leftNew = left + leftStep;
    if (Math.abs(leftNew - leftTo) < Math.abs(leftStep)) {
      leftNew = leftTo;
    }
    let topNew = top + topStep;
    if (Math.abs(topNew - topTo) < Math.abs(topStep)) {
      topNew = topTo;
    }

    return {
      left: leftNew,
      top: topNew,
    };
  }
  return {
    ...state,
    transition: false,
    transitionFn: null,
  };
}

function transitionZoom({ state, x, y, width, height, zoomTo, zoomStep }) {
  if (
    (zoomStep > 0 && state.zoom < zoomTo) ||
    (zoomStep < 0 && state.zoom > zoomTo)
  ) {
    const { left, top, zoom } = state;
    let zoomNew = zoom + zoomStep;
    if (Math.abs(zoomTo - zoomNew) < Math.abs(zoomStep)) {
      zoomNew = zoomTo;
    }

    const { left: leftNew, top: topNew } = zoomToPoint({
      x,
      y,
      left,
      top,
      width,
      height,
      zoomOld: zoom,
      zoomNew,
    });
    return {
      ...state,
      zoom: zoomNew,
      left: leftNew,
      top: topNew,
      gesture: zoom < zoomNew ? 'zoomIn' : 'zoomOut',
    };
  }
  return {
    ...state,
    transition: false,
    transitionFn: null,
  };
}

export const onDoubleTap = {
  onTouchStart: ({ state, touch1, touch2, lastEvent }) => {
    if (!touch1 || !touch2 || state.zoom != 1) {
      return state;
    }
    if (
      touch2.timestamp - touch1.timestamp < 300 &&
      touch1.touches.length === 1 &&
      touch2.touches.length === 1
    ) {
      lastEvent.preventDefault();
      lastEvent.stopPropagation();
      lastEvent.nativeEvent.stopImmediatePropagation();

      const { zoom, left, top } = state;
      const { height, width } = lastEvent.target.getBoundingClientRect();
      const zoomTo = zoom > 1 ? 1 : 1.5;
      const zoomStep = zoom > 1 ? -0.1 : 0.1;

      return {
        ...state,
        gesture: zoom < zoomTo ? 'zoomIn' : 'zoomOut',
        transitionFn: (currState) => transitionZoom({
          state: currState,
          x: width / 2,
          y: height / 2,
          width,
          height,
          zoomTo,
          zoomStep,
        }),
        transition: true,
      };
    }
    return state;
  }
};

export const onMove = {
  onTouchMove({ state, touch1, touch2, lastEvent }) {
    const { zoom, left, top } = state;
    if (zoom === 1 || !(touch1 && touch2)) {
      return state;
    }

    const { touches: touches1 } = touch1;
    const { touches: touches2 } = touch2;
    if (touches1.length !== 1 || touches2.length !== 1) {
      return state;
    }

    const { height: canvasHeight, width: canvasWidth } = lastEvent.target.getBoundingClientRect();
    const distance = calculateDistance({
      x1: touches2[0].x,
      y1: touches2[0].y,
      x2: touches1[0].x,
      y2: touches1[0].y,
    });

    lastEvent.preventDefault();
    lastEvent.stopPropagation();
    lastEvent.nativeEvent.stopImmediatePropagation();
    const xMove = touches2[0].x - touches1[0].x;
    const yMove = touches2[0].y - touches1[0].y;
    return {
      ...state,
      left: Math.max(-canvasWidth * zoom + canvasWidth, Math.min(0, (left + xMove))),
      top: Math.max(-canvasHeight * zoom + canvasHeight, Math.min(0, (top + yMove))),
      gesture: 'move',
    };

    return state;
  },

  onTouchEnd({ state, touch1, touch2, lastEvent }) {
    if (state.gesture !== 'move') {
      return state;
    }

    const { zoom, left, top } = state;
    if (zoom === 1 || !(touch1 && touch2)) {
      return state;
    }

    const { touches: touches1 } = touch1;
    const { touches: touches2 } = touch2;
    const distance = calculateDistance({
      x1: touches2[0].x,
      y1: touches2[0].y,
      x2: touches1[0].x,
      y2: touches1[0].y,
    });
    if (touches1.length !== 1 || touches2.length !== 1 || distance < 20) {
      return state;
    }
    let leftMovement = (touches2[0].x - touches1[0].x);
    let topMovement = (touches2[0].y - touches1[0].y);
    while (Math.abs(leftMovement) > 20 || Math.abs(topMovement) > 20) {
      leftMovement /= 2;
      topMovement /= 2;
    }
    let leftStep = leftMovement;
    let topStep = topMovement;
    while (Math.abs(leftStep) > 5 || Math.abs(topStep) > 5) {
      leftStep /= 2;
      topStep /= 2;
    }
    return {
      ...state,
      transitionFn: (currState) => transitionMovement({
        state: currState,
        leftTo: left + leftMovement,
        topTo: top + topMovement,
        leftStep: leftStep,
        topStep: topStep,
      }),
      transition: true,
    };

  }
};

export const onPinch = {
  onTouchMove({ state, touch1, touch2, lastEvent }) {
    if (!(touch1 && touch2)) {
      return state;
    }

    const { touches: touches1 } = touch1;
    const { touches: touches2 } = touch2;
    if (touches1.length !== 2 || touches2.length !== 2) {
      return state;
    }

    lastEvent.preventDefault();
    lastEvent.stopPropagation();
    lastEvent.nativeEvent.stopImmediatePropagation();

    const { zoom, left, top } = state;
    const distanceMinToMove = 15;
    const distance1 = calculateDistance({
      x1: touches1[0].x,
      y1: touches1[0].y,
      x2: touches1[1].x,
      y2: touches1[1].y,
    });
    const distance2 = calculateDistance({
      x1: touches2[0].x,
      y1: touches2[0].y,
      x2: touches2[1].x,
      y2: touches2[1].y,
    });
    let zoomNew  = 0;
    if (distance1 < distance2) {
      zoomNew = Math.min(3, zoom + (distance2 / distance1) / 15);
    }
    else {
      zoomNew = Math.max(1, zoom - (distance2 / distance1) / 15);
    }

    const {
      top: elTop,
      left: elLeft,
      height,
      width,
    } = lastEvent.target.getBoundingClientRect();
    const midPoint = midpoint({
      x1: touches2[0].x,
      y1: touches2[0].y,
      x2: touches2[1].x,
      y2: touches2[1].y,
    });
    const [xOffset, yOffset] = [midPoint.x - elLeft, midPoint.y - elTop];
    const { left: leftNew, top: topNew } = zoomToPoint({
      x: xOffset,
      y: yOffset,
      left,
      top,
      width,
      height,
      zoomOld: zoom,
      zoomNew,
    });
    return {
      ...state,
      zoom: zoomNew,
      left: leftNew,
      top: topNew,
      gesture: zoom < zoomNew ? 'zoomIn' : 'zoomOut',
    };
  },

  onTouchEnd({ state, touch1, touch2, lastEvent }) {
    if (state.gesture !== 'zoomOut') {
      return state;
    }
    const { touches: touches1 } = touch1;
    const { touches: touches2 } = touch2;
    if (touches1.length !== 2 || touches2.length !== 2) {
      return state;
    }

    const distance1 = calculateDistance({
      x1: touches1[0].x,
      y1: touches1[0].y,
      x2: touches1[1].x,
      y2: touches1[1].y,
    });
    const distance2 = calculateDistance({
      x1: touches2[0].x,
      y1: touches2[0].y,
      x2: touches2[1].x,
      y2: touches2[1].y,
    });
    if (Math.abs(distance2 - distance1) < 5) {
      return state;
    }

    const midPoint = midpoint({
      x1: touches2[0].x,
      y1: touches2[0].y,
      x2: touches2[1].x,
      y2: touches2[1].y,
    });
    const { height, width, left: elLeft, top: elTop } = lastEvent.target.getBoundingClientRect();
    const [xOffset, yOffset] = [midPoint.x - elLeft, midPoint.y - elTop];
    const zoomStep = (1 - state.zoom) / 10;

    return {
      ...state,
      transitionFn: (currState) => transitionZoom({
        state: currState,
        x: xOffset,
        y: yOffset,
        width,
        height,
        zoomTo: 1,
        zoomStep: zoomStep,
      }),
      transition: true,
    };
  },
};
