import { Router } from 'express';
import { getRepository } from 'typeorm';
import File from '../models/File';
import s3 from '../middleware/s3';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateFileService, {
  FileProps,
} from '../services/files/CreateFileService';

const router = Router();

router.get('/', ensureAuthenticated, async (req, res) => {
  const { id } = req.token.user;
  const fileRepository = getRepository(File);
  const files = await fileRepository.find();
  return res.status(201).json(files);
});

router.post('/', ensureAuthenticated, s3().single('file'), async (req, res) => {
  const { id } = req.token.user;
  const createFileService = new CreateFileService();
  try {
    const file = await createFileService.execute({
      userId: id,
      file: (req.file as unknown) as FileProps,
    });
    return res.status(201).json({
      location: file.location,
      id: file.id,
      name: file.originalname,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
