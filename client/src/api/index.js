import * as mockApi from './mockApi.js'
import * as httpApi from './httpApi.js'

export const USING_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const implementation = USING_MOCK_API ? mockApi : httpApi

export const {
  listPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  listPhotos,
} = implementation

// Demo mode has nothing to log into, so these are no-ops there.
export const NEEDS_LOGIN = !USING_MOCK_API
export const setCredentials = USING_MOCK_API ? () => {} : httpApi.setCredentials
export const clearCredentials = USING_MOCK_API ? () => {} : httpApi.clearCredentials