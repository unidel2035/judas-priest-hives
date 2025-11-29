# K_DA.js API Анализ - HTTP Запросы и Endpoints

## Обзор анализа

Анализ выполнен с помощью запуска `k_da.js` через прокси `mitmproxy` с debug логированием. Выявлены основные API endpoints и сервисы, к которым обращается приложение.

## Основные API Endpoints

### 1. Koda API Services
- **Telemetry Endpoint**: `https://telemetry.kodacode.ru/log`
  - Используется для отправки телеметрии и логов
  - Ошибки подключения обрабатываются и переотправляются в очередь

- **Models API**: `https://api.kodacode.ru/v1/models`
  - Запрос информации о доступных моделях
  - Получение контекстных длин моделей

### 2. Gemini API Integration
- **Error Reports**: `/tmp/gemini-client-error-*.json`
  - Локальные файлы ошибок при работе с Gemini API
  - Полные отчеты об ошибках сохраняются во временные файлы

### 3. Proxy Configuration
- **HTTP/HTTPS Proxy**: `http://127.0.0.1:8080`
  - Приложение корректно использует прокси через `https-proxy-agent`
  - Поддерживает как environment переменные, так и встроенный `--proxy` флаг

## Типы HTTP Запросов

### 1. Telemetry Requests
```http
POST https://telemetry.kodacode.ru/log
Content-Type: application/json
```
- Отправка логов и аналитики
- Обработка ошибок с повторной отправкой

### 2. API Model Requests  
```http
GET https://api.kodacode.ru/v1/models
```
- Получение списка доступных моделей
- Получение контекстных ограничений

### 3. AI Service Requests
- **KodaClient**: Основные запросы к AI моделям
- **Gemini API**: Запросы к Google Gemini (через провайдера)
- **Polza AI**: Агрегатор для OpenAI, Anthropic, Google моделей

## Debug Логи Analysis

### Структура логов:
```
[KodaClient] [prompt {uuid}] request started (model: KodaAgent) at {timestamp}
[KodaClient] [prompt {uuid}] first event content/error after {latency}ms at {timestamp}
[KodaClient] [prompt {uuid}] request completed in {duration}ms; first event latency: {latency}ms
```

### Обработка ошибок:
- Ошибки подключения фиксируются и переотправляются в очередь
- Полные отчеты об ошибках сохраняются в `/tmp/gemini-client-error-*.json`
- Логирование в формате JSON для структурированного анализа

## Proxy Support

### Environment Variables
```bash
export http_proxy=http://127.0.0.1:8080
export https_proxy=http://127.0.0.1:8080
export HTTP_PROXY=http://127.0.0.1:8080
export HTTPS_PROXY=http://127.0.0.1:8080
```

### CLI Arguments
```bash
k_da.js --proxy http://127.0.0.1:8080
```

### Debug Logging
```bash
DEBUG=* k_da.js --debug
```

## Сетевое взаимодействие

### Подключения
- Прокси подключения создаются через `https-proxy-agent`
- Использует асинхронные HTTP клиенты
- Поддержка HTTPS через прокси

### Ошибки подключения
```
Error: Unable to connect. Is the computer able to access the url?
code: 'ConnectionRefused'
path: '{url}'
errno: 0
```

## Рекомендации для мониторинга

### 1. Установка mitmproxy
```bash
# Запустить mitmproxy в headless режиме
mitmdump --listen-port 8080 --set console_eventlog_verbosity=error > /dev/null 2>&1 &

# Или с веб-интерфейсом
mitmweb --listen-port 8080 --web-port 8081 --web-host 0.0.0.0 > /dev/null 2>&1 &
```

### 2. Настройка прокси
```bash
export HTTP_PROXY=http://127.0.0.1:8080
export HTTPS_PROXY=http://127.0.0.1:8080
```

### 3. Запуск с мониторингом
```bash
DEBUG=* k_da.js --proxy http://127.0.0.1:8080 --debug -p "Your prompt here"
```

### 4. Анализ трафика
- Открыть веб-интерфейс mitmweb: http://127.0.0.1:8081
- Фильтровать по доменам: `kodacode.ru`, `polza.ai`, `github.com`
- Экспорт HTTP запросов в различных форматах

## Заключение

K_DA.js является комплексным CLI инструментом, который:
- Интегрируется с множественными AI провайдерами
- Использует телеметрию для аналитики
- Поддерживает прокси на уровне приложения
- Имеет развитую систему обработки ошибок
- Логирует все HTTP взаимодействия в debug режиме

Приложение готово для production использования с возможностью детального мониторинга всех сетевых взаимодействий через прокси.