import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
}

const adapter = new FileSync<DatabaseSchema>(path.join(__dirname, '../../data/db.json'));
const db = low(adapter);

// Initialize database with default values
db.defaults({ users: [] }).write();

export default db;
