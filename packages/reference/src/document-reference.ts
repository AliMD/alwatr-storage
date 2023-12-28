import {createLogger} from '@alwatr/logger';
import {StoreFileType, StoreFileId, StoreFileExtension, type DocumentContext, type StoreFileMeta} from '@alwatr/store-types';
import {waitForTimeout} from '@alwatr/wait';

import {logger} from './logger';
import { getStoreId, getStorePath } from './util';

import type {Dictionary} from '@alwatr/type-helper';

logger.logModule?.('document-reference');

/**
 * Represents a reference to a document of the AlwatrStore.
 * Provides methods to interact with the document, such as get, set, update and save.
 */
export class DocumentReference<TDoc extends Dictionary = Dictionary> {
  /**
   * Alwatr store engine version string.
   */
  static readonly version = __package_version;

  /**
   * Alwatr store engine file format version number.
   */
  static readonly fileFormatVersion = 1;

  /**
   * Creates new DocumentReference instance from stat and initial data.
   *
   * @param statId the document stat.
   * @param initialData the document data.
   * @param updatedCallback the callback to invoke when the document changed.
   * @template TDoc The document data type.
   * @returns A new document reference class.
   */
  static newRefFromData<TDoc extends Dictionary>(
    statId: StoreFileId,
    initialData: TDoc,
    updatedCallback: (from: DocumentReference<TDoc>) => unknown,
  ): DocumentReference<TDoc> {
    logger.logMethodArgs?.('doc.newRefFromData', statId);

    const now = Date.now();
    const initialContext: DocumentContext<TDoc> = {
      ok: true,
      meta: {
        ...statId,
        rev: 1,
        updated: now,
        created: now,
        type: StoreFileType.Document,
        extension: StoreFileExtension.Json,
        ver: DocumentReference.version,
        fv: DocumentReference.fileFormatVersion,
      },
      data: initialData,
    };

    return new DocumentReference(initialContext, updatedCallback);
  }

  /**
   * Creates new DocumentReference instance from DocumentContext.
   *
   * @param context the document context.
   * @param updatedCallback the callback to invoke when the document changed.
   * @template TDoc The document data type.
   * @returns A new document reference class.
   */
  static newRefFromContext<TDoc extends Dictionary>(
    context: DocumentContext<TDoc>,
    updatedCallback: (from: DocumentReference<TDoc>) => unknown,
  ): DocumentReference<TDoc> {
    logger.logMethodArgs?.('doc.newRefFromContext', context.meta);
    return new DocumentReference(context, updatedCallback);
  }

  /**
   * Validates the document context and try to migrate it to the latest version.
   *
   * @param context document context
   */
  private static validateContext__(context: DocumentContext<Dictionary>): void {
    logger.logMethodArgs?.('doc.validateContext__', {name: context.meta?.name});

    if (context.ok !== true) {
      logger.accident?.('doc.validateContext__', 'store_not_ok', context);
      throw new Error('store_not_ok', {cause: context});
    }

    if (context.meta === undefined) {
      logger.accident?.('doc.validateContext__', 'store_meta_undefined', context);
      throw new Error('store_meta_undefined', {cause: context});
    }

    if(context.meta.type !== StoreFileType.Document) {
      logger.accident?.('doc.validateContext__', 'document_type_invalid', context.meta);
      throw new Error('document_type_invalid', {cause: context.meta});
    }

    if (context.meta.ver !== DocumentReference.version) {
      logger.incident?.('doc.validateContext__', 'store_version_incompatible', {
        fileVersion: context.meta.ver,
        currentVersion: DocumentReference.version,
      });

      DocumentReference.migrateContext__(context);
    }
  }

