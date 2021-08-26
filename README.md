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
