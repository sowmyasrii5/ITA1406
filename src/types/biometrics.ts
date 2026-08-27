export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type AuthStatus = 'VERIFIED' | 'SUSPICIOUS' | 'BLOCKED';
export type ActiveTab = 
  | 'landing'
  | 'dashboard'
  | 'capture'
  | 'ai_engine'
  | 'pattern_recognition'
  | 'anomaly_detection'
  | 'continuous_verification'
  | 'security_alerts'
  | 'fraud_detection'
  | 'auth_history'
  | 'settings';

export interface KeystrokeEvent {
  key: string;
  code: string;
  keyDownTime: number;
  keyUpTime: number;
  holdDuration: number; // ms
  flightTime: number;  // ms between previous keyUp and current keyDown
}

export interface KeystrokeMetrics {
  wpm: number;
  avgHoldTime: number;       // ms
  avgFlightTime: number;     // ms
  consistencyScore: number;  // 0-100%
  totalKeystrokes: number;
  holdTimeVariance: number;
}

export interface MouseEventData {
  x: number;
  y: number;
  timestamp: number;
  type: 'move' | 'click' | 'drag';
}

export interface MouseMetrics {
  avgSpeed: number;          // px/sec
  maxSpeed: number;          // px/sec
  avgAcceleration: number;   // px/sec^2
  clickCount: number;
  avgClickInterval: number;  // ms
  movementConsistency: number; // 0-100%
  behaviourScore: number;    // 0-100
  totalDistance: number;     // px
}

export interface ScrollMetrics {
  scrollSpeed: number;       // px/sec
  eventCount: number;
  directionChanges: number;
  avgInterval: number;       // ms
}

export interface BiometricFeatureVector {
  wpm: number;
  avgHoldTime: number;
  avgFlightTime: number;
  typingConsistency: number;
  mouseSpeed: number;
  mouseAcceleration: number;
  clickInterval: number;
  mouseConsistency: number;
  scrollSpeed: number;
  scrollFrequency: number;
  interactionFrequency: number;
}

export interface UserBiometricProfile {
  profileId: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  baselineConfidence: number; // e.g. 94%
  baselineVector: BiometricFeatureVector;
  sampleCount: number;
}

export interface ParameterScores {
  keystrokeMatch: number;      // 0-100%
  mouseMatch: number;          // 0-100%
  scrollMatch: number;         // 0-100%
  overallSimilarity: number;  // 0-100%
  anomalyScore: number;       // 0-100%
  confidenceScore: number;    // 0-100%
}

export interface AuthenticationResult {
  timestamp: string;
  userId: string;
  userName: string;
  confidenceScore: number;
  status: AuthStatus;
  riskLevel: RiskLevel;
  parameterScores: ParameterScores;
  detectedIssues: string[];
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  riskLevel: RiskLevel;
  similarityScore: number;
  anomalyScore: number;
  message: string;
  detectedIssue: string;
  recommendedAction: string;
  resolved: boolean;
}

export interface AuthHistoryRecord {
  id: string;
  time: string;
  userId: string;
  userName: string;
  behaviourScore: number;
  riskLevel: RiskLevel;
  status: AuthStatus;
  anomalyScore: number;
}

export interface FraudIndicators {
  suddenTypingShift: boolean;
  abnormalMouseTrajectory: boolean;
  automatedClickBurst: boolean;
  unusualNavigationSpeed: boolean;
  highAnomalyScore: boolean;
  multipleFailedChecks: boolean;
  overallFraudScore: number; // 0-100%
  riskLevel: RiskLevel;
}
