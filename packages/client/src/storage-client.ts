import {type FetchOptions, serviceRequest} from '@alwatr/fetch';
import {createLogger, globalAlwatr} from '@alwatr/logger';

import type {AlwatrStorageClientConfig} from './type.js';
import type {
  AlwatrDocumentObject,
  AlwatrDocumentStorage,
  AlwatrServiceResponseSuccess,
  StringifyableRecord,
} from '@alwatr/type';

export {type AlwatrStorageClientConfig};

globalAlwatr.registeredList.push({
  name: '@alwatr/storage-client',
  version: _ALWATR_VERSION_,
});

/**
 * Elegant micro client for storage server written in tiny TypeScript ES module.
 *
 * Example:
 *
 * ```ts
 * import {type AlwatrDocumentObject, AlwatrStorageClient} from '@alwatr/storage-client';
 *
 * interface User extends AlwatrDocumentObject  {
 *   fname: string;
 *   lname: string;
 *   email: string;
 *   token?: string;
 * }
 *
 * const db = new AlwatrStorageClient<User>({
 *   name: 'user-list',
 *   host: 'http://127.0.0.1:80',
 *   token: 'YOUR_SECRET_TOKEN',
 *   timeout: 2_000,
 * });
 *
 * await db.set({
 *   id: 'alimd',
 *   fname: 'Ali',
 *   lname: 'Mihandoost',
 *   email: 'ali@mihandoost.com',
 * });
 *
 * await db.set({
 *   id: 'fmd',
 *   fname: 'Fatemeh',
 *   lname: 'Mihandoost',
 *   email: 'Fatemeh@mihandoost.com',
 *   token: Math.random().toString(36).substring(2, 15),
 * });
 *
 * console.log('has \'alimd\': %o', await db.has('alimd'));
 * console.log('keys: %o', await db.keys());
 * console.log('getStorage: %o', await db.getStorage());
 * console.log('delete: %o', await db.delete('alimd'));
 * try {
 *   await db.delete('abcd');
 * }
 * catch (err) {
 *   console.log('delete 404: %o', (err as Error).message);
 * }
 */
export class AlwatrStorageClient<DocumentType extends AlwatrDocumentObject = AlwatrDocumentObject> {
  protected _logger = createLogger(
      'alwatr/storage-client' + (this.config.name == null ? '' : ':' + this.config.name),
      this.config.devMode,
  );

  /**
   * Default fetch options for service request.
   */
  fetchOption: FetchOptions = {
    url: 'http://' + this.config.host + ':' + this.config.port + '/',
    keepalive: true,
    timeout: this.config.timeout ?? 0,
    cacheStrategy: 'network_only',
    removeDuplicate: 'never',
    retry: 3,
    retryDelay: 500,
    token: this.config.token,
  };

  constructor(public readonly config: AlwatrStorageClientConfig) {
    this._logger.logMethodArgs?.('constructor', config);
  }

  /**
   * Get a document object by id.
   *
   * @param documentId The id of the document object.
   *
   * Example:
   *
   * ```ts
   * try {
   *   const user = await userStorage.get('user-1');
   *   console.dir(item);
   * }
   * catch (err) {
   *   if ((err as Error)?.message === 'document_not_found') {
   *     console.log('user_5000 id not found!');
   *   }
   *   else {
   *     console.error((err as Error)?.message || err);
   *   }
   * }
   * ```
   */
  async get<T extends DocumentType = DocumentType>(
      documentId: string,
      storage = this.config.name,
  ): Promise<T | null> {
    this._logger.logMethodArgs?.('get', {storage, documentId});
    if (storage == null) throw new Error('storage_not_defined');

    const responseJson = await serviceRequest<AlwatrServiceResponseSuccess<T | null>>({
      ...this.fetchOption,
      queryParameters: {
        storage,
        id: documentId,
      },
    });

    return responseJson.data;
  }

  /**
   * Check document exists by id.
   *
   * @param documentId The id of the document object.
   *
   * Example:
   *
   * ```ts
   * const userExist = await userStorage.has('user-1');
   * if (!userExist) console.log('user_not_found');
   * ```
   */
  async has(documentId: string, storage = this.config.name): Promise<boolean> {
    this._logger.logMethodArgs?.('has', {storage, documentId});
    if (storage == null) throw new Error('storage_not_defined');

    const responseJson = await serviceRequest<AlwatrServiceResponseSuccess<boolean>>({
      ...this.fetchOption,
      url: this.fetchOption.url + 'has',
      queryParameters: {
        storage,
        id: documentId,
      },
    });

    if (typeof responseJson.data !== 'boolean') {
      this._logger.error('has', 'invalid_response_data', {responseJson});
      throw new Error('invalid_response_data');
    }

    return responseJson.data;
  }

