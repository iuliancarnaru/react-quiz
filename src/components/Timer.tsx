/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from "react";
import { ActionKind, ActionType } from "../types";

interface TimerProps {
  dispatch: React.Dispatch<ActionType>;
  secondsRemaining: number | null;
}

function Timer({ dispatch, secondsRemaining }: TimerProps) {
  const minutes = `${Math.floor(secondsRemaining! / 60)}`.padStart(2, "0");
  const seconds = `${secondsRemaining! % 60}`.padStart(2, "0");

  // performance issue, re-render every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: ActionKind.TICK,
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  return (
    <div className="timer">
      {minutes}:{seconds}
    </div>
  );
}

export default Timer;
