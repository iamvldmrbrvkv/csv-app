const fs = require('fs');

const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград'];
const occupations = ['Программист', 'Менеджер проекта', 'Дизайнер', 'Аналитик данных', 'DevOps инженер', 'Маркетолог', 'HR менеджер', 'Frontend разработчик', 'Backend разработчик', 'Тестировщик', 'Системный администратор', 'Архитектор ПО'];
const departments = ['Разработка', 'Продукт', 'Дизайн', 'Аналитика', 'Операции', 'Маркетинг', 'HR', 'Поддержка'];
const firstNames = ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья', 'Кирилл', 'Михаил', 'Анна', 'Мария', 'Елена', 'Ольга', 'Татьяна', 'Наталья', 'Ирина', 'Екатерина', 'Юлия', 'Светлана'];
const lastNames = ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов'];

function generateCSV(rowCount, filename) {
  return new Promise((resolve) => {
    console.log(`\n📝 Генерирую ${filename} с ${rowCount.toLocaleString('ru-RU')} строками...`);
    const startTime = Date.now();
    
    const stream = fs.createWriteStream(filename);
    stream.write('id,имя,email,возраст,город,должность,зарплата,отдел,дата_приема\n');
    
    for (let i = 1; i <= rowCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${transliterate(firstName)}.${transliterate(lastName)}${i}@example.com`;
      const age = 22 + Math.floor(Math.random() * 40);
      const city = cities[Math.floor(Math.random() * cities.length)];
      const occupation = occupations[Math.floor(Math.random() * occupations.length)];
      const salary = 60000 + Math.floor(Math.random() * 190000);
      const department = departments[Math.floor(Math.random() * departments.length)];
      const year = 2017 + Math.floor(Math.random() * 8);
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      const joinDate = `${year}-${month}-${day}`;
      
      stream.write(`${i},${name},${email},${age},${city},${occupation},${salary},${department},${joinDate}\n`);
      
      // Progress indicator
      if (i % 10000 === 0) {
        process.stdout.write(`\r   Прогресс: ${i.toLocaleString('ru-RU')} / ${rowCount.toLocaleString('ru-RU')} строк (${Math.round(i/rowCount*100)}%)`);
      }
    }
    
    stream.end(() => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      const fileSize = fs.statSync(filename).size;
      const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
      
      console.log(`\n✅ Создан ${filename}`);
      console.log(`   Размер: ${fileSizeMB} МБ`);
      console.log(`   Время: ${duration}с\n`);
      resolve();
    });
  });
}

// Транслитерация для email
function transliterate(text) {
  // Сначала удаляем все мягкие и твёрдые знаки, затем приводим к нижнему регистру
  const cleanText = text.replace(/[ьЬъЪ]/g, '').toLowerCase();
  
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return cleanText.split('').map(char => map[char] || char).join('');
}

// Генерируем файлы последовательно
(async () => {
  // Генерируем 100,000 строк (~15 МБ)
  await generateCSV(100000, 'test-data-100k.csv');
  
  // Генерируем 1,000,000 строк (~150 МБ)
  await generateCSV(1000000, 'test-data-1m.csv');
  
  console.log('🎉 Готово!');
})();
