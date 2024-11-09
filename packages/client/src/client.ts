import {createLogger, fetchJson, resolveUrl, type FetchOptions, type ResponseError, HttpStatusCodes} from 'alwatr/nanolib';
import {
  getStorePath,
  StoreFileType,
  type CollectionContext,
  type StoreFileContext,
  type StoreFileId,
  type StoreFileStat,
} from 'alwatr/nitrobase/client';

const logger = /* #__PURE__ */ createLogger('alwatr-client-nitrobase');

// @TODO: move this file to nitrobase new package

export type AlwatrAuth = {
  userId: string;
  userToken: string;
};

export type NitrobaseDocumentContext<TData extends JsonObject = JsonObject> = StoreFileContext<TData>;

export abstract class AlwatrClientNitrobaseRepository {
  // TODO: Move to `config` & remove all defaults

  /**
   * The root path of the storage.
   * This is where the AlwatrClientNitrobase will nitrobase its data.
   * @default `/api/s7`
   */
  apiUrl = '/api/s7';

  /**
   * The authorization information.
   * @default `anonymous`
   */
  alwatrAuthorization: AlwatrAuth = {
    userId: 'anonymous',
    userToken: 'anonymous',
  };

  fetchOptions: Partial<FetchOptions> = {
    retry: 3,
    retryDelay: '1s',
    timeout: '8s',
    removeDuplicate: 'until_load',
    cacheStorageName: 'nitrobase',
    cacheStrategy: 'network_first',
    priority: 'high',
  };

  reloadOnSchemaVersionMismatch = true;

  constructor() {
    logger.logMethod?.('new');
  }

  abstract fetchDocument<TDoc extends JsonObject>(documentId: StoreFileStat): Promise<ResponseError | NitrobaseDocumentContext<TDoc>>;
  abstract fetchCollection<TItem extends JsonObject>(collectionId: StoreFileStat): Promise<ResponseError | CollectionContext<TItem>>;
}

export class AlwatrClientNitrobase extends AlwatrClientNitrobaseRepository {
  private async fetch__<T extends StoreFileContext>(storeStat: StoreFileStat): Promise<ResponseError | T> {
    const response = await fetchJson<T>({
      ...this.fetchOptions,
      url: resolveUrl(this.apiUrl, getStorePath(storeStat)),
      alwatrAuth: this.alwatrAuthorization,
    });

    if (response.ok === true && response.meta?.schemaVer !== undefined && response.meta.schemaVer !== (storeStat.schemaVer ?? 1)) {
      logger.accident?.('fetch__', 'schema_version_mismatch', {
        requestedStoreId: storeStat,
        responseMeta: response.meta,
      });

      if (this.reloadOnSchemaVersionMismatch) {
        location.reload();
      }

      return {
        ok: false,
        statusCode: HttpStatusCodes.Error_Client_400_Bad_Request,
        errorCode: 'schema_version_mismatch',
        errorMessage: 'Schema version mismatch',
        meta: response.meta,
      } as ResponseError;
    }

    return response;
  }

  async fetchDocument<TDoc extends JsonObject>(documentId: StoreFileId): Promise<ResponseError | NitrobaseDocumentContext<TDoc>> {
    logger.logMethodArgs?.('fetchDocument', documentId);
    return this.fetch__<NitrobaseDocumentContext<TDoc>>({
      ...documentId,
      type: StoreFileType.Document,
    });
  }

  async fetchCollection<TItem extends JsonObject>(collectionId: StoreFileId): Promise<ResponseError | CollectionContext<TItem>> {
    logger.logMethodArgs?.('fetchCollection', collectionId);
    return this.fetch__<CollectionContext<TItem>>({
      ...collectionId,
      type: StoreFileType.Collection,
    });
  }
}
