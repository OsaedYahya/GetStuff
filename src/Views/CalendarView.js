import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, timeTypes } from '../Constants'
import moment from 'moment'
import DayComponent from '../Components/DayComponent'
import database from '@react-native-firebase/database'

const XDate = require('xdate')

const styles = StyleSheet.create({
  bottomButton: {
    position: 'absolute',
    backgroundColor: 'black',
    width: '100%',
    bottom: 0,
    paddingVertical: 30
  },
  bottomText: {
    color: 'white',
    textAlign: 'center',
  }
})

const CalendarView: () => Node = (props) => {
  const [isFromDatePicked, setIsFromDatePicked] = useState(false)
  const [isToDatePicked, setIsToDatePicked] = useState(false)
  const [markedDates, setMarkedDates] = useState({})
  const [fromDate, setFromDate] = useState(Date())
  const { userId } = props.route.params

  function onDayPress (day) {
    if (!isFromDatePicked || (isFromDatePicked && isToDatePicked)) {
      setupStartMarker(day)
    } else if (!isToDatePicked) {
      let [mMarkedDates, range] = setupMarkedDates(fromDate, day.dateString, markedDates)
      if (range >= 0) {
        setupStartMarker(day)
        setIsFromDatePicked(true)
        setIsToDatePicked(true)
        setMarkedDates(mMarkedDates)
      } else {
        setupStartMarker(day)
      }
    }
  }

  function setupMarkedDates (fromDate, toDate, markedDates) {
    let mFromDate = new XDate(fromDate)
    let mToDate = new XDate(toDate)
    let range = mFromDate.diffDays(mToDate)
    if (range >= 0) {
      if (range === 0) {
        markedDates = {}
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
          if (i < range) {
            markedDates[tempDate] = { color: colors.MAIN_COLOR, textColor: 'white' }
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: colors.MAIN_COLOR,
              textColor: 'white'
            }
          }
        }
        markedDates[Object.keys(markedDates)[0]].startingDay = true
        markedDates[Object.keys(markedDates)[0]].singleSelect = false
      }
    }
    return [markedDates, range]
  }

  function setupStartMarker (day) {
    let markedDates = {
      [day.dateString]: {
        singleSelect: true,
        color: colors.MAIN_COLOR,
        textColor: 'white'
      }
    }
    setIsFromDatePicked(true)
    setIsToDatePicked(false)
    setFromDate(day.dateString)
    setMarkedDates(markedDates)
  }

  const getSelectedTime = () => {
    const markedDatesObject = Object.keys(markedDates)
    if (markedDatesObject.length === 0)
      return ' '

    let arr = []
    const format = 'MMMM D, YYYY'
    markedDatesObject.forEach(function (key) {
      arr.push(markedDates[key])
    })
    if (arr.length <= 1) {
      const startDate = moment(markedDatesObject[0])
      return startDate.format(format)
    } else if (arr.length > 1) {
      const startDate = moment(markedDatesObject[0])
      const endDate = moment(markedDatesObject[arr.length - 1])
      if (startDate.month() === endDate.month()) {
        return `${startDate.format('MMMM')} ${startDate.format('D')}-${endDate.format('D')}, ${endDate.format('YYYY')}`
      }
      return `${startDate.format(format)} - ${endDate.format(format)}`
    }
    return 'ERROR'
  }

  function clickTime () {
    const markedDatesObject = Object.keys(markedDates)
    let isRange = false
    if (markedDatesObject.length > 1)
      isRange = true
    database()
      .ref(`/users/${userId}`)
      .set({
        startTime: moment(markedDatesObject[0]).unix(),
        endTime: moment(markedDatesObject[markedDatesObject.length - 1]).unix(),
        type: isRange ? timeTypes.DATE_RANGE : timeTypes.DATE
      })
      .then(() => {
        props.navigation.pop()
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        theme={{
          'stylesheet.calendar.main': {
            dayContainer: {
              flex: 1,
              justifyContent: 'center'
            },
          },
        }}
        markingType={'period'}
        current={fromDate}
        markedDates={markedDates}
        onDayPress={onDayPress}
        dayComponent={(props) => <DayComponent {...props} />}
      />
      <TouchableOpacity
        onPress={clickTime}
        style={styles.bottomButton}>
        <Text style={styles.bottomText}>{getSelectedTime()}</Text>
      </TouchableOpacity>
    </View>
  )
}
export default CalendarView
