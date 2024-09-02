import {createLogger} from '@alwatr/logger';
import {
  StoreFileType,
  StoreFileExtension,
  type StoreFileId,
  type CollectionContext,
  type CollectionItem,
  type CollectionItemMeta,
  type StoreFileMeta,
} from '@alwatr/store-types';
import {waitForImmediate, waitForTimeout} from '@alwatr/wait';

import {logger} from './logger.js';
import {getStoreId, getStorePath} from './util.js';

import type {Dictionary, JsonObject} from '@alwatr/type-helper';

logger.logModule?.('collection-reference');

/**
 * Represents a reference to a collection of the AlwatrStore.
 * Provides methods to interact with the collection, such as retrieving, creating, updating, and deleting items.
 *
 * @template TItem - The data type of the collection items.
 */
export class CollectionReference<TItem extends JsonObject = JsonObject> {
  /**
   * Alwatr store engine version string.
   */
  static readonly version = __package_version__;

  /**
   * Alwatr store engine file format version number.
   */
  static readonly fileFormatVersion = 3;

  /**
   * Creates new CollectionReference instance from stat.
   *
   * @param stat the collection stat.
   * @param initialData the collection data.
   * @param updatedCallback the callback to invoke when the collection changed.
   * @template TItem The collection item data type.
   * @returns A new collection reference class.
   */
  static newRefFromData<TItem extends JsonObject>(
    stat: StoreFileId,
    initialData: CollectionContext<TItem>['data'] | null,
    updatedCallback: (from: CollectionReference<TItem>) => void,
    debugDomain?: string,
  ): CollectionReference<TItem> {
    logger.logMethodArgs?.('col.newRefFromData', stat);

    const now = Date.now();
    const initialContext: CollectionContext<TItem> = {
      ok: true,
      meta: {
        ...stat,
        rev: 1,
        updated: now,
        created: now,
        lastAutoId: 0,
        type: StoreFileType.Collection,
        extension: StoreFileExtension.Json,
        fv: CollectionReference.fileFormatVersion,
        extra: {},
      },
      data: initialData ?? {},
    };

    return new CollectionReference(initialContext, updatedCallback, debugDomain);
  }

  /**
   * Creates new CollectionReference instance from CollectionContext.
   *
   * @param context the collection context.
   * @param updatedCallback the callback to invoke when the collection changed.
   * @template TItem The collection item data type.
   * @returns A new collection reference class.
   */
  static newRefFromContext<TItem extends JsonObject>(
    context: CollectionContext<TItem>,
    updatedCallback: (from: CollectionReference<TItem>) => void,
    debugDomain?: string,
  ): CollectionReference<TItem> {
    logger.logMethodArgs?.('col.newRefFromContext', context.meta);
    return new CollectionReference(context, updatedCallback, debugDomain);
  }

  /**
   * Validates the collection context and try to migrate it to the latest version.
   */
  private validateContext__(): void {
    this.logger__.logMethod?.('validateContext__');

    if (this.context__.ok !== true) {
      this.logger__.accident?.('validateContext__', 'store_not_ok');
      throw new Error('store_not_ok', {cause: {context: this.context__}});
    }

    if (this.context__.meta === undefined) {
      this.logger__.accident?.('validateContext__', 'store_meta_undefined');
      throw new Error('store_meta_undefined', {cause: {context: this.context__}});
    }

    if (this.context__.meta.type !== StoreFileType.Collection) {
      this.logger__.accident?.('validateContext__', 'collection_type_invalid', this.context__.meta);
      throw new Error('collection_type_invalid', {cause: this.context__.meta});
    }

    if (this.context__.meta.fv !== CollectionReference.fileFormatVersion) {
      this.logger__.incident?.('validateContext__', 'store_file_version_incompatible', {
        old: this.context__.meta.fv,
        new: CollectionReference.fileFormatVersion,
      });
      this.migrateContext__();
    }
  }

  /**
   * Migrate the collection context to the latest.
   */
  private migrateContext__(): void {
    if (this.context__.meta.fv === CollectionReference.fileFormatVersion) return;

    this.logger__.logMethod?.('migrateContext__');

    if (this.context__.meta.fv > CollectionReference.fileFormatVersion) {
      this.logger__.accident('migrateContext__', 'store_version_incompatible', this.context__.meta);
      throw new Error('store_version_incompatible', {cause: this.context__.meta});
    }

    if (this.context__.meta.fv === 1) {
      // migrate from v1 to v2
      // this.context__.meta.schemaVer = 0
      this.context__.meta.fv = 2;
    }

    if (this.context__.meta.fv === 2) {
      // migrate from v1 to v3
      if (this.context__.meta.schemaVer === undefined || this.context__.meta.schemaVer === 0) {
        this.context__.meta.schemaVer = 1;
      }
      delete (this.context__.meta as Dictionary)['ver'];
      this.context__.meta.extra ??= {};
      this.context__.meta.fv = 3;
    }

    this.updated__();
  }

