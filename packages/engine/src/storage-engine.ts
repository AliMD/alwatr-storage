import {resolve} from 'node:path';

import {createLogger, globalAlwatr, type AlwatrLogger} from '@alwatr/logger';
import {readJsonFileSync, writeJsonFile, writeJsonFileSync} from '@alwatr/util/node.js';
import exitHook from 'exit-hook';

import type {AlwatrStorageEngineConfig} from './type.js';
import type {AlwatrDocumentStorage, AlwatrDocumentObject, MaybePromise} from '@alwatr/type';

export type {AlwatrDocumentObject, AlwatrDocumentStorage};

globalAlwatr.registeredList.push({
  name: '@alwatr/storage-engine',
  version: _ALWATR_VERSION_,
});

/**
 * Elegant micro in-memory json-like storage with disk backed,
 * Fastest NoSQL Database written in tiny TypeScript ES module.
 *
 * Example:
 *
 * ```ts
 * import {type AlwatrDocumentObject, AlwatrStorageEngine} from '@alwatr/storage-engine';
 *
 * interface User extends AlwatrDocumentObject {
 *   fname: string;
 *   lname: string;
 *   email: string;
 *   token?: string;
 * }
 *
 * const db = new AlwatrStorageEngine<User>({
 *   name: 'user-list',
 *   path: 'db',
 *   saveBeautiful: true,
 *   debug: true,
 * });
 *
 * console.log('db loaded and ready to access.');
 *
 * let ali = db.get('alimd');
 *
 * if (ali == null) {
 *   console.log('ali not found');
 *   ali = {
 *     id: 'alimd',
 *     fname: 'Ali',
 *     lname: 'Mihandoost',
 *     email: 'ali@mihandoost.com',
 *   };
 * }
 * else {
 *   console.log('ali found: %o', ali);
 *   ali.token = Math.random().toString(36).substring(2, 15);
 * }
 *
 * db.set(ali);
 *
 * db.set({
 *   id: 'fmd',
 *   fname: 'Fatemeh',
 *   lname: 'Mihandoost',
 *   email: 'Fatemeh@mihandoost.com',
 *   token: Math.random().toString(36).substring(2, 15),
 * });
 * ```
 */
export class AlwatrStorageEngine<DocumentType extends AlwatrDocumentObject = AlwatrDocumentObject> {
  static readonly formatVersion = 5;

  /**
   * Storage name like database table name.
   */
  readonly name: string;

  /**
   * Storage file full path.
   */
  readonly storagePath: string;

  /**
   * Save debounce timeout for minimal disk iops usage.
   */
  saveDebounce: number;

  /**
   * Write pretty formatted JSON file.
   */
  saveBeautiful: boolean;

  /**
   * The storage has unsaved changes that have not yet saved.
   */
  hasUnsavedChanges = false;

  _storage: AlwatrDocumentStorage<DocumentType>;

  protected _logger: AlwatrLogger;
  protected _keys: string[] | null = null;

  /**
   * All document ids in array.
   */
  get keys(): string[] {
    if (this._keys === null) {
      this._keys = Object.keys(this._storage.data);
    }
    return this._keys;
  }

  /**
   * Size of the storage.
   */
  get length(): number {
    return this.keys.length;
  }

  /**
   * Get next auto increment id for numerical document id.
   */
  protected _nextAutoIncrementId(): string {
    this._storage.meta.lastAutoId;
    do {
      this._storage.meta.lastAutoId++;
    } while (this._storage.data[this._storage.meta.lastAutoId.toString()] != null);
    return this._storage.meta.lastAutoId.toString();
  }

  protected get _newStorage(): AlwatrDocumentStorage<DocumentType> {
    return {
      ok: true,
      meta: {
        id: this.name,
        formatVersion: AlwatrStorageEngine.formatVersion,
        reversion: 0,
        lastUpdated: Date.now(),
        lastAutoId: -1,
      },
      data: {},
    };
  }

  constructor(config: AlwatrStorageEngineConfig) {
    this._logger = createLogger(`alwatr-storage:${config.name}`, config.devMode);
    this._logger.logMethodArgs?.('constructor', config);
    this._$save = this._$save.bind(this);

    this.name = config.name;
    this.storagePath = resolve(`${config.path ?? './db'}/${config.name}.json`);
    this.saveDebounce = config.saveDebounce ?? 1000;
    this.saveBeautiful = config.saveBeautiful || false;

    exitHook(() => this._$save(true));
    this._storage = this.load();

    if (this._storage.meta?.formatVersion !== AlwatrStorageEngine.formatVersion) {
      this._migrateStorage();
      this.save();
    }
  }

  /**
   * load storage file.
   */
  protected load(): AlwatrDocumentStorage<DocumentType> {
    this._logger.logMethodArgs?.('load', {name: this.name, path: this.storagePath});

    const storage = readJsonFileSync<AlwatrDocumentStorage<DocumentType>>(this.storagePath);

    if (storage === null) {
      this._logger.incident?.('load', 'file_not_found', 'Storage path not found, empty storage loaded', {
        path: this.storagePath,
      });
      this.save();
      return this._newStorage;
    }

    if (storage.ok !== true) {
      this._logger.error('load', 'invalid_storage_data', {storage});
      throw new Error('invalid_storage_data');
    }

    return storage;
  }

