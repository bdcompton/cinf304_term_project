import React, {useState} from 'react';
import {Picker, Text, StyleSheet, View, TextInput, Button} from 'react-native';
import locationData from './locations.json';


const Pick = ({parentCallBack}) => {
 
  const [currency, setCurrency] = useState('');
  const locData = locationData.locations;
  
  
  return (
    <View >
      <Text > Choose Origin </Text>
      <View>
        
        <Picker
          selectedValue={currency}
          onValueChange={currentCurrency => setCurrency(currentCurrency)}>
        {
                 locData.map((item) =>{
                   return(
                   <Picker.Item  label={item.name} value={item.position} key={item.name}/>
                   );
                 })
        }
        </Picker>
        <Text>
          Selected: {currency}
        </Text>
      </View>
    </View>
    
  );
};
const styles = StyleSheet.create({
  //Check project repo for styles
});

export default Pick;