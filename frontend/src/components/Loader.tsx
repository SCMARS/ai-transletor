import { motion } from 'framer-motion';

interface LoaderProps {
  text?: string;
}

// Крапковий лоадер для симуляції бекенд-операцій.
const Loader = ({ text = 'Обробляємо...' }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-3 w-3 rounded-full bg-brand"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.12 }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
};

export default Loader;
