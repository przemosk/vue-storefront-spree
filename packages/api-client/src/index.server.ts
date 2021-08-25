import { apiClientFactory, ApiClientExtension } from '@vue-storefront/core';
import { makeClient } from '@spree/storefront-api-v2-sdk';
import NodeCache from 'node-cache';
import getProduct from './api/getProduct';
import getProducts from './api/getProducts';
import getCategory from './api/getCategory';
import logIn from './api/logIn';
import logOut from './api/logOut';
import getCurrentUser from './api/getCurrentUser';
import isGuest from './api/isGuest';
import changePassword from './api/changePassword';
import registerUser from './api/registerUser';
import addAddress from './api/addAddress';
import getAddresses from './api/getAddresses';
import getAvailableCountries from './api/getAvailableCountries';
import getCountryDetails from './api/getCountryDetails';
import updateAddress from './api/updateAddress';
import getCart from './api/getCart';
import addToCart from './api/addToCart';
import updateItemQuantity from './api/updateItemQuantity';
import removeFromCart from './api/removeFromCart';
import clearCart from './api/clearCart';
import applyCoupon from './api/applyCoupon';
import removeCoupon from './api/removeCoupon';
import getCheckout from './api/getCheckout';
import saveCheckoutShippingAddress from './api/saveCheckoutShippingAddress';
import saveCheckoutBillingAddress from './api/saveCheckoutBillingAddress';
import createAuthIntegration from './api/authentication/integration';
import getOrCreateCart from './api/getOrCreateCart';
import getOrders from './api/getOrders';

const defaultSettings = {
  backendUrl: 'http://localhost:4000'
};

const cacheProvider = new NodeCache({});

const onCreate = (settings) => {
  return {
    config: {
      ...defaultSettings,
      ...settings
    },
    client: makeClient({ host: settings.backendUrl || defaultSettings.backendUrl }),
    cacheProvider
  };
};

const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  hooks: (req, res) => {
    const auth = createAuthIntegration(req, res);

    return {
      beforeCreate: ({ configuration }) => ({
        ...configuration,
        auth
      })
    };
  }
};

const { createApiClient } = apiClientFactory<any, any>({
  onCreate,
  api: {
    getProduct,
    getProducts,
    getCategory,
    getCurrentUser,
    logIn,
    logOut,
    isGuest,
    changePassword,
    registerUser,
    addAddress,
    getAddresses,
    getAvailableCountries,
    getCountryDetails,
    updateAddress,
    getCart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCheckout,
    saveCheckoutShippingAddress,
    saveCheckoutBillingAddress,
    getOrCreateCart,
    getOrders
  },
  extensions: [tokenExtension]
});

export {
  createApiClient
};
