import { NavigationContainer } from '@react-navigation/native'
import CustomerStack from './StackNavigator/CustomerStack'
import DriverStack from './StackNavigator/DriverStack'
import BusinessStack from './StackNavigator/BusinessStack'
import { Switch, View, Text } from 'react-native'
import { useState } from 'react'
import Constants from 'expo-constants'
import SelectDropdown from 'react-native-select-dropdown'
//import status bar height height from expo constants

export default function App() {
  // const [isEnabled, setIsEnabled] = useState(false)
  const [selectedValue, setSelectedValue] = useState('Customer')
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)
  return (
    <NavigationContainer>
      <View
        style={{
          flex: 1,
          paddingTop: Constants.statusBarHeight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SelectDropdown
          data={['Customer', 'Driver', 'Business']}
          onSelect={(selectedItem, index) => {
            setSelectedValue(selectedItem)
          }}
          dropdownIconPosition="right"
          rowTextForSelection={(item, index) => {
            return item
          }}
          defaultButtonText={selectedValue}
        />

        <View
          style={{
            padding: 10,
          }}
        >
          <Text>
            {selectedValue === 'Customer'
              ? 'Customer'
              : selectedValue === 'Driver'
              ? 'Driver'
              : 'Business'}
              {` `}Mode 
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          {selectedValue === 'Customer' && <CustomerStack />}
          {selectedValue === 'Driver' && <DriverStack />}
          {selectedValue === 'Business' && <BusinessStack />}
        </View>
      </View>
    </NavigationContainer>
  )
}

// async function fetchDriverList() {
//   const response = await fetch('http://192.168.1.206:3000/users')
//   const data = await response.json()
//   return data
// }

// buttonStyle={{
//   backgroundColor: '#f5dd4b',
//   width: 200,
//   height: 50,
//   borderRadius: 10,
//   justifyContent: 'center',
//   alignItems: 'center',
// }}
// buttonTextStyle={{
//   color: '#000',
//   fontSize: 20,
// }}
// renderDropdownIcon={() => {
//   return (
//     <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
//   )
// }}

{
  /* <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        /> */
}
