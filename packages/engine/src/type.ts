export interface AlwatrStorageEngineConfig {
  /**
   * Storage name.
   */
  name: string;

  /**
   * Storage path.
   *
   * @default './db'
   */
  path?: string;

  /**
   * Save debounce timeout for minimal disk iops usage.
   *
   * @default 1000
   */
  saveDebounce?: number;

  /**
   * Write pretty formatted JSON file.
   *
   * @default false
   */
  saveBeautiful?: boolean;

  /**
   * Enable or disable debug mode.
   *
   * @default undefined Auto detect base on `NODE_ENV`
   */
  devMode?: boolean;
}

export interface AlwatrStorageEngineProviderConfig {
  /**
   * Default storage path. you can override it in get config params.
   *
   * @default './db'
   */
  path?: string;

  /**
   * Save debounce timeout for minimal disk iops usage.
   *
   * @default 100
   */
  saveDebounce?: number;

  /**
   * Write pretty formatted JSON file.
   *
   * @default false
   */
  saveBeautiful?: boolean;

  /**
   * Enable or disable debug mode.
   *
   * @default undefined Auto detect base in NODE_ENV
   */
  devMode?: boolean;
}
