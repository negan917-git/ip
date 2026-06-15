import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    const totalMessages = await prisma.message.count({ where });
    const complaints = await prisma.message.count({ where: { ...where, isComplaint: true } });
    const positiveMessages = await prisma.message.count({
      where: { ...where, emotion: { in: ['радость', 'нейтральное'] } },
    });
    const negativeMessages = await prisma.message.count({
      where: { ...where, emotion: { in: ['гнев', 'грусть', 'разочарование'] } },
    });
    const highPriority = await prisma.message.count({
      where: { ...where, priority: { in: ['высокий', 'критичный'] } },
    });

    res.json({
      totalMessages,
      complaints,
      positiveMessages,
      negativeMessages,
      highPriority,
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEmotions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    const emotions = await prisma.message.groupBy({
      by: ['emotion'],
      where: { ...where, emotion: { not: null } },
      _count: true,
    });

    const labels: Record<string, string> = {
      'радость': 'Радость',
      'гнев': 'Гнев',
      'грусть': 'Грусть',
      'нейтральное': 'Нейтральное',
      'разочарование': 'Разочарование',
    };

    const result = emotions.map((e) => ({
      name: labels[e.emotion!] || e.emotion,
      value: e._count,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get emotions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const where: any = { isComplaint: true };

    if (userId) {
      where.userId = userId;
    }

    const categories = await prisma.message.groupBy({
      by: ['category'],
      where: { ...where, category: { not: null } },
      _count: true,
    });

    const labels: Record<string, string> = {
      'техническая проблема': 'Техническая проблема',
      'качество обслуживания': 'Качество обслуживания',
      'оплата': 'Оплата',
      'доставка': 'Доставка',
      'другое': 'Другое',
    };

    const result = categories.map((c) => ({
      name: labels[c.category!] || c.category,
      value: c._count,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
