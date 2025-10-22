import { motion } from 'framer-motion';
import { BadgeCheck, Clock, CreditCard, Languages } from 'lucide-react';

interface ResultCardProps {
  documentType: string;
  language: string;
  price: number;
  time: string;
  onPay: () => void;
}

// Displays the AI analysis details and demo payment CTA.
const ResultCard = ({ documentType, language, price, time, onPay }: ResultCardProps) => {
  return (
    <motion.div
      className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-glass backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Analysis ready</p>
            <h2 className="text-xl font-semibold text-slate-900">{documentType}</h2>
          </div>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
          MK:translations
        </span>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-brand-dark" />
          <span className="font-medium">Detected language:</span>
          <span>{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brand-dark" />
          <span className="font-medium">Estimated price:</span>
          <span>{price} UAH</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-dark" />
          <span className="font-medium">Turnaround:</span>
          <span>{time}</span>
        </div>
      </div>

      <motion.button
        className="mt-6 w-full rounded-2xl bg-brand text-white py-3 text-sm font-semibold shadow-lg shadow-brand/40 transition hover:bg-brand-dark"
        onClick={onPay}
        whileTap={{ scale: 0.98 }}
      >
        Pay Now (demo)
      </motion.button>
    </motion.div>
  );
};

export default ResultCard;
