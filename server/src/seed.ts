import prisma from './prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Seed user created:', user.username);

  const sampleMessages = [
    {
      text: 'Здравствуйте! У меня уже неделю не работает интернет. Вызывал мастера, но никто так и не пришёл. Это просто безобразие!',
      source: 'web',
      emotion: 'гнев',
      isComplaint: true,
      category: 'техническая проблема',
      priority: 'высокий',
      summary: 'Клиент жалуется на отсутствие интернета в течение недели и неявку мастера',
      userId: user.id,
    },
    {
      text: 'Спасибо большое за отличный сервис! Всё работает прекрасно, очень доволен вашей работой!',
      source: 'telegram',
      emotion: 'радость',
      isComplaint: false,
      category: 'другое',
      priority: 'низкий',
      summary: 'Клиент выражает благодарность за качественный сервис',
      userId: user.id,
    },
    {
      text: 'Куда пропали деньги со счёта? Я не совершал никаких платежей, а баланс уменьшился. Требую разобраться!',
      source: 'web',
      emotion: 'гнев',
      isComplaint: true,
      category: 'оплата',
      priority: 'критичный',
      summary: 'Клиент обнаружил списание средств без его ведома и требует разбирательства',
      userId: user.id,
    },
    {
      text: 'Подскажите, как поменять тарифный план? Не могу найти эту опцию в личном кабинете.',
      source: 'telegram',
      emotion: 'нейтральное',
      isComplaint: false,
      category: 'другое',
      priority: 'низкий',
      summary: 'Клиент интересуется сменой тарифного плана',
      userId: user.id,
    },
    {
      text: 'Заказал товар неделю назад, до сих пор не пришёл. Отслеживание не обновляется. Когда мне ждать доставку?',
      source: 'web',
      emotion: 'разочарование',
      isComplaint: true,
      category: 'доставка',
      priority: 'средний',
      summary: 'Клиент жалуется на задержку доставки заказа',
      userId: user.id,
    },
    {
      text: 'Оператор на линии был очень груб. Я просто хотел уточнить информацию, а он нахамил и бросил трубку.',
      source: 'telegram',
      emotion: 'гнев',
      isComplaint: true,
      category: 'качество обслуживания',
      priority: 'высокий',
      summary: 'Клиент сообщает о грубости оператора на линии',
      userId: user.id,
    },
    {
      text: 'Вчера подключил новую услугу, но она до сих пор не активна. Прошло уже 24 часа. Когда включат?',
      source: 'web',
      emotion: 'разочарование',
      isComplaint: true,
      category: 'техническая проблема',
      priority: 'средний',
      summary: 'Клиент ожидает подключения услуги более 24 часов',
      userId: user.id,
    },
    {
      text: 'Всё отлично! Спасибо за быструю помощь, очень выручили!',
      source: 'telegram',
      emotion: 'радость',
      isComplaint: false,
      category: 'другое',
      priority: 'низкий',
      summary: 'Благодарность за оказанную помощь',
      userId: user.id,
    },
  ];

  for (const msg of sampleMessages) {
    await prisma.message.create({ data: msg });
  }

  console.log('Sample messages created:', sampleMessages.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
