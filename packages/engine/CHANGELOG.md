# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.1.1](https://github.com/Alwatr/store/compare/v7.1.0...v7.1.1) (2024-09-24)

### Miscellaneous Chores

* **deps-dev:** bump the development-dependencies group across 1 directory with 3 updates ([122251c](https://github.com/Alwatr/store/commit/122251c315c422b7e9c2d5aba827f27b321194bb)) by @dependabot[bot]
* **deps:** bump the alwatr-dependencies group with 9 updates ([2a94694](https://github.com/Alwatr/store/commit/2a94694b2ec12c2915aa77934023328751d13837)) by @dependabot[bot]

### Dependencies update

* update ([82c475e](https://github.com/Alwatr/store/commit/82c475e29bd7f42ad03660556f40f180b3b6c9c6)) by @AliMD

## [7.1.0](https://github.com/Alwatr/store/compare/v7.0.0...v7.1.0) (2024-09-08)

### Features

* **engine:** add @alwatr/store-helper package ([66bca93](https://github.com/Alwatr/store/commit/66bca93e46f344b54b6f9eb57f4a680247e36157)) by @AliMD

### Miscellaneous Chores

* **deps-dev:** bump the development-dependencies group with 2 updates ([f6d8374](https://github.com/Alwatr/store/commit/f6d837417886ccf3719100570194434455fda365)) by @dependabot[bot]

## [7.0.0](https://github.com/Alwatr/store/compare/v7.0.0-beta.1...v7.0.0) (2024-09-02)

### Features

* Add getStoreList method to AlwatrStore ([25ace2a](https://github.com/Alwatr/store/commit/25ace2aa4e32d9ad99d6ac2e63ac783462b9f4e5)) by @AliMD

### Bug Fixes

* **engine:** set the correct names ([076fa3e](https://github.com/Alwatr/store/commit/076fa3e0d7cfe673cc58418153b7dc2aacfb340a)) by @mohammadhonarvar
* **packages/engine:** apply some new name of methods ([e3d5712](https://github.com/Alwatr/store/commit/e3d5712e19406f58fb87b822e036df5847aab6c0)) by @mohammadhonarvar

### Code Refactoring

* **engine:** use  `hasItem` ([e17afa7](https://github.com/Alwatr/store/commit/e17afa7ef050cbf9f349dd6919739a01764aa24f)) by @mohammadhonarvar
* move all demo from engine to srore package ([e34fc49](https://github.com/Alwatr/store/commit/e34fc49c71703cd287559ca4fb23f9f13842b2d0)) by @AliMD
* Remove unused "ALWATR_DEBUG" environment variable from build script ([26e7642](https://github.com/Alwatr/store/commit/26e764280e0a2827904762ed3de21a9966ddfc63)) by @AliMD
* Replace id_ with documentId and collectionId in AlwatrStore ([e58d0fd](https://github.com/Alwatr/store/commit/e58d0fd905722352238e11ed4e308907485f8ff5)) by @AliMD
* Update type imports in alwatr-store.ts ([d6f02ad](https://github.com/Alwatr/store/commit/d6f02ad5b779d04aa1b484bff96369483393af15)) by @AliMD
* Update type imports in alwatr-store.ts ([274d234](https://github.com/Alwatr/store/commit/274d234e6653cade2288288a4894feb7314987a2)) by @AliMD

### Dependencies update

* update ([6411ff7](https://github.com/Alwatr/store/commit/6411ff7d49323b8bbf0dbb03fbc3c640b433a8bb)) by @

## [7.0.0-beta.1](https://github.com/Alwatr/store/compare/v7.0.0-beta.0...v7.0.0-beta.1) (2024-08-31)

### Code Refactoring

* Remove unnecessary debug flag ([bdebb58](https://github.com/Alwatr/store/commit/bdebb5856310efd3628edb236f790968d94035fa)) by @
* Update demo for test schemaVer ([4d5038b](https://github.com/Alwatr/store/commit/4d5038b3a5ae390355e2bd6524f7edc66fedc65c)) by @

## [7.0.0-beta.0](https://github.com/Alwatr/store/compare/v6.2.1...v7.0.0-beta.0) (2024-08-31)

### ⚠ BREAKING CHANGES

* The `deleteFile` method has been renamed to `remove`. Update your code accordingly.
* The `doc` and `collection` methods have been deprecated and should no longer be used. Instead, use the `openDocument` and `openCollection` methods.

### Features

* Add newDocument and newCollection methods to AlwatrStore ([363f820](https://github.com/Alwatr/store/commit/363f820a104e49a49746c95e7f303982d3ecb481)) by @AliMD
* Open document and collection with given id in AlwatrStore ([5041a20](https://github.com/Alwatr/store/commit/5041a20bbf6dc3a26499aac4649e8c0d17c23537)) by @AliMD

### Bug Fixes

* **alwatr-store:** logger methods name issue ([4798d15](https://github.com/Alwatr/store/commit/4798d1527d05f1c7c79ddf03520e3478c0dae529)) by @AliMD

### Code Refactoring

* **AlwatrStore:** compatible with new api ([42c30f2](https://github.com/Alwatr/store/commit/42c30f2c7a066305eaba5e6fae50bfa5dc4502c8)) by @AliMD
* **demo:** compatible with new api ([a76cc74](https://github.com/Alwatr/store/commit/a76cc7403610661c42099aae254ca5989bda1bff)) by @AliMD
* Remove unnecessary debug flag from yarn script ([7f21798](https://github.com/Alwatr/store/commit/7f217981fb9c53c01f469a1a0b2761d856dc7337)) by @AliMD
* rename `deleteFile` method to `remove` ([7356079](https://github.com/Alwatr/store/commit/735607933f78424ff7bdb6728f0e7b6eb18ca8a1)) by @AliMD
* update StoreFileStat type to make extension property optional ([e75a186](https://github.com/Alwatr/store/commit/e75a186fbafd30a3d745467a973bec06e1d8109e)) by @AliMD
* updates the `storeChanged__` method name to `storeChanged_`. ([8fd35fa](https://github.com/Alwatr/store/commit/8fd35fa69c0ff5c5fdc1f3be11a70ca4bac7dd81)) by @AliMD

### Miscellaneous Chores

* fix logs messages ([73d4496](https://github.com/Alwatr/store/commit/73d4496928c6e8fa5800f31619b9be717cba3592)) by @AliMD

### Dependencies update

* update ([2657638](https://github.com/Alwatr/store/commit/26576384c4a8ffcf35776f19008432e194fb39de)) by @AliMD

## [6.2.1](https://github.com/Alwatr/store/compare/v6.2.0...v6.2.1) (2024-08-31)

### Miscellaneous Chores

* **deps-dev:** bump the development-dependencies group across 1 directory with 13 updates ([7e6aa11](https://github.com/Alwatr/store/commit/7e6aa11e1b4507111993a6070b481ebc95e534c7)) by @dependabot[bot]
* **deps:** bump the alwatr-dependencies group with 10 updates ([faf1fc1](https://github.com/Alwatr/store/commit/faf1fc15f8b4c9c4c451dd5fa1d564eb3bf3d9a3)) by @dependabot[bot]
* **deps:** bump the alwatr-dependencies group with 9 updates ([64ac4f2](https://github.com/Alwatr/store/commit/64ac4f239c0f0a8ccdadbd736c16973bd684f811)) by @dependabot[bot]

## [6.2.0](https://github.com/Alwatr/store/compare/v6.1.0...v6.2.0) (2024-07-03)

### Features

* Add freeze property to CollectionReference and DocumentReference ([af1d7e4](https://github.com/Alwatr/store/commit/af1d7e47b3217d4e361a63d9eb9c410e04ea9385)) by @AliMD

## [6.1.0](https://github.com/Alwatr/store/compare/v6.0.5...v6.1.0) (2024-07-03)

### Dependencies update

* bump the development-dependencies ([546ca1b](https://github.com/Alwatr/store/commit/546ca1be049090eb3c8304fcb75e98ac0b984510)) by @AliMD

## [6.0.5](https://github.com/Alwatr/store/compare/v6.0.4...v6.0.5) (2024-05-12)

### Miscellaneous Chores

* **deps-dev:** bump the development-dependencies group across 1 directory with 3 updates ([f97552d](https://github.com/Alwatr/store/commit/f97552d0e8e85bc2e2f0863da17502b8e55799e8)) by @dependabot[bot]
* **deps:** bump the alwatr-dependencies group with 8 updates ([1aa95ca](https://github.com/Alwatr/store/commit/1aa95ca232a7b706eda4b0eb537316d38b27aa28)) by @dependabot[bot]

## [6.0.4](https://github.com/Alwatr/store/compare/v6.0.3...v6.0.4) (2024-04-25)

**Note:** Version bump only for package @alwatr/store-engine

## [6.0.3](https://github.com/Alwatr/store/compare/v6.0.2...v6.0.3) (2024-03-28)

### Miscellaneous Chores

* **deps-dev:** bump the development-dependencies group with 13 updates ([23fb121](https://github.com/Alwatr/store/commit/23fb1217470593d386b658f2a1d85fe4ef6e55df)) by @dependabot[bot]
* **deps:** bump the alwatr-dependencies group with 10 updates ([ce6ee74](https://github.com/Alwatr/store/commit/ce6ee7495aaa67a8d3bb0a3f2b2ea8389e161552)) by @dependabot[bot]
* **deps:** bump the alwatr-dependencies group with 9 updates ([686e155](https://github.com/Alwatr/store/commit/686e155d4c0ccab6daf81d280cf91299152b8583)) by @dependabot[bot]

## [6.0.0](https://github.com/Alwatr/store/compare/v6.0.0-alpha.0...v6.0.0) (2024-01-24)

### Features

- Enhance types, add Jsonifiable type and update method signatures ([57502d2](https://github.com/Alwatr/store/commit/57502d230f0c9cb88aa9a9e71a3460f1219955b0)) by @AliMD

### Miscellaneous Chores

- **deps-dev:** bump the development-dependencies group with 4 updates ([7d71044](https://github.com/Alwatr/store/commit/7d71044165583f9d56fb61a05bdf51ccb104f422)) by @dependabot[bot]
- **deps:** bump the alwatr-dependencies group with 10 updates ([cc42e89](https://github.com/Alwatr/store/commit/cc42e895179c53ee2dd60802d994ba84f5a37fde)) by @dependabot[bot]
- **deps:** update ([0e85743](https://github.com/Alwatr/store/commit/0e85743f76f0efdd0f6cd4001eebc4550b43f43f)) by @AliMD
- **deps:** update ([a894bfc](https://github.com/Alwatr/store/commit/a894bfc62124a3eb027cad4e8d1c974761e22dad)) by @AliMD

## [6.0.0-alpha.0](https://github.com/Alwatr/store/compare/v5.1.0...v6.0.0-alpha.0) (2024-01-15)

### Miscellaneous Chores

- **deps:** update ([8f3edcf](https://github.com/Alwatr/store/commit/8f3edcf8a489927a6c43dfcaa5db88a579ecac80)) by @

## [5.1.0](https://github.com/Alwatr/store/compare/v5.0.0...v5.1.0) (2024-01-13)

**Note:** Version bump only for package @alwatr/store-engine

# [5.0.0](https://github.com/Alwatr/store/compare/v5.0.0-beta...v5.0.0) (2024-01-12)

### Code Refactoring

- **engine:** remove all string id from public api ([c44fd1c](https://github.com/Alwatr/store/commit/c44fd1c0a7daffe20ba9e836f23d63a4dd4250b8)) by @AliMD

### Features

- **engine:** use alwatr exit hook ([5be4f01](https://github.com/Alwatr/store/commit/5be4f01bc746b5b4cfb1df10def3abc5632c44ee)) by @njfamirm
- **store:** Add option to error when store not initialized ([4b27468](https://github.com/Alwatr/store/commit/4b27468a063027b357e27fdff2484932e23d46e0)) by @AliMD

### BREAKING CHANGES

- **engine:** The string ID has been removed from public APIs to prevent confusion caused by a simple sting ID.

# [5.0.0-beta](https://github.com/Alwatr/store/compare/v4.1.0...v5.0.0-beta) (2023-12-31)

### Bug Fixes

- **deps:** dev deps ([b129567](https://github.com/Alwatr/store/commit/b12956768b9d60a75c0fdc43774512b86b655f78)) by @AliMD
- **engine/demo:** benchmark ([48b4456](https://github.com/Alwatr/store/commit/48b4456cd09bf610bfe718c843e55ff0db2a9e5a)) by @njfamirm
- **engine/demo:** import path ([6effc2c](https://github.com/Alwatr/store/commit/6effc2c105aaf4057581bc161723d59a7ea0b7e6)) by @njfamirm
- **engine:** add types to deps ([170043d](https://github.com/Alwatr/store/commit/170043d9095c73e3c678c051bc3f34d2ccd43730)) by @njfamirm
- **engine:** data loss issue and improve performance ([07f6877](https://github.com/Alwatr/store/commit/07f68777faec66fee4efae7afd340bebe7078f17)) by @AliMD
- **engine:** file path ([bbc4abd](https://github.com/Alwatr/store/commit/bbc4abdbb601108dc91ee95eeaac5cbbc272cdd4)) by @njfamirm
- **engine:** get collection issue ([742aa23](https://github.com/Alwatr/store/commit/742aa236ae98c934ea6e0904a8a91d152471a31a)) by @AliMD
- **engine:** import type ([9f67871](https://github.com/Alwatr/store/commit/9f67871dba8528a5393ea372f136865c952a102c)) by @njfamirm
- **engine:** Remove StoreFileStatModel class ([d47b680](https://github.com/Alwatr/store/commit/d47b680d54b8bd9a0b8926653a69cb59c8f36398)) by @AliMD
- **engine:** unsaved data lost issues ([fec0bef](https://github.com/Alwatr/store/commit/fec0bef78ac67ddd669012d8804588883f39affa)) by @AliMD
- **engine:** Update defaultChangeDebounce value in AlwatrStore ([63edd08](https://github.com/Alwatr/store/commit/63edd08c87c675edb91b8f7aa61b901a6d1db111)) by @AliMD
- **engine:** Update imports and refactor util.ts ([2b1f962](https://github.com/Alwatr/store/commit/2b1f9628f4578f707996fe5e6d5d92c7d093b615)) by @AliMD

### Features

- **engine/demo:** collection with new api ([f603e86](https://github.com/Alwatr/store/commit/f603e86d2827c66219321f9df400049e76b78c21)) by @AliMD
- **engine:** Add data-lost-test.js demo file ([673f324](https://github.com/Alwatr/store/commit/673f3247c4b6c1bca2f9e9d9169843ca6a5e9804)) by @AliMD
- **engine:** debounce for save file ([c92749e](https://github.com/Alwatr/store/commit/c92749e83352129c02130ac2466dd5acda289795)) by @AliMD
- **engine:** doc demo ([f49f78b](https://github.com/Alwatr/store/commit/f49f78bd3b5942406fe74e273e87bcbf12f67c4f)) by @njfamirm
- **engine:** enhance benchmark demo ([200da18](https://github.com/Alwatr/store/commit/200da18cd9542fa4182f910c0ad813703326fe38)) by @AliMD
- **engine:** impediment exit hook ([68695a9](https://github.com/Alwatr/store/commit/68695a975e0ec6c473bbd2d9a62c81720f090352)) by @AliMD
- **engine:** Refactor code to improve performance and readability ([b4c0848](https://github.com/Alwatr/store/commit/b4c0848e7518ae5c96e8ab7643716a2e923f7635)) by @AliMD
- **node-fs:** Update logger method arguments to include truncated path ([8c6f49a](https://github.com/Alwatr/store/commit/8c6f49ad56d5667ba1280a5d28b7a39b21c3a11a)) by @AliMD
