# GetStuff
Since there's an issue in "react-native-calendars" (and they have a PR open for it) I had to manually edit "node_modules/react-native-calendars/src/calendar/day/index.js" and replace "extractComponentProps(Component, this.props)" in line 85 to "extractComponentProps(Day, this.props)"

ref https://github.com/wix/react-native-calendars/pull/1407
