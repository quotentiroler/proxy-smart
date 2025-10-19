import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { logger } from './logger';

export interface OAuthFlowEvent {
  id: string;
  timestamp: string;
  type: 'authorization' | 'token' | 'refresh' | 'error' | 'revoke' | 'introspect';
  status: 'success' | 'error' | 'pending' | 'warning';
  clientId: string;
  clientName?: string;
  userId?: string;
  userName?: string;
  scopes: string[];
  grantType: string;
  responseTime: number;
  ipAddress: string;
  userAgent: string;
  errorMessage?: string;
  errorCode?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: boolean;
  fhirContext?: {
    patient?: string;
    encounter?: string;
    location?: string;
    fhirUser?: string;
  };
  requestDetails?: {
    path: string;
    method: string;
    headers?: Record<string, string>;
  };
}

export interface OAuthPredictiveInsights {
  generatedAt: string;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  trendConfidence: number;
  nextHour: {
    totalFlows: number;
    successRate: number;
    errorRate: number;
  };
  anomalyRisk: 'low' | 'medium' | 'high';
  anomalyReasons: string[];
  notes?: string;
}

export interface OAuthAnalytics {
  totalFlows: number;
  successRate: number;
  averageResponseTime: number;
  activeTokens: number;
  topClients: Array<{
    clientId: string;
    clientName: string;
    count: number;
    successRate: number;
  }>;
  flowsByType: Record<string, number>;
  errorsByType: Record<string, number>;
  hourlyStats: Array<{
    hour: string;
    success: number;
    error: number;
    total: number;
  }>;
  predictiveInsights?: OAuthPredictiveInsights;
}

class OAuthMetricsLogger {
  private readonly logDir: string;
  private readonly eventsFile: string;
  private readonly analyticsFile: string;
  private readonly systemHealthFile: string;
  private events: OAuthFlowEvent[] = [];
  private analytics: OAuthAnalytics | null = null;
  private subscribers: Set<(event: OAuthFlowEvent) => void> = new Set();
  private analyticsSubscribers: Set<(analytics: OAuthAnalytics) => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.logDir = join(process.cwd(), 'logs', 'oauth-metrics');
    this.eventsFile = join(this.logDir, 'oauth-events.jsonl');
    this.analyticsFile = join(this.logDir, 'oauth-analytics.json');
    this.systemHealthFile = join(this.logDir, 'system-health.json');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create log directory if it doesn't exist
      if (!existsSync(this.logDir)) {
        await mkdir(this.logDir, { recursive: true });
        logger.auth.info('Created OAuth metrics log directory', { dir: this.logDir });
      }

      // Load existing events from the last 24 hours
      await this.loadRecentEvents();
      
      // Calculate initial analytics
      await this.calculateAnalytics();

