import { createStackNavigator } from '@react-navigation/stack'
import SignUp from '../Screen/Customer/SignUp'
import Home from '../Screen/Customer/Home'
const Stack = createStackNavigator()

export default function CustomerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='SignUp'
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}