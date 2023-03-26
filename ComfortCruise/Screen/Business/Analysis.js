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

export default function Home({ navigation }) {
  const [analysis, setAnalysis] = useState([
    {
      SourceName: 'Source',
      Vehicle_Type: 'Vehicle',
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    },
    {
      SourceName: 'Welcome',
      Vehicle_Type: 'Moto',
      January: 0,
      February: 1,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    },
    {
      SourceName: 'Welcome',
      Vehicle_Type: 'Prime',
      January: 0,
      February: 1,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    },
  ])
  useEffect(() => {
    getAnalysis().then((data) => {
      setAnalysis([...analysis, ...data])
    })
  }, [])
  console.log(analysis)
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={{ fontSize: 30 }}>Analysis</Text>
        {/* <Button title="Go to Business" onPress={() => navigation.navigate('Business')} /> */}
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
              <Text>{item.SourceName}</Text>
              <Text>{item.Vehicle_Type}</Text>
              <Text>{item.January}</Text>
              <Text>{item.February}</Text>
              <Text>{item.March}</Text>
              <Text>{item.April}</Text>
              <Text>{item.May}</Text>
              <Text>{item.June}</Text>
              <Text>{item.July}</Text>
              <Text>{item.August}</Text>
              <Text>{item.September}</Text>
              <Text>{item.October}</Text>
              <Text>{item.November}</Text>
              <Text>{item.December}</Text>
            </ScrollView>
          )}
          keyExtractor={(item) => item.SourceName + item.Vehicle_Type}
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

async function getAnalysis() {
    let response = await fetch('http://192.168.137.1:3000/AnalysisOLAP', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let json = await response.json()
    // console.log(json)
    return json
}
