# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.0.0](https://github.com/Alwatr/nitrobase/compare/v7.5.9...v8.0.0) (2025-02-24)

**Note:** Version bump only for package @alwatr/nitrobase-nginx

## [7.5.9](https://github.com/Alwatr/nitrobase/compare/v7.5.8...v7.5.9) (2025-02-20)

### Bug Fixes

* **nginx:** remove error message from 403 response for undefined users ([3c762c8](https://github.com/Alwatr/nitrobase/commit/3c762c859d057ebaf09f1a2d60f5e082cfd3a15b)) by @alimd

## [7.5.8](https://github.com/Alwatr/nitrobase/compare/v7.5.7...v7.5.8) (2025-02-18)

### Miscellaneous Chores

* **deps:** bump alwatr/nginx-json in /packages/nginx ([09bc34d](https://github.com/Alwatr/nitrobase/commit/09bc34d8bde53c390c925922df2983d2d9f928eb)) by @dependabot[bot]

## [7.5.3](https://github.com/Alwatr/nitrobase/compare/v7.5.2...v7.5.3) (2024-11-11)

### Bug Fixes

* **debug:** sample data ([b3c3281](https://github.com/Alwatr/nitrobase/commit/b3c32814fe21cfc07e2a7cb78ef970a7c6c280ea)) by @AliMD
* **nginx:** add 403 response for undefined user locations in region authenticated config ([b59872f](https://github.com/Alwatr/nitrobase/commit/b59872f03d9fae7ce3b4502e041d5870c66e4058)) by @AliMD
* **nginx:** add 403 response for undefined user locations in region manager and owner configs ([1b9b491](https://github.com/Alwatr/nitrobase/commit/1b9b49135b39073387ee6ce6d79c6592cb3adc66)) by @AliMD
* **nginx:** add 403 response for undefined user locations in region per-user config ([cfb8c4e](https://github.com/Alwatr/nitrobase/commit/cfb8c4ee1ff4881660cd7b0225c824bdca2ac392)) by @AliMD
* **nginx:** add 403 response for undefined user locations in region public config ([5c060c8](https://github.com/Alwatr/nitrobase/commit/5c060c8b623a13ae9ddbabb90949fb969761d28e)) by @AliMD
* **nginx:** add custom message to 403 response in deny-other.conf.template ([f306a39](https://github.com/Alwatr/nitrobase/commit/f306a39c9affd4b2a2c17a94381d410dd183b426)) by @AliMD
* **nginx:** modify authentication logic to return 403 for unauthorized user locations ([c10116d](https://github.com/Alwatr/nitrobase/commit/c10116d60c6d7f85a2b0cbb5ba7456e29addaac1)) by @AliMD
* **nginx:** rename all files order ([8922752](https://github.com/Alwatr/nitrobase/commit/8922752b8d746e24f10dc7a24f8f2eefc7e6255f)) by @AliMD
* **nginx:** update 404 response for secret locations to include custom message ([c982522](https://github.com/Alwatr/nitrobase/commit/c982522426924048ca493ce3e090a2015aaf4a5c)) by @AliMD
* **nginx:** update base image to version 3.3.3 in Dockerfile ([65fb63a](https://github.com/Alwatr/nitrobase/commit/65fb63ae3fd5b09b4057874d51b98bc5a7f25d8c)) by @AliMD
* **nginx:** update base image to version 3.3.5 and modify CORS methods ([18bd47e](https://github.com/Alwatr/nitrobase/commit/18bd47ebc98dc0cf0b5bac66d72bdf953f68a0aa)) by @AliMD
* **nginx:** update library path and comment out unused curl requests in debug script ([c7cc148](https://github.com/Alwatr/nitrobase/commit/c7cc148fafaa34d7d6b3e51b475f6fcd37ab9634)) by @AliMD

## [7.5.2](https://github.com/Alwatr/nitrobase/compare/v7.5.1...v7.5.2) (2024-11-09)

### Bug Fixes

* **nginx:** comment out OPTIONS method handling in auth configuration ([25eb239](https://github.com/Alwatr/nitrobase/commit/25eb23943e5da8defebfd9fb4874e86384c2332d)) by @

## [7.5.1](https://github.com/Alwatr/nitrobase/compare/v7.5.0...v7.5.1) (2024-11-09)

### Bug Fixes

* **nginx:** skip return 403 for OPTIONS method in auth configuration ([18a62c3](https://github.com/Alwatr/nitrobase/commit/18a62c3e52c172619ec365526858dc46a5ba3554)) by @

## [7.5.0](https://github.com/Alwatr/nitrobase/compare/v7.4.1...v7.5.0) (2024-11-09)

### Bug Fixes

* **nginx:** change return code from 444 to 403 for unauthorized user access ([7cdb33d](https://github.com/Alwatr/nitrobase/commit/7cdb33d66c1c98f118c623a4cc116d9f60da344a)) by @AliMD
* **nginx:** update base image from 3.2.0 to 3.3.1 in Dockerfile ([6378cb3](https://github.com/Alwatr/nitrobase/commit/6378cb3913937f9bd09f514648b1f77a06af317f)) by @AliMD

## [7.4.0](https://github.com/Alwatr/nitrobase/compare/v7.3.1...v7.4.0) (2024-11-08)

### Features

* **nginx:** default CORS configuration ([bb69e47](https://github.com/Alwatr/nitrobase/commit/bb69e47ad14b061b6a0d47653d3fbed2e379ea3e)) by @

### Miscellaneous Chores

* **deps:** bump alwatr/nginx-json in /packages/nginx ([f86339f](https://github.com/Alwatr/nitrobase/commit/f86339ffdcbd52c06885be6b1b10c54bd823b419)) by @dependabot[bot]
* **dockerfile:** update label version ([f25eb3b](https://github.com/Alwatr/nitrobase/commit/f25eb3b04b1646eddcf75d15e4f38834ef57ac7e)) by @AliMD

## [7.3.1](https://github.com/Alwatr/nitrobase/compare/v7.3.0...v7.3.1) (2024-11-02)

### Miscellaneous Chores

* **deps:** bump alwatr/nginx-json in /packages/nginx ([6b965bc](https://github.com/Alwatr/nitrobase/commit/6b965bc0426be815c3c5d38296d798bbdb2b4f60)) by @dependabot[bot]
* **Dockerfile:** update label version ([9b59694](https://github.com/Alwatr/nitrobase/commit/9b596946662766c90b7b816359401f47252c0f85)) by @AliMD

## [7.2.1](https://github.com/Alwatr/nitrobase/compare/v7.2.0...v7.2.1) (2024-09-29)

### Miscellaneous Chores

* **nginx:** change the license to AGPL-3.0 ([e2cf692](https://github.com/Alwatr/nitrobase/commit/e2cf6922a6c403408d36e4a5b3eab147ce76dfa4)) by @ArmanAsadian

## [7.2.0](https://github.com/Alwatr/nitrobase/compare/v7.1.1...v7.2.0) (2024-09-24)

### Code Refactoring

* rename all store to nitrobase ([0928420](https://github.com/Alwatr/nitrobase/commit/0928420d8751e16ff1e8d91e1d3048a5895885a6)) by @AliMD
* rename all store to nitrobase ([9e31765](https://github.com/Alwatr/nitrobase/commit/9e31765b63ecd94bcf600cb44cfd9e341dd11a4e)) by @AliMD

## [7.1.1](https://github.com/Alwatr/nitrobase/compare/v7.1.0...v7.1.1) (2024-09-24)

### Bug Fixes

* **nginx:** update store prefix to latest version ([679a14b](https://github.com/Alwatr/nitrobase/commit/679a14b4c3f96b58e8b3bcb90f7af4a2d6b99149)) by @njfamirm

## [7.0.0](https://github.com/Alwatr/nitrobase/compare/v7.0.0-beta.1...v7.0.0) (2024-09-02)

**Note:** Version bump only for package @alwatr/nitrobase-nginx

## [6.0.4](https://github.com/Alwatr/nitrobase/compare/v6.0.3...v6.0.4) (2024-04-25)

### Miscellaneous Chores

* **deps:** bump alwatr/nginx-json in /packages/nginx ([ae24e49](https://github.com/Alwatr/nitrobase/commit/ae24e49b1a1d183f7e331b72e8d077cbd14484b2)) by @dependabot[bot]
* **nginx:** update labels ([4b15d23](https://github.com/Alwatr/nitrobase/commit/4b15d23aea3383cfd97356437411642f93ebd270)) by @AliMD

## [6.0.2](https://github.com/Alwatr/nitrobase/compare/v6.0.1...v6.0.2) (2024-02-09)

### Performance Improvements

* **nginx:** Update nginx-json base image version and improve HEALTHCHECK performance ([7e46731](https://github.com/Alwatr/nitrobase/commit/7e46731af349f8b3be07ab3a3238449038806acb)) by @AliMD

## [6.0.1](https://github.com/Alwatr/nitrobase/compare/v6.0.0...v6.0.1) (2024-01-24)

### Bug Fixes

* **nginx/debug:** Add prefixUri variable to command_test function and add ps command ([ae165f8](https://github.com/Alwatr/nitrobase/commit/ae165f8b7f1a6d60ec4d220e20f2e594618d6447)) by @
* **nginx:** docker HEALTHCHECK ([34f61c0](https://github.com/Alwatr/nitrobase/commit/34f61c0079730be6c8aa972df748e53ee81f8e62)) by @

## [6.0.0](https://github.com/Alwatr/nitrobase/compare/v6.0.0-alpha.0...v6.0.0) (2024-01-24)

### Miscellaneous Chores

* **deps:** bump alwatr/nginx-json in /packages/nginx ([485b9a4](https://github.com/Alwatr/nitrobase/commit/485b9a4b934bb6857a15b6acb47b45f522478c84)) by @dependabot[bot]
* **nginx:** update dockerfile labels ([80555c8](https://github.com/Alwatr/nitrobase/commit/80555c846ff6158cee0658aba016c8eda30b72f7)) by @AliMD

## [6.0.0-alpha.0](https://github.com/Alwatr/nitrobase/compare/v5.1.0...v6.0.0-alpha.0) (2024-01-15)

### ⚠ BREAKING CHANGES

* **nginx:** default `nitrobaseApiPrefix` change to `/api/s6`
* **nginx:** Add authentication requirement for all location
* **nginx:** new authorization method

### Features

* **nginx:** Add 99-deny-other.conf.template to deny all unknown locationswner ([4707214](https://github.com/Alwatr/nitrobase/commit/470721469eefae49e9d1243b40d792aaeca3e67c)) by @AliMD
* **nginx:** Add authentication support and remove separate requirement for authentication ([ec7e8c4](https://github.com/Alwatr/nitrobase/commit/ec7e8c41d21c8f7038f0650db0ee02a056f63edf)) by @AliMD
* **nginx:** Add debug.sh script for debug and test deployment ([dcb2b33](https://github.com/Alwatr/nitrobase/commit/dcb2b3308ab4c44108affdb66cafed44b5641ab1)) by @AliMD
* **nginx:** Add region-specific file location per owner ([425289c](https://github.com/Alwatr/nitrobase/commit/425289c02a575627ba0f6c91ac269fd96559817f)) by @AliMD
* **nginx:** Complete new PerUser region location with manager access ([d6ab5ed](https://github.com/Alwatr/nitrobase/commit/d6ab5ed6eed28b30be29623ad1afc1f238a7db4b)) by @AliMD
* **nginx:** extraction of authUserId and authUserToken from authorization header ([79fb030](https://github.com/Alwatr/nitrobase/commit/79fb030c288958584f280d18dd10872dd07e6a92)) by @AliMD
* **nginx:** rewrite debug location ([73f9980](https://github.com/Alwatr/nitrobase/commit/73f99801a35a210a94d411d7bb1c8d057d32fca2)) by @AliMD
* **nginx:** Update region secret location to return 404 ([53c2521](https://github.com/Alwatr/nitrobase/commit/53c2521bc99eff0dc5ca33f932ada61823a18163)) by @AliMD

### Bug Fixes

* **nginx:** location directive in 93-region-managers.conf.template ([fc8fdab](https://github.com/Alwatr/nitrobase/commit/fc8fdabfc60475b973b58a96da5c3836165ce836)) by @AliMD
* **nginx:** location directive in region public configuration ([2b19c0c](https://github.com/Alwatr/nitrobase/commit/2b19c0c55f48e9d546cf05dbb77b9d2ca15303f9)) by @AliMD
* **nginx:** location directive in region-authenticated.conf.template ([a82153e](https://github.com/Alwatr/nitrobase/commit/a82153e4c606d0ba0fc5539632576ffd91aafe28)) by @AliMD
* **nginx:** location try_files issues in PerUser ([e2671d4](https://github.com/Alwatr/nitrobase/commit/e2671d4e227626f4f18073fbc92770c0e0345dd0)) by @AliMD
* **nginx:** regex pattern in location directive ([ebd1e27](https://github.com/Alwatr/nitrobase/commit/ebd1e27768048bc03a8cf274a4d7b0b87b15d009)) by @AliMD
* **nginx:** Remove extract-auth.conf and add map-auth.conf template ([7c74be2](https://github.com/Alwatr/nitrobase/commit/7c74be26760fc807b29c62e358f4ef1db3f15b1b)) by @AliMD

### Code Refactoring

* **nginx:** Add authentication requirement for all location ([0f52f8c](https://github.com/Alwatr/nitrobase/commit/0f52f8cc5173e797bc5faba363277cc64af9724a)) by @AliMD
* **nginx:** Add rewrite rule to remove nitrobaseApiPrefix from URL ([c0a5a69](https://github.com/Alwatr/nitrobase/commit/c0a5a6910a2244f3a8eeffef0351f5390ebf8e69)) by @AliMD
* **nginx:** Add nitrobaseDebugPath and change nitrobaseRegionPerDevice to nitrobaseRegionPerOwner ([4dcdd61](https://github.com/Alwatr/nitrobase/commit/4dcdd61cc40b5127a5fe4c6196c98f4321e7a4dc)) by @AliMD
* **nginx:** Authenticated region location ([ebb91c6](https://github.com/Alwatr/nitrobase/commit/ebb91c66fcf937ef9c7c2666b340ca817e0cb5f2)) by @AliMD
* **nginx:** home page JSON response ([fb7f70c](https://github.com/Alwatr/nitrobase/commit/fb7f70c424c0c6c0234d6728869d1a24eb436e06)) by @AliMD
* **nginx:** Managers region location ([a2568cf](https://github.com/Alwatr/nitrobase/commit/a2568cf0d88cfc9d6b0e9d3795fe7907ec03d999)) by @AliMD
* **nginx:** public region location ([3b57d62](https://github.com/Alwatr/nitrobase/commit/3b57d6213a7b048691910dac4965fd8dddc0a2c8)) by @AliMD
* **nginx:** secret region location ([358b0bf](https://github.com/Alwatr/nitrobase/commit/358b0bfa8f49d03678568aa0c2af3e7940914fa6)) by @AliMD

### Miscellaneous Chores

* **nginx:** cleanup ([4d971ff](https://github.com/Alwatr/nitrobase/commit/4d971ff981b12790417f3b52d67467953975f058)) by @AliMD
* **nginx:** rename home json ([5e1c06b](https://github.com/Alwatr/nitrobase/commit/5e1c06baff9ddaac4eaea2a0733d127f5771e852)) by @AliMD
* **nginx:** Update NGINX nitrobase API prefix ([f477ce8](https://github.com/Alwatr/nitrobase/commit/f477ce8107628a110a7c38f1d1a52ed8274fda46)) by @AliMD

## [5.1.0](https://github.com/Alwatr/nitrobase/compare/v5.0.0...v5.1.0) (2024-01-13)

### Features

* update nginx base image to v2.3.2 ([db8c896](https://github.com/Alwatr/nitrobase/commit/db8c896464b6d4c824eb93fb5ac5c40d3caad9c9)) by @AliMD

### Miscellaneous Chores

* **deps:** bump alwatr/nginx-json in /packages/nginx ([fedc46a](https://github.com/Alwatr/nitrobase/commit/fedc46a497927b0fa4668ec81c85fa4b2b1c369e)) by @dependabot[bot]
* **nginx:** update docker label ([9f38e70](https://github.com/Alwatr/nitrobase/commit/9f38e70607d349cb482e445fe68fe129776b551f)) by @AliMD

### Code Refactoring

* Update nitrobaseRegionSecret value in Dockerfile and types file ([a0b13c6](https://github.com/Alwatr/nitrobase/commit/a0b13c6ff07599a425fa666437c0ebf167ccf6c8)) by @AliMD

# [5.0.0](https://github.com/Alwatr/nitrobase/compare/v5.0.0-beta...v5.0.0) (2024-01-12)

### Bug Fixes

* **nginx:** token validation in managers region ([f5f54fb](https://github.com/Alwatr/nitrobase/commit/f5f54fb52cb9d4721b25d0c3d76d8a8c717ae288)) by @AliMD

### Code Refactoring

* rename region SuperAdmin to Managers ([7c3ece8](https://github.com/Alwatr/nitrobase/commit/7c3ece8a24a88ea12a82966e41ea1ad7362159f4)) by @AliMD

### Performance Improvements

* **nginx:** Micro optimization in map ([955f836](https://github.com/Alwatr/nitrobase/commit/955f8369e5013af06b987bba7acae5fa2d167dfb)) by @AliMD

### BREAKING CHANGES

* region `SuperAdmin` renamed to `Managers`

# [5.0.0-beta](https://github.com/Alwatr/nitrobase/compare/v4.1.0...v5.0.0-beta) (2023-12-31)

### Bug Fixes

* **nginx:** device id variable ([7e58911](https://github.com/Alwatr/nitrobase/commit/7e5891137a095b28fd6cd5388073212f73441225)) by @njfamirm
* **nginx:** header map regex ([3e16b69](https://github.com/Alwatr/nitrobase/commit/3e16b6946c7f07b76af7a3af299339899ac4b6fa)) by @njfamirm

### Features

* **nginx:** Add debug-info-007 endpoint to return JSON response ([9d6d671](https://github.com/Alwatr/nitrobase/commit/9d6d67187248e3b626675a780e23bf3bdfc64300)) by @AliMD
* **nginx:** Add input validation for user_id and user_token ([7216ae5](https://github.com/Alwatr/nitrobase/commit/7216ae5171b0c13c77b5d801bf945c23972f6234)) by @AliMD
* **nginx:** Add location for super admin access ([7e274a6](https://github.com/Alwatr/nitrobase/commit/7e274a63b3d12ac656dd461f9bd03ed63f0db2cb)) by @AliMD
* **nginx:** Add MIME type for asj files ([756a99e](https://github.com/Alwatr/nitrobase/commit/756a99e70c8977dda1d852327ef9f87942d3f4d9)) by @AliMD
* **nginx:** Add user/device/token locations headers mappings ([3e71297](https://github.com/Alwatr/nitrobase/commit/3e7129732ada897e4c858d8c7ab0b2309186f353)) by @AliMD
* **nginx:** compatible with new engine ([196b80f](https://github.com/Alwatr/nitrobase/commit/196b80fcf6ce24d9f061b85c99a0a93d5e1a8933)) by @njfamirm
* **nginx:** Refactor nginx location configuration for engine5 ([451e266](https://github.com/Alwatr/nitrobase/commit/451e266daade4c7dff88a3d73273424537bc7251)) by @AliMD
* **nginx:** Update device ID mapping in nginx configuration ([5ff4080](https://github.com/Alwatr/nitrobase/commit/5ff40806e29158e2e7271b6123027e92bbc0c933)) by @AliMD
* **nginx:** Update home page JSON response ([0da2f5e](https://github.com/Alwatr/nitrobase/commit/0da2f5e1673a96a1bc329a9e7e6968c73312394f)) by @AliMD
* **nginx:** Update nginx version and add default error JSON file ([5213c65](https://github.com/Alwatr/nitrobase/commit/5213c652977e5a9db4c2f88aeec8da6a07b1f626)) by @AliMD
* **nginx:** Update nginx-json base image version and add environment variables ([2269f67](https://github.com/Alwatr/nitrobase/commit/2269f67f07bfd0eb0207584a27a3fc8663cece8c)) by @AliMD
* **nginx:** Update nitrobaseRegionSecret env value in nginx Dockerfile ([15b3595](https://github.com/Alwatr/nitrobase/commit/15b35954fc972fdd648584f1b71fdad550699b70)) by @AliMD
