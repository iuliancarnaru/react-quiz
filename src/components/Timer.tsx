/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from "react";

import { useQuiz } from "../contexts/QuizContext";

function Timer() {
  const { secondsRemaining, handleTick } = useQuiz();
  const minutes = `${Math.floor(secondsRemaining! / 60)}`.padStart(2, "0");
  const seconds = `${secondsRemaining! % 60}`.padStart(2, "0");

  // performance issue, re-render every second
  useEffect(() => {
    const interval = setInterval(() => {
      handleTick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [handleTick]);

  return (
    <div className="timer">
      {minutes}:{seconds}
    </div>
  );
}

export default Timer;
