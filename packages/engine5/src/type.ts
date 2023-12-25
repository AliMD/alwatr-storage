export type MaybePromise<T> = T | Promise<T>;

// *** Configs ***

export interface AlwatrStoreConfig {
  /**
   * The root path of the storage.
   * This is where the AlwatrStore will store its data.
   */
  rootPath: string;

  /**
   * The save debounce timeout in milliseconds for minimal disk I/O usage.
   * This is used to limit the frequency of disk writes for performance reasons.
   * The recommended value is `50`.
   */
  saveDebounce: number;
}


// *** Store File ***

/**
 * The subdirectory location for each store file.
 */
export enum Region {
  /**
   * Store file location that can be accessed by anyone.
   */
  Public = 'p',

  /**
   * Store file location that can be accessed by authenticated users.
   */
  Authenticated = 'a',

  /**
   * Store file location that can be accessed by super admin only.
   */
  SuperAdmin = 'sa',

  /**
   * Store file location specific to each user id. Can be accessed using the user token.
   */
  PerUser = 'u',

  /**
   * Store file location specific to each device id.
   */
  PerDevice = 'd',

  /**
   * Store file location specific to each token.
   */
  PerToken = 't',

  /**
   * Private store file location. Cannot be accessed publicly and must be directly accessed by the admin API only.
   */
  Secret = 'secret',
}

/**
 * The different types of store file formats.
 */
export enum StoreFileType {
  /**
   * Type used for `single document` storage.
   */
  Document = 'doc',

  /**
   * Type used for storing a `collection` of simpler documents, referred to as collection items.
   */
  Collection = 'col',

  /**
   * Type used for storing a collection of items that are `append-only`.
   */
  AppendOnlyCollection = 'aoc',
}

/**
 * Store file encoding types.
 */
export enum StoreFileEncoding {
  /**
   * AlwatrStore JSON format.
   */
  Json = 'asj',
}

/**
 * Unique identifier of the store file.
 *
 * Get from user for select store file.
 */
export interface StoreFileId {
  // [P: string]: unknown;

  /**
   * The store filename.
   */
  name: string;

  /**
   * The region where the store file is located.
   * @see {@link Region}
   */
  region: Region;

  /**
   * The owner of the store file.
   * If the region is `Region.PerX` then this is the user id, device id, or token id etc.
   * @see {@link Region}
   *
   */
  ownerId?: string
}

/**
 * Store the complete metadata of the file in the root database.
 */
export interface StoreFileStat extends StoreFileId {
  /**
   * The type of the store file.
   *
   * @see {@link StoreFileType}
   */
  type: StoreFileType;

  /**
   * The encoding used for the store file.
   *
   * @see {@link StoreFileEncoding}
   */
  encoding: StoreFileEncoding;

  /**
   * The time-to-live (TTL) of the store file in memory.
   */
  ttl: number;
}

/**
 * Represents the metadata of a store file.
 */
export interface StoreFileMeta extends StoreFileStat {
  /**
   * The AlwatrStore engine version.
   */
  ver: string;

  /**
   * Store file format version.
   */
  fv: number;

  /**
   * The revision number of the store file.
   *
   * This number is incremented every time the store file is updated.
   */
  rev: number;

  /**
   * The Unix timestamp (in milliseconds since the epoch) for when the store file was updated.
   */
  updated: number;

  /**
   * The Unix timestamp (in milliseconds since the epoch) for when the store file was created.
   */
  created: number;

  /**
   * Last auto increment id.
   */
  lastAutoId?: number;
}

/**
 * Represents the context of a store file.
 * @template TData The type of the data content in the store file.
 */
export interface StoreFileContext<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The status of the store file.
   *
   * if false, the Alwatr store throws an error.
   */
  ok: true;

  /**
   * The metadata of the store file.
   * @see {@link StoreFileMeta}
   */
  meta: StoreFileMeta;

  /**
   * The data content of the store file.
   */
  data: TData;
}

/**
 * Store file meta only content type.
 */
export type StoreFileMetaOnlyContext = Omit<StoreFileContext<never>, 'data'>;

// *** Documents ***

/**
 * StoreFileContext for document type.
 */
export type DocumentContext<TDoc extends Record<string, unknown> = Record<string, unknown>> = StoreFileContext<TDoc>;


// *** Collections ***

/**
 * The metadata of an item in a collection.
 */
export interface CollectionItemMeta {
  /**
   * The unique identifier for the collection item.
   */
  id: string | number;

  /**
   * The revision number for the collection item.
   *
   * This number is incremented each time the item is updated.
   */
  rev: number;

  /**
   * The Unix timestamp (in milliseconds since the epoch) for when the collection item was updated.
   */
  updated: number;

  /**
   * The Unix timestamp (in milliseconds since the epoch) for when the collection item was created.
   */
  created: number;
}

/**
 * Collection item context type.
 */
export interface CollectionItem<TItem> {
/**
   * Collection item's metadata.
   */
  meta: CollectionItemMeta;

  /**
   * Collection item data.
   */
  data: TItem;
}

/**
 * Collection item context type.
 */
export type CollectionContext<TItem extends Record<string, unknown> = Record<string, unknown>> = StoreFileContext<
  Record<string | number, CollectionItem<TItem>>
>;
