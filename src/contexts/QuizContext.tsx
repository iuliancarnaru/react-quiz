import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import {
  ActionKind,
  ActionType,
  QuestionType,
  StateType,
  Status,
} from "../types";

const initialState: StateType = {
  questions: [] as QuestionType[],
  status: Status.loading,
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECONDS_PER_QUESTION = 30;

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case ActionKind.DATA_RECEIVED:
      return { ...state, questions: action.payload, status: Status.ready };
    case ActionKind.DATA_FAILED:
      return { ...state, status: Status.error };
    case ActionKind.START:
      return {
        ...state,
        status: Status.active,
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case ActionKind.NEW_ANSWER:
      // eslint-disable-next-line no-case-declarations
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question?.correctOption
            ? state.points + question.points
            : state.points,
      };
    case ActionKind.NEXT_QUESTION:
      return { ...state, index: state.index + 1, answer: null };
    case ActionKind.FINISH:
      return {
        ...state,
        status: Status.finished,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case ActionKind.RESTART:
      return {
        ...initialState,
        questions: state.questions,
        status: Status.ready,
      };
    case ActionKind.TICK:
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secondsRemaining: state.secondsRemaining! - 1,
        status: state.secondsRemaining === 0 ? Status.finished : Status.active,
      };
    default:
      return state;
  }
}

type QuizContextType = {
  questions: QuestionType[];
  status: Status;
  index: number;
  answer: number | null;
  points: number;
  highScore: number;
  secondsRemaining: number | null;
  numQuestions: number;
  maxPossiblePoints: number;
  handleStart: () => void;
  handleNewAnswer: (idx: number) => void;
  handleTick: () => void;
  handleNextQuestion: () => void;
  handleFinish: () => void;
  handleRestart: () => void;
};

const QuizContext = createContext<QuizContextType>({} as QuizContextType);

function QuizProvider({ children }: { children: React.ReactNode }) {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, val) => acc + val.points, 0);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data: QuestionType[]) =>
        dispatch({
          type: ActionKind.DATA_RECEIVED,
          payload: data,
        })
      )
      .catch((err: Error) =>
        dispatch({
          type: ActionKind.DATA_FAILED,
          payload: err.message,
        })
      );
  }, []);

  function handleStart() {
    dispatch({
      type: ActionKind.START,
    });
  }

  function handleNewAnswer(idx: number) {
    dispatch({
      type: ActionKind.NEW_ANSWER,
      payload: Number(idx),
    });
  }

  const handleTick = useCallback(() => {
    dispatch({
      type: ActionKind.TICK,
    });
  }, []);

  function handleNextQuestion() {
    dispatch({
      type: ActionKind.NEXT_QUESTION,
    });
  }

  function handleFinish() {
    dispatch({
      type: ActionKind.FINISH,
    });
  }

  function handleRestart() {
    dispatch({
      type: ActionKind.RESTART,
    });
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        handleStart,
        handleNewAnswer,
        handleTick,
        handleNextQuestion,
        handleFinish,
        handleRestart,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used inside QuizProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { QuizProvider, useQuiz };
