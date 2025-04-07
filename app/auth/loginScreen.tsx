// app/auth/loginScreen.tsx
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Rive from 'rive-react-native';


export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'user' && password === '123456') {
      login();
      router.replace('/');
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.riveContainer}>
        <Rive
          resourceName="login"
          autoplay={true}
          style={{ width: 250, height: 250 }}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
      />

      <View style={styles.buttonGroup}>
        <Button title="Entrar" onPress={handleLogin} color="#7C3AED" />
        <View style={styles.googleButton}>
          <Button title="Entrar com Google" onPress={() => alert('Google login')} color="#DB4437" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  riveContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonGroup: {
    marginTop: 10,
  },
  googleButton: {
    marginTop: 10,
  },
});
