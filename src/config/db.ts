import mongoose from 'mongoose';

// Replace this with your MONGOURI.
const MONGOURI =
  'mongodb+srv://private_rw_ohalia:9bkefw6VtHEDptPs@cluster0.ptjaz.mongodb.net/sistema?retryWrites=true&w=majority';

const InitiateMongoServer = async (): Promise<any> => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log('Bando de dados conectado !!');
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default InitiateMongoServer;
