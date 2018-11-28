import * as React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { Locations } from '../containers/Locations';
import { configureStore } from '../configureStore';
import { Provider } from 'react-redux';

const store = configureStore();

/**
 * Main App
 */
export function App() {
  return (
    <Provider {...{ store }}>
      <BrowserRouter>
        <div>
          <Route exact path="/" render={redirect('/locations')} />
          <Route path="/locations" component={Locations} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

function redirect(to: string) {
  return () => <Redirect to={to} />;
}
