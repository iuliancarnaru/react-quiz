// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class = { new (...args: any[]): any };

declare global {
  interface Window {
    Confetti: Class;
  }
}

export interface QuestionType {
  question: string;
  options?: string[] | null;
  correctOption: number;
  points: number;
}

export enum Status {
  loading = "loading",
  error = "error",
  ready = "ready",
  active = "active",
  finished = "finished",
}

export type StateType = {
  questions: QuestionType[];
  status: Status;
  index: number;
  answer: number | null;
  points: number;
  highScore: number;
  secondsRemaining: number | null;
};

export enum ActionKind {
  DATA_RECEIVED = "DATA_RECEIVED",
  DATA_FAILED = "DATA_FAILED",
  START = "START",
  NEW_ANSWER = "NEW_ANSWER",
  NEXT_QUESTION = "NEXT_QUESTION",
  FINISH = "FINISH",
  RESTART = "RESTART",
  TICK = "TICK",
}

export type ActionType =
  | {
      type: ActionKind.DATA_RECEIVED;
      payload: QuestionType[];
    }
  | {
      type: ActionKind.DATA_FAILED;
      payload: string;
    }
  | {
      type: ActionKind.START;
    }
  | {
      type: ActionKind.NEW_ANSWER;
      payload: number;
    }
  | {
      type: ActionKind.NEXT_QUESTION;
    }
  | {
      type: ActionKind.FINISH;
    }
  | {
      type: ActionKind.RESTART;
    }
  | {
      type: ActionKind.TICK;
    };
