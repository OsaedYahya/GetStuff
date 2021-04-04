import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import * as appActions from './../actions/app'
import { colors } from '../Constants'

const styles = StyleSheet.create({
  inputFieldStyle: {
    backgroundColor: colors.LIGHT_GREY,
    borderWidth: 1,
    borderColor: colors.GREY,
    minWidth: '80%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginVertical: 4
  },
  buttonStyle: {
    borderRadius: 50,
    backgroundColor: colors.MAIN_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 12
  }
})
const LoginScreen = (props) => {

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  function signIn () {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        props.dispatch(
          appActions.moveTo('home'),
        )
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          auth().signInWithEmailAndPassword(email, password)
          props.dispatch(
            appActions.moveTo('home'),
          )
          return
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!')
        }

        console.error(error)
      })
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <TextInput style={styles.inputFieldStyle} onChangeText={setEmail}/>
      <TextInput style={styles.inputFieldStyle} onChangeText={setPassword}/>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => signIn()}>
        <Text style={{ color: 'white', }}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const mapStateToProps = state => ({
  app: state.app,
})

export default connect(mapStateToProps)(LoginScreen)
