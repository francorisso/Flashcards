import React from 'react';
import { Link } from 'react-router';

const App = props => (
  <div>
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
