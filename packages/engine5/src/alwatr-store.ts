import {resolve} from 'node:path';

import {CollectionReference} from './lib/collection-reference.js';
import {DocumentReference} from './lib/document-reference.js';
import {logger} from './lib/logger.js';
import {readJsonFile, writeJsonFile} from './lib/util.js';
import {
  StoreFileType,
  StoreFileEncoding,
  Region,
  type StoreFileStat,
  type AlwatrStoreConfig,
  type StoreFileContext,
  type CollectionContext,
  type DocumentContext,
} from './type.js';

logger.logModule?.('alwatr-store');

/**
 * AlwatrStore engine.
 *
 * It provides methods to read, write, validate, and manage store files.
 * It also provides methods to interact with `documents` and `collections` in the store.
 */
export class AlwatrStore {
  /**
   * The Alwatr Store version string.
   *
   * Use for store file format version for check compatibility.
   */
  static readonly version = __package_version;

  /**
   * Validates a store file with the provided context and try to migrate if needed.
   *
   * @param context The store file context.
   */
  protected static validateStoreFile_(context: StoreFileContext<Record<string, unknown>>): void {
    logger.logMethodArgs?.('_validateStoreFile', {id: context.meta});

    if (context.ok !== true) {
      throw new Error('store_not_ok', {cause: context});
    }

    if (context.meta?.ver !== AlwatrStore.version) {
      logger.accident?.('_validateStoreFile', 'store_version_incompatible', {
        fileVersion: context.meta.ver,
        currentVersion: AlwatrStore.version,
      });

      switch (context.meta?.type) {
        case StoreFileType.document: {
          DocumentReference.migrateContext_(context);
          break;
        }

        case StoreFileType.collection: {
          CollectionReference.migrateContext_(context);
          break;
        }

        default:
          throw new Error('store_file_type_not_supported', {cause: context.meta});
      }
    }
  }

  /**
   * `collectionReference` of all `storeFileStat`s.
   * This is the root store collection.
   */
  protected storeFilesCollection_;

  /**
   * Constructs an AlwatrStore instance with the provided configuration.
   *
   * @param config The configuration of the AlwatrStore engine.
   * @example
   * ```typescript
   * const alwatrStore = new AlwatrStore({
   *   rootPath: './db',
   *   saveDebounce: 100,
   * });
   * ```
   */
  constructor(readonly config: AlwatrStoreConfig) {
    logger.logMethodArgs?.('new', config);
    this.storeFilesCollection_ = this.loadRootStoreDocument_();
  }

  /**
   * Checks if a store file with the given id exists.
   *
   * @param id store file id
   * @returns true if a store file with the given id exists, false otherwise
   * @example
   * ```typescript
   * if (!alwatrStore.exists('user1/profile')) {
   *   alwatrStore.defineDocument(...)
   * }
   * ```
   */
  exists(id: string): boolean {
    const exists = id in this.storeFilesCollection_.get();
    logger.logMethodFull?.('exists', id, exists);
    return exists;
  }

  /**
   * Returns the stats of a store file with the given id from the root store document without loading the store file.
   * If the store file does not exist, an error is thrown.
   *
   * @param id store file id
   * @returns file store stat
   * @example
   * ```typescript
   * const stat = alwatrStore.stat('user1/order-list');
   * console.log(stat.type); // collection
   * ```
   */
  stat(id: string): Readonly<StoreFileStat> {
    const stat = this.storeFilesCollection_.get()[id] ?? null;
    logger.logMethodFull?.('stat', id, stat);
    if (stat === null) throw new Error('store_file_not_defined', {cause: {id}});
    return stat;
  }

