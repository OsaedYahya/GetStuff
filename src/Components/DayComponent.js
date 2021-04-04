import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Day from 'react-native-calendars/src/calendar/day'
import { colors } from '../Constants'

const DayComponent = React.memo((props) => {
  let color = props.marking && props.marking.textColor
  if (props.state === 'disabled') {
    color = colors.GREY
  } else if (props.state === 'today' && !props.marking.textColor) {
    color = colors.MAIN_COLOR
  }
  return (
    <TouchableOpacity style={{
      backgroundColor: props.marking.color,
      alignItems: 'center',
      padding: 10,
      borderRadius: 50,
      borderTopLeftRadius: props.marking.startingDay || props.marking.singleSelect ? 50 : 0,
      borderBottomLeftRadius: props.marking.startingDay || props.marking.singleSelect ? 50 : 0,
      borderTopRightRadius: props.marking.endingDay || props.marking.singleSelect ? 50 : 0,
      borderBottomRightRadius: props.marking.endingDay || props.marking.singleSelect ? 50 : 0
    }} onPress={() => props.onPress(props.date)}>
      <Text style={{ color }}>{props.date.day}</Text>
    </TouchableOpacity>
  )
})

export default DayComponent
DayComponent.propTypes = Day.propTypes
