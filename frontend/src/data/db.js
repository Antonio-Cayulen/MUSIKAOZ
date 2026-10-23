import seedData from './seedData.json'; // Se importan los datos iniciales desde un archivo JSON

const STORAGE_KEY = 'marketplace.db.v1'; // Clave para almacenar los datos en localStorage

const clone = (value) => JSON.parse(JSON.stringify(value)); //  Función para trabajar los datos sin ensuciar los la DB de prueba. (seedData)

const loadSeed = () => clone(seedData); // Función para cargar los datos iniciales desde el archivo JSON, es una copia.

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); // Se leen los datos, buscando por la clave STORAGE_KEY en el localStorage. Si no se encuentran, se cargan los datos iniciales desde el archivo JSON y se guardan en el localStorage.
    if (!raw) { // Si no se encuentran...
      const seed = loadSeed(); // Se cargan los datos iniciales desde el archivo JSON.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); // Se guardan en el localStorage bajo la clave STORAGE_KEY.
      return seed; // Se devuelve la copia de los datos iniciales.
    }
    return JSON.parse(raw); // Si se encuentran, se parsean y se devuelven como un objeto JavaScript.
  } catch {
    const seed = loadSeed(); // Si ocurre un error al leer o parsear los datos, se cargan los datos iniciales desde el archivo JSON.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
};

const write = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const nextId = (collection) => {
  if (collection.length === 0) return 1; // Si collection está vacía, el siguiente id disponible es 1.
  return Math.max(...collection.map((item) => item.id)) + 1; // Expande la coleccion, obtiene el id maximo y le suma 1 para obtener el siguiente id disponible.
};

const findCollection = (state, name) => {
  if (!state[name]) {
    state[name] = [];
  }
  return state[name];
};

export const resetDatabase = async () => {
  write(loadSeed());
};

export const list = async (collectionName) => {
  const state = read();
  return clone(findCollection(state, collectionName));
};

export const findById = async (collectionName, id) => {
  const state = read();
  const found = findCollection(state, collectionName).find(
    (item) => item.id === Number(id)
  );
  return found ? clone(found) : null;
};

export const findBy = async (collectionName, predicate) => {
  const state = read();
  const items = findCollection(state, collectionName);

  const fn = typeof predicate === 'function'
    ? predicate
    : new Function('item', `return Boolean(${predicate});`);

  const found = items.find((item) => fn(clone(item)));
  return found ? clone(found) : null;
};

export const create = async (collectionName, entity) => {
  const state = read();
  const collection = findCollection(state, collectionName);
  const created = { ...clone(entity), id: nextId(collection) };
  collection.push(created);
  write(state);
  return clone(created);
};

export const update = async (collectionName, id, patch) => {
  const state = read();
  const collection = findCollection(state, collectionName);
  const index = collection.findIndex((item) => item.id === Number(id));
  if (index === -1) return null;
  const merged = { ...collection[index], ...clone(patch), id: collection[index].id };
  collection[index] = merged;
  write(state);
  return clone(merged);
};

export const remove = async (collectionName, id) => {
  const state = read();
  const collection = findCollection(state, collectionName);
  const index = collection.findIndex((item) => item.id === Number(id));
  if (index === -1) return false;
  collection.splice(index, 1);
  write(state);
  return true;
};

export const db = {
  reset: resetDatabase,
  list,
  findById,
  findBy,
  create,
  update,
  remove,
};

export default db;