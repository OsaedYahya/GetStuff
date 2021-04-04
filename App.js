import type { Node } from 'react'
import React from 'react'
import { persistor, store } from './src/Helpers/store'
import { Provider } from 'react-redux'
import MainNavigator from './src/Views/MainNavigator'
import * as appActions from './src/actions/app'
import { PersistGate } from 'redux-persist/integration/react';

const App: () => Node = () => {
  store.dispatch(appActions.appInitialized())
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MainNavigator />
    </PersistGate>
  </Provider>
  )

}

export default App
