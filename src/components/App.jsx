import React from 'react';
import { Link } from 'react-router';

function onTouchStart(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function onTouchEnd(e) {
}

function onTouchMove(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }
}

const App = props => (
  <div
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
  >
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">Flashcards</Link>
        </div>
      </div>
    </nav>
    <section className="container">
      {!!props.children && React.cloneElement(props.children, props)}
    </section>
  </div>
);

export default App;
