import { Request, Response, NextFunction } from 'express';
import { createNotification, processPending } from '../services/notificationService';
import Notification from '../models/Notification';

export const postNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const notif = await createNotification(data);
    res.status(201).json({ notificationId: notif.notificationId, status: notif.status });
  } catch (err) {
    next(err);
  }
};

export const getNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notif = await Notification.findOne({ notificationId: req.params.notificationId }).lean().exec();
    if (!notif) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(notif);
  } catch (err) {
    next(err);
  }
};


export const queryNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.eventType) filter.eventType = req.query.eventType;
    if (req.query.status) filter.status = { $in: (req.query.status as string).split(',') };
    const list = await Notification.find(filter).lean().exec();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// Optional: trigger background processing manually
export const runProcessor = async (_: Request, res: Response) => {
  await processPending();
  res.json({ message: 'Processing triggered' });
};
