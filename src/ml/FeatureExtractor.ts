import type { KeystrokeEvent, KeystrokeMetrics, MouseEventData, MouseMetrics, ScrollMetrics, BiometricFeatureVector } from '../types/biometrics';

export class FeatureExtractor {
  public static calculateKeystrokeMetrics(events: KeystrokeEvent[]): KeystrokeMetrics {
    if (events.length === 0) {
      return {
        wpm: 0,
        avgHoldTime: 110,
        avgFlightTime: 95,
        consistencyScore: 90,
        totalKeystrokes: 0,
        holdTimeVariance: 15,
      };
    }

    const holdTimes = events.map((e) => e.holdDuration);
    const flightTimes = events.filter((e) => e.flightTime > 0).map((e) => e.flightTime);

    const sumHold = holdTimes.reduce((acc, val) => acc + val, 0);
    const avgHoldTime = Math.round(sumHold / holdTimes.length);

    const sumFlight = flightTimes.reduce((acc, val) => acc + val, 0);
    const avgFlightTime = flightTimes.length > 0 ? Math.round(sumFlight / flightTimes.length) : 95;

    const meanHold = avgHoldTime;
    const variance = holdTimes.reduce((acc, val) => acc + Math.pow(val - meanHold, 2), 0) / holdTimes.length;
    const stdDev = Math.sqrt(variance);
    
    const normalizedDev = Math.min(1, stdDev / (meanHold || 1));
    const consistencyScore = Math.max(40, Math.min(99, Math.round((1 - normalizedDev * 0.7) * 100)));

    const firstTime = events[0].keyDownTime;
    const lastTime = events[events.length - 1].keyUpTime;
    const durationMinutes = Math.max(0.05, (lastTime - firstTime) / 60000);
    const wpm = Math.round((events.length / 5) / durationMinutes);

    return {
      wpm: Math.min(180, Math.max(10, wpm)),
      avgHoldTime,
      avgFlightTime,
      consistencyScore,
      totalKeystrokes: events.length,
      holdTimeVariance: Math.round(variance),
    };
  }

  public static calculateMouseMetrics(events: MouseEventData[]): MouseMetrics {
    if (events.length < 2) {
      return {
        avgSpeed: 240,
        maxSpeed: 850,
        avgAcceleration: 1200,
        clickCount: 0,
        avgClickInterval: 450,
        movementConsistency: 88,
        behaviourScore: 92,
        totalDistance: 0,
      };
    }

    let totalDistance = 0;
    const speeds: number[] = [];
    const accelerations: number[] = [];
    const clickTimes: number[] = [];

    for (let i = 1; i < events.length; i++) {
      const p1 = events[i - 1];
      const p2 = events[i];

      if (p2.type === 'click') {
        clickTimes.push(p2.timestamp);
      }

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const dt = Math.max(1, (p2.timestamp - p1.timestamp) / 1000);

      totalDistance += dist;
      const speed = dist / dt;
      speeds.push(speed);

      if (i > 1) {
        const prevSpeed = speeds[i - 2];
        const accel = Math.abs(speed - prevSpeed) / dt;
        accelerations.push(accel);
      }
    }

    const avgSpeed = speeds.length > 0 ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length) : 240;
    const maxSpeed = speeds.length > 0 ? Math.round(Math.max(...speeds)) : 850;
    const avgAcceleration = accelerations.length > 0 ? Math.round(accelerations.reduce((a, b) => a + b, 0) / accelerations.length) : 1200;

    let avgClickInterval = 450;
    if (clickTimes.length >= 2) {
      const intervals = [];
      for (let c = 1; c < clickTimes.length; c++) {
        intervals.push(clickTimes[c] - clickTimes[c - 1]);
      }
      avgClickInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
    }

    const meanSpeed = avgSpeed || 1;
    const speedVariance = speeds.reduce((a, b) => a + Math.pow(b - meanSpeed, 2), 0) / (speeds.length || 1);
    const speedStdDev = Math.sqrt(speedVariance);
    const movementConsistency = Math.max(40, Math.min(98, Math.round((1 - Math.min(1, speedStdDev / meanSpeed) * 0.6) * 100)));

    const behaviourScore = Math.round((movementConsistency + Math.min(100, (avgSpeed / 10))) / 2);

    return {
      avgSpeed,
      maxSpeed,
      avgAcceleration,
      clickCount: clickTimes.length,
      avgClickInterval,
      movementConsistency,
      behaviourScore: Math.min(99, Math.max(30, behaviourScore)),
      totalDistance: Math.round(totalDistance),
    };
  }

  public static createFeatureVector(
    keystroke: KeystrokeMetrics,
    mouse: MouseMetrics,
    scroll: ScrollMetrics
  ): BiometricFeatureVector {
    return {
      wpm: keystroke.wpm,
      avgHoldTime: keystroke.avgHoldTime,
      avgFlightTime: keystroke.avgFlightTime,
      typingConsistency: keystroke.consistencyScore,
      mouseSpeed: mouse.avgSpeed,
      mouseAcceleration: mouse.avgAcceleration,
      clickInterval: mouse.avgClickInterval,
      mouseConsistency: mouse.movementConsistency,
      scrollSpeed: scroll.scrollSpeed,
      scrollFrequency: scroll.eventCount,
      interactionFrequency: Math.round((keystroke.totalKeystrokes + mouse.clickCount + scroll.eventCount) / 2),
    };
  }
}
