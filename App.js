import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/screens/MapScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={MapScreen} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}