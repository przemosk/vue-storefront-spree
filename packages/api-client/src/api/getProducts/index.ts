/* eslint-disable camelcase */

import { ApiContext } from '../../types';
import { addHostToProductImages, deserializeLimitedVariants, deserializeSearchMetadata } from '../serializers/product';

const productsCacheTtl = 60 * 60 * 24;

export default async function getProducts({ client, config, cacheProvider }: ApiContext, params) {
  const { id, categoryId, page, sort, optionValuesIds, price, itemsPerPage, term } = params;

  const productsCacheKey = `product_${id}_${categoryId}_${page}_${sort}_${optionValuesIds?.join(',')}_${price}_${itemsPerPage}_${term}`;

  let data;
  if (cacheProvider.has(productsCacheKey)) {
    data = cacheProvider.get(productsCacheKey);
  } else {
    const result = await client.products.list({
      filter: {
        ids: id,
        taxons: categoryId,
        option_value_ids: optionValuesIds,
        price,
        name: term
      },
      fields: {
        product: 'name,slug,variants,option_types,taxons',
        variant: 'name,slug,sku,price,display_price,product,images,option_values'
      },
      include: 'variants.option_values,option_types,taxons,images',
      page,
      sort,
      per_page: itemsPerPage
    });

    if (result.isSuccess()) {
      data = result.success();
      cacheProvider.set(productsCacheKey, data, productsCacheTtl);
    } else {
      console.log(result.fail());
      throw result.fail();
    }
  }

  const productsData = addHostToProductImages(data, config);
  return {
    data: deserializeLimitedVariants(productsData),
    meta: deserializeSearchMetadata(data.meta)
  };
}

