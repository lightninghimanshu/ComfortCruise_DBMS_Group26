import { StatusBar } from 'expo-status-bar'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native'
import { useEffect, useState } from 'react'

export default function Home({ navigation }) {
  let [data, setData] = useState()
  let [Driver_Id, setDriver_Id] = useState(94)
  let [loading, setLoading] = useState(true)
  let [driverDetails, setDriverDetails] = useState()
  useEffect(() => {
    {
      loading &&
        getNearbyBookings()
          .then((res) => {
            console.log('res')
            console.log(res)
            setData(res)
          })
          .then(
            getDriverDetails({ Driver_Id }).then((res) => {
              console.log('res')
              console.log(res)
              setDriverDetails(res[0])
            }),
          )
    }
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={{ fontSize: 30, textAlign: 'center', padding: 20 }}>
          Welcome {'\n'} {driverDetails?.Name}
        </Text>
        <Text style={{ padding: 10 }}>
          Your location is currently set at {driverDetails?.Current_Location}
        </Text>

        <ScrollView>
          {data?.map((item) => {
            return (
              <Pressable
                style={{
                  justifyContent: 'space-evenly',
                  padding: 10,
                }}
                key={item.SourceName}
                onPress={async () => {
                  // alert('Booking Accepted')
                  setProposedBooking({ Ride_Id:item.Ride_Id })
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold' }}>Pickup: </Text>
                  <Text>{item.SourceName}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold' }}>Distance: </Text>
                  <Text>{item.Distance.toFixed(2)}</Text>
                </View>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

async function getNearbyBookings() {
  let response = await fetch('http://192.168.137.1:3000/NearbyBookings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await response.json()
  return json
}

async function getDriverDetails({ Driver_Id }) {
  let response = await fetch('http://192.168.137.1:3000/DriverInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Driver_Id,
    }),
  })
  let json = await response.json()
  return json
}

async function setProposedBooking({ Ride_Id }) {
  Ride_Id=42;
  alert('Ride_Id: ' + Ride_Id)
  let response = await fetch('http://192.168.137.1:3000/SetProposedBooking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Ride_Id,
    }),
  })
  let json = await response.json()
  alert('Booking Accepted')
  return json
}
