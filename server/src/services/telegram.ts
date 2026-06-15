import { Telegraf } from 'telegraf';
import prisma from '../prisma';
import { analyzeMessage } from './openai';

const bots: Map<string, Telegraf> = new Map();

export async function connectTelegramBot(botName: string, apiToken: string, userId: number): Promise<void> {
  const existing = await prisma.telegramBot.findFirst({
    where: { userId, apiToken },
  });

  if (existing) {
    throw new Error('Bot already connected');
  }

  const bot = new Telegraf(apiToken);

  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const chatId = ctx.chat.id;

    try {
      const analysis = await analyzeMessage(text);

      const message = await prisma.message.create({
        data: {
          text,
          source: 'telegram',
          emotion: analysis.emotion,
          isComplaint: analysis.isComplaint,
          category: analysis.category,
          priority: analysis.priority,
          summary: analysis.summary,
          userId,
        },
      });

      await ctx.reply(
        `✅ Сообщение проанализировано!\n\n` +
        `Эмоция: ${analysis.emotion}\n` +
        `Жалоба: ${analysis.isComplaint ? 'Да' : 'Нет'}\n` +
        `Категория: ${analysis.category}\n` +
        `Срочность: ${analysis.priority}\n` +
        `Резюме: ${analysis.summary}`
      );
    } catch (error) {
      console.error('Error analyzing message:', error);
      await ctx.reply('❌ Произошла ошибка при анализе сообщения. Попробуйте позже.');
    }
  });

  bot.launch();
  bots.set(userId.toString(), bot);

  await prisma.telegramBot.create({
    data: {
      botName,
      apiToken,
      isConnected: true,
      userId,
    },
  });
}

export async function disconnectTelegramBot(userId: number): Promise<void> {
  const bot = bots.get(userId.toString());
  if (bot) {
    bot.stop();
    bots.delete(userId.toString());
  }

  await prisma.telegramBot.deleteMany({
    where: { userId },
  });
}

export async function getBotStatus(userId: number) {
  const bot = await prisma.telegramBot.findFirst({
    where: { userId, isConnected: true },
  });

  return {
    isConnected: !!bot,
    botName: bot?.botName || null,
    createdAt: bot?.createdAt || null,
  };
}

export async function setupWebhook(apiToken: string, webhookUrl: string): Promise<void> {
  const bot = new Telegraf(apiToken);
  await bot.telegram.setWebhook(webhookUrl);
}

export async function handleWebhookUpdate(apiToken: string, update: any, userId: number): Promise<void> {
  const bot = new Telegraf(apiToken);

  if (update.message?.text) {
    const text = update.message.text;

    const analysis = await analyzeMessage(text);

    await prisma.message.create({
      data: {
        text,
        source: 'telegram',
        emotion: analysis.emotion,
        isComplaint: analysis.isComplaint,
        category: analysis.category,
        priority: analysis.priority,
        summary: analysis.summary,
        userId,
      },
    });

    await bot.telegram.sendMessage(
      update.message.chat.id,
      `✅ Сообщение проанализировано!\n\n` +
      `Эмоция: ${analysis.emotion}\n` +
      `Жалоба: ${analysis.isComplaint ? 'Да' : 'Нет'}\n` +
      `Категория: ${analysis.category}\n` +
      `Срочность: ${analysis.priority}\n` +
      `Резюме: ${analysis.summary}`
    );
  }
}
