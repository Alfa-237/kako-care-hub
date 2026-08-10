// Couche de stockage abstraite (local-first).
// L'implémentation actuelle utilise localStorage ; elle pourra être remplacée
// par SQLite/fichier local lors du passage en application Windows.

export interface StorageAdapter {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  private memory = new Map<string, string>();

  private get store(): Storage | null {
    return typeof window === "undefined" ? null : window.localStorage;
  }

  async read<T>(key: string): Promise<T | null> {
    const raw = this.store ? this.store.getItem(key) : (this.memory.get(key) ?? null);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async write<T>(key: string, value: T): Promise<void> {
    const raw = JSON.stringify(value);
    if (this.store) this.store.setItem(key, raw);
    else this.memory.set(key, raw);
  }

  async remove(key: string): Promise<void> {
    if (this.store) this.store.removeItem(key);
    else this.memory.delete(key);
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();

export const DB_KEY = "kako.db.v1";
export const SESSION_KEY = "kako.session.v1";
