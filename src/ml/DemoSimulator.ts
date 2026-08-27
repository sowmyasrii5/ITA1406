import type { UserBiometricProfile, BiometricFeatureVector, AuthHistoryRecord, SecurityAlert } from '../types/biometrics';

export class DemoSimulator {
  public static getSampleProfiles(): Record<string, UserBiometricProfile> {
    return {
      'USER-001': {
        profileId: 'USER-BIO-2026-001',
        userId: 'USER-001',
        userName: 'Alex Morgan (Legitimate User)',
        createdAt: '2026-08-20 09:15',
        updatedAt: '2026-08-21 00:01',
        baselineConfidence: 94,
        baselineVector: {
          wpm: 65,
          avgHoldTime: 118,
          avgFlightTime: 95,
          typingConsistency: 92,
          mouseSpeed: 280,
          mouseAcceleration: 1100,
          clickInterval: 420,
          mouseConsistency: 90,
          scrollSpeed: 150,
          scrollFrequency: 12,
          interactionFrequency: 45,
        },
        sampleCount: 1280,
      },
      'USER-002': {
        profileId: 'USER-BIO-2026-002',
        userId: 'USER-002',
        userName: 'Taylor Swift (Suspicious Session)',
        createdAt: '2026-08-19 14:20',
        updatedAt: '2026-08-20 18:30',
        baselineConfidence: 67,
        baselineVector: {
          wpm: 92,
          avgHoldTime: 65,
          avgFlightTime: 40,
          typingConsistency: 60,
          mouseSpeed: 750,
          mouseAcceleration: 3200,
          clickInterval: 180,
          mouseConsistency: 55,
          scrollSpeed: 420,
          scrollFrequency: 28,
          interactionFrequency: 95,
        },
        sampleCount: 420,
      },
      'USER-003': {
        profileId: 'USER-BIO-2026-003',
        userId: 'USER-003',
        userName: 'Unrecognized Attacker (High Risk)',
        createdAt: '2026-08-18 11:05',
        updatedAt: '2026-08-18 11:10',
        baselineConfidence: 31,
        baselineVector: {
          wpm: 140,
          avgHoldTime: 25,
          avgFlightTime: 15,
          typingConsistency: 35,
          mouseSpeed: 1800,
          mouseAcceleration: 7500,
          clickInterval: 50,
          mouseConsistency: 28,
          scrollSpeed: 850,
          scrollFrequency: 55,
          interactionFrequency: 180,
        },
        sampleCount: 85,
      },
    };
  }

  public static getInitialHistory(): AuthHistoryRecord[] {
    return [
      {
        id: 'hist-101',
        time: '10:20 AM',
        userId: 'USER-001',
        userName: 'Alex Morgan',
        behaviourScore: 94,
        riskLevel: 'LOW',
        status: 'VERIFIED',
        anomalyScore: 7,
      },
      {
        id: 'hist-102',
        time: '10:25 AM',
        userId: 'USER-001',
        userName: 'Alex Morgan',
        behaviourScore: 89,
        riskLevel: 'LOW',
        status: 'VERIFIED',
        anomalyScore: 11,
      },
      {
        id: 'hist-103',
        time: '10:31 AM',
        userId: 'USER-002',
        userName: 'Taylor Swift',
        behaviourScore: 62,
        riskLevel: 'MEDIUM',
        status: 'SUSPICIOUS',
        anomalyScore: 42,
      },
      {
        id: 'hist-104',
        time: '10:35 AM',
        userId: 'USER-003',
        userName: 'Unrecognized Attacker',
        behaviourScore: 38,
        riskLevel: 'HIGH',
        status: 'BLOCKED',
        anomalyScore: 87,
      },
    ];
  }

  public static getInitialAlerts(): SecurityAlert[] {
    return [
      {
        id: 'alert-001',
        timestamp: '10:35 AM',
        userId: 'USER-003',
        userName: 'Unrecognized Attacker',
        riskLevel: 'HIGH',
        similarityScore: 38,
        anomalyScore: 87,
        message: 'Potential account takeover attempt detected.',
        detectedIssue: 'Current typing and mouse behaviour significantly differs from the registered behavioural profile.',
        recommendedAction: 'Re-authentication Required immediately. Lock session.',
        resolved: false,
      },
      {
        id: 'alert-002',
        timestamp: '10:31 AM',
        userId: 'USER-002',
        userName: 'Taylor Swift',
        riskLevel: 'MEDIUM',
        similarityScore: 62,
        anomalyScore: 42,
        message: 'Unusual behavioural activity detected.',
        detectedIssue: 'Abnormal keystroke dwell time and elevated mouse acceleration burst.',
        recommendedAction: 'Request Step-up MFA / OTP verification.',
        resolved: false,
      },
      {
        id: 'alert-003',
        timestamp: '10:15 AM',
        userId: 'USER-001',
        userName: 'Alex Morgan',
        riskLevel: 'LOW',
        similarityScore: 91,
        anomalyScore: 9,
        message: 'Minor behavioural variation detected.',
        detectedIssue: 'Slight fluctuation in typing speed during multi-tasking.',
        recommendedAction: 'Continue continuous background monitoring.',
        resolved: true,
      },
    ];
  }

  public static generateSuspiciousVector(baseline: BiometricFeatureVector): BiometricFeatureVector {
    return {
      wpm: Math.round(baseline.wpm * 2.1 + 25),
      avgHoldTime: Math.max(15, Math.round(baseline.avgHoldTime * 0.35)),
      avgFlightTime: Math.max(10, Math.round(baseline.avgFlightTime * 0.25)),
      typingConsistency: 42,
      mouseSpeed: Math.round(baseline.mouseSpeed * 3.8 + 400),
      mouseAcceleration: Math.round(baseline.mouseAcceleration * 4.2 + 2000),
      clickInterval: Math.max(25, Math.round(baseline.clickInterval * 0.2)),
      mouseConsistency: 38,
      scrollSpeed: Math.round(baseline.scrollSpeed * 3.5 + 300),
      scrollFrequency: Math.round(baseline.scrollFrequency * 3 + 15),
      interactionFrequency: 140,
    };
  }
}
