import { StatusBar } from 'expo-status-bar'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from 'react-native'
import { useEffect, useState } from 'react'

export default function PastRides({ navigation }) {
  const [Customer_Id, setCustomer_Id] = useState('302')
  const [analysis, setAnalysis] = useState([
    {
      Ride_id: 'Ride ID',
      Driver_name: 'Driver Name',
      SourceName: 'Source',
      DestnatonName: 'Destination',
      Date: 'Date',
      Cost: 'Cost',
      Vehide_Type: 'Vehicle Type',
      // Ride_ld
      // Driver_name
      // SourceName
      // DestnatonName
      // Date
      // Cost
      // Vehide_Type
    },
  ])
  useEffect(() => {
    getPastRides({
      Customer_Id,
    }).then((data) => {
      setAnalysis([...analysis, ...data])
    })
  }, [])
  console.log(analysis)
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={{ fontSize: 30 }}>Past Rides</Text>
        <FlatList
          data={analysis}
          style={{ margin: 10 }}
          renderItem={({ item }) => (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-between',
                borderWidth: 1,
                padding: 10,
                gap: 10,
              }}
            >
              <Text>{item.Ride_id}</Text>
              <Text>{item.Driver_name}</Text>
              <Text>{item.SourceName}</Text>
              <Text>{item.DestnatonName}</Text>
              <Text>{item.Date}</Text>
              <Text>{item.Cost}</Text>
              <Text>{item.Vehide_Type}</Text>
            </ScrollView>
          )}
          keyExtractor={(item) => item.Driver_Id + ' ' + item.Ride_id}
        />
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
    gap: 10,
  },
})

async function getPastRides({ Customer_Id }) {
  let response = await fetch('http://192.168.1.206:3000/ViewPastRides', {
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
