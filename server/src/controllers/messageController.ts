import { Request, Response } from 'express';
import prisma from '../prisma';
import { analyzeMessage } from '../services/openai';
import { AuthRequest } from '../middleware/auth';

export const analyze = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const userId = req.userId;

    const analysis = await analyzeMessage(text);

    const message = await prisma.message.create({
      data: {
        text,
        source: 'web',
        emotion: analysis.emotion,
        isComplaint: analysis.isComplaint,
        category: analysis.category,
        priority: analysis.priority,
        summary: analysis.summary,
        userId: userId || undefined,
      },
    });

    res.json({
      id: message.id,
      text: message.text,
      source: message.source,
      emotion: analysis.emotion,
      isComplaint: analysis.isComplaint,
      category: analysis.category,
      priority: analysis.priority,
      summary: analysis.summary,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error('Analyze message error:', error);
    res.status(500).json({ error: 'Failed to analyze message' });
  }
};

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const emotion = (req.query.emotion as string) || '';
    const category = (req.query.category as string) || '';
    const priority = (req.query.priority as string) || '';
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.text = { contains: search, mode: 'insensitive' };
    }

    if (emotion) {
      where.emotion = emotion;
    }

    if (category) {
      where.category = category;
    }

    if (priority) {
      where.priority = priority;
    }

    const total = await prisma.message.count({ where });

    const messages = await prisma.message.findMany({
      where,
      orderBy: { [sortBy]: sortOrder } as any,
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const message = await prisma.message.findUnique({ where: { id } });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.json(message);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
