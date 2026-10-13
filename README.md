# Pip's Sky Islands

Обучающая игра для 4 класса (математика, время, календарь, чтение, мир) с лисёнком Пипом.
Сайт хостится бесплатно на **GitHub Pages**. Вход и облачное сохранение работают через **Firebase**
(бесплатный план Spark).

## Как устроено сохранение (почему прогресс не теряется)

1. **Вход только для взрослого** (Google или email + пароль). Дети не вводят email: они выбирают своё имя
   (по желанию с детским PIN-кодом).
2. **Три слоя защиты:**
   - каждое изменение сразу пишется в браузер (localStorage);
   - Firestore держит офлайн-очередь: без интернета игра продолжается, данные уходят в облако, когда сеть вернётся;
   - облачная копия плюс **автобэкап раз в день** (хранится 30 дней), восстановление в один клик в разделе Grown-ups.
3. **Слияние без потерь между устройствами.** Если ребёнок играл на двух устройствах (даже одновременно и без
   интернета), прогресс объединяется, а не перезаписывается:
   - звёзды, опыт и стикеры берутся по максимуму;
   - покупки объединяются;
   - монеты считаются отдельно по каждому устройству (заработано и потрачено), поэтому сумма всегда верная;
   - для настроек и одежды Пипа побеждает последний выбор.

   Данные заменяет только явный **Reset** или **Restore** из бэкапа.
4. Удалённый игрок не «воскресает» со старого офлайн-устройства: это запрещено правилами базы.

## Файлы

| Файл | Что это |
|---|---|
| `index.html` | сама игра |
| `cloud.js` | вход и облако (Firebase JS SDK 12.19.0 с gstatic.com) |
| `firebase-config.js` | **сюда вставить ключи своего Firebase-проекта** |
| `privacy.html` | уведомление о конфиденциальности для родителей (впишите свой email вместо `CONTACT_EMAIL_HERE`) |
| `firestore.rules` | правила безопасности базы: каждый аккаунт видит только свои данные |

Пока в `firebase-config.js` стоят заглушки `PASTE_...`, игра работает без аккаунтов и сохраняет прогресс только в браузере.

---

## Настройка за ~20 минут (всё в браузере, ничего устанавливать не нужно)

### 1. Создать проект Firebase
1. Откройте https://console.firebase.google.com и войдите своим Google-аккаунтом.
2. **Create a project** → имя, например `pip-sky-islands` → Google Analytics можно **выключить** → Create.

### 2. Включить вход
1. Слева **Build → Authentication → Get started**.
2. Вкладка **Sign-in method**:
   - **Google** → Enable → выберите support email → Save;
   - **Email/Password** → Enable (первый переключатель) → Save.

### 3. Создать базу и вставить правила
1. **Build → Firestore Database → Create database**.
2. Регион: ближайший к вам, например `nam5 (United States)` или `us-west1`. Режим **Production mode** → Create.
3. Вкладка **Rules** → удалите всё → вставьте содержимое файла `firestore.rules` из этого репозитория → **Publish**.

### 4. Получить ключи и вставить в игру
1. Шестерёнка рядом с *Project Overview* → **Project settings** → внизу **Your apps** → значок **`</>`** (Web).
2. Имя: `pip-web` → галочку Hosting **не ставить** → Register app.
3. Скопируйте значения из блока `firebaseConfig` (apiKey, authDomain, projectId, …).
4. На GitHub откройте `firebase-config.js` → карандаш (Edit) → замените `PASTE_...` своими значениями → **Commit changes**.
   (Или пришлите эти значения мне, и я сам их вставлю. Они не секретные: данные защищают правила из шага 3.)

### 5. Включить GitHub Pages
1. Репозиторий на GitHub → **Settings → Pages**.
2. *Build and deployment* → Source: **Deploy from a branch** → Branch: **main**, папка **/ (root)** → Save.
3. Через 1–2 минуты сайт будет доступен по адресу `https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПОЗИТОРИЯ/`.

### 6. Разрешить вход с этого адреса
Firebase → **Authentication → Settings → Authorized domains → Add domain**:
- `ВАШ_ЛОГИН.github.io`
- позже и свой домен (шаг 7), например `pipskyislands.com` и `www.pipskyislands.com`.

