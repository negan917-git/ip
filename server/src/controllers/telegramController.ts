import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { connectTelegramBot, getBotStatus } from '../services/telegram';

export const connect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { botName, apiToken } = req.body;
    const userId = req.userId!;

    await connectTelegramBot(botName, apiToken, userId);

    res.json({ message: 'Bot connected successfully', isConnected: true });
  } catch (error: any) {
    console.error('Connect bot error:', error);
    res.status(400).json({ error: error.message || 'Failed to connect bot' });
  }
};

export const status = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const status = await getBotStatus(userId);
    res.json(status);
  } catch (error) {
    console.error('Get bot status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const webhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { apiToken, update, userId } = req.body;

    const { handleWebhookUpdate } = await import('../services/telegram');
    await handleWebhookUpdate(apiToken, update, userId);

    res.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
