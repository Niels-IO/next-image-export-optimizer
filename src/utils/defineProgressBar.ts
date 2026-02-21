export default function defineProgressBar() {
  let startTime: number;
  let total: number;
  let current: number = 0;
  let sizeOfGeneratedImages: number = 0;
  let lastDisplayedPercentage: number = -2;

  const updateProgress = () => {
    const percentage = Math.floor((current / total) * 100);
    const barLength = 50;
    const filledLength = Math.floor((percentage * barLength) / 100);
    const bar = "=".repeat(filledLength) + "-".repeat(barLength - filledLength);
    const eta = Math.round(
      (((Date.now() - startTime) / current) * (total - current)) / 1000
    );

    // Only update display every 2% or at 100%
    if (percentage % 2 === 0 && percentage !== lastDisplayedPercentage) {
      lastDisplayedPercentage = percentage;
      process.stdout.write(
        `\r${bar} ${percentage}% | ETA: ${eta}s | ${current}/${total} | Total size: ${sizeOfGeneratedImages.toFixed(
          1
        )} MB`
      );
    }
  };

  return {
    start: (totalValue: number, startValue: number, payload: { sizeOfGeneratedImages: number }) => {
      total = totalValue;
      current = startValue;
      startTime = Date.now();
      sizeOfGeneratedImages = payload.sizeOfGeneratedImages;
      updateProgress();
    },
    increment: (payload: { sizeOfGeneratedImages: string }) => {
      current++;
      sizeOfGeneratedImages = parseFloat(payload.sizeOfGeneratedImages);
      updateProgress();
    },
    stop: () => {
      const elapsedTime = startTime === undefined ? 0 : Date.now() - startTime;
      process.stdout.write(
        `\nFinished optimization in: ${msToTime(elapsedTime)}\n`
      );
    },
  };
}

function msToTime(ms: number): string {
  const seconds = (ms / 1000).toFixed(1);
  const minutes = (ms / (1000 * 60)).toFixed(1);
  const hours = (ms / (1000 * 60 * 60)).toFixed(1);
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (parseFloat(seconds) < 60) return seconds + " seconds";
  else if (parseFloat(minutes) < 60) return minutes + " minutes";
  else if (parseFloat(hours) < 24) return hours + " hours";
  else return days + " days";
}
