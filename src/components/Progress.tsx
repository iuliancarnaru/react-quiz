interface ProgressProps {
  idx: number;
  numQuestions: number;
  points: number;
  maxPossiblePoints: number;
  answer: null | number;
}

function Progress({
  idx,
  numQuestions,
  points,
  maxPossiblePoints,
  answer,
}: ProgressProps) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={idx + Number(answer !== null)} />
      <p>
        Question <strong>{idx + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
