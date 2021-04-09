import { getRepository } from 'typeorm';
import slugify from 'slugify';
import ServiceError from '../../util/ServiceError';
import File from '../../models/File';
import Tag from '../../models/Tag';
import Category from '../../models/Category';

interface Request {
  icon: string;
  name: string;
  categoryId: string;
}

class CreateTagService {
  public async execute({ icon, name, categoryId }: Request): Promise<Tag> {
    const filesRepository = getRepository(File);
    const tagsRepository = getRepository(Tag);
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new ServiceError('Id de categoria inválida.');
    }

    const fileExits = await filesRepository.findOne({
      where: { id: icon },
    });

    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const tagData = tagsRepository.create({
        icon: fileExits,
        name,
        slug: slugify(name),
        createdAt,
        updatedAt,
        category,
      });

      const tag = await tagsRepository.save(tagData);
      if (tag) {
        return await tagsRepository.findOne({
          where: { id: tag.id },
          relations: ['icon'],
        });
      }
      throw new ServiceError(`Erro ao recuperar nova tag do banco de dados.`);
    } catch (err) {
      throw new ServiceError(`Erro ao criar tag: ${err}`);
    }
  }
}

export default CreateTagService;