  protected _migrateStorage(): void {
    if (this._storage.meta == null) {
      this._storage.meta = {
        id: this.name,
        formatVersion: 5,
        reversion: 0,
        lastUpdated: Date.now(),
        lastAutoId: -1,
      };
    }

    if (this._storage.meta.formatVersion === 4) {
      this._storage.meta.id = this.name;
      this._storage.meta.formatVersion = 5;
    }

    if (this._storage.meta.formatVersion !== AlwatrStorageEngine.formatVersion) {
      this._logger.error('load', 'storage_version_incompatible', {storageMeta: this._storage.meta});
      throw new Error('storage_version_incompatible');
    }
  }

  /**
   * Check documentId exist in the storage or not.
   *
   * Example:
   *
   * ```ts
   * if(!userStorage.has('user-1')) throw new Error('user not found');
   * ```
   */
  has(documentId: string): boolean {
    return this._storage.data[documentId] != null;
  }

  /**
   * Get a document object by id.
   *
   * @param documentId The id of the document object.
   * @param fastInstance by default it will return a copy of the document.
   * if you set fastInstance to true, it will return the original document.
   * This is dangerous but much faster, you should use it only if you know what you are doing.
   *
   * Example:
   *
   * ```ts
   * const user = userStorage.get('user-1');
   * ```
   */
  get(documentId: string, fastInstance?: boolean): DocumentType | null {
    this._logger.logMethodArgs?.('get', documentId);

    const documentObject = this._storage.data[documentId] as DocumentType | undefined;
    if (typeof documentObject === 'string') {
      return this.get(documentObject);
    }
    else if (documentObject == null) {
      return null;
    }
    else if (fastInstance) {
      return documentObject;
    }
    else {
      return JSON.parse(JSON.stringify(documentObject));
    }
  }

  /**
   * Insert/update a document object in the storage.
   *
   * @param documentObject The document object to insert/update contain `id`.
   * @param fastInstance by default it will make a copy of the document before set.
   * if you set fastInstance to true, it will set the original document.
   * This is dangerous but much faster, you should use it only if you know what you are doing.
   *
   * Example:
   *
   * ```ts
   * userStorage.set({
   *   id: 'user-1',
   *   foo: 'bar',
   * });
   * ```
   */
  set(documentObject: DocumentType, fastInstance?: boolean): DocumentType {
    this._logger.logMethodArgs?.('set', documentObject.id);

    if (fastInstance !== true) {
      documentObject = JSON.parse(JSON.stringify(documentObject));
    }

    if (documentObject.id === 'auto_increment') {
      documentObject.id = this._nextAutoIncrementId();
    }

    const oldData = this._storage.data[documentObject.id] as DocumentType | undefined;

    if (oldData == null) {
      this._keys = null; // Clear cached keys
    }

    // update meta
    documentObject.meta ??= {
      rev: 0,
      updated: 0,
      created: 0,
    };
    documentObject.meta.updated = Date.now();
    documentObject.meta.created = oldData?.meta?.created ?? documentObject.meta.updated;
    documentObject.meta.rev = (oldData?.meta?.rev ?? 0) + 1;

    this._storage.meta.lastUpdated = documentObject.meta.updated;

    this._storage.data[documentObject.id] = documentObject;

    this.save();
    return documentObject;
  }

  /**
   * Delete a document object from the storage.
   *
   * Example:
   *
   * ```ts
   * userStorage.delete('user-1');
   * ```
   */
  delete(documentId: string): boolean {
    this._logger.logMethodArgs?.('delete', documentId);

    if (this._storage.data[documentId] == null) {
      return false;
    }
    // else
    delete this._storage.data[documentId];

    // Clear cached keys
    this._keys = null;

    this.save();
    return true;
  }

  /**
   * Loop over all document objects.
   *
   * Example:
   *
   * ```ts
   * for(const user of userStorage.allObject()) {
   *   await sendMessage(user.id, 'Happy new year!');
   *   user.sent = true; // direct change document (use with caution)!
   * }
   * ```
   */
  * allObject(): Generator<DocumentType, void, void> {
    for (const documentId of this.keys) {
      const documentObject = this.get(documentId);
      if (documentObject != null) yield documentObject;
    }
    this.save();
  }

  private _saveTimer: NodeJS.Timeout | null = null;

  /**
   * Save the storage to disk (debounced and none blocking).
   */
  save(): void {
    this._logger.logMethod?.('save');
    this.hasUnsavedChanges = true;
    if (this._saveTimer != null) return; // save already requested
    this._saveTimer = setTimeout(this._$save, this.saveDebounce);
  }

  /**
   * Save the storage to disk without any debounce (none blocking) when `this.hasUnsavedChanges` is true.
   *
   * @param [emergency=false] - Recommend to ignore it (default is false) for none blocking IO.
   */
  private _$save(emergency = false): MaybePromise<void> {
    this._logger.logMethod?.('_$save');

    if (this._saveTimer != null) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }

    if (this.hasUnsavedChanges) {
      this.hasUnsavedChanges = false;
      this._storage.meta.reversion++;
      if (emergency) {
        return writeJsonFileSync(this.storagePath, this._storage, 'rename', this.saveBeautiful ? 2 : undefined);
      }
      // else
      return writeJsonFile(this.storagePath, this._storage, 'replace', this.saveBeautiful ? 2 : undefined);
    }
  }

  /**
   * Unload storage data and free ram usage (auto saved before unload).
   *
   * Example:
   *
   * ```ts
   * userStorage.unload();
   * delete userStorage;
   * ```
   */
  unload(): void {
    this._logger.logMethod?.('unload');
    this._$save();
    this._keys = null;
    this._storage = this._newStorage;
  }
}
