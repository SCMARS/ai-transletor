# MK:translations AI Assistant

Prototype Telegram AI translation assistant that combines a FastAPI backend, aiogram bot, and a Telegram WebApp built with React, TailwindCSS, shadcn-inspired components, and Framer Motion.

## Features
- Telegram bot with `/start` command and “Open Web App” button.
- Modern responsive WebApp with animated file upload and quote card.
- FastAPI backend that handles file uploads, runs OCR + language detection, and maps pricing from `pricing.json`.
- Dummy payment flow: clicking **Pay Now (demo)** closes the WebApp and notifies the bot.

## Project Structure
```
project/
├── backend/
│   ├── bot.py
│   ├── main.py
│   ├── ocr.py
│   ├── pricing.json
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/
│       │   ├── Loader.tsx
│       │   ├── ResultCard.tsx
│       │   └── UploadZone.tsx
│       ├── styles/
│       │   └── globals.css
│       └── utils/
│           ├── api.ts
│           └── telegram.ts
└── README.md
```

## Getting Started

### Requirements
- Node.js ≥ 18 and pnpm/npm.
- Python ≥ 3.10.
- Tesseract OCR binary installed locally (optional on Render if using Google Vision).

### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL` to your backend URL for local testing (defaults to `http://localhost:8000`).

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Environment variables (prefix `MK_`):
- `MK_FRONTEND_ORIGIN` – e.g. `http://localhost:5173`.
- `MK_PRODUCTION_ORIGIN` – e.g. `https://mk-translations-webapp.vercel.app`.

### Telegram Bot (aiogram)
```bash
TELEGRAM_BOT_TOKEN=<your_bot_token> \
WEBAPP_URL=https://<frontend-host> \
BACKEND_URL=https://<backend-host> \
./run.sh
```
The bot listens for `/start`, sends the WebApp button, and acknowledges demo payments sent via `window.Telegram.WebApp.sendData`.

## Deployment Notes
- **Frontend:** Deploy to Vercel. Set `VITE_API_URL` to your Render backend URL.
- **Backend:** Deploy to Render with `uvicorn main:app --host 0.0.0.0 --port 8000`. Add Tesseract buildpack or swap `_extract_image_text` with Google Vision in `ocr.py`.
- **Bot:** Host on Render/Heroku, ensure `WEBAPP_URL` points to Vercel deployment and `BACKEND_URL` to the FastAPI deployment.

## API
`POST /api/upload`
- Form-data field: `file` (PDF/JPG/PNG).
- Response:
  ```json
  {
    "document_type": "Marriage Certificate",
    "language": "Ukrainian",
    "price": 350,
    "time": "1 day"
  }
  ```

`GET /health` – simple readiness check for uptime monitoring.

## Testing Ideas
- Upload sample PDFs and images in Ukrainian/Russian to validate keyword detection.
- Adjust `pricing.json` to add new documents and verify detection mapping in `ocr.py`.
- Use Telegram's `tg://resolve` deep link to test the WebApp on mobile.
# ai-transletor