  /**
   * Migrate the document context to the latest.
   *
   * @param context document context
   */
  private static migrateContext__(context: DocumentContext<Dictionary>): void {
    if (context.meta.ver === DocumentReference.version) return;

    logger.logMethodArgs?.('doc.migrateContext__', {
      name: context.meta.name,
      ver: context.meta.ver,
      fv: context.meta.fv,
    });

    if (context.meta.fv > DocumentReference.fileFormatVersion) {
      logger.accident('doc.migrateContext__', 'store_version_incompatible', context.meta);
      throw new Error('store_version_incompatible', {cause: context.meta});
    }

  }

  /**
   * The ID of the document store file.
   */
  readonly id = getStoreId(this.context__.meta);

  /**
   * The location path of the document store file.
   */
  readonly path = getStorePath(this.context__.meta);

  /**
   * Logger instance for this document.
   */
  private logger__ = createLogger(`doc:${this.id.slice(0, 20)}`);

  /**
   * Create a new document reference.
   * Document reference have methods to get, set, update and save the AlwatrStore Document.
   *
   * @param context__ Document's context filled from the Alwatr Store (parent).
   * @param updatedCallback__ updated callback to invoke when the document is updated from the Alwatr Store (parent).
   * @template TDoc The document data type.
   */
  constructor(
    private readonly context__: DocumentContext<TDoc>,
    private readonly updatedCallback__: (from: DocumentReference<TDoc>) => unknown,
  ) {
    this.logger__.logMethodArgs?.('new', {path: this.path});
    DocumentReference.validateContext__(this.context__);
  }

  /**
   * Retrieves the document's data.
   *
   * @returns The document's data.
   *
   * @example
   * ```typescript
   * const documentData = documentRef.get();
   * ```
   */
  get(): TDoc {
    this.logger__.logMethod?.('get');
    return this.context__.data;
  }

  /**
   * Retrieves the document's metadata.
   *
   * @returns The document's metadata.
   *
   * @example
   * ```typescript
   * const documentMeta = documentRef.meta();
   * ```
   */
  meta(): Readonly<StoreFileMeta> {
    this.logger__.logMethod?.('meta');
    return this.context__.meta;
  }

  /**
   * Sets the document's data.
   *
   * @param data The new document data.
   *
   * @example
   * ```typescript
   * documentRef.set({ key: 'value' });
   * ```
   */
  set(data: TDoc): void {
    this.logger__.logMethodArgs?.('set', data);
    (this.context__.data as unknown) = data;
    this.updated__();
  }

  /**
   * Update Document's data.
   * Can be used to update a part of the document.
   *
   * @param data Data to update the document with.
   *
   * @example
   * ```typescript
   * documentRef.update({ key: 'updated value' });
   * ```
   */
  update(data: Partial<TDoc>): void {
    this.logger__.logMethodArgs?.('update', data);
    Object.assign(this.context__.data, data);
    this.updated__();
  }

  /**
   * Requests the Alwatr Store to save the document.
   * Saving may take some time in Alwatr Store due to the use of throttling.
   *
   * @example
   * ```typescript
   * documentRef.save();
   * ```
   */
  save(): void {
    this.logger__.logMethod?.('save');
    this.updated__();
  }

  getFullContext_(): Readonly<DocumentContext<TDoc>> {
    this.logger__.logMethod?.('getFullContext_');
    return this.context__;
  }

  private updateDelayed__ = false;

  /**
   * Update the document metadata and invoke the updated callback.
   * This method is throttled to prevent multiple updates in a short time.
   */
  private async updated__(): Promise<void> {
    this.logger__.logMethodArgs?.('updated__', {delayed: this.updateDelayed__});
    if (this.updateDelayed__ === true) return;
    // else

    if (this.context__.meta.changeDebounce !== undefined) {
      this.updateDelayed__ = true;
      await waitForTimeout(this.context__.meta.changeDebounce);
      this.updateDelayed__ = false;
    }

    this.updateMeta__();
    this.updatedCallback__.call(null, this);
  }

  /**
   * Updates the document's metadata.
   */
  private updateMeta__(): void {
    this.logger__.logMethod?.('updateMeta__');
    this.context__.meta.updated = Date.now();
    this.context__.meta.rev++;
  }
}