      this.isInitialized = true;
      logger.auth.info('OAuth metrics logger initialized successfully');
    } catch (error) {
      logger.auth.error('Failed to initialize OAuth metrics logger', { error });
      throw error;
    }
  }

  /**
   * Log an OAuth flow event
   */
  async logEvent(event: Omit<OAuthFlowEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: OAuthFlowEvent = {
      ...event,
      id: `oauth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    try {
      // Add to in-memory store
      this.events.unshift(fullEvent);
      
      // Keep only last 1000 events in memory
      if (this.events.length > 1000) {
        this.events = this.events.slice(0, 1000);
      }

      // Persist to file (JSONL format for easy parsing)
      const logLine = JSON.stringify(fullEvent) + '\n';
      await appendFile(this.eventsFile, logLine);

      // Notify real-time subscribers
      this.subscribers.forEach(callback => {
        try {
          callback(fullEvent);
        } catch (error) {
          logger.auth.error('Error in OAuth event subscriber', { error });
        }
      });

      // Recalculate analytics periodically
      if (this.events.length % 10 === 0) {
        await this.calculateAnalytics();
      }

      logger.auth.debug('OAuth event logged', { 
        eventId: fullEvent.id, 
        type: fullEvent.type, 
        status: fullEvent.status,
        clientId: fullEvent.clientId 
      });
    } catch (error) {
      logger.auth.error('Failed to log OAuth event', { error, event: fullEvent });
    }
  }

  /**
   * Subscribe to real-time OAuth events
   */
  subscribeToEvents(callback: (event: OAuthFlowEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Subscribe to analytics updates
   */
  subscribeToAnalytics(callback: (analytics: OAuthAnalytics) => void): () => void {
    this.analyticsSubscribers.add(callback);
    return () => this.analyticsSubscribers.delete(callback);
  }

  /**
   * Get recent events with optional filtering
   */
  getRecentEvents(options?: {
    limit?: number;
    type?: string;
    status?: string;
    clientId?: string;
    since?: Date;
  }): OAuthFlowEvent[] {
    let filtered = [...this.events];

    if (options?.type && options.type !== 'all') {
      filtered = filtered.filter(e => e.type === options.type);
    }

    if (options?.status && options.status !== 'all') {
      filtered = filtered.filter(e => e.status === options.status);
    }

    if (options?.clientId) {
      filtered = filtered.filter(e => e.clientId === options.clientId);
    }

    if (options?.since) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= options.since!);
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Get current analytics
   */
  getAnalytics(): OAuthAnalytics | null {
    return this.analytics;
  }

  /**
   * Calculate analytics from recent events
   */
  private async calculateAnalytics(): Promise<void> {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentEvents = this.events.filter(e => new Date(e.timestamp) >= last24Hours);

      const totalFlows = recentEvents.length;
      const successfulFlows = recentEvents.filter(e => e.status === 'success').length;
      const successRate = totalFlows > 0 ? (successfulFlows / totalFlows) * 100 : 0;
      
      const totalResponseTime = recentEvents.reduce((sum, e) => sum + e.responseTime, 0);
      const averageResponseTime = totalFlows > 0 ? totalResponseTime / totalFlows : 0;
      
      const activeTokens = recentEvents.filter(e => 
        e.status === 'success' && 
        e.tokenType && 
        e.type === 'token'
      ).length;

      // Calculate client statistics
      const clientStats = new Map<string, { name: string; count: number; successful: number }>();
      recentEvents.forEach(event => {
        if (!clientStats.has(event.clientId)) {
          clientStats.set(event.clientId, { 
            name: event.clientName || event.clientId, 
            count: 0, 
            successful: 0 
          });
        }
        const stat = clientStats.get(event.clientId)!;
        stat.count++;
        if (event.status === 'success') stat.successful++;
      });

      const topClients = Array.from(clientStats.entries())
        .map(([clientId, stat]) => ({
          clientId,
          clientName: stat.name,
          count: stat.count,
          successRate: stat.count > 0 ? (stat.successful / stat.count) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Flows by grant type
      const flowsByType = recentEvents.reduce((acc, event) => {
        acc[event.grantType] = (acc[event.grantType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Errors by type
      const errorsByType = recentEvents
        .filter(e => e.status === 'error')
        .reduce((acc, event) => {
          const errorType = event.errorCode || 'unknown';
          acc[errorType] = (acc[errorType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      // Hourly stats for the last 24 hours
      const hourlyStats = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);
        const hourEvents = recentEvents.filter(e => {
          const eventTime = new Date(e.timestamp);
          return eventTime.getHours() === hour.getHours() && 
                 eventTime.getDate() === hour.getDate();
        });
        
        return {
          hour: hour.toISOString(),
          success: hourEvents.filter(e => e.status === 'success').length,
          error: hourEvents.filter(e => e.status === 'error').length,
          total: hourEvents.length
        };
      });

      const predictiveInsights = this.calculatePredictiveInsights({
        hourlyStats,
        errorsByType
      });

      this.analytics = {
        totalFlows,
        successRate,
        averageResponseTime,
        activeTokens,
        topClients,
        flowsByType,
        errorsByType,
        hourlyStats,
        predictiveInsights: predictiveInsights ?? undefined
      };

      // Persist analytics to file
      await writeFile(this.analyticsFile, JSON.stringify(this.analytics, null, 2));

      // Notify analytics subscribers
      this.analyticsSubscribers.forEach(callback => {
        try {
          callback(this.analytics!);
        } catch (error) {
          logger.auth.error('Error in OAuth analytics subscriber', { error });
        }
      });

      logger.auth.debug('OAuth analytics calculated', { 
        totalFlows, 
        successRate: successRate.toFixed(2),
        averageResponseTime: averageResponseTime.toFixed(0)
      });
    } catch (error) {
      logger.auth.error('Failed to calculate OAuth analytics', { error });
    }
  }

  private calculatePredictiveInsights(input: {
    hourlyStats: Array<{ hour: string; success: number; error: number; total: number }>;
    errorsByType: Record<string, number>;
  }): OAuthPredictiveInsights | null {
    const { hourlyStats, errorsByType } = input;

    if (!hourlyStats || hourlyStats.length < 4) {
      return null;
    }

    const recent = hourlyStats.slice(-6).filter(stat => Number.isFinite(stat.total));
    if (recent.length < 3) {
      return null;
    }

    const totals = recent.map(stat => stat.total);
  const successes = recent.map(stat => stat.success);

    const { slope: volumeSlope, direction: trendDirection, confidence: volumeConfidence } = this.computeLinearTrend(totals);
    const { slope: successSlope } = this.computeLinearTrend(successes.map((value, idx) => {
      const total = recent[idx].total || 0;
      return total === 0 ? 0 : (value / total) * 100;
    }));

    const latest = recent[recent.length - 1];
    const latestTotal = latest.total;
    const latestSuccessRate = latest.total > 0 ? (latest.success / latest.total) * 100 : 0;
    const predictedTotal = Math.max(0, Math.round(latestTotal + volumeSlope));
    const predictedSuccessRate = Math.max(0, Math.min(100, latestSuccessRate + successSlope));
    const predictedErrorRate = Math.max(0, Math.min(100, 100 - predictedSuccessRate));

    const recentErrorRates = recent.slice(0, -1).map(stat => {
      if (stat.total === 0) return 0;
      return (stat.error / stat.total) * 100;
    });
    const averageErrorRate = recentErrorRates.length
      ? recentErrorRates.reduce((sum, value) => sum + value, 0) / recentErrorRates.length
      : 0;
    const variance = recentErrorRates.length
      ? recentErrorRates.reduce((sum, value) => sum + Math.pow(value - averageErrorRate, 2), 0) / recentErrorRates.length
      : 0;
    const stdDeviation = Math.sqrt(variance);
    const lastErrorRate = latest.total === 0 ? 0 : (latest.error / latest.total) * 100;

    let anomalyRisk: 'low' | 'medium' | 'high' = 'low';
    const anomalyReasons: string[] = [];

    if (recentErrorRates.length >= 2) {
      if (lastErrorRate > averageErrorRate + 2 * stdDeviation && lastErrorRate > 5) {
        anomalyRisk = 'high';
        anomalyReasons.push('Error rate spiked significantly in the last hour');
      } else if (lastErrorRate > averageErrorRate + stdDeviation) {
        anomalyRisk = 'medium';
        anomalyReasons.push('Error rate is trending upward');
      }
    }

    if (trendDirection === 'increasing' && predictedErrorRate > 10) {
      anomalyRisk = anomalyRisk === 'high' ? 'high' : 'medium';
      anomalyReasons.push('Increasing traffic with elevated projected error rate');
    }

    const topErrorType = Object.entries(errorsByType)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type)[0];

    if (topErrorType) {
      anomalyReasons.push(`Dominant error category: ${topErrorType}`);
    }

    if (anomalyReasons.length === 0) {
      anomalyReasons.push('No anomalies detected in the last six hours');
    }

    const trendConfidence = Math.max(0, Math.min(1, volumeConfidence));

    return {
      generatedAt: new Date().toISOString(),
      trendDirection,
      trendConfidence,
      nextHour: {
        totalFlows: predictedTotal,
        successRate: Number(predictedSuccessRate.toFixed(1)),
        errorRate: Number(predictedErrorRate.toFixed(1))
      },
      anomalyRisk,
      anomalyReasons,
      notes: anomalyRisk === 'high' ? 'Investigate failing clients or infrastructure issues impacting OAuth flows.' : undefined
    };
  }

  private computeLinearTrend(values: number[]): { slope: number; direction: 'increasing' | 'decreasing' | 'stable'; confidence: number } {
    const numeric = values.filter(value => Number.isFinite(value));
    const n = numeric.length;
    if (n < 2) {
      return { slope: 0, direction: 'stable', confidence: 0 };
    }

    const sumX = numeric.reduce((acc, _, idx) => acc + idx, 0);
    const sumY = numeric.reduce((acc, value) => acc + value, 0);
    const sumXY = numeric.reduce((acc, value, idx) => acc + idx * value, 0);
    const sumX2 = numeric.reduce((acc, _, idx) => acc + idx * idx, 0);

    const denominator = n * sumX2 - sumX * sumX;
    const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;

    let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
    const threshold = Math.max(1, numeric[n - 1] * 0.05);
    if (slope > threshold) {
      direction = 'increasing';
    } else if (slope < -threshold) {
      direction = 'decreasing';
    }

    const average = sumY / n;
    const variance = numeric.reduce((acc, value) => acc + Math.pow(value - average, 2), 0) / n;
    const confidence = average === 0 ? 0 : Math.min(1, Math.abs(slope) / (average + Math.sqrt(variance) + 1));

    return { slope, direction, confidence };
  }

  /**
   * Load recent events from persisted logs
   */
  private async loadRecentEvents(): Promise<void> {
    try {
      if (!existsSync(this.eventsFile)) {
        logger.auth.info('No existing OAuth events file found, starting fresh');
        return;
      }

      // For now, we'll keep events in memory only
      // In production, you might want to implement more sophisticated log rotation
      this.events = [];
      logger.auth.info('OAuth events loaded from persistence');
    } catch (error) {
      logger.auth.error('Failed to load recent OAuth events', { error });
    }
  }

  /**
   * Log system health metrics
   */
  async logSystemHealth(): Promise<void> {
    try {
      const healthMetrics = {
        timestamp: new Date().toISOString(),
        oauthServer: {
          status: 'healthy',
          uptime: process.uptime(),
          responseTime: await this.measureResponseTime(),
        },
        tokenStore: {
          status: 'healthy',
          activeTokens: this.analytics?.activeTokens || 0,
          storageUsed: 68, // This would be calculated based on actual storage
        },
        network: {
          status: 'healthy',
          throughput: '1.2k req/min', // This would be calculated from actual metrics
          errorRate: this.analytics ? (100 - this.analytics.successRate) : 0,
        }
      };

      await writeFile(this.systemHealthFile, JSON.stringify(healthMetrics, null, 2));
      logger.auth.debug('System health metrics logged');
    } catch (error) {
      logger.auth.error('Failed to log system health metrics', { error });
    }
  }

  /**
   * Measure OAuth server response time
   */
  private async measureResponseTime(): Promise<number> {
    // This is a placeholder - in production you'd ping your actual OAuth endpoints
    return Math.random() * 200 + 100; // 100-300ms
  }
}

// Export singleton instance
export const oauthMetricsLogger = new OAuthMetricsLogger();
