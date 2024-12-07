import { ErrorType, ApiError } from '@/api/errors';

interface ErrorReport {
  message: string;
  type: string;
  timestamp: string;
  stack?: string;
  componentStack?: string;
  additionalData?: any;
}

class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;
  private errorQueue: ErrorReport[] = [];
  private readonly MAX_QUEUE_SIZE = 50;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.startPeriodicFlush();
  }

  public static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flushErrors();
    }, this.FLUSH_INTERVAL);
  }

  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    if (process.env.NODE_ENV === 'development') {
      console.group('Error Monitoring - Flushing Errors');
      console.table(this.errorQueue);
      console.groupEnd();
    } else {
      // In production, send to your error monitoring service
      try {
        // Example: await this.sendToMonitoringService(this.errorQueue);
        console.warn('Error monitoring service not configured for production');
      } catch (error) {
        console.error('Failed to send errors to monitoring service:', error);
      }
    }

    this.errorQueue = [];
  }

  public captureError(error: Error | ApiError, additionalData?: any): void {
    const errorReport: ErrorReport = {
      message: error.message,
      type: error instanceof ApiError ? error.type : 'RUNTIME',
      timestamp: new Date().toISOString(),
      stack: error.stack,
      additionalData
    };

    if (error instanceof ApiError) {
      errorReport.additionalData = {
        ...errorReport.additionalData,
        status: error.status,
        apiData: error.data
      };
    }

    this.addToQueue(errorReport);

    // Immediately flush critical errors
    if (this.isCriticalError(error)) {
      this.flushErrors();
    }
  }

  public captureComponentError(error: Error, componentStack: string, additionalData?: any): void {
    const errorReport: ErrorReport = {
      message: error.message,
      type: 'COMPONENT',
      timestamp: new Date().toISOString(),
      stack: error.stack,
      componentStack,
      additionalData
    };

    this.addToQueue(errorReport);
    this.flushErrors(); // Always flush component errors immediately
  }

  private addToQueue(error: ErrorReport): void {
    this.errorQueue.push(error);
    
    // Remove oldest errors if queue is too large
    if (this.errorQueue.length > this.MAX_QUEUE_SIZE) {
      this.errorQueue = this.errorQueue.slice(-this.MAX_QUEUE_SIZE);
    }
  }

  private isCriticalError(error: Error | ApiError): boolean {
    if (error instanceof ApiError) {
      return error.type === ErrorType.SERVER || error.status === 500;
    }
    return false;
  }

  public getErrorCount(): number {
    return this.errorQueue.length;
  }

  public clearErrors(): void {
    this.errorQueue = [];
  }
}

export const errorMonitoring = ErrorMonitoringService.getInstance();
