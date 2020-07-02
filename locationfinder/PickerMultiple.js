import React, {useState} from 'react';
import {Picker, Text, StyleSheet, View, TextInput, Button} from 'react-native';
import locationData from './locations.json';


const Pick = ({parentCallBack}) => {
 
  const [currency, setCurrency] = useState('');
  const locData = locationData.locations;
  
  
  return (
    <View >
     
      <View>
      <Text style={styles.text}>
          Add Building to Path
        </Text>
        <Picker
          selectedValue={currency}
          onValueChange={currentCurrency => parentCallBack(currentCurrency)}>
        {
                 locData.map((item) =>{
                   return(
                   <Picker.Item  label={item.name} value={item.position} key={item.name}/>
                   );
                 })
        }
        </Picker>
        
      </View>
    </View>
    
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize:18
  }
});

export default Pick;