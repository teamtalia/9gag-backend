import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import slugify from 'slugify';
import Category from '../../models/Category';
import Tag from '../../models/Tag';

export default class CreateTags implements Seeder {
  payload = {
    MITOLOGIA: [
      'Mitlogia',
      'Mitologia Grega',
      'Mitologia Egípcia',
      'Mitologia Romana',
      'Mitologia Japonesa',
      'Mitologia Asteca',
      'Mitologia Celta',
      'Mitologia Iorubá',
      'Mitologia Hindu',
      'Mitologia Nórdica',
    ],
    'MODA/BELEZA': [
      'Moda',
      'Beleza',
      'Maquiagem',
      'Casamento',
      'Fashion Week',
      'Moda feminina',
      'Moda masculina',
      'Moda Clássico',
      'Moda Elegante',
      'Moda Esportivo',
      'Moda Romântico',
      'Moda Vintage',
      'Moda Geek',
    ],
    ESPORTES: [
      'Esportes',
      'Futebol',
      'Basquete',
      'Vôlei',
      'MMA',
      'Golfe',
      'Tênis',
      'Atletismo',
      'Skate',
      'Surfe',
      'Natação',
    ],
    'FILMES/SÉRIES': [
      'Filmes',
      'Séries',
      'Gênero  Ação',
      // 'Stand-Up', // removido
      'Comédia',
      'Romântico',
      'Animação ',
      'Aventura ',
      'Biografia ',
      'Drama',
      'Ficção Científica',
      'Infantil ',
      'Documentário',
      'Musical ',
      'Terror',
    ],
    CORONAVIRUS: ['Coronavírus', 'Pandemia', 'Fica em Casa'],
    ENGRAÇADO: ['Engraçado', 'Meme', 'Stand-Up'], // removido Comédia
    JOGOS: [
      'Jogos',
      'Jogo de PC',
      'Jogo Mobile',
      'PS4',
      'Nintendo',
      'Xbox',
      'Consoles',
      'RPG',
      'Jogo Luta',
      'Jogo Aventura',
      'Jogo Terror',
      'Jogo Ação',
      'Jogo Futebol',
      'Among Us',
      'Fortnite',
      'Minecraft',
      'Free Fire',
      'League of Legends ',
      'Overwatch',
      'Valorant',
      'Apex Legends',
      'Counter-Strike',
      'Call of Duty',
    ],
    MÚSICA: [
      'Música',
      'Pop',
      'Sertanejo',
      'Samba',
      'Bossa Nova',
      'Rap',
      'MPB',
      'Rock',
      'Heavy Metal',
      'Pagode',
      'Funk',
      'Gospel',
      'Reggae',
    ],
    COMIDAS: [
      'Comidas',
      'Bebidas',
      'Fast Food',
      'Orgânico',
      'Vegano',
      'Vegetariano',
      'Receitas',
      'Pratos típicos',
    ],
    VIAGENS: [
      'Viagens',
      'Turismo',
      'Viagens gastronômicas',
      'Viagens românticas',
      ' Mochilão',
      'Passeio relaxante',
      'Intercâmbio',
    ],
    CARROS: ['Carros', 'Motos', 'Rali', 'Fórmula 1'],
    ANIMAIS: [
      'Animais',
      'Cachorros',
      'Gatos',
      'Dinossauros',
      'Vida Selvagem',
      'Peixes',
      'Aves',
      'Mamíferos',
      'Répteis',
      'Anfíbios',
    ],
    POLÍTICA: ['Política', 'Eleições', 'Governo'],
  };

  public async run(factory: Factory, connection: Connection): Promise<any> {
    try {
      const categoryRepository = await connection.getRepository(Category);
      const categories = (await categoryRepository.find()).reduce(
        (prev, curr) => {
          return {
            ...prev,
            [curr.name]: curr,
          };
        },
        {},
      );

      await Promise.all(
        Object.entries(this.payload).map(async ([category, tags]) => {
          const categoryModel = categories[category];

          const values = tags.map(tag => ({
            name: tag,
            slug: slugify(tag.toLowerCase()),
            category: categoryModel,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await connection
            .createQueryBuilder()
            .insert()
            .into(Tag)
            .values(values)
            .execute();
        }),
      );
    } catch (e) {
      console.log('Erro ao subir um seed');
    }
  }
}
