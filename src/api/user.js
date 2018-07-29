import { Router } from 'express';
import User from '../models/User';

export default function (config) {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const user = new User();
      await user.save();
      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
