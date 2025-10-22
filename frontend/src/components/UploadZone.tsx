import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void | Promise<void>;
  disabled?: boolean;
  actionLabel?: string;
  description?: string;
  hint?: string;
}

const acceptedMime = ['application/pdf', 'image/png', 'image/jpeg'];

const UploadZone = ({
  onFileSelect,
  disabled = false,
  actionLabel = 'Завантажити файл',
  description = 'Перетягніть сюди або натисніть, щоб обрати PDF, JPG чи PNG. До 10 МБ.',
  hint = 'Файли залишаються у межах Telegram-сесії та видаляються після завершення.'
}: UploadZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const [file] = Array.from(files);
      await onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      if (disabled) return;
      setIsDragActive(false);
      await handleFiles(event.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  return (
    <motion.label
      htmlFor="file-upload"
      className={`relative flex cursor-pointer flex-col items-center gap-4 rounded-3xl border-2 border-dashed bg-white/80 p-10 text-center shadow-lg transition-all ${
        isDragActive ? 'border-brand-dark bg-brand-light/50' : 'border-slate-200'
      } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (disabled) return;
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={onDrop}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand-dark shadow-inner"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FileText className="h-8 w-8" />
      </motion.div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold text-slate-900">{actionLabel}</p>
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      </div>
      <span className="rounded-full bg-brand/10 px-4 py-1 text-xs font-medium text-brand-dark">
        {hint}
      </span>
      <input
        id="file-upload"
        ref={inputRef}
        type="file"
        accept={acceptedMime.join(',')}
        className="hidden"
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
      />
    </motion.label>
  );
};

export default UploadZone;
