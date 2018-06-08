import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Test from 'Components/Test';
import License from 'Components/License';

import styles from './App.pcss';

export class App extends Component { // elsint-disable-line
  state = {
    some: 'state',
  }

  render() {
    return (
      <section className={styles.App} dataArg={this.state.some}>
        <h1 className={styles.App__title}>Pages</h1>
        <nav className={styles.App__menu}>
          <Link className={styles.App__link} to="/">home</Link>
          <Link className={styles.App__link} to="/license">licenses</Link>
        </nav>
        <Switch>
          <Route
            exact
            path={'/:locale([a-z]{1,2})/license'}
            component={License}
          />
          <Route
            exact
            path="/license"
            component={License}
          />
          <Route
            exact
            path={'/:locale([a-z]{1,2})'}
            component={Test}
          />
          <Route
            exact
            path="/"
            component={Test}
          />
        </Switch>
      </section>
    );
  }
}

export default App;
