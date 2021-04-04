import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { colors, timeTypes } from '../Constants'
import database from '@react-native-firebase/database'
import moment from 'moment'
import * as appActions from '../actions/app'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.MAIN_COLOR,
  },
  headerText: {
    fontSize: 18,
    marginVertical: 12
  },
  button: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    color: colors.MAIN_COLOR,
  },
  row: {
    flexDirection: 'row',
  },
  logout: {
    fontSize: 16,
    marginVertical: 12,
  }
})

const HomeView: () => Node = (props) => {
  const [user, setUser] = useState()
  const [dateObject, setDateObject] = useState()

  function onAuthStateChanged (user) {
    if (user) {
      setUser(user)
      database()
        .ref(`/users/${user.uid}`)
        .on('value', snapshot => {
          setDateObject(snapshot.val())
        })
    }
  }

  function signOut () {
    props.dispatch(appActions.moveTo('login'))
    auth()
      .signOut()
      .then(() => props.dispatch(appActions.moveTo('login')))
  }

  function getDateTime () {
    switch (dateObject.type) {
      case timeTypes.TIME:
        return `Your meeting is due at ${moment(dateObject.startTime * 1000).format('hh:mm a')}`
      case timeTypes.TIME_RANGE:
        return `Your meeting is due at ${moment(dateObject.startTime * 1000).format('hh:mm a')} - ${moment(dateObject.endTime * 1000).format('hh:mm a')}`
      case timeTypes.DATE:
        return `Your meeting is due on ${moment(dateObject.startTime * 1000).format('MMMM D, YYYY')}`
      case timeTypes.DATE_RANGE:
        return `Your meeting is due on ${moment(dateObject.startTime * 1000).format('MMMM D, YYYY')} - ${moment(dateObject.endTime * 1000).format('MMMM D, YYYY')}`
    }
    return ``
  }

  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged)
  }, [])

  return (
    <View style={styles.container}>
      {dateObject && <Text style={styles.headerText}>{getDateTime()}</Text>}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Calendar', { userId: user.uid })}>
          <Text style={styles.buttonText}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Time', { userId: user.uid })}>
          <Text style={styles.buttonText}>Time</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
const mapStateToProps = state => ({
  app: state.app,
})

export default connect(mapStateToProps)(HomeView)
