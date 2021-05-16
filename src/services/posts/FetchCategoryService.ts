import { getRepository } from 'typeorm';
import slugify from 'slugify';
import ServiceError from '../../util/ServiceError';
import Category from '../../models/Category';
import Post from '../../models/Post';

interface PostsByCategory extends Category {
  posts: number;
}

class FetchCategoryService {
  public async execute(): Promise<PostsByCategory[]> {
    const categoriesRepository = getRepository(Category);

    const allCategories = await categoriesRepository.find({
      relations: ['tags', 'tags.posts'],
    });
    try {
      const postByCategory = allCategories
        .map(category => {
          const posts = category.tags
            .reduce<Post[]>((prev, curr) => [...prev, ...curr.posts], [])
            .filter((post, index, self) => {
              const findPost = self.findIndex(el => el.id === post.id);
              return findPost !== -1 && findPost === index;
            });
          return {
            ...category,
            posts: posts.length,
          };
        })
        .sort((a, b) => {
          if (a.posts > b.posts) {
            return -1;
          }
          if (a.posts < b.posts) {
            return 1;
          }
          return 0;
        });
      return postByCategory;
    } catch (err) {
      throw new ServiceError(`erro ao buscar as categorias: ${err}`);
    }
  }
}

export default FetchCategoryService;
