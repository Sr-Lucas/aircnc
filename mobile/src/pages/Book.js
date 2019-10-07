import React, { useState } from 'react'
import * as Localization from 'expo-localization'
import moment from 'moment'
import 'moment/min/locales'

import {
  SafeAreaView,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  AsyncStorage,
  StyleSheet
} from 'react-native'

import api from '../services/api'

const deviceLanguage =
  Localization.locale
    .replace(/_/g, '-')
    .toLowerCase()

moment.locale([
  deviceLanguage,
  'pt-br'
])

const DatePicker =
  Platform.OS === 'ios'
    ? require('DatePickerIOS')
    : require('../components/DatePickerAndroid')

export default ({ navigation }) => {
  const [date, setDate] = useState(Platform.OS === 'ios' ? new Date(): '')
  const id = navigation.getParam('id')

  const handleSubmit = async () => {
    const user_id =
      await AsyncStorage.getItem('user')

    await api.post(`/spots/${id}/bookings`, {
      date:
        Platform.OS === 'ios'
          ? moment(date).format('LL')
          : date
    }, {
      headers: { user_id }
    })

    Alert.alert('Booking requested!')
    navigation.navigate('List')
  }

  const handleCancel = () =>
    navigation.navigate('List')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>DATE *</Text>

      {<DatePicker
          date={date}
          onDateChange={setDate}
          locale={deviceLanguage}
          moment={moment}
        />}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>
          Request booking
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
        <Text style={styles.buttonText}>
          Cancel
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 30
  },

  label: {
    fontWeight: 'bold',
    color: '#444',
    marginTop: 20,
    marginBottom: 8
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },

  button: {
    height: 42,
    backgroundColor: '#ec3246',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },

  cancelButton: {
    backgroundColor: '#7a8188',
    marginTop: 10

  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15
  }
})
