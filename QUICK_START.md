# Швидкий старт для публікації

## Що потрібно зробити:

### 1. Оновити інформацію в package.json

```bash
cd extension
```

Відредагуй `package.json`:
- Рядок 6: `"publisher": "твій-publisher-id"`
- Рядок 7-9: `"author": { "name": "Твоє Ім'я" }`
- Рядок 13: `"url": "https://github.com/твій-username/css-responsive-pk"`
- Рядок 16: `"url": "https://github.com/твій-username/css-responsive-pk/issues"`

### 2. Оновити LICENSE

Відредагуй `extension/LICENSE`:
- Рядок 3: Замість `[Your Name]` напиши своє ім'я

### 3. Створити іконку (опціонально)

Створи `extension/icon.png` (128x128 px) або видали рядок 11 з package.json:
```json
"icon": "icon.png",  // <-- цей рядок
```

### 4. Встановити vsce

```bash
npm install -g @vscode/vsce
```

### 5. Створити Publisher

1. Перейди: https://marketplace.visualstudio.com/manage
2. Створи publisher з унікальним ID

### 6. Отримати Token

1. Перейди: https://dev.azure.com
2. User Settings → Personal Access Tokens
3. New Token → Marketplace: Manage
4. Скопіюй token

### 7. Опублікувати

```bash
cd extension
vsce login твій-publisher-id
# (введи token)
vsce publish
```

Готово! 🎉

---

Детальну інструкцію дивись в `extension/PUBLISHING.md`

