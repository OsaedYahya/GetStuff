import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { colors, timeTypes } from '../Constants'
import database from '@react-native-firebase/database';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tabsText: {
    fontSize: 18,
    marginHorizontal: 12,
    color: 'black',
  },
  selectedTab: {
    textDecorationLine: 'underline',
    color: colors.MAIN_COLOR,
  },
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

const TimeView: () => Node = (props) => {
  const { userId } = props.route.params;
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isRange, setIsRange] = useState(false)
  const [isSelectingEnd, setSelectingEnd] = useState(false)
  const [difference, setDifference] = useState(0)

  useEffect(()=>{
    setDifference(moment.duration(moment(endDate).diff(startDate)))
  }, [endDate, startDate, isRange])
  function clickDate(){
    if(difference < 0 && isRange){
      alert("Please select a valid range")
      return;
    }
    database()
      .ref(`/users/${userId}`)
      .set({
        startTime: moment(startDate).unix(),
        endTime: moment(endDate).unix(),
        type: isRange ? timeTypes.TIME_RANGE : timeTypes.TIME
      })
      .then(() => {
        props.navigation.pop()
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => {
          setIsRange(false)
          setSelectingEnd(false)
        }}>
          <Text style={[styles.tabsText, !isRange && styles.selectedTab]}>Specific
            Time</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRange(true)}>
          <Text style={[styles.tabsText, isRange && styles.selectedTab]}>Range</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setSelectingEnd(false)}>
          <Text
            style={{ color: isSelectingEnd ? 'black' : colors.MAIN_COLOR }}>{moment(startDate).format('hh:mm a')}</Text>
        </TouchableOpacity>
        {isRange && <>
          <Text> - </Text>
          <TouchableOpacity onPress={() => setSelectingEnd(true)}>
            <Text
              style={{ color: isSelectingEnd ? colors.MAIN_COLOR : 'black' }}>{moment(endDate).format('hh:mm a')}</Text>
          </TouchableOpacity>
        </>}
      </View>
      <View>
        {isSelectingEnd ? <DatePicker
            date={endDate}
            mode={'time'}
            minimumDate={startDate}
            minuteInterval={5}
            onDateChange={setEndDate}
          /> :
          <DatePicker
            date={startDate}
            mode={'time'}
            minuteInterval={5}
            onDateChange={(date) => {
              setStartDate(date)
            }}
          />}

      </View>
      <TouchableOpacity
        disabled={difference < 0 && isRange}
        onPress={clickDate}
        style={[styles.bottomButton, {backgroundColor: difference < 0 && isRange ? colors.GREY : 'black' }]}>
        <Text style={styles.bottomText}>
          {moment(startDate).format('hh:mm a')}{isRange && ` - ${moment(endDate).format('hh:mm a')}`}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
export default TimeView
