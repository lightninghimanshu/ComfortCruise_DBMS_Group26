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

export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.container}>
                <Text style={{ fontSize: 30 }}>Welcome</Text>
                <Button title="Go to Analysis" onPress={() => navigation.navigate('Analysis')} />
                <Button title="Go to Vehicle and Driver Revenue" onPress={() => navigation.navigate('VehicleAndDriverRevenue')} />
                <Button title="Go to Yearly Revenue" onPress={() => navigation.navigate('YearlyRevenue')} />
                <Button title="Go to Age Wise Revenue" onPress={() => navigation.navigate('AgeWiseRevenue')} />
                <Button title='Check Proposed Booking' onPress={() => navigation.navigate('CheckProposedBooking')} />
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