  /**
   * Defines a document in the store with the given configuration and initial data.
   * Document defined immediately and you don't need to await, unless you want to catch writeContext errors.
   *
   * @template TDoc document data type
   * @param config store file config
   * @param initialData initial data for the document
   * @example
   * ```typescript
   * await alwatrStore.defineDocument<Order>({
   *  id: 'user1/profile',
   *  region: Region.PerUser,
   *  ttl: StoreFileTTL.medium,
   * }, {
   *   name: 'Ali',
   *   email: 'ali@alwatr.io',
   * });
   * ```
   */
  defineDocument<TDoc extends Record<string, unknown>>(
    config: Pick<StoreFileStat, 'id' | 'region' | 'ttl'>,
    initialData: TDoc,
  ): Promise<void> {
    logger.logMethodArgs?.('defineDocument', config);

    const stat: StoreFileStat = {
      ...config,
      type: StoreFileType.document,
      encoding: StoreFileEncoding.json,
    };

    this.addStoreFile_(stat);
    return this.writeContext_(stat.id, DocumentReference.newContext_(config.id, config.region, initialData));
  }

  /**
   * Defines a collection in the store with the given configuration.
   * collection defined immediately and you don't need to await, unless you want to catch writeContext errors.
   *
   * @param config store file config
   * @example
   * ```typescript
   * alwatrStore.defineCollection({
   *   id: 'user1/orders',
   *   region: Region.PerUser,
   *   ttl: StoreFileTTL.medium,
   * });
   * ```
   */
  defineCollection(config: Pick<StoreFileStat, 'id' | 'region' | 'ttl'>): Promise<void> {
    logger.logMethodArgs?.('defineCollection', config);

    const stat: StoreFileStat = {
      ...config,
      type: StoreFileType.collection,
      encoding: StoreFileEncoding.json,
    };

    this.addStoreFile_(stat);
    return this.writeContext_(stat.id, CollectionReference.newContext_(config.id, config.region));
  }

  /**
   * Create and return a DocumentReference for a document with the given id.
   * If the document not exists or its not a document, an error is thrown.
   *
   * @template TDoc document data type
   * @param id document id
   * @returns document reference {@link DocumentReference}
   * @example
   * ```typescript
   * const doc = await alwatrStore.doc<User>('user1/profile');
   * doc.update({name: 'ali'});
   * ```
   */
  async doc<TDoc extends Record<string, unknown>>(id: string): Promise<DocumentReference<TDoc>> {
    logger.logMethodArgs?.('doc', id);
    if (this.exists(id) === false) throw new Error('document_not_found', {cause: {id}});
    const stat = this.stat(id);
    if (stat.type != StoreFileType.document) {
      logger.error?.('doc', 'document_wrong_type', stat);
      throw new Error('document_not_found', {cause: stat});
    }
    return new DocumentReference((await this.getContext_(id)) as DocumentContext<TDoc>, this.writeContext_.bind(this));
  }

  /**
   * Create and return a CollectionReference for a collection with the given id.
   * If the collection not exists or its not a collection, an error is thrown.
   *
   * @template TItem collection item data type
   * @param id collection id
   * @returns collection reference {@link CollectionReference}
   * @example
   * ```typescript
   * const collection = await alwatrStore.collection<Order>('user1/orders');
   * collection.add({name: 'order 1'});
   * ```
   */
  async collection<TItem extends Record<string, unknown>>(id: string): Promise<CollectionReference<TItem>> {
    logger.logMethodArgs?.('collection', id);
    if (this.exists(id) === false) throw new Error('collection_not_found', {cause: {id}});
    const stat = this.stat(id);
    if (stat.type != StoreFileType.collection) {
      logger.error?.('collection', 'collection_wrong_type', stat);
      throw new Error('collection_not_found', {cause: stat});
    }
    return new CollectionReference(
      (await this.getContext_(id)) as CollectionContext<TItem>,
      this.writeContext_.bind(this),
    );
  }

  /**
   * Unloads the store file with the given id from memory.
   *
   * @param id The unique identifier of the store file.
   * @example
   * ```typescript
   * alwatrStore.unload('user1/profile');
   * alwatrStore.exists('user1/orders'); // true
   * ```
   */
  unload(id: string): void {
    logger.logMethodArgs?.('unload', id);
    // TODO: this.save_(id);
    delete this.memoryContextRecord_[id];
  }

