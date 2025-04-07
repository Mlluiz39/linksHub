import { View, Button, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('./loginScreen'); // Redireciona para a tela de login após o logout
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deseja mesmo sair?</Text>
      <Button title="Sair" onPress={handleLogout} color="#EF4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 20 },
});
