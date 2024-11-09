import {createLogger, fetchJson, HttpStatusCodes, resolveUrl, type FetchOptions, type ResponseError} from '@alwatr/nanolib';
import {getStorePath} from '@alwatr/nitrobase-helper';
import {
  StoreFileType,
  type AlwatrAuth,
  type CollectionContext,
  type StoreFileContext,
  type StoreFileId,
  type StoreFileStat,
} from '@alwatr/nitrobase-types';

const logger = /* #__PURE__ */ createLogger('alwatr-client-nitrobase');

export type NitrobaseDocumentContext<TData extends JsonObject = JsonObject> = StoreFileContext<TData>;

/**
 * Recommended config
 * ```
 *  apiUrl = '/api/s7';
 *
 *  alwatrAuthorization: AlwatrAuth = {
 *     userId: 'anonymous',
 *     userToken: 'anonymous',
 *  };
 *
 *  fetchOptions: Partial<FetchOptions> = {
 *   retry: 3,
 *    retryDelay: '1s',
 *    timeout: '8s',
 *    removeDuplicate: 'until_load',
 *    cacheStorageName: 'nitrobase',
 *    cacheStrategy: 'network_first',
 *    priority: 'high',
 *  };
 * ```
 */
export interface AlwatrClientNitrobaseConfig {
  apiUrl: string;
  alwatrAuthorization: AlwatrAuth;
  fetchOptions: Partial<FetchOptions>;
}

export abstract class AlwatrClientNitrobaseRepository {
  reloadOnSchemaVersionMismatch = true;

  constructor(readonly config_: AlwatrClientNitrobaseConfig) {
    logger.logMethod?.('new');
  }

  abstract fetchDocument<TDoc extends JsonObject>(documentId: StoreFileStat): Promise<ResponseError | NitrobaseDocumentContext<TDoc>>;
  abstract fetchCollection<TItem extends JsonObject>(collectionId: StoreFileStat): Promise<ResponseError | CollectionContext<TItem>>;
}

export class AlwatrClientNitrobase extends AlwatrClientNitrobaseRepository {
  private async fetch__<T extends StoreFileContext>(storeStat: StoreFileStat): Promise<ResponseError | T> {
    const response = await fetchJson<T>({
      ...this.config_.fetchOptions,
      url: resolveUrl(this.config_.apiUrl, getStorePath(storeStat)),
      alwatrAuth: this.config_.alwatrAuthorization,
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