Без этого шага вход через Google покажет ошибку «This website address is not allowed yet».

### 7. Свой домен (по желанию)
1. Купите домен у регистратора: **Cloudflare Registrar**, **Porkbun** или **Namecheap**.
   Обычный `.com` стоит порядка $10–15 в год; точную цену смотрите у регистратора.
2. GitHub → **Settings → Pages → Custom domain** → впишите домен, например `pipskyislands.com` → Save.
   (Рекомендуется также подтвердить домен: GitHub → ваш профиль → Settings → Pages → *Add a domain*. Это защищает от захвата домена.)
3. У регистратора в настройках DNS создайте записи:

   | Тип | Имя | Значение |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `ВАШ_ЛОГИН.github.io` |

   В Cloudflare у этих записей выключите оранжевое облачко (DNS only), иначе GitHub не выпустит сертификат.
4. Подождите до 24 часов (обычно быстрее), затем в **Settings → Pages** включите **Enforce HTTPS**.
5. Добавьте домен в Firebase **Authorized domains** (шаг 6).

### 8. Последние штрихи
- `privacy.html`: замените `CONTACT_EMAIL_HERE` на email для вопросов родителей.
- Firebase → Authentication → **Templates**: можно указать название отправителя писем (например *Pip's Sky Islands*).
- Перенести старый прогресс из версии на claude.ai: там **Grown-ups → Sync between devices → Copy code**,
  затем на новом сайте **Grown-ups → Move progress with a code → Add from code**.

---

## Проверка после запуска
1. Войдите через Google → отметьте согласие → добавьте игрока → решите пару задач. Значок в шапке должен показать **Saved**.
2. Откройте сайт на другом устройстве (или в другом браузере) → войдите тем же аккаунтом → прогресс на месте.
3. **Grown-ups → Backups**: после первой задачи дня появляется ежедневная копия.

## Лимиты бесплатного плана (Spark)
Firestore: 1 GiB данных, 50 000 чтений, 20 000 записей и 20 000 удалений в сутки. Auth: до 50 000 активных пользователей в месяц.
Игра пишет в облако не чаще раза в 15 секунд на игрока (и при закрытии вкладки), так что для класса из 30 детей
это небольшая доля лимита.

## Дети и приватность (COPPA)
Аккаунт создаёт только взрослый и подтверждает согласие. О детях хранится только имя или ник и игровой прогресс.
Нет рекламы и трекинга. Взрослый может скачать или удалить все данные в разделе Grown-ups.
Это разумная базовая схема, но не юридическая консультация. Если игру будет официально использовать школа,
стоит показать её школьному администратору.

## Project structure

| File | What is inside |
|---|---|
| `index.html` | The page layout (screens, buttons, overlays) |
| `styles.css` | All styles |
| `content/` | Standards, the skill library and the island pack for each state and grade (JSON). See `content/README.md` |
| `js/content.js` | Built from `content/` by `tools/build_content.py`; do not edit by hand |
| `js/core.js` | Helpers, icons, Pip the fox, shared drawings |
| `js/math.js` | Math question generators, "Show me how", clocks, math reasoning and big tasks |
| `js/english.js` | Words, reading passages, long test-style passages, listening |
| `js/islands.js` | History, grammar, writing, Test Practice, Clock Cove, question generators per island (`GEN`), the island list from the pack, seasonal events |
| `js/progress.js` | Saving, profiles, skills, sound, rewards, lessons, Pip's Pick |
| `js/play.js` | Screens and the question player (drag and drop, Part A/B, Yes/No...) |
| `js/app.js` | Closet, album, story, sign-in, Grown-ups, Writing Desk, my island, the house, start-up |
| `sw.js` | Offline support: list every new file in `CORE` and bump the version |
| `tools/build_content.py` | Checks `content/`, builds `js/content.js` and the standards coverage report |
| `tests/` | Automatic checks, run `tests/run_all.sh` before publishing |

The JS files are plain scripts loaded in this order and share one global scope, so a file may only use, while it loads, things defined in files above it.
