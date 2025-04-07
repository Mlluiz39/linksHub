import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      {isLoggedIn && (
        <Tabs.Screen
          name="links"
          options={{
            title: 'Links',
            tabBarIcon: ({ size, color }) => (
              <Feather name="link" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Botão de logout apenas visual */}
      {isLoggedIn && (
        <Tabs.Screen
          name="logout"
          options={{
            title: 'Sair',
            tabBarIcon: () => null,
            // 👉 Apenas usa tabBarButton, sem href
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={logout}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}
              >
                <Feather name="log-out" size={22} color="#EF4444" />
                <Text style={{ fontSize: 12, color: '#EF4444' }}>Sair</Text>
              </TouchableOpacity>
            ),
          }}
        />
      )}
    </Tabs>
  );
}
