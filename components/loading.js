import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Loading.module.css';

const steps = 4;
const stepLength = 500;

export function LoadingMessage({ message }) {
  const msg = message || 'Loading';
  const [step, setStep] = useState(0);
  const timeoutId = useRef();

  useEffect(() => {
    function runStep(currentStep) {
      return () => {
        setStep(currentStep);

        timeoutId.current = setTimeout(runStep((currentStep + 1) % steps), stepLength);
      };
    }

    timeoutId.current = setTimeout(runStep(step), stepLength);

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return (
    <p className={styles.message}>
      {msg}
      {'...'.slice(0, step)}
    </p>
  );
}

export default function Loading({ modal }) {
  if (modal === undefined) {
    modal = true;
  }

  return (
    <dialog open className={modal ? styles.modal : styles.nonModal}>
      <LoadingMessage />
    </dialog>
  );
}
