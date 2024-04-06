import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ErrorPopup: React.FC<{ errorMessage?: string }> = ({ errorMessage }) => {
  const [error, setError] = useState<string>();
  useEffect(() => setError(errorMessage), [errorMessage]);
  setInterval(() => {
    setError("");
  }, 5000);
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.span
          initial={{
            y: "-100%",
            x: "-50%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            x: "-50%",
            opacity: 1,
          }}
          exit={{
            y: "-100%",
            x: "-50%",
            opacity: 0,
          }}
          className="fixed left-1/2 top-5 rounded-2xl p-5 bg-red-300 text-white font-bold"
        >
          {error}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export { ErrorPopup };
