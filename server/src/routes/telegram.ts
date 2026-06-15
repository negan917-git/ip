import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';
import * as telegramController from '../controllers/telegramController';

const router = Router();

/**
 * @swagger
 * /api/telegram/connect:
 *   post:
 *     tags: [Telegram]
 *     summary: Connect a Telegram bot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - botName
 *               - apiToken
 *             properties:
 *               botName:
 *                 type: string
 *               apiToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bot connected
 *       400:
 *         description: Error
 */
router.post(
  '/connect',
  authenticateToken,
  [
    body('botName').notEmpty().withMessage('Bot name is required'),
    body('apiToken').notEmpty().withMessage('API token is required'),
  ],
  validate,
  telegramController.connect
);

/**
 * @swagger
 * /api/telegram/status:
 *   get:
 *     tags: [Telegram]
 *     summary: Get Telegram bot connection status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bot status
 */
router.get('/status', authenticateToken, telegramController.status);

/**
 * @swagger
 * /api/telegram/webhook:
 *   post:
 *     tags: [Telegram]
 *     summary: Handle Telegram webhook updates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiToken:
 *                 type: string
 *               update:
 *                 type: object
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/webhook', telegramController.webhook);

export default router;
