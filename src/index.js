import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules/App';
import { AppContainer } from 'react-hot-loader';

const render = Root => {
  ReactDOM.render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.getElementById('root')
  )
}


render(App)

if (module.hot) {
  module.hot.accept('./modules/App', () => { render(App) })
}