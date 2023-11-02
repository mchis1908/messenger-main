import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
// import AIAssistant from "./screens/AIAssistant";
import ChatsScreen from "./screens/ChatsScreen";
import FriendsScreen from "./screens/FriendsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' options={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name='AIAssistant' component={AIAssistant} options={{ headerShown: false }}/> */}
        <Stack.Screen name='Chats' component={ChatsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Friends' component={FriendsScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

