import { StatusBar } from 'expo-status-bar'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { useEffect, useState } from 'react'

export default function RideDetails({ navigation }) {
  const [rideDetails, setRideDetails] = useState({
    Ride_id: 'No rides found',
    Distance: 'No rides found',
    Status: 'No rides found',
    Customer_Id: 'No rides found',
    Driver_Id: 'No rides found',
    Start_time: 'No rides found',
    End_time: 'No rides found',
    OTP: 'No rides found',
    Coupon: 'No coupon found',
  })
  const [Customer_Id, setCustomer_Id] = useState('302')

  useEffect(() => {
    fetchRideDetails({
      Customer_Id,
    }).then((data) => {
      if (data.length === 0) {
        setRideDetails({
          Ride_id: 'No rides found',
          Distance: 'No rides found',
          Status: 'No rides found',
          Customer_Id: 'No rides found',
          Driver_Id: 'No rides found',
          Start_time: 'No rides found',
          End_time: 'No rides found',
          OTP: 'No rides found',
          Coupon: 'No coupon found',
        })
        alert('No rides found')
        navigation.navigate('CHome')
      } else {
        setRideDetails(data[0])
      }
      console.log(data)
    })
  }, [])

  return (
    <View style={styles.container}>
      {/* <ScrollView> */}
      <Text style={{ fontSize: 30, margin: 10 }}>Ride Details</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Ride ID:</Text>
          <Text style={styles.value}>{rideDetails.Ride_id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Distance:</Text>
          <Text style={styles.value}>{rideDetails.Distance}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{rideDetails.Status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Customer ID:</Text>
          <Text style={styles.value}>{rideDetails.Customer_Id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Driver ID:</Text>
          <Text style={styles.value}>{rideDetails.Driver_Id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.value}>{rideDetails.Start_time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>End Time:</Text>
          <Text style={styles.value}>{rideDetails.End_time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>OTP:</Text>
          <Text style={styles.value}>{rideDetails.OTP}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cost:</Text>
          <Text style={styles.value}>{rideDetails.Cost}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Coupon:</Text>
          <Text style={styles.value}>{rideDetails.Coupon_code}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.buttonDesign, { backgroundColor: '#63ea05' }]}
        onPress={async () => {
          alert('Coupon Applied')
          await applyCouponTransaction({
            Ride_id: rideDetails.Ride_id,
            Customer_id: rideDetails.Customer_Id,
          }).then((res) => {
            alert('Coupon Applied')
          })
          fetchRideDetails({
            Customer_Id,
          }).then((data) => {
            if (data.length === 0) {
              setRideDetails({
                Ride_id: 'No rides found',
                Distance: 'No rides found',
                Status: 'No rides found',
                Customer_Id: 'No rides found',
                Driver_Id: 'No rides found',
                Start_time: 'No rides found',
                End_time: 'No rides found',
                OTP: 'No rides found',
                Coupon: 'No coupon found',
              })
              alert('No rides found')
              navigation.navigate('CHome')
            } else {
              setRideDetails(data[0])
            }
            console.log(data)
          })
        }}
      >
        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
          Apply Coupon
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonDesign, { backgroundColor: '#f6161c' }]}
        onPress={() => {
          cancelRide({ Ride_id: rideDetails.Ride_id }).then((res) => {
            alert('Ride Cancelled')
            navigation.navigate('CHome')
          })
        }}
      >
        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
          Cancel Ride
        </Text>
      </TouchableOpacity>

      {/* </ScrollView> */}
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
  card: {
    // flex: 1,
    backgroundColor: '#fff',
    width: '60%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
  value: {
    flex: 1,
  },
  buttonDesign: {
    backgroundColor: '#f6161c',
    width: '60%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
async function fetchRideDetails({ Customer_Id }) {
  let response = await fetch('http://192.168.1.206:3000/CurrentRide', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Customer_Id,
    }),
  })

  let json = await response.json()
  return json
}
async function cancelRide({ Ride_id }) {
  let response = await fetch(
    'http://192.168.1.206:3000/CancelRideTransaction',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ride_id,
      }),
    },
  )
}
async function applyCouponTransaction({ Ride_id, Customer_id }) {
  let response = await fetch(
    'http://192.168.1.206:3000/ApplyCouponTransaction',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Ride_id,
        Customer_id,
      }),
    },
  )
}
