import { Router } from 'express';
import reports from './reports';
import user from './user';

export default function (config) {
  const api = Router();

  // API routes
  api.use('/reports', reports(config));
  api.use('/user', user(config));

  // Expose something at root
  api.get('/', (req, res) => res.json({ message: 'Yay, the Avocado service is up and running' }));

  return api;
}
