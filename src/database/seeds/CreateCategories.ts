import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import slugify from 'slugify';
import { uniqueId } from 'lodash';
import Category from '../../models/Category';

export default class CreateCategories implements Seeder {
  payload = [
    'MITOLOGIA',
    'MODA/BELEZA',
    'ESPORTES',
    'FILMES/SÉRIES',
    'CORONAVIRUS',
    'ENGRAÇADO',
    'JOGOS',
    'MÚSICA',
    'COMIDAS',
    'VIAGENS',
    'CARROS',
    'ANIMAIS',
    'POLÍTICA',
  ];

  public async run(factory: Factory, connection: Connection): Promise<any> {
    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(
          this.payload.map(category => ({
            name: category,
            slug: slugify(category.toLowerCase()),
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        )
        .execute();
    } catch (e) {
      console.log('Erro ao subir um seed:', e);
    }
  }
}
