import { useEffect, useState } from 'react';
import { API_KEY } from '@env';
import { Alert, StyleSheet, Text, TextInput, View, Image, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {

  const[rates, setRates] = useState({});
  const[selected, setSelected] = useState('');
  const[amount, setAmount] = useState('');
  const[eur, setEur] = useState('');

  useEffect(() =>{
    getRates()
  },[]);

  const getRates = async () => {
    const url = 'https://api.apilayer.com/exchangerates_data/latest';
    const options = {
      headers: {
        apikey: API_KEY
      }
    };
  
    try {
      const response = await fetch(url, options);
      console.log('Response status', response.status);
      const currencyData = await response.json();
      console.log(currencyData);
      setRates(currencyData.rates);
    } catch (e) {
      Alert.alert('Error fetching data');
    }
  };

  const convert = () => {
    const amountEur = Number(amount) / rates[selected];
    setEur(`${amountEur.toFixed(2)}€`);

  }

  return (
    <View style={styles.container}>
      <Image source={require('./raha.png')} style={styles.image} />
      <Text style={{...styles.valuerow, ...styles.text }}>{eur}</Text>
      <View style={styles.inputrow}>
      <TextInput
        style={styles.text}
        placeholder={'Amount'}
        keyboardType='numeric'
        value={amount}
        onChangeText={text => setAmount(text)}
      />
        <Picker style={styles.picker}
          selectedValue={selected}
          onValueChange={(itemValue, itemIndex) => {
            setSelected(itemValue);
          }}
        >
          {Object.keys(rates).sort().map(key => (<Picker.item label={key} value={key} key={key} />))}
          </Picker>
          </View>
      <Button
        title='Convert'
        onPress={convert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 350,
  },
  valuerow: {
    paddingTop: 20,
  },
  inputrow: {
    flexDirection: 'row',
    height: 50,
  },
  picker: {
    width: 120
  },
  Text: {
    fontSize: 16
  },
});
