import React from 'react'
import Home from './HomeView'
import { createStackNavigator } from '@react-navigation/stack';
import CalendarView from './CalendarView'
import TimeView from './TimeView'

const Stack = createStackNavigator();
const AppNavigator: () => Node = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Calendar" component={CalendarView} />
    <Stack.Screen name="Time" component={TimeView} />
  </Stack.Navigator>)
}
export default AppNavigator;
