import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Languages,
  ShieldCheck,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import UploadZone from './components/UploadZone';
import Loader from './components/Loader';
import { bootstrapTelegram } from './utils/telegram';

type Step = 'hero' | 'upload' | 'analyzing' | 'analysis' | 'pricing' | 'confirmation';

const heroGradient = {
  background: 'linear-gradient(135deg, rgba(76,154,255,0.25) 0%, rgba(255,255,255,0.92) 100%)'
};

const visualSteps: Array<{ id: Exclude<Step, 'analyzing'>; label: string }> = [
  { id: 'hero', label: 'Початок' },
  { id: 'upload', label: 'Завантаження' },
  { id: 'analysis', label: 'Результати' },
  { id: 'pricing', label: 'Оплата' },
  { id: 'confirmation', label: 'Готово' }
];

const languageOptions = [
  { value: 'Англійська', basePrice: 450, baseDays: 2 },
  { value: 'Німецька', basePrice: 520, baseDays: 3 },
  { value: 'Польська', basePrice: 430, baseDays: 2 },
  { value: 'Іспанська', basePrice: 480, baseDays: 2 }
];

const formatDays = (days: number) => {
  if (days === 1) return '1 робочий день';
  if (days >= 5) return `${days} робочих днів`;
  return `${days} робочі дні`;
};

const getStepIndex = (step: Step) => {
  if (step === 'analyzing') {
    return visualSteps.findIndex((item) => item.id === 'upload');
  }
  return visualSteps.findIndex((item) => item.id === step);
};

