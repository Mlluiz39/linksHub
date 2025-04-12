// app/auth/loginScreen.tsx
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Rive from 'rive-react-native';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleGoogleSignIn, login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await handleGoogleSignIn();
      router.replace('/');
    } catch (error) {
      setError('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
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
      <View style={styles.buttonGroup}>
        <View style={styles.googleButton}>
          <Button
            accessibilityLabel="Entrar com Google"
            title={loading ? 'Entrando...' : 'Entrar com Google'}
            onPress={handleLogin}
            color="#DB4437"
            disabled={loading}
          />
          {error ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          ) : null}
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
