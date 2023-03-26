import { createStackNavigator } from '@react-navigation/stack'
import SignUp from '../Screen/Customer/SignUp'
import Home from '../Screen/Driver/Home'

const Stack = createStackNavigator()

export default function DriverStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='Home'
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}