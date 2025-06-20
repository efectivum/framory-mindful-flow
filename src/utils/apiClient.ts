
import { supabase } from '@/integrations/supabase/client';

interface RequestConfig {
  rateLimitKey?: string;
  retryCount?: number;
  timeout?: number;
}

class APIClient {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests = 60; // requests per minute
  private readonly windowMs = 60000; // 1 minute

  private checkRateLimit(key: string): boolean {
    const now = Date.now();
    const limit = this.requestCounts.get(key);

    if (!limit || now > limit.resetTime) {
      this.requestCounts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (limit.count >= this.maxRequests) {
      console.warn(`Rate limit exceeded for key: ${key}`);
      return false;
    }

    limit.count++;
    return true;
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    retryCount: number = 3,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount === 0) throw error;
      
      console.log(`Retrying operation, ${retryCount} attempts remaining`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.withRetry(operation, retryCount - 1, delay * 2);
    }
  }

  async callFunction(
    functionName: string,
    body: any,
    config: RequestConfig = {}
  ) {
    const rateLimitKey = config.rateLimitKey || `function_${functionName}`;
    
    if (!this.checkRateLimit(rateLimitKey)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    return this.withRetry(
      () => supabase.functions.invoke(functionName, { body }),
      config.retryCount || 3
    );
  }

  async query(
    table: string,
    operation: (query: any) => any,
    config: RequestConfig = {}
  ) {
    const rateLimitKey = config.rateLimitKey || `query_${table}`;
    
    if (!this.checkRateLimit(rateLimitKey)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    return this.withRetry(
      () => operation(supabase.from(table)),
      config.retryCount || 3
    );
  }
}

export const apiClient = new APIClient();
