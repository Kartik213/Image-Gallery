const DB_NAME = "image-gallery";
const STORE_NAME = "user-images";
const DELETED_STORE_NAME = "deleted-images";
const DB_VERSION = 2;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME))
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      if (!database.objectStoreNames.contains(DELETED_STORE_NAME))
        database.createObjectStore(DELETED_STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadUserImages() {
  if (!("indexedDB" in window)) return [];

  const database = await openDatabase();
  const rows = await new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  database.close();
  return rows.map((row) => ({
    ...row,
    image_url: URL.createObjectURL(row.file),
  }));
}

export async function saveUserImage(image) {
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, "readwrite")
      .objectStore(STORE_NAME)
      .put(image);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
  database.close();
}

export async function removeUserImage(id) {
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, "readwrite")
      .objectStore(STORE_NAME)
      .delete(id);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
  database.close();
}

export async function markImageDeleted(id) {
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const request = database
      .transaction(DELETED_STORE_NAME, "readwrite")
      .objectStore(DELETED_STORE_NAME)
      .put({ id });
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
  database.close();
}

export async function loadDeletedImageIds() {
  if (!("indexedDB" in window)) return new Set();
  const database = await openDatabase();
  const rows = await new Promise((resolve, reject) => {
    const request = database
      .transaction(DELETED_STORE_NAME, "readonly")
      .objectStore(DELETED_STORE_NAME)
      .getAllKeys();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return new Set(rows);
}
