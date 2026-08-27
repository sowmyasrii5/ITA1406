import type { BiometricFeatureVector } from '../types/biometrics';

export class IsolationForestDetector {
  private baselineVector: BiometricFeatureVector | null = null;

  constructor(baseline?: BiometricFeatureVector) {
    if (baseline) {
      this.baselineVector = baseline;
    }
  }

  public setBaseline(baseline: BiometricFeatureVector): void {
    this.baselineVector = baseline;
  }

  public computeAnomalyScore(current: BiometricFeatureVector): number {
    if (!this.baselineVector) return 10;

    const b = this.baselineVector;
    
    const deviations = [
      Math.abs(current.wpm - b.wpm) / Math.max(10, b.wpm * 0.25),
      Math.abs(current.avgHoldTime - b.avgHoldTime) / Math.max(15, b.avgHoldTime * 0.3),
      Math.abs(current.avgFlightTime - b.avgFlightTime) / Math.max(15, b.avgFlightTime * 0.3),
      Math.abs(current.typingConsistency - b.typingConsistency) / 20,
      Math.abs(current.mouseSpeed - b.mouseSpeed) / Math.max(50, b.mouseSpeed * 0.35),
      Math.abs(current.mouseAcceleration - b.mouseAcceleration) / Math.max(200, b.mouseAcceleration * 0.4),
      Math.abs(current.clickInterval - b.clickInterval) / Math.max(50, b.clickInterval * 0.35),
      Math.abs(current.scrollSpeed - b.scrollSpeed) / Math.max(50, b.scrollSpeed * 0.4),
    ];

    const maxDev = Math.max(...deviations);
    const avgDev = deviations.reduce((sum, val) => sum + val, 0) / deviations.length;

    const combinedScore = avgDev * 0.6 + maxDev * 0.4;
    const anomalyScore = Math.min(99, Math.max(1, Math.round((1 - Math.pow(2, -combinedScore * 0.8)) * 100)));

    return anomalyScore;
  }

  public detectBotPatterns(current: BiometricFeatureVector): { isBot: boolean; botConfidence: number; reason: string } {
    if (current.avgHoldTime < 20 && current.avgFlightTime < 15) {
      return {
        isBot: true,
        botConfidence: 98,
        reason: 'Automated script detected: Impossible zero-latency keystroke flight times.',
      };
    }

    if (current.mouseSpeed > 3500 && current.mouseConsistency > 98) {
      return {
        isBot: true,
        botConfidence: 95,
        reason: 'Linear mouse macro detected: Perfectly uniform speed without natural human micro-jitter.',
      };
    }

    if (current.clickInterval < 30 && current.clickInterval > 0) {
      return {
        isBot: true,
        botConfidence: 92,
        reason: 'Auto-clicker software detected: Sub-30ms click burst intervals.',
      };
    }

    return {
      isBot: false,
      botConfidence: 5,
      reason: 'Human movement characteristics validated.',
    };
  }
}
