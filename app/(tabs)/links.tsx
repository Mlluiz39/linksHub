import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  RefreshControl,
  Linking,
} from 'react-native';

import { SplashScreen } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Search,
  Plus,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Link as LinkIcon,
  ExternalLink,
  User,
} from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Trash2, Edit, ArrowDown } from 'lucide-react-native';
import { AddLinkModal } from '../../components/AddLinkModal';
import { getLinks } from '../../services/db';
import { deleteLink } from '../../services/db';

interface Link {
  id: string;
  title: string;
  url: string;
  platform: string;
}

// Impede a Splash Screen de fechar automaticamente
SplashScreen.preventAutoHideAsync();

const CATEGORIES = [
  'Todos',
  'YouTube',
  'Instagram',
  'Facebook',
  'Twitter',
  'TikTok',
  'Other',
];

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return { Icon: Youtube, color: '#FF0000' };
    case 'instagram':
      return { Icon: Instagram, color: '#E4405F' };
    case 'facebook':
      return { Icon: Facebook, color: '#1877F2' };
    case 'twitter':
      return { Icon: Twitter, color: '#1DA1F2' };
    case 'tiktok':
      return { Icon: User, color: '#000000' };
    default:
      return { Icon: LinkIcon, color: '#7C3AED' };
  }
};

// Função para abrir o link na plataforma correta
const openLink = async (url: string, platform: string) => {
  try {
    let finalUrl = url;

    switch (platform.toLowerCase()) {
      case 'youtube':
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
          finalUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            url
          )}`;
        }
        break;
      case 'instagram':
        if (!url.includes('instagram.com')) {
          finalUrl = `https://www.instagram.com/${url.replace('@', '')}`;
        }
        break;
      case 'facebook':
        if (!url.includes('facebook.com')) {
          finalUrl = `https://www.facebook.com/${url}`;
        }
        break;
      case 'twitter':
        if (!url.includes('twitter.com')) {
          finalUrl = `https://twitter.com/${url.replace('@', '')}`;
        }
        break;
      case 'tiktok':
        if (!url.includes('tiktok.com')) {
          finalUrl = `https://www.tiktok.com/@${url.replace('@', '')}`;
        }
        break;
      default:
        break;
    }

    await Linking.openURL(finalUrl);
  } catch (error) {
    console.error('Erro ao abrir o link:', error);
  }
};

export default function LinksScreen() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [refresh, setRefresh] = useState(false);

  const fetchLinks = async () => {
    try {
      const links = await getLinks();
      setLinks(links);
    } catch (error) {
      console.error('Erro ao buscar links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSuccess = () => {
    fetchLinks(); // 🔥 Garante que os links serão recarregados
    setRefresh((prev) => !prev); // 🔄 Força a re-renderização
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLinks();
    setRefreshing(false);
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' || link.platform === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (link: Link) => {
    setEditLink(link); // Armazena o link selecionado para edição
    setModalVisible(true);
  };

  const handleLongPress = (linkId: Link['id']): void => {
    Alert.alert('Excluir Link', 'Tem certeza que deseja excluir este link?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await deleteLink(Number(linkId));
            fetchLinks(); // Atualiza a lista de links após a exclusão
          } catch (error) {
            console.error('Erro ao excluir link:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderRightActions = (link: Link) => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FFA500' }]}
        onPress={() => handleEdit(link)}
      >
        <Edit size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
        onPress={() => handleLongPress(link.id)}
      >
        <Trash2 size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.header}
        >
          <View>
            <Text style={styles.headerTitle}>LinkHub</Text>
            <Text style={styles.headerSubtitle}>Gerencie seus links</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <User size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </Animated.View>

        {/* Search and Add */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.searchContainer}
        >
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#666666" style={styles.searchIcon} />
            <TextInput
              placeholder="Pesquisar links..."
              style={styles.searchInput}
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.categoriesContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  category === selectedCategory && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === selectedCategory && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Links List */}
        <View style={styles.recentLinksContainer}>
          <Text style={styles.sectionTitle}>Links Recentes</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {loading ? (
              <Text style={styles.loadingText}>Carregando links...</Text>
            ) : filteredLinks.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum link encontrado</Text>
            ) : (
              filteredLinks.map((link, index) => {
                const { Icon, color } = getPlatformIcon(link.platform);
                return (
                  <Animated.View
                    entering={FadeInUp.delay(200 * index).springify()}
                    key={`${link.id}-${refresh}`}
                   
                  >
                    <Swipeable
                      renderRightActions={() => renderRightActions(link)}
                    >
                      <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => openLink(link.url, link.platform)}
                        onLongPress={() => handleLongPress(link.id)}
                      >
                        <View
                          style={[
                            styles.linkIconContainer,
                            { backgroundColor: `${color}15` },
                          ]}
                        >
                          <Icon size={30} color={color} />
                        </View>
                        <View style={styles.linkInfo}>
                          <Text style={styles.linkTitle}>{link.title}</Text>
                          <Text style={styles.linkUrl}>{link.url}</Text>
                        </View>
                        <ExternalLink size={18} color="#666666" />
                      </TouchableOpacity>
                    </Swipeable>
                  </Animated.View>
                );
              })
            )}
          </ScrollView>
        </View>

        <AddLinkModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          onSuccess={handleSuccess}
          editLink={editLink}
        />
      </View>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  searchIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1A1A1A',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
  },
  categoryButtonActive: {
    backgroundColor: '#7C3AED',
  },
  categoryText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  recentLinksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
  },
  linkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkInfo: {
    flex: 1,
    marginLeft: 16,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  linkUrl: {
    fontSize: 14,
    color: '#666666',
  },
  linkIcon: {
    width: 20,
    height: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
});
