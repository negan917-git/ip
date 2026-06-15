import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Get analytics overview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview data
 */
router.get('/overview', authenticateToken, analyticsController.getOverview);

/**
 * @swagger
 * /api/analytics/emotions:
 *   get:
 *     tags: [Analytics]
 *     summary: Get emotion distribution
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Emotion data
 */
router.get('/emotions', authenticateToken, analyticsController.getEmotions);

/**
 * @swagger
 * /api/analytics/complaints:
 *   get:
 *     tags: [Analytics]
 *     summary: Get complaint categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaint data
 */
router.get('/complaints', authenticateToken, analyticsController.getComplaints);

export default router;
