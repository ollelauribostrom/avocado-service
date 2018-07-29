import { Router } from 'express';
import AvocadoReport from '../models/AvocadoReport';
import User from '../models/User';

export default function (config) {
  const router = Router();

  router.get('/:offset?', async (req, res, next) => {
    try {
      const { offset, reports } = await AvocadoReport.getReports(Number(req.params.offset));
      res.json({ reports, offset });
    } catch (err) {
      next(err);
    }
  });

  router.get('/user/:id', async (req, res, next) => {
    try {
      const reports = await AvocadoReport.getReportsByUserID(req.params.id);
      res.json({ reports });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { where, description, postedBy } = req.body;
      const user = await User.findOne({ _id: postedBy });
      if (!where || !description) {
        res.sendStatus(400);
      }
      if (!user) {
        res.sendStatus(403);
      }
      const report = new AvocadoReport({ where, description, postedBy });
      await report.save();
      res.status(201).json(report);
    } catch (err) {
      next(err);
    }
  });

  router.post('/upvote/:id', async (req, res, next) => {
    try {
      const reportID = req.params.id;
      const { userID } = req.body;
      const user = await User.find({ _id: userID });
      if (!reportID) {
        res.sendStatus(400);
      }
      if (!user) {
        res.sendStatus(403);
      }
      await AvocadoReport.upvote(reportID, userID);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  router.post('/downvote/:id', async (req, res, next) => {
    try {
      const reportID = req.params.id;
      const { userID } = req.body;
      const user = await User.find({ _id: userID });
      if (!reportID) {
        res.sendStatus(400);
      }
      if (!user) {
        res.sendStatus(403);
      }
      await AvocadoReport.downvote(reportID, userID);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
