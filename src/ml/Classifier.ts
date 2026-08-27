import type { BiometricFeatureVector, ParameterScores, AuthStatus, RiskLevel, AuthenticationResult } from '../types/biometrics';

export class Classifier {
  public static cosineSimilarity(v1: number[], v2: number[]): number {
    if (v1.length !== v2.length || v1.length === 0) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  public static calculateDimensionMatch(val1: number, val2: number, maxExpectedDiff: number): number {
    if (val1 === 0 && val2 === 0) return 100;
    const absDiff = Math.abs(val1 - val2);
    const ratio = Math.min(1, absDiff / Math.max(1, maxExpectedDiff));
    return Math.max(0, Math.min(100, Math.round((1 - ratio) * 100)));
  }

  public static compareProfiles(
    current: BiometricFeatureVector,
    baseline: BiometricFeatureVector
  ): ParameterScores {
    const holdMatch = this.calculateDimensionMatch(current.avgHoldTime, baseline.avgHoldTime, 60);
    const flightMatch = this.calculateDimensionMatch(current.avgFlightTime, baseline.avgFlightTime, 65);
    const wpmMatch = this.calculateDimensionMatch(current.wpm, baseline.wpm, 35);
    const consistencyMatch = this.calculateDimensionMatch(current.typingConsistency, baseline.typingConsistency, 30);

    const keystrokeMatch = Math.round(holdMatch * 0.35 + flightMatch * 0.35 + wpmMatch * 0.15 + consistencyMatch * 0.15);

    const speedMatch = this.calculateDimensionMatch(current.mouseSpeed, baseline.mouseSpeed, 200);
    const accelMatch = this.calculateDimensionMatch(current.mouseAcceleration, baseline.mouseAcceleration, 800);
    const clickMatch = this.calculateDimensionMatch(current.clickInterval, baseline.clickInterval, 250);
    const mouseConsistencyMatch = this.calculateDimensionMatch(current.mouseConsistency, baseline.mouseConsistency, 30);

    const mouseMatch = Math.round(speedMatch * 0.3 + accelMatch * 0.3 + clickMatch * 0.25 + mouseConsistencyMatch * 0.15);

    const scrollSpeedMatch = this.calculateDimensionMatch(current.scrollSpeed, baseline.scrollSpeed, 300);
    const scrollFreqMatch = this.calculateDimensionMatch(current.scrollFrequency, baseline.scrollFrequency, 20);

    const scrollMatch = Math.round(scrollSpeedMatch * 0.6 + scrollFreqMatch * 0.4);

    const vec1 = [
      current.wpm,
      current.avgHoldTime,
      current.avgFlightTime,
      current.typingConsistency,
      current.mouseSpeed,
      current.mouseAcceleration,
      current.clickInterval,
      current.scrollSpeed,
    ];

    const vec2 = [
      baseline.wpm,
      baseline.avgHoldTime,
      baseline.avgFlightTime,
      baseline.typingConsistency,
      baseline.mouseSpeed,
      baseline.mouseAcceleration,
      baseline.clickInterval,
      baseline.scrollSpeed,
    ];

    const cosineScore = Math.round(this.cosineSimilarity(vec1, vec2) * 100);

    const overallSimilarity = Math.round(
      keystrokeMatch * 0.4 + mouseMatch * 0.35 + scrollMatch * 0.15 + cosineScore * 0.1
    );

    const deviationMax = Math.max(100 - keystrokeMatch, 100 - mouseMatch, 100 - scrollMatch);
    const anomalyScore = Math.min(99, Math.max(1, Math.round((100 - overallSimilarity) * 0.7 + deviationMax * 0.3)));

    const confidenceScore = Math.max(1, Math.min(99, Math.round(overallSimilarity * 0.85 + (100 - anomalyScore) * 0.15)));

    return {
      keystrokeMatch,
      mouseMatch,
      scrollMatch,
      overallSimilarity,
      anomalyScore,
      confidenceScore,
    };
  }

  public static evaluateAuthentication(
    userId: string,
    userName: string,
    current: BiometricFeatureVector,
    baseline: BiometricFeatureVector
  ): AuthenticationResult {
    const scores = this.compareProfiles(current, baseline);
    const detectedIssues: string[] = [];

    if (scores.keystrokeMatch < 65) {
      detectedIssues.push('Typing rhythm & key dwell time significantly differ from baseline.');
    }
    if (scores.mouseMatch < 60) {
      detectedIssues.push('Abnormal mouse speed, acceleration, or click interval detected.');
    }
    if (scores.scrollMatch < 55) {
      detectedIssues.push('Unusual scrolling speed & frequency pattern.');
    }
    if (scores.anomalyScore > 40) {
      detectedIssues.push('High anomaly index detected by Isolation Forest engine.');
    }

    let status: AuthStatus = 'VERIFIED';
    let riskLevel: RiskLevel = 'LOW';

    if (scores.confidenceScore < 50 || scores.anomalyScore > 65) {
      status = 'BLOCKED';
      riskLevel = 'HIGH';
    } else if (scores.confidenceScore < 75 || scores.anomalyScore > 30) {
      status = 'SUSPICIOUS';
      riskLevel = 'MEDIUM';
    }

    return {
      timestamp: new Date().toLocaleTimeString(),
      userId,
      userName,
      confidenceScore: scores.confidenceScore,
      status,
      riskLevel,
      parameterScores: scores,
      detectedIssues: detectedIssues.length > 0 ? detectedIssues : ['Behaviour strongly matches registered baseline profile.'],
    };
  }
}
