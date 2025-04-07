// components/CustomTabBar.tsx
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName =
          route.name === 'index' ? 'home' :
          route.name === 'links' ? 'link' :
          '';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', padding: 10 }}
          >
            <Feather name={iconName as any} size={22} color={isFocused ? '#7C3AED' : '#94A3B8'} />
            <Text style={{ fontSize: 12, color: isFocused ? '#7C3AED' : '#94A3B8' }}>
              {typeof label === 'string' ? label : ''}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Botão de logout personalizado */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{ flex: 1, alignItems: 'center', padding: 10 }}
      >
        <Feather name="log-out" size={22} color="#EF4444" />
        <Text style={{ fontSize: 12, color: '#EF4444' }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
