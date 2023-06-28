import { useEffect, useRef } from "react";
import { useQuiz } from "../contexts/QuizContext";

function FinishedScreen() {
  const { points, maxPossiblePoints, highScore, handleRestart } = useQuiz();

  // Pass in the id of an element
  const resultRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const confetti = new window.Confetti(resultRef?.current?.id);

    // Edit given parameters
    confetti.setCount(75);
    confetti.setSize(1);
    confetti.setPower(25);
    confetti.setFade(false);
    confetti.destroyTarget(true);
  }, []);

  const percentage = (points / maxPossiblePoints) * 100;

  let emoji;

  if (percentage === 100) emoji = "🏅";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "😀";
  if (percentage >= 0 && percentage < 50) emoji = "🤔";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p
        className="result"
        ref={resultRef}
        id="demo"
        style={{ cursor: "pointer" }}
      >
        {emoji} You scored <strong>{points}</strong> out of {maxPossiblePoints}{" "}
        ({percentage.toFixed(2)}%)
      </p>
      <p className="highscore">(High Score: {highScore})</p>
      <button className="btn btn-ui" onClick={handleRestart}>
        Restart
      </button>
    </>
  );
}

export default FinishedScreen;
