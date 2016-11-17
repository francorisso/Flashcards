import React, { Component } from 'react';
import cn from 'classnames';
import classNames from './Filters.scss';

const genres = [
  {
    genre: 'male',
    icon: 'mars',
  },
  {
    genre: 'female',
    icon: 'venus',
  },
  {
    genre: 'neutral',
    icon: 'neuter',
  },
];

const plurals = ['-', '-¨', 'e', 'en', 'er', 'n', 's', '-¨e', '-¨er'];
class Filters extends Component {
  constructor() {
    super();
    this.pluralMenuToggle = this.pluralMenuToggle.bind(this);
  }

  state = {
    pluralOpen: false,
  };

  componentDidMount() {
    if (window) {
      window.addEventListener('click', () => {
        this.setState({
          pluralOpen: false,
        });
      })
    }
  }

  pluralMenuToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      pluralOpen: !this.state.pluralOpen,
    });
  }

  render() {
    const {
      shown = true,
      onFilter,
      filters: {
        genre: activeGenre,
        plural: activePlural,
      },
    } = this.props;
    const { pluralOpen } = this.state;

    return (
      <div className={classNames.container}>
        {shown && (
          <div className={classNames.filters}>
            <div className={classNames.row}>
              <div className="btn-group">
                {genres.map(({ genre, icon }) =>
                  <button
                    key={genre}
                    type="button"
                    className={cn('btn', 'btn-default', 'btn-lg', { active: genre === activeGenre })}
                    onClick={() => onFilter('genre', genre)}
                  >
                    <i className={`fa fa-${icon} ${classNames[genre]}`} />
                  </button>
                )}
              </div>
              {!!activeGenre &&
                <button
                  type="button"
                  className={cn('btn', 'btn-link')}
                  onClick={() => onFilter('genre', false)}
                >
                  Clear
                </button>
              }
            </div>
            <div className={cn(classNames.row, 'dropdown', { open: pluralOpen })}>
              <button
                type="button"
                className="btn btn-default btn-lg"
                onClick={this.pluralMenuToggle}
              >
                Plural {!!activePlural && `(${activePlural})`}
                &nbsp; <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className={classNames.menuItem}
                    onClick={() => onFilter('plural', null)}
                  >
                    Show All
                  </a>
                </li>
                {plurals.map((plural, idx) =>
                  <li
                    key={idx}
                    className={cn(
                      classNames.menuItem,
                      { active: activePlural === plural }
                    )}
                  >
                    <a onClick={() => onFilter('plural', plural)}>{plural}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Filters;