  /**
   * Deletes the store file with the given id from the store and unload it from memory.
   *
   * @param id The unique identifier of the store file.
   * @example
   * ```typescript
   * alwatrStore.deleteFile('user1/profile');
   * alwatrStore.exists('user1/orders'); // false
   * ```
   */
  deleteFile(id: string): void {
    logger.logMethodArgs?.('deleteFile', id);
    if (id in this.memoryContextRecord_) {
      this.unload(id);
    }
    // TODO: AlwatrStore.deleteStoreFile_(this.stat(id));
    delete this.storeFilesCollection_.get()[id];
  }

  /**
   * Keep all loaded store file context loaded in memory.
   */
  private memoryContextRecord_: Record<string, StoreFileContext> = {};

  /**
   * Get store file context.
   * If the store file not exists, an error is thrown.
   * If the store file is loaded, it will be returned from memory.
   * If the store file is not loaded, it will be loaded from disk.
   *
   * @param id The unique identifier of the store file.
   * @returns store file context
   * @example
   * ```typescript
   * const context = await this.getContext_('user1/profile');
   * console.log(context.data.name); // ali
   * ```
   */
  protected async getContext_(id: string): Promise<StoreFileContext> {
    logger.logMethodArgs?.('getContext', id);

    if (id in this.memoryContextRecord_) {
      return this.memoryContextRecord_[id];
    }

    const stat = this.stat(id);

    const path = this.storeFilePath_(stat);

    return (this.memoryContextRecord_[id] = (await readJsonFile(path)) as StoreFileContext);
  }

  /**
   * Write store file context.
   * If the store file not exists, an error is thrown.
   *
   * @param id The unique identifier of the store file.
   * @param context The store file context. If not provided, it will be loaded from memory.
   * @example
   * ```typescript
   * await this.writeContext_('user1/profile');
   * ```
   */
  protected async writeContext_(id: string, context?: StoreFileContext): Promise<void> {
    logger.logMethodArgs?.('writeContext', id);
    const stat = this.stat(id);
    const path = this.storeFilePath_(stat);

    if (context !== undefined) {
      this.memoryContextRecord_[id] = context;
    }
    else {
      context = this.memoryContextRecord_[id];
      if (context === undefined) {
        logger.error?.('writeContext_', 'store_file_unloaded', {id});
        throw new Error('store_file_unloaded', {cause: {id}});
      }
    }

    return await writeJsonFile(path, context, 'rename');
  }

  /**
   * Calculate store file path.
   *
   * @param stat The store file stat.
   * @returns store file path
   * @example
   * ```typescript
   * const path = this.storeFilePath_({
   *   id: 'user1/profile',
   *   region: Region.Secret,
   *   type: StoreFileType.document,
   *   encoding: StoreFileEncoding.json,
   * });
   * console.log(path); // /rootPath/s/user1/profile.doc.ajs
   * ```
   */
  protected storeFilePath_(stat: StoreFileStat): string {
    const regionPath = stat.region;

    if (stat.region === Region.PerUser) {
      // TODO:
    }

    return resolve(this.config.rootPath, regionPath, `${stat.id}.${stat.type}.${stat.encoding}`);
  }

  /**
   * Load storeFilesCollection or create new one.
   */
  protected loadRootStoreDocument_(): DocumentReference<Record<string, StoreFileStat>> {
    // TODO: load root meta or make empty and save
    const context = DocumentReference.newContext_<Record<string, StoreFileStat>>('.store-files', Region.Secret, {});
    return new DocumentReference(context, this.rootStoreUpdated_.bind(this));
  }

  /**
   * Handles updates to the root store document.
   */
  protected rootStoreUpdated_() {
    logger.logMethod?.('rootStoreUpdated_');
    // TODO: save
  }

  /**
   * @param stat store file stat
   *
   * Adds a new store file to the root storeFilesCollection.
   */
  protected addStoreFile_(stat: StoreFileStat) {
    logger.logMethodArgs?.('_addStoreFile', stat);
    this.storeFilesCollection_.update({[stat.id]: stat});
  }
}