  /**
   * The ID of the collection store file.
   */
  readonly id: string;

  /**
   * The location path of the collection store file.
   */
  readonly path: string;

  /**
   * Indicates whether the collection has unsaved changes.
   */
  hasUnprocessedChanges_ = false;

  /**
   * Logger instance for this collection.
   */
  private logger__;

  /**
   * Collection reference have methods to get, set, update and save the Alwatr Store Collection.
   * This class is dummy in saving and loading the collection from file.
   * It's the responsibility of the Alwatr Store to save and load the collection.
   *
   * @param context__ Collection's context filled from the Alwatr Store (parent).
   * @param updatedCallback__ updated callback to invoke when the collection is updated from the Alwatr Store (parent).
   * @template TItem - Items data type.
   * @example
   * ```typescript
   * const collectionRef = alwatrStore.col('blog/posts');
   * ```
   */
  constructor(
    private context__: CollectionContext<TItem>,
    private updatedCallback__: (from: CollectionReference<TItem>) => void,
    debugDomain?: string,
  ) {
    this.id = getStoreId(this.context__.meta);
    this.path = getStorePath(this.context__.meta);

    debugDomain ??= this.id.slice(0, 20);
    this.logger__ = createLogger(`col:${debugDomain}`);

    this.logger__.logMethodArgs?.('new', {id: this.id});

    this.validateContext__();
  }

  /**
   * Get store schema version
   *
   * @returns store schema version
   */
  get schemaVer(): number {
    return this.context__.meta.schemaVer ?? 1;
  }

  /**
   * Set store schema version for migrate
   */
  set schemaVer(ver: number) {
    this.logger__.logMethodArgs?.('set schemaVer', {old: this.context__.meta.schemaVer, new: ver});
    this.context__.meta.schemaVer = ver;
    this.updated__();
  }

  /**
   * Indicates whether the collection data is frozen and cannot be saved.
   */
  private _freeze = false;

  /**
   * Gets the freeze status of the collection data.
   *
   * @returns `true` if the collection data is frozen, `false` otherwise.
   *
   * @example
   * ```typescript
   * const isFrozen = collectionRef.freeze;
   * console.log(isFrozen); // Output: false
   * ```
   */
  get freeze(): boolean {
    return this._freeze;
  }

  /**
   * Sets the freeze status of the collection data.
   *
   * @param value - The freeze status to set.
   *
   * @example
   * ```typescript
   * collectionRef.freeze = true;
   * console.log(collectionRef.freeze); // Output: true
   * ```
   */
  set freeze(value: boolean) {
    this.logger__.logMethodArgs?.('freeze changed', {value});
    this._freeze = value;
  }

  /**
   * Checks if an item exists in the collection.
   *
   * @param itemId - The ID of the item.
   * @returns `true` if the item with the given ID exists in the collection, `false` otherwise.
   *
   * @example
   * ```typescript
   * const doesExist = collectionRef.itemExists('item1');
   *
   * if (doesExist) {
   *    collectionRef.create('item1', { key: 'value' });
   * }
   * ```
   */
  itemExists(itemId: string | number): boolean {
    const exists = Object.hasOwn(this.context__.data, itemId);
    this.logger__.logMethodFull?.('itemExists', itemId, exists);
    return exists;
  }

  /**
   * Retrieves the metadata of the store file.
   *
   * @returns The metadata of the store file.
   *
   * @example
   * ```typescript
   * const metadata = collectionRef.getStoreMeta();
   * ```
   */
  getStoreMeta(): Readonly<StoreFileMeta> {
    this.logger__.logMethod?.('getStoreMeta');
    return this.context__.meta;
  }

  /**
   * Retrieves an item from the collection. If the item does not exist, an error is thrown.
   *
   * @param itemId - The ID of the item.
   * @returns The item with the given ID.
   */
  private item__(itemId: string | number): CollectionItem<TItem> {
    const item = this.context__.data[itemId];
    if (item === undefined) {
      this.logger__.accident('item__', 'collection_item_not_found', {itemId});
      throw new Error('collection_item_not_found', {cause: {itemId}});
    }
    return item;
  }

