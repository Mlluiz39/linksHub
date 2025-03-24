import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

SplashScreen.preventAutoHideAsync();

export default function OnboardingScreen() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.imageContainer}
      >
        <Image
          source={{
            uri: 'https://res.cloudinary.com/drocbczra/image/upload/v1742748979/afulyjqelcoi5vy0ysgn.webp?h=80&w=2940&auto=format&fit=crop',
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(600).springify()}
        style={styles.contentContainer}
      >
        <Text style={styles.title}>Todos os seus links em um só lugar</Text>

        <Text style={styles.description}>
          Gerencie e compartilhe seus links de todas as redes sociais de forma
          simples e elegante.
        </Text>

        <View style={styles.socialIconsContainer}>
          <View style={styles.socialIcons}>
            <Icon
              name="youtube"
              size={32}
              color="#FF0000"
              style={styles.icon}
            />
            <Icon
              name="twitter"
              size={32}
              color="#7C3AED"
              style={styles.icon}
            />
            <Icon
              name="instagram"
              size={32}
              color="#E4405F"
              style={styles.icon}
            />
            <Icon
              name="facebook"
              size={32}
              color="#1877F2"
              style={styles.icon}
            />
            <Icon name="tiktok" size={32} color="#000000" style={styles.icon} />
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Começar Agora</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    height: '45%',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 12,
  },
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 18,
  },
});
