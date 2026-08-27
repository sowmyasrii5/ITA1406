import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  ActiveTab,
  UserBiometricProfile,
  KeystrokeEvent,
  MouseEventData,
  KeystrokeMetrics,
  MouseMetrics,
  ScrollMetrics,
  AuthenticationResult,
  SecurityAlert,
  AuthHistoryRecord,
  BiometricFeatureVector,
} from '../types/biometrics';
import { FeatureExtractor } from '../ml/FeatureExtractor';
import { Classifier } from '../ml/Classifier';
import { DemoSimulator } from '../ml/DemoSimulator';

interface AuthStoreContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedUserId: string;
  userProfiles: Record<string, UserBiometricProfile>;
  activeProfile: UserBiometricProfile;
  currentKeystrokeEvents: KeystrokeEvent[];
  currentMouseEvents: MouseEventData[];
  keystrokeMetrics: KeystrokeMetrics;
  mouseMetrics: MouseMetrics;
  scrollMetrics: ScrollMetrics;
  currentFeatureVector: BiometricFeatureVector;
  authResult: AuthenticationResult;
  authHistory: AuthHistoryRecord[];
  securityAlerts: SecurityAlert[];
  isLiveDemoActive: boolean;
  isSuspiciousSimulated: boolean;
  sessionSeconds: number;
  hasConsent: boolean;
  selectedAiModel: string;
  setSelectedAiModel: (model: string) => void;
  
  // Actions
  switchUserProfile: (userId: string) => void;
  recordKeystroke: (event: KeystrokeEvent) => void;
  recordMouse: (event: MouseEventData) => void;
  recordScroll: (deltaY: number) => void;
  createProfileFromCapturedData: (customName?: string) => void;
  evaluateCurrentSession: () => void;
  toggleLiveDemo: (enable?: boolean) => void;
  simulateSuspiciousUser: () => void;
  resetSimulation: () => void;
  resolveAlert: (alertId: string) => void;
  clearProfile: () => void;
  setPrivacyConsent: (consent: boolean) => void;
}

const AuthStoreContext = createContext<AuthStoreContextType | null>(null);

