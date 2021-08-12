/* eslint-disable camelcase */

import { ApiContext, Category } from '../../types';
import { deserializeCategories } from '../serializers/category';

const allCategoriesCacheKey = 'allCategories';
const allCategoriesCacheTtl = 60 * 60 * 24;

const findCategory = (categories: Category[], slug: string) => categories.find(e => e.slug === slug);

export default async function getCategory({ client, cacheProvider }: ApiContext, { categorySlug }) {
  try {
    let categories;
    if (!cacheProvider.has(allCategoriesCacheKey)) {
      const result = await client.taxons.list({ fields: { taxon: 'name,permalink,children,parent,is_root' }, per_page: 500 });
      if (result.isSuccess()) {
        const data = result.success().data;
        categories = deserializeCategories(data);
        cacheProvider.set(allCategoriesCacheKey, categories, allCategoriesCacheTtl);
      } else {
        throw result.fail();
      }
    } else {
      categories = cacheProvider.get(allCategoriesCacheKey);
    }

    return {
      root: findCategory(categories, 'categories'),
      current: findCategory(categories, categorySlug)
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
