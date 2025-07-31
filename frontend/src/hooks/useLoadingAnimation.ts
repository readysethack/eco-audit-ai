import { useState } from 'react';

interface LoadingStep {
  text: string;
  duration: number;
}

interface UseLoadingAnimationProps {
  onComplete?: () => void;
}

export function useLoadingAnimation({ onComplete }: UseLoadingAnimationProps = {}) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Analyzing Your Data...");

  const simulateLoading = () => {
    const loadingSteps: LoadingStep[] = [
      { text: "Cross-referencing regional energy grids...", duration: 2000 },
      { text: "Evaluating local supply chain emissions...", duration: 2000 },
      { text: "Compiling your personalized sustainability report...", duration: 2000 },
    ];

    let currentStepIndex = 0;
    setLoadingProgress(0);

    const runStep = () => {
      if (currentStepIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStepIndex].text);

        const stepDuration = loadingSteps[currentStepIndex].duration;
        const progressIncrement = 100 / loadingSteps.length;
        const startProgress = currentStepIndex * progressIncrement;

        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 50;
          const stepProgress = Math.min(elapsed / stepDuration, 1);
          setLoadingProgress(startProgress + stepProgress * progressIncrement);

          if (elapsed >= stepDuration) {
            clearInterval(interval);
            currentStepIndex++;
            runStep();
          }
        }, 50);
      } else if (onComplete) {
        // All steps completed
        onComplete();
      }
    };

    runStep();
  };

  return {
    loadingProgress,
    loadingText,
    simulateLoading,
  };
}