  /**
   * Retrieves an item's metadata from the collection. If the item does not exist, an error is thrown.
   *
   * @param itemId - The ID of the item.
   * @returns The metadata of the item with the given ID.
   * @example
   * ```typescript
   * const itemMeta = collectionRef.getItemMeta('item1');
   * ```
   */
  getItemMeta(itemId: string | number): Readonly<CollectionItemMeta> {
    const meta = this.item__(itemId).meta;
    this.logger__.logMethodFull?.('getItemMeta', itemId, meta);
    return meta;
  }

  /**
   * Retrieves an item's data from the collection. If the item does not exist, an error is thrown.
   *
   * @param itemId - The ID of the item.
   * @returns The data of the item with the given ID.
   *
   * @example
   * ```typescript
   * const itemData = collectionRef.getItemData('item1');
   * ```
   */
  getItemData(itemId: string | number): TItem {
    this.logger__.logMethodArgs?.('getItemData', itemId);
    return this.item__(itemId).data;
  }

  /**
   * Direct access to an item.
   * If the item does not exist, `undefined` is returned.
   * **USE WITH CAUTION!**
   *
   * @param itemId - The ID of the item.
   * @returns The data of the item with the given ID or `undefined` if the item does not exist.
   *
   * @example
   * ```typescript
   * collectionRef.getItemContext_('item1')?.data.name = 'test2';
   * ```
   */
  getItemContext_(itemId: string | number): CollectionItem<TItem> | undefined {
    this.logger__.logMethodArgs?.('getItemContext_', itemId);
    return this.context__.data[itemId];
  }

  /**
   * Add a new item to the collection.
   * If an item with the given ID already exists, an error is thrown.
   *
   * @param itemId - The ID of the item to create.
   * @param data - The initial data of the item.
   *
   * @example
   * ```typescript
   * collectionRef.addItem('item1', { key: 'value' });
   * ```
   */
  addItem(itemId: string | number, data: TItem): void {
    this.logger__.logMethodArgs?.('addItem', {itemId, data});
    if (this.itemExists(itemId)) {
      this.logger__.accident('addItem', 'collection_item_exist', {itemId});
      throw new Error('collection_item_exist', {cause: {itemId}});
    }

    const now = Date.now();

    this.context__.data[itemId] = {
      meta: {
        id: itemId,
        // other prop calc in updateMeta__
        rev: 0,
        created: now,
        updated: now,
      },
      data,
    };
    this.updated__(itemId);
  }

  /**
   * Appends the given data to the collection with auto increment ID.
   *
   * @param data - The data to append.
   * @returns The ID of the appended item.
   *
   * @example
   * ```typescript
   * const newId = collectionRef.appendItem({ key: 'value' });
   * ```
   */
  appendItem(data: TItem): string | number {
    this.logger__.logMethodArgs?.('appendItem', data);
    const id = this.nextAutoIncrementId__();
    this.addItem(id, data);
    return id;
  }

  /**
   * Removes an item from the collection.
   *
   * @param itemId - The ID of the item to delete.
   *
   * @example
   * ```typescript
   * collectionRef.removeItem('item1');
   * collectionRef.itemExists('item1'); // Output: false
   * ```
   */
  removeItem(itemId: string | number): void {
    this.logger__.logMethodArgs?.('removeItem', itemId);
    delete this.context__.data[itemId];
    this.updated__();
  }

  /**
   * Sets an item's data in the collection. Replaces the item's data with the given data.
   *
   * @param itemId - The ID of the item to set.
   * @param data - The data to set for the item.
   *
   * @example
   * ```typescript
   * collectionRef.replaceItemData('item1', { a: 1, b: 2, c: 3 });
   * ```
   */
  replaceItemData(itemId: string | number, data: TItem): void {
    this.logger__.logMethodArgs?.('replaceItemData', {itemId, data});
    (this.item__(itemId).data as unknown) = data;
    this.updated__(itemId);
  }

  /**
   * Updates an item in the collection by merging a partial update into the item's data.
   *
   * @param itemId - The ID of the item to update.
   * @param data - The part of data to merge into the item's data.
   *
   * @example
   * ```typescript
   * collectionRef.mergeItemData(itemId, partialUpdate);
   * ```
   */
  mergeItemData(itemId: string | number, data: Partial<TItem>): void {
    this.logger__.logMethodArgs?.('mergeItemData', {itemId, data});
    Object.assign(this.item__(itemId).data, data);
    this.updated__(itemId);
  }

  /**
   * Requests the Alwatr Store to save the collection.
   * Saving may take some time in Alwatr Store due to the use of throttling.
   *
   * @example
   * ```typescript
   * collectionRef.save();
   * ```
   */
  save(): void {
    this.logger__.logMethod?.('save');
    this.updated__(null, false);
  }

