import { getRepository } from 'typeorm';
import slugify from 'slugify';
import ServiceError from '../../util/ServiceError';
import Category from '../../models/Category';

interface Request {
  name: string;
}

class CreateCategoryService {
  public async execute({ name }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const categoryData = await categoriesRepository.create({
        name,
        slug: slugify(name),
        createdAt,
        updatedAt,
      });
      const category = await categoriesRepository.save(categoryData);
      if (category) {
        return await categoriesRepository.findOne({
          where: { id: category.id },
        });
      }
      throw new ServiceError(`error on retrive new tag from database.`);
    } catch (err) {
      throw new ServiceError(`error on create tag: ${err}`);
    }
  }
}

export default CreateCategoryService;
