import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LearnScreen from "../../screens/LearnScreen";
import Leaderboards from "../../screens/Leaderboards";
import SettingsScreen from "../../screens/SettingScreen";

const Tab = createBottomTabNavigator();

const BotNavbar = () => {
  const bounceValue = new Animated.Value(1);

  const handlePress = (navigation, routeName) => {
    navigation.navigate(routeName);
    Animated.sequence([
      Animated.spring(bounceValue, {
        toValue: 0.8,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderTabBarIcon = (route, focused, color, size, navigation) => {
    let iconName;

    if (route.name === "LearnTab") {
      iconName = focused ? "book" : "book-outline";
    } else if (route.name === "LeaderboardsTab") {
      iconName = focused ? "medal" : "medal-outline";
    } else if (route.name === "SettingsTab") {
      iconName = focused ? "settings-sharp" : "settings-outline";
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => handlePress(navigation, route.name)}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: bounceValue }] },
          ]}
        >
          <Ionicons name={iconName} size={size} color={color} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          renderTabBarIcon(route, focused, color, size, navigation),
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#CECECE",
        tabBarStyle: {
          backgroundColor: "#0078EB",
          borderTopWidth: 0,
          paddingBottom: 5,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="LearnTab" component={LearnScreen} />
      <Tab.Screen name="LeaderboardsTab" component={Leaderboards} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: "#469FF5",
  },
});

export default BotNavbar;
