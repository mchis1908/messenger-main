import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Home' component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

