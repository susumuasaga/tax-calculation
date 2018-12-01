import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Locations } from '../containers/Locations';
import { configureStore } from '../configureStore';
import { Provider } from 'react-redux';
import { Transactions } from '../containers/Transactions';

const store = configureStore();

/**
 * Main App
 */
export function App() {
  return (
    <Provider {...{ store }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={redirectTo('/locations')} />
          <Route path="/locations" component={Locations} />
          <Route path="/transactions" component={Transactions} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

function redirectTo(url: string) {
  return () => <Redirect to={url} />;
}
