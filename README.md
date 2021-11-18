# Hybaj

React Native Expo app. Bootstraped with expo typescript tabs example.

## Development

Install:

```
yarn
```

Run for all platforms

```
yarn start
```

This will guide you how to open it locally on iOs simulator (if available) or Android emulator (also if available). Running in web browser is possible but discouraged (react-native-mapview is still experimental in browser).

If you want to develop on your device, from [Expo Go](https://expo.io/client) application (downlaoaded from Play store). ping Martin Pinter to get it.

To get Env keys:

- GOOGLE_PLACES_API_KEY
  1. Log into google account inovacie.bratislava@gmail.com
  2. Proceed to console.cloud [dopravna aplikacia](https://console.cloud.google.com/google/maps-apis/credentials?pli=1&project=dopravna-aplikacia&folder=&organizationId=)
  3. `development-key Google Places`
- GOOGLE_MAPS_API_KEY
  1. Log into google account inovacie.bratislava@gmail.com
  2. Proceed to console.cloud [dopravna aplikacia](https://console.cloud.google.com/google/maps-apis/credentials?pli=1&project=dopravna-aplikacia&folder=&organizationId=)
  3. `tester release 1 Google Maps key`
- SENTRY_AUTH_TOKEN
  1. Log in to [Sentry](https://sentry.io/settings/account/api/auth-tokens/) with inovacie.bratislava@gmail.com account
  2. Proceed to Settings -> Account -> API -> Auth Tokens
  3. Get Auth token with scope: org:read, project:releases, project:write

For help reach to @mpinter (Martin Pinter) or @Balros (Adam Grund)

### Running on device

You need the [Expo Go](https://expo.io/client) application installed on your device. With Android you only need to scan the QR shown to you after `yarn start`. On iOs you may need access to the bratislava expo organisation - ping Martin Pinter to get it.

## Deployment

TODO

## Fetching data

We use [React Query](https://react-query.tanstack.com) to fetch data - it's giving it's default configuration and behaviour a quick look [here](https://react-query.tanstack.com/guides/important-defaults).

Fetching with React Query looks something like the following:

```ts
const { isLoading, data, error } = useQuery('uniqueKey', fetcherFunction)
```

The first (key) param is used as the cache key - `useQuery` used in two different places with the same key should

The fetcher functions reside in `api.ts` - please use the name of the fn as the key (as long as they all reside in same file this should guarantee uniqueness) - if the resource uses a parameter (i.e. you're fetching a resource by it's id), the key should be an array with the name of the functions and all parameters used:

```ts
useQuery('getStations', getStations)
useQuery(['getStationById', id], () => getStationsById(id))
```

## Validating data

We use [yup](https://github.com/jquense/yup). Useful not only as a sanity check but also to provide you with types and autocomplete. Validations reside in `validation.ts`.

## Release

To release application through `expo publish`:

1. `app.config.js` property `version` MUST be moddified
2. `expo publish --release-channel production`

To release new `.apk` to Play Store:

1. `yarn create-production-apk`
2. wait for [Expo](https://expo.dev/accounts/bratislava/projects/hybaj/builds) to build new `.apk`
3. Download produced `.apk`
4. Create new release to desired release channels, e.g. [Internal testing](https://play.google.com/console/u/1/developers/5957584533981072671/app/4975790424614272614/app-dashboard?timespan=thirtyDays)
5. Upload new `.apk`

## Additional info

When aplication is installed from play store, version installed is always from last `.apk` file uploaded to store, then OTA updates is applied.
