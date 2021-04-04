import React from 'react'
import { connect } from 'react-redux'
import LoginScreen from './LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './AppNavigator'

const MainNavigator: () => Node = (props) => {
  const { root } = props.app
  return (
    root === 'login' ?
      <LoginScreen/> :
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>)
}

const mapStateToProps = state => ({
  app: state.app,
})
export default connect(mapStateToProps)(MainNavigator)

