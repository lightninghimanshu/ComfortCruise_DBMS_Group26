import { StatusBar } from 'expo-status-bar'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'

export default function Book({ navigation }) {
  const [Customer_Id, setCustomer_Id] = useState('302')
  const [SourceName, setSourceName] = useState('')
  const [DestinationName, setDestinationName] = useState('')
  const [Vehicle_Type, setVehicle_Type] = useState('')
  const [Start_time, setStart_time] = useState('10:30:00')
  const [End_Time, setEnd_Time] = useState('11:30:00')
  const [Date, setDate] = useState('2023-04-21')
  const [Payment_method, setPayment_method] = useState('Cash')

  return (
    <ScrollView
      style={{
        backgroundColor: '#fff',
        padding: 20,
      }}
    >
      <StatusBar style="auto" />

      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>Book Ride Now!</Text>
      </View>
      <View style={{ gap: 10 }}>
        <TextInput
          placeholder="Customer Id"
          style={styles.input}
          value={Customer_Id}
        />
        <TextInput
          placeholder="Source"
          style={styles.input}
          onChangeText={(text) => setSourceName(text)}
        />
        <TextInput
          placeholder="Destination"
          style={styles.input}
          onChangeText={(text) => setDestinationName(text)}
        />
        <TextInput placeholder="Date" style={styles.input} value={Date} />
        <TextInput
          placeholder="Time Start"
          style={styles.input}
          value="10:30:00"
        />
        <TextInput
          placeholder="Time End"
          style={styles.input}
          value="11:30:00"
        />
        <TextInput
          placeholder="Vehicle Type"
          style={styles.input}
          onChangeText={(text) => setVehicle_Type(text)}
        />
        <Button
          title="Book"
          onPress={async () =>
            requestRide({
              Customer_Id,
              SourceName,
              DestinationName,
              Vehicle_Type,
              Start_time,
              End_Time,
              Date,
              Payment_method,
            })
          }
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
})

async function requestRide({
  Customer_Id,
  Start_time,
  End_Time,
  Date,
  Payment_method,
  SourceName,
  DestinationName,
  Vehicle_Type,
}) {
  console.log('requestRide')
  let response = await fetch('http://192.168.1.206:3000/RequestRide', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Customer_Id,
      Start_time,
      End_Time,
      Date,
      Payment_method,
      SourceName,
      DestinationName,
      Vehicle_Type,
    }),
  })
  // let response = await fetch('http://192.168.1.206:3000/RideBookingTransaction', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     Customer_Id,
  //     Start_time,
  //     End_Time,
  //     Date,
  //     Payment_method,
  //     SourceName,
  //     DestinationName,
  //     Vehicle_Type,
  //   }),
  // })
  let json = await response.json()
  let d = json[0]['Distance']
  alert('Ride Requested Successfully! Total Distance: ' + d + ' km')

  return json
}
