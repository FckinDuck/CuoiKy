import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import DetailScreen from '../screens/DetailScreen';
import CreateFoodScreen from '../screens/CreateFoodScreen';
import EditFoodScreen from '../screens/EditFoodScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
}
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="EditFood" component={EditFoodScreen} options={{ title: 'Edit' }} />
    </Stack.Navigator>
  );
}
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="EditFood" component={EditFoodScreen} options={{ title: 'Edit' }} />
    </Stack.Navigator>
  );
}
function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen name="Detail" component={DetailScreen}  />
      <Stack.Screen name="EditFood" component={EditFoodScreen} options={{ title: 'Edit' }} />
    </Stack.Navigator>
  );
}
function CreateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateFood" component={CreateFoodScreen} />
    </Stack.Navigator>
  );
}

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
  >
    <View style={styles.buttonInner}>{children}</View>
  </TouchableOpacity>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'Search':
            iconName = 'search-outline';
            break;
          case 'Create':
            iconName = 'add';
            break;
          case 'Favorite':
            iconName = 'heart-outline';
            break;
          case 'Profile':
            iconName = 'person-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
      tabBarActiveTintColor: '#FF6B00',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute',
        height: 60,
        elevation: 5,
        backgroundColor: '#fff',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Search" component={SearchStack} />

    <Tab.Screen
      name="Create"
      component={CreateStack}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="add" size={28} color="#fff" />
        ),
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
      }}
    />

    <Tab.Screen name="Favorite" component={FavoriteStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

export default MainTabNavigator;

const styles = StyleSheet.create({
  customButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