export const AuthStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sampleProfiles = DemoSimulator.getSampleProfiles();
  const [userProfiles, setUserProfiles] = useState<Record<string, UserBiometricProfile>>(sampleProfiles);
  const [selectedUserId, setSelectedUserId] = useState<string>('USER-001');
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [selectedAiModel, setSelectedAiModel] = useState<string>('Random Forest + Isolation Forest');

  const [currentKeystrokeEvents, setCurrentKeystrokeEvents] = useState<KeystrokeEvent[]>([]);
  const [currentMouseEvents, setCurrentMouseEvents] = useState<MouseEventData[]>([]);
  const [scrollEventsCount, setScrollEventsCount] = useState<number>(14);
  const [scrollSpeed, setScrollSpeed] = useState<number>(180);

  const [isLiveDemoActive, setIsLiveDemoActive] = useState<boolean>(true);
  const [isSuspiciousSimulated, setIsSuspiciousSimulated] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(1122);
  const [hasConsent, setHasConsent] = useState<boolean>(true);

  const [authHistory, setAuthHistory] = useState<AuthHistoryRecord[]>(DemoSimulator.getInitialHistory());
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(DemoSimulator.getInitialAlerts());

  const activeProfile = userProfiles[selectedUserId] || userProfiles['USER-001'];

  const keystrokeMetrics = FeatureExtractor.calculateKeystrokeMetrics(currentKeystrokeEvents);
  const mouseMetrics = FeatureExtractor.calculateMouseMetrics(currentMouseEvents);
  const scrollMetrics: ScrollMetrics = {
    scrollSpeed,
    eventCount: scrollEventsCount,
    directionChanges: Math.round(scrollEventsCount * 0.2),
    avgInterval: 320,
  };

  const baseFeatureVector = FeatureExtractor.createFeatureVector(keystrokeMetrics, mouseMetrics, scrollMetrics);
  
  const currentFeatureVector = isSuspiciousSimulated
    ? DemoSimulator.generateSuspiciousVector(activeProfile.baselineVector)
    : baseFeatureVector;

  const authResult = Classifier.evaluateAuthentication(
    activeProfile.userId,
    activeProfile.userName,
    currentFeatureVector,
    activeProfile.baselineVector
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLiveDemoActive) return;

    const interval = setInterval(() => {
      const result = Classifier.evaluateAuthentication(
        activeProfile.userId,
        activeProfile.userName,
        currentFeatureVector,
        activeProfile.baselineVector
      );

      setScrollSpeed((prev) => Math.max(50, Math.min(600, prev + Math.floor(Math.random() * 20 - 10))));

      if (result.status === 'SUSPICIOUS' || result.status === 'BLOCKED') {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setAuthHistory((prev) => {
          if (prev.length > 0 && prev[0].time === timeNow && prev[0].status === result.status) {
            return prev;
          }
          return [
            {
              id: `hist-${Date.now()}`,
              time: timeNow,
              userId: result.userId,
              userName: result.userName,
              behaviourScore: result.confidenceScore,
              riskLevel: result.riskLevel,
              status: result.status,
              anomalyScore: result.parameterScores.anomalyScore,
            },
            ...prev.slice(0, 15),
          ];
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveDemoActive, activeProfile, currentFeatureVector]);

  const switchUserProfile = (userId: string) => {
    if (userProfiles[userId]) {
      setSelectedUserId(userId);
      setIsSuspiciousSimulated(userId === 'USER-002' || userId === 'USER-003');
    }
  };

  const recordKeystroke = useCallback((event: KeystrokeEvent) => {
    setCurrentKeystrokeEvents((prev) => [...prev.slice(-40), event]);
  }, []);

  const recordMouse = useCallback((event: MouseEventData) => {
    setCurrentMouseEvents((prev) => [...prev.slice(-60), event]);
  }, []);

  const recordScroll = useCallback((deltaY: number) => {
    setScrollEventsCount((prev) => prev + 1);
    setScrollSpeed(Math.min(900, Math.abs(deltaY) * 5 + 80));
  }, []);

  const createProfileFromCapturedData = (customName?: string) => {
    const newProfileId = `USER-BIO-${Date.now().toString().slice(-4)}`;
    const newUserId = `USER-CUSTOM-${Object.keys(userProfiles).length + 1}`;
    const userName = customName || 'Registered Bio-Profile';

    const newProfile: UserBiometricProfile = {
      profileId: newProfileId,
      userId: newUserId,
      userName,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      baselineConfidence: 96,
      baselineVector: { ...currentFeatureVector },
      sampleCount: currentKeystrokeEvents.length + currentMouseEvents.length + 50,
    };

    setUserProfiles((prev) => ({
      ...prev,
      [newUserId]: newProfile,
    }));
    setSelectedUserId(newUserId);
    setIsSuspiciousSimulated(false);
  };

  const evaluateCurrentSession = () => {
    const result = Classifier.evaluateAuthentication(
      activeProfile.userId,
      activeProfile.userName,
      currentFeatureVector,
      activeProfile.baselineVector
    );

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuthHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        time: timeNow,
        userId: result.userId,
        userName: result.userName,
        behaviourScore: result.confidenceScore,
        riskLevel: result.riskLevel,
        status: result.status,
        anomalyScore: result.parameterScores.anomalyScore,
      },
      ...prev,
    ]);
  };

  const toggleLiveDemo = (enable?: boolean) => {
    setIsLiveDemoActive((prev) => (enable !== undefined ? enable : !prev));
  };

  const simulateSuspiciousUser = () => {
    setIsSuspiciousSimulated(true);
    const suspiciousVector = DemoSimulator.generateSuspiciousVector(activeProfile.baselineVector);
    const evalResult = Classifier.evaluateAuthentication(
      activeProfile.userId,
      activeProfile.userName,
      suspiciousVector,
      activeProfile.baselineVector
    );

    const newAlert: SecurityAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: activeProfile.userId,
      userName: activeProfile.userName,
      riskLevel: 'HIGH',
      similarityScore: evalResult.parameterScores.overallSimilarity,
      anomalyScore: evalResult.parameterScores.anomalyScore,
      message: '🚨 HIGH RISK BEHAVIOUR DETECTED (Simulated)',
      detectedIssue: 'Current typing and mouse behaviour significantly differs from the registered behavioural profile.',
      recommendedAction: 'Re-authentication Required immediately. Lock session.',
      resolved: false,
    };

    setSecurityAlerts((prev) => [newAlert, ...prev]);
    setActiveTab('security_alerts');
  };

  const resetSimulation = () => {
    setIsSuspiciousSimulated(false);
    setSelectedUserId('USER-001');
    setCurrentKeystrokeEvents([]);
    setCurrentMouseEvents([]);
  };

  const resolveAlert = (alertId: string) => {
    setSecurityAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert))
    );
  };

  const clearProfile = () => {
    setCurrentKeystrokeEvents([]);
    setCurrentMouseEvents([]);
    setIsSuspiciousSimulated(false);
  };

  return (
    <AuthStoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedUserId,
        userProfiles,
        activeProfile,
        currentKeystrokeEvents,
        currentMouseEvents,
        keystrokeMetrics,
        mouseMetrics,
        scrollMetrics,
        currentFeatureVector,
        authResult,
        authHistory,
        securityAlerts,
        isLiveDemoActive,
        isSuspiciousSimulated,
        sessionSeconds,
        hasConsent,
        selectedAiModel,
        setSelectedAiModel,
        switchUserProfile,
        recordKeystroke,
        recordMouse,
        recordScroll,
        createProfileFromCapturedData,
        evaluateCurrentSession,
        toggleLiveDemo,
        simulateSuspiciousUser,
        resetSimulation,
        resolveAlert,
        clearProfile,
        setPrivacyConsent: setHasConsent,
      }}
    >
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = () => {
  const context = useContext(AuthStoreContext);
  if (!context) {
    throw new Error('useAuthStore must be used within an AuthStoreProvider');
  }
  return context;
};