  /**
   * Insert/update a document object in the storage.
   *
   * @param documentObject The document object to insert/update contain `id`.
   *
   * Example:
   *
   * ```ts
   * await userStorage.set({
   *   id: 'user-1',
   *   foo: 'bar',
   * });
   * ```
   */
  async set<T extends DocumentType = DocumentType>(
      documentObject: T,
      storage = this.config.name,
  ): Promise<T> {
    this._logger.logMethodArgs?.('set', {storage, documentId: documentObject.id});
    if (storage == null) throw new Error('storage_not_defined');

    const responseJson = await serviceRequest<AlwatrServiceResponseSuccess<T>>({
      ...this.fetchOption,
      method: 'PATCH',
      queryParameters: {
        storage,
      },
      bodyJson: documentObject,
    });

    if (typeof responseJson.data?.id !== 'string') {
      this._logger.error('set', 'invalid_response_data', {responseJson});
      throw new Error('invalid_response_data');
    }

    return responseJson.data;
  }

  /**
   * Touch the storage to make sure storage file exist.
   *
   * Example:
   *
   * ```ts
   * await userStorage.touch();
   * ```
   */
  async touch(storage = this.config.name): Promise<void> {
    this._logger.logMethodArgs?.('touch', {storage});
    if (storage == null) throw new Error('storage_not_defined');

    await serviceRequest({
      ...this.fetchOption,
      method: 'GET',
      url: this.fetchOption.url + 'touch',
      queryParameters: {
        storage,
      },
    });
  }

  /**
   * Make a symbolic link
   *
   * **CAUTION: the destination path will be removed if exists**
   *
   * Example:
   *
   * ```ts
   * await storageClient.link('private/user-50/order-list', 'public/token/oder-list');
   * ```
   */
  async link(src: string, dest: string): Promise<void> {
    this._logger.logMethodArgs?.('link', {src, dest});

    await serviceRequest({
      ...this.fetchOption,
      method: 'GET',
      url: this.fetchOption.url + 'link',
      queryParameters: {
        src,
        dest,
      },
    });
  }

  /**
   * Make a cache from the api response.
   *
   * Example:
   *
   * ```ts
   * await storageClient.cacheApiResponse('public/token/user-profile', {id: 'test', ...});
   * ```
   */
  async cacheApiResponse<T extends StringifyableRecord>(
      path: string,
      data: T,
  ): Promise<void> {
    this._logger.logMethodArgs?.('cacheApiResponse', {path, data});

    await serviceRequest({
      ...this.fetchOption,
      method: 'PUT',
      url: this.fetchOption.url + 'cache-api-response',
      bodyJson: {
        path,
        data,
      },
    });
  }

  /**
   * Delete a document object from the storage.
   *
   * Example:
   *
   * ```ts
   * await userStorage.delete('user-1');
   * ```
   */
  async delete(
      documentId: string,
      storage = this.config.name,
  ): Promise<boolean> {
    this._logger.logMethodArgs?.('delete', {storage, documentId});
    if (storage == null) {
      throw new Error('storage_not_defined');
    }

    const responseJson = await serviceRequest<AlwatrServiceResponseSuccess<boolean>>({
      ...this.fetchOption,
      method: 'DELETE',
      queryParameters: {
        storage,
        id: documentId,
      },
    });

    if (typeof responseJson.data !== 'boolean') {
      this._logger.error('delete', 'invalid_response_data', {responseJson});
      throw new Error('invalid_response_data');
    }

    return responseJson.data;
  }

  /**
   * Dump all storage.
   *
   * Example:
   *
   * ```ts
   * const userStorage = await userStorage.getStorage();
   * ```
   */
  async getStorage<T extends DocumentType = DocumentType>(
      name = this.config.name,
  ): Promise<AlwatrDocumentStorage<T>> {
    this._logger.logMethodArgs?.('getStorage', {name});
    if (name == null) {
      throw new Error('storage_not_defined');
    }

    const responseJson = await serviceRequest<AlwatrDocumentStorage<T>>({
      ...this.fetchOption,
      url: this.fetchOption.url + 'storage',
      queryParameters: {
        name,
      },
    });

    const responseJsonHasData = typeof responseJson.data === 'object';
    const responseJsonHasMeta = typeof responseJson.meta === 'object';
    const responseJsonHasLastUpdated =
      typeof responseJson.meta.lastUpdated === 'number';
    if (
      !responseJsonHasData ||
      !responseJsonHasMeta ||
      !responseJsonHasLastUpdated
    ) {
      this._logger.error('getStorage', 'invalid_response_data', {responseJson});
      throw new Error('invalid_response_data');
    }

    return responseJson;
  }

  /**
   * Get all documents keys.
   *
   * Example:
   *
   * ```ts
   * const userIdArray = await userStorage.keys();
   * ```
   */
  async keys(storage = this.config.name): Promise<string[]> {
    this._logger.logMethodArgs?.('keys', {storage});

    if (storage == null) {
      throw new Error('storage_not_defined');
    }

    const responseJson = await serviceRequest<AlwatrServiceResponseSuccess<string[]>>({
      ...this.fetchOption,
      url: this.fetchOption.url + 'keys',
      queryParameters: {
        storage,
      },
    });

    if (!Array.isArray(responseJson.data)) {
      this._logger.error('keys', 'invalid_response_data', {responseJson});
      throw new Error('invalid_response_data');
    }

    return responseJson.data;
  }
}
