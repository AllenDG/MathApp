import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BotNavbar from './src/components/Navbar/BotNavbar';
import TurnBasedScreen from './src/screens/TurnBasedScreen';
import Quizgame from './src/screens/Quizgame';
import MatchNumberScreen from './src/screens/MatchNumberScreen';
import MatchNumberStartScreen from './src/screens/MatchNumberStartScreen';
import QuizGameStartScreen from './src/screens/QuizGameStartScreen';
import TurnBasedStartScreen from './src/screens/TurnBasedStartScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setInitialRoute(user ? 'Dashboard' : 'Login');
    });
    
    return () => unsubscribe();
  }, []); 

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Dashboard" component={BotNavbar} />
          <Stack.Screen options={{ headerShown: false }} name="QuizGame" component={Quizgame} />
          <Stack.Screen options={{ headerShown: false }} name="TurnBased" component={TurnBasedScreen} />
          <Stack.Screen options={{ headerShown: false }} name="MatchNumber" component={MatchNumberScreen} />
          <Stack.Screen options={{ headerShown: false }} name="MatchNumberStart" component={MatchNumberStartScreen} />
          <Stack.Screen options={{ headerShown: false }} name="QuizGameStart" component={QuizGameStartScreen} />
          <Stack.Screen options={{ headerShown: false }} name="TurnBasedStart" component={TurnBasedStartScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