  /**
   * Requests the Alwatr Store to save the collection immediately.
   *
   * @example
   * ```typescript
   * collectionRef.saveImmediate();
   * ```
   */
  saveImmediate(): void {
    this.logger__.logMethod?.('saveImmediate');
    this.updated__(null, true);
  }

  /**
   * Retrieves the IDs of all items in the collection in array.
   * Impact performance if the collection is large, use `ids()` instead.
   *
   * @returns Array of IDs of all items in the collection.
   * @example
   * ```typescript
   * const ids = collectionRef.keys();
   * ```
   */
  keys(): string[] {
    this.logger__.logMethod?.('keys');
    return Object.keys(this.context__.data);
  }

  /**
   * Retrieves all items in the collection in array.
   * Impact performance if the collection is large, use `items()` instead.
   *
   * @returns Array of all items in the collection.
   * @example
   * ```typescript
   * const items = collectionRef.values();
   * console.log('meta: %o', items[0].meta);
   * console.log('data: %o', items[0].data);
   * ```
   */
  values(): CollectionItem<TItem>[] {
    this.logger__.logMethod?.('values');
    return Object.values(this.context__.data);
  }

  /**
   * Retrieves the IDs of all items in the collection.
   * Use this method instead of `keys()` if the collection is large.
   * This method is a generator and can be used in `for...of` loops.
   * @returns Generator of IDs of all items in the collection.
   * @example
   * ```typescript
   * for (const id of collectionRef.ids()) {
   *   const doc = collectionRef.get(id);
   * }
   * ```
   */
  *ids(): Generator<string, void, void> {
    this.logger__.logMethod?.('ids');
    for (const id in this.context__.data) {
      yield id;
    }
  }

  /**
   * Retrieves all items in the collection.
   * Use this method instead of `values()` if the collection is large.
   * This method is a generator and can be used in `for...of` loops.
   * @returns Generator of all items in the collection.
   * @example
   * ```typescript
   * for (const item of collectionRef.items()) {
   *  console.log(item.data);
   * }
   */
  *items(): Generator<CollectionItem<TItem>, void, void> {
    this.logger__.logMethod?.('items');
    for (const id in this.context__.data) {
      yield this.context__.data[id];
    }
  }

  /**
   * Retrieves the full context of the collection.
   *
   * @returns The full context of the collection.
   *
   * @example
   * ```typescript
   * const context = collectionRef.getFullContext_();
   * ```
   */
  getFullContext_(): Readonly<CollectionContext<TItem>> {
    this.logger__.logMethod?.('getFullContext_');
    return this.context__;
  }

  updateDelayed_ = false;

  /**
   * Update the document metadata and invoke the updated callback.
   * This method is throttled to prevent multiple updates in a short time.
   *
   * @param itemId - The ID of the item to update.
   */
  private async updated__(itemId: string | number | null = null, immediate = false): Promise<void> {
    this.logger__.logMethodArgs?.('updated__', {id: itemId, immediate, delayed: this.updateDelayed_});

    this.hasUnprocessedChanges_ = true;
    if (itemId !== null) this.refreshMeta_(itemId); // meta must updated per item

    if (immediate === false && this.updateDelayed_ === true) return;
    // else

    this.updateDelayed_ = true;

    if (immediate === true || this.context__.meta.changeDebounce === undefined) {
      await waitForImmediate();
    }
    else {
      await waitForTimeout(this.context__.meta.changeDebounce);
    }

    if (this.updateDelayed_ !== true) return; // another parallel update finished!
    this.updateDelayed_ = false;

    if (itemId === null) this.refreshMeta_(itemId); // root meta not updated for null

    if (this._freeze === true) return; // prevent save if frozen
    this.updatedCallback__.call(null, this);
  }

  /**
   * Refresh/recalculate the collection's metadata timestamp and revision.
   *
   * @param itemId - The ID of the item to update.
   */
  protected refreshMeta_(itemId: string | number | null): void {
    this.logger__.logMethodArgs?.('refreshMeta_', {id: itemId});
    const now = Date.now();
    this.context__.meta.rev++;
    this.context__.meta.updated = now;
    if (itemId !== null) {
      const itemMeta = this.item__(itemId).meta;
      itemMeta.rev++;
      itemMeta.updated = now;
    }
  }

  /**
   * Generates the next auto increment ID.
   *
   * @returns The next auto increment ID.
   * @example
   * ```typescript
   * const nextId = this.nextAutoIncrementId_();
   * ```
   */
  private nextAutoIncrementId__(): number {
    this.logger__.logMethod?.('nextAutoIncrementId__');
    const meta = this.context__.meta as Required<StoreFileMeta>;
    do {
      meta.lastAutoId++;
    } while (meta.lastAutoId in this.context__.data);
    return meta.lastAutoId;
  }
}
