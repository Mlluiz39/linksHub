import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { addLink } from '../services/db';

interface AddLinkModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PLATFORMS = [
  'YouTube',
  'Instagram',
  'Facebook',
  'Twitter',
  'TikTok',
  'Other',
];

export function AddLinkModal({
  visible,
  onClose,
  onSuccess,
}: AddLinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Resetando os campos sempre que o modal for aberto
  useEffect(() => {
    if (visible) {
      setTitle('');
      setUrl('');
      setPlatform('');
      setError(null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (!title || !url || !platform) {
      setLoading(false);
      return Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }

    try {
      await addLink({ title, url, platform });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      setError('Ocorreu um erro ao adicionar o link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adicionar Novo Link</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Adicionar título do link"
                placeholderTextColor="#666666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL</Text>
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="Adicionar URL"
                placeholderTextColor="#666666"
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plataforma</Text>
              <View style={styles.platformButtons}>
                {PLATFORMS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.platformButton,
                      platform === p && styles.platformButtonActive,
                    ]}
                    onPress={() => setPlatform(p)}
                  >
                    <Text
                      style={[
                        styles.platformButtonText,
                        platform === p && styles.platformButtonTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Salvando...' : 'Salvar Link'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '70%',
    padding: 24,
    ...Platform.select({
      web: {
        maxWidth: 500,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 40,
        borderRadius: 24,
        minHeight: 'auto',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1A1A1A',
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  platformButtonActive: {
    backgroundColor: '#7C3AED',
  },
  platformButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  platformButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});
