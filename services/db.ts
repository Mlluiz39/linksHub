import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('links.db');

const initializeDb = async () => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, url TEXT NOT NULL, platform TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
    );
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

interface Link {
  title: string;
  url: string;
  platform: string;
}

// Função para adicionar um link
const addLink = async (link: Link) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'INSERT INTO links (title, url, platform) VALUES (?, ?, ?)',
      [link.title, link.url, link.platform]
    );
  } catch (error) {
    console.error('Erro ao adicionar link:', error);
  }
};

// Função para buscar todos os links corretamente
const getLinks = async () => {
  try {
    const db = await dbPromise;
    const result = await db.getAllAsync(
      'SELECT * FROM links ORDER BY created_at DESC'
    );
    return result; // Retorna um array de objetos
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    return [];
  }
};

// Função para editar link pelo ID

const updateLink = async (id: number, link: Link) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'UPDATE links SET title = ?, url = ?, platform = ? WHERE id = ?',
      [link.title, link.url, link.platform, id]
    );
  } catch (error) {
    console.error('Erro ao editar link:', error);
  }
};

// Função para deletar um link pelo ID
const deleteLink = async (id: number) => {
  try {
    const db = await dbPromise;
    await db.runAsync('DELETE FROM links WHERE id = ?', [id]);
  } catch (error) {
    console.error('Erro ao deletar link:', error);
  }
};

// Inicializar o banco ao carregar o app
initializeDb();

export { addLink, getLinks, updateLink, deleteLink, dbPromise };