function App() {
  const [step, setStep] = useState<Step>('hero');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0].value);
  const [needsNotary, setNeedsNotary] = useState(false);
  const [needsStamp, setNeedsStamp] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    bootstrapTelegram();
  }, []);

  useEffect(() => {
    if (step !== 'analyzing') return;

    const timeout = setTimeout(() => {
      setStep('analysis');
    }, 2200);

    return () => clearTimeout(timeout);
  }, [step]);

  const currentLanguageConfig = useMemo(
    () => languageOptions.find((option) => option.value === selectedLanguage) ?? languageOptions[0],
    [selectedLanguage]
  );

  const calculatedPrice = useMemo(() => {
    let price = currentLanguageConfig.basePrice;
    if (needsNotary) price += 250;
    if (needsStamp) price += 150;
    return price;
  }, [currentLanguageConfig.basePrice, needsNotary, needsStamp]);

  const turnaroundLabel = useMemo(() => {
    const additionalDays = (needsNotary ? 1 : 0) + (needsStamp ? 1 : 0);
    const totalDays = currentLanguageConfig.baseDays + additionalDays;
    return formatDays(totalDays);
  }, [currentLanguageConfig.baseDays, needsNotary, needsStamp]);

  const handleFileSelect = (file: File) => {
    setUploadedFileName(file.name);
    setStep('analyzing');
  };

  const handleReset = () => {
    setUploadedFileName(null);
    setNeedsNotary(false);
    setNeedsStamp(false);
    setSelectedLanguage(languageOptions[0].value);
    setIsPaymentProcessing(false);
    setStep('hero');
  };

  const handlePayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setStep('confirmation');
    }, 2000);
  };

  const progressIndex = getStepIndex(step);
  const totalSteps = visualSteps.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-light via-white to-slate-100" />

      <div className="absolute left-[-200px] top-[-200px] h-[400px] w-[400px] rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute right-[-150px] bottom-[-150px] h-[320px] w-[320px] rounded-full bg-brand/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
        <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/80 p-5 shadow-glass backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-dark/70">MK:translations</p>
              <p className="text-sm font-medium text-slate-700">AI-помічник Telegram</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {visualSteps.map((visualStep, index) => {
              const completed = index < progressIndex;
              const active = index === progressIndex;

              return (
                <div key={visualStep.id} className="flex items-center gap-2">
                  <motion.span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                      completed
                        ? 'border-brand bg-brand text-white'
                        : active
                          ? 'border-brand bg-white text-brand'
                          : 'border-slate-200 bg-white text-slate-400'
                    }`}
                    animate={{ scale: active ? 1.08 : 1 }}
                  >
                    {index + 1}
                  </motion.span>
                  {index < totalSteps - 1 && (
                    <span className={`h-px w-8 ${completed ? 'bg-brand' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'hero' && (
            <motion.section
              key="hero"
              className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                style={heroGradient}
                className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-glass backdrop-blur"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1 text-sm font-medium text-brand-dark">
                  <UploadCloud className="h-4 w-4" />
                  Почнемо переклад за 2 хвилини
                </span>
                <h1 className="mt-6 text-3xl font-semibold text-slate-900">
                  Вітаємо! Я ваш AI-помічник із перекладу документів.
                </h1>
                <p className="mt-4 text-base text-slate-600">
                  Завантажте документ та отримайте попередній розрахунок вартості й термінів перекладу
                  без очікування менеджера. Працює одразу в Telegram.
                </p>
                <motion.button
                  className="mt-8 w-full rounded-2xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand/40 transition hover:bg-brand-dark"
                  onClick={() => setStep('upload')}
                  whileTap={{ scale: 0.98 }}
                >
                  Завантажити документ
                </motion.button>
                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white/70 p-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand" />
                    <div>
                      <p className="font-semibold text-slate-800">Безпечний Telegram-досвід</p>
                      <p>Файли не залишають сесію Telegram та видаляються після завершення.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-brand" />
                    <div>
                      <p className="font-semibold text-slate-800">Готовна команда перекладачів</p>
                      <p>Після підтвердження оплати ми передамо замовлення у роботу.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-glass backdrop-blur">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Як це працює</p>
                  <ul className="mt-4 space-y-4 text-sm text-slate-600">
                    <li>
                      <span className="font-medium text-slate-900">1. Завантажте документ.</span> PDF, JPG або PNG
                      до 10 МБ.
                    </li>
                    <li>
                      <span className="font-medium text-slate-900">2. AI проаналізує вміст.</span> Визначимо тип,
                      мову та обсяг.
                    </li>
                    <li>
                      <span className="font-medium text-slate-900">3. Отримайте розрахунок.</span> Додайте
                      опції — нотаріуса чи печатку.
                    </li>
                    <li>
                      <span className="font-medium text-slate-900">4. Сплатіть у Telegram.</span> Після оплати
                      підтверджуємо замовлення.
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-brand/10 p-4 text-sm text-brand-dark">
                  <p className="font-semibold text-brand">Новинка</p>
                  <p>У демо прототипі ви побачите увесь шлях: від завантаження до підтвердження оплати.</p>
                </div>
              </div>
            </motion.section>
          )}

          {step === 'upload' && (
            <motion.section
              key="upload"
              className="flex flex-col gap-6 md:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-full rounded-3xl border border-white/70 bg-white/90 p-8 shadow-glass backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-brand-dark/70">
                  Крок 2 — Завантаження
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Додайте документ для аналізу</h2>
                <p className="mt-3 text-sm text-slate-600">
                  Система підтримує скани у форматах PDF, JPG та PNG. Для демо достатньо обрати будь-який файл.
                </p>
                <div className="mt-6">
                  <UploadZone onFileSelect={handleFileSelect} />
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
                  onClick={() => setStep('hero')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </button>
              </div>
              <motion.div
                className="flex w-full flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 text-sm text-slate-600 shadow-glass backdrop-blur md:max-w-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="font-semibold text-slate-800">Поради для кращого розпізнавання:</p>
                <ul className="space-y-3">
                  <li>• Використовуйте чіткі скани без відблисків.</li>
                  <li>• Якщо документ двосторонній, додайте обидві сторони в один файл.</li>
                  <li>• Для прискорення перекладу зазначте, чи потрібні печатки та засвідчення.</li>
                </ul>
              </motion.div>
            </motion.section>
          )}

          {step === 'analyzing' && (
            <motion.section
              key="analyzing"
              className="rounded-3xl border border-white/70 bg-white/90 p-10 text-center shadow-glass backdrop-blur"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Loader text="Аналізуємо документ..." />
              <p className="mt-4 text-sm text-slate-500">
                AI визначає структуру, мову та рахує сторінки. Це займає до 5 секунд.
              </p>
              {uploadedFileName && (
                <p className="mt-2 text-xs text-slate-400">Файл: {uploadedFileName}</p>
              )}
            </motion.section>
          )}

          {step === 'analysis' && (
            <motion.section
              key="analysis"
              className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-glass backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-brand-dark/70">
                  Крок 3 — Результати аналізу
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Попередні дані документа</h2>

                <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50/80 p-5 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">Тип документа</span>
                    <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-brand-dark shadow-sm">
                      Свідоцтво про шлюб
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Мова оригіналу</span>
                    <span className="font-medium text-slate-900">Українська</span>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span>Мова перекладу</span>
                    <select
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      value={selectedLanguage}
                      onChange={(event) => setSelectedLanguage(event.target.value)}
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      checked={needsNotary}
                      onChange={(event) => setNeedsNotary(event.target.checked)}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">Нотаріальне засвідчення</p>
                      <p>Додає офіційний підпис нотаріуса. +250 ₴ та +1 робочий день.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      checked={needsStamp}
                      onChange={(event) => setNeedsStamp(event.target.checked)}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">Печатка бюро перекладів</p>
                      <p>Підтверджує переклад офіційною печаткою. +150 ₴ та +1 робочий день.</p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand/10 p-4 text-sm text-brand-dark">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span>Обрана мова перекладу:</span>
                  </div>
                  <span className="font-semibold">{selectedLanguage}</span>
                </div>

                <div className="mt-8 flex flex-col gap-3 md:flex-row">
                  <motion.button
                    className="w-full rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark md:w-auto"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('pricing')}
                  >
                    Розрахувати вартість
                  </motion.button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-6 py-3 text-sm font-medium text-slate-600 transition hover:text-slate-800"
                    onClick={handleReset}
                  >
                    Почати заново
                  </button>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-6 text-sm text-slate-600 shadow-glass backdrop-blur"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                  Виявлені елементи документа
                </p>
                <ul className="space-y-3">
                  <li>• 2 сторінки, кольоровий скан з чітким текстом</li>
                  <li>• Наявні підписи та печаті, що потребують перекладу</li>
                  <li>• Формат відповідає вимогам для подачі в консульство</li>
                </ul>
                <div className="rounded-2xl bg-brand/10 p-4 text-sm text-brand-dark">
                  Зміна мови або опцій автоматично оновить ціну та терміни на наступному кроці.
                </div>
              </motion.div>
            </motion.section>
          )}

          {step === 'pricing' && (
            <motion.section
              key="pricing"
              className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-glass backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-brand-dark/70">
                  Крок 4 — Вартість і оплата
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Перевірте розрахунок перед оплатою</h2>

                <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-slate-50/80 p-5 text-slate-700">
                  <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                    <span>💰 Вартість</span>
                    <span>{calculatedPrice} ₴</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>⏱ Орієнтовний термін</span>
                    <span className="font-medium text-slate-900">{turnaroundLabel}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Остаточний розрахунок менеджер підтвердить у робочий час. Для демо усі значення
                    генеруються автоматично.
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                    <span>Мова перекладу</span>
                    <span className="font-medium text-slate-900">{selectedLanguage}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                    <span>Нотаріальне засвідчення</span>
                    <span className="font-medium text-slate-900">{needsNotary ? 'Так' : 'Ні'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                    <span>Печатка бюро</span>
                    <span className="font-medium text-slate-900">{needsStamp ? 'Так' : 'Ні'}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 md:flex-row">
                  <motion.button
                    className="w-full rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark md:w-auto"
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={isPaymentProcessing}
                  >
                    {isPaymentProcessing ? 'Обробка платежу...' : 'Оплатити зараз'}
                  </motion.button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-6 py-3 text-sm font-medium text-slate-600 transition hover:text-slate-800"
                    onClick={() => setStep('analysis')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    До попереднього кроку
                  </button>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-glass backdrop-blur"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Оплата всередині Telegram</p>
                    <p className="text-xs text-slate-500">
                      Підтримує картки Visa/Mastercard, Apple Pay, Google Pay.
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>• Після оплати надішлемо підтвердження в чат.</li>
                  <li>• Менеджер уточнить деталі перекладу за потреби.</li>
                  <li>• Ви зможете відстежувати статус замовлення в боті.</li>
                </ul>
                <div className="rounded-2xl bg-brand/10 p-4 text-sm text-brand-dark">
                  Це демо: кнопка оплати симулює процес і переводить вас до фінального екрану.
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'confirmation' && (
            <motion.section
              key="confirmation"
              className="rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-glass backdrop-blur"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-900">Оплату підтверджено!</h2>
              <p className="mt-3 text-sm text-slate-600">
                Замовлення передано перекладачам MK:translations. Протягом найближчого часу надішлемо
                оновлення у Telegram-чат.
              </p>
              <div className="mt-6 rounded-2xl bg-slate-50/80 p-5 text-sm text-slate-700">
                <p className="font-semibold text-slate-800">Що далі:</p>
                <ul className="mt-3 space-y-2 text-left">
                  <li>• Менеджер перевірить дані та підтвердить термін {turnaroundLabel.toLowerCase()}.</li>
                  <li>• Отримаєте готовий переклад і скан із печатками (за потреби).</li>
                  <li>• У боті можна буде замовити додаткові копії чи апостиль.</li>
                </ul>
              </div>
              <motion.button
                className="mt-8 rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
              >
                Створити новий запит
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
