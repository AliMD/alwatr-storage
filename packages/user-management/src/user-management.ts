import {dirname, resolve} from 'node:path';

import {createLogger} from 'alwatr/nanolib';
import {existsSync, makeEmptyFile} from 'alwatr/nanolib/node-fs';
import {DocumentReference, Region, type AlwatrNitrobase, type StoreFileId, type StoreFileMeta} from 'alwatr/nitrobase';

import {config, logger} from '../config.js';

import type {AlwatrAuth} from 'common';

// TODO: Move this file to `nitrobase`

// export interface NitrobaseUserManagementConfig<TUser extends JsonObject> {
//   rootUser: NewUser<TUser>;
// }

export type NewUser<TUser extends JsonObject> = AlwatrAuth & {
  data: TUser;
  isManager?: true;
};

interface NitrobaseUserManagementInterface<TUser extends JsonObject> {
  // readonly config: NitrobaseUserManagementConfig<TUser>;

  /**
   * ...
   * @returns user id
   */
  newUser(user: NewUser<TUser>): Promise<void>;

  hasUser(userId: string): Promise<boolean>;

  getUserData(userId: string): Promise<TUser>;
  getUserMeta(userId: string): Promise<Readonly<StoreFileMeta>>;

  verifyUserToken(userId: string, token: string): Promise<boolean>;

  save(userId: string): void;
  saveImmediate(userId: string): void;

  userIds(): Promise<Generator<string, void, void>>;

  getUserDirectory(userId: string): Promise<string>;
}

export class NitrobaseUserManagement<TUser extends JsonObject> implements NitrobaseUserManagementInterface<TUser> {
  static readonly nitrobaseIds = {
    userList: {
      name: 'user-list',
      region: Region.Managers,
      schemaVer: 1,
    } as Readonly<StoreFileId>,

    userInfo: {
      name: 'user-info',
      region: Region.PerUser,
    } as Readonly<StoreFileId>,
  } as const;

  static async initialize(nitrobase: AlwatrNitrobase) {
    logger.logMethod?.('NitrobaseUserManagement.initialize');
    nitrobase.newCollection(this.nitrobaseIds.userList);
  }

  protected logger_ = createLogger('user-management');

  protected userListCollection_;

  constructor(
    protected readonly nitrobase_: AlwatrNitrobase,
    // public readonly config: NitrobaseUserManagementConfig<TUser>,
  ) {
    this.logger_.logMethod?.('new');
    this.userListCollection_ = this.nitrobase_.openCollection(NitrobaseUserManagement.nitrobaseIds.userList);
  }

  async newUser(user: NewUser<TUser>) {
    this.logger_.logMethodArgs?.('newUser', user);

    (await this.userListCollection_).addItem(user.userId, {});

    this.newUserInfoDocument_(user.userId, user.data);

    await this.makeTokenFile_(user.userId, user.userToken, user.isManager);
  }

  async hasUser(userId: string) {
    const userExists = (await this.userListCollection_).hasItem(userId);
    this.logger_.logMethodFull?.('hasUser', {userId}, userExists);
    return userExists;
  }

  async getUserData(userId: string) {
    this.logger_.logMethodArgs?.('getUserData', userId);
    const userInfoDocument = await this.openUserInfoDocument_(userId);
    return userInfoDocument.getData();
  }

  async getUserMeta(userId: string) {
    this.logger_.logMethodArgs?.('getUserMeta', userId);
    const document = await this.openUserInfoDocument_(userId);
    return document.getStoreMeta();
  }

  save(userId: string) {
    this.logger_.logMethodArgs?.('save', userId);
    this.openUserInfoDocument_(userId).then((document) => {
      document.save();
    });
  }

  saveImmediate(userId: string) {
    this.logger_.logMethodArgs?.('saveImmediate', userId);
    this.openUserInfoDocument_(userId).then((document) => {
      document.saveImmediate();
    });
  }

  async userIds() {
    return (await this.userListCollection_).ids();
  }

  // async generateUserToken(userId: string) {
  //   const uniqueList = await this.generateTokenUniqueList_(userId);
  //   return this.cryptoFactory.generateToken(uniqueList);
  // }

  async verifyUserToken(userId: string, token: string) {
    const tokenFileExist = existsSync(await this.getUserTokenFilePath_(userId, token));
    this.logger_.logMethodFull?.('verifyUserToken', {userId, token: token.slice(0, 12) + '...'}, tokenFileExist);
    return tokenFileExist;
  }

  async getUserDirectory(userId: string) {
    const userInfoDocument = await this.openUserInfoDocument_(userId);
    const userDirectoryPath = dirname(resolve(config.nitrobase.config.rootPath, userInfoDocument.path));
    this.logger_.logMethodFull?.('getUserDirectory', {userId}, userDirectoryPath);
    return userDirectoryPath;
  }

  // protected async generateTokenUniqueList_(userId: string) {
  //   const uniqueList: (string | number)[] = [userId];

  //   if (this.config.tokenExtraUniquelyList !== undefined) {
  //     const userInfo = await this.getUserData(userId);
  //     this.config.tokenExtraUniquelyList.forEach((key) => {
  //       const value = userInfo[key];
  //       if (typeof value === 'string' || typeof value === 'number') {
  //         uniqueList.push(value);
  //       }
  //     });
  //   }

  //   return uniqueList;
  // }

  protected newUserInfoDocument_(userId: string, userInfo: TUser) {
    this.logger_.logMethodArgs?.('newUserInfoDocument', {userId, userInfo});
    const storeId: StoreFileId = {
      ...NitrobaseUserManagement.nitrobaseIds.userInfo,
      ownerId: userId,
    };
    if (this.nitrobase_.hasStore(storeId)) {
      this.logger_.accident?.('newUserInfoDocument_', 'store_already_exists', storeId);
      return;
    }
    this.nitrobase_.newDocument<TUser>(storeId, userInfo);
  }

  protected openUserInfoDocument_(userId: string): Promise<DocumentReference<TUser>> {
    this.logger_.logMethodArgs?.('openUserInfoDocument_', userId);
    return this.nitrobase_.openDocument<TUser>({
      ...NitrobaseUserManagement.nitrobaseIds.userInfo,
      ownerId: userId,
    });
  }

  protected async makeTokenFile_(userId: string, token: string, isManager?: true): Promise<void> {
    this.logger_.logMethodArgs?.('makeTokenFile', {userId, token: token.slice(0, 12) + '...', isManager});
    const userDirectory = await this.getUserDirectory(userId);

    await makeEmptyFile(resolve(userDirectory, `.token/${token}.asn`));

    if (isManager === true) {
      await makeEmptyFile(resolve(userDirectory, '.auth/manager.asn'));
    }
  }

  protected async getUserTokenFilePath_(userId: string, token: string): Promise<string> {
    const userTokenFilePath = resolve(await this.getUserDirectory(userId), `.token/${token}.asn`);
    this.logger_.logMethodFull?.('getTokenFilePath', {userId, token: token.slice(0, 12) + '...'}, userTokenFilePath);
    return userTokenFilePath;
  }
}
