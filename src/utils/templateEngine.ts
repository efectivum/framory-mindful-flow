
import type { TemplateVariables } from '@/types/notifications';

export class TemplateEngine {
  /**
   * Render a template string with variables
   * Supports {{variable_name}} syntax
   */
  static render(template: string, variables: TemplateVariables = {}): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      if (value === undefined || value === null) {
        console.warn(`Template variable '${variableName}' not found`);
        return match; // Keep original placeholder if variable not found
      }
      return String(value);
    });
  }

  /**
   * Extract variable names from a template string
   */
  static extractVariables(template: string): string[] {
    const matches = template.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    
    return [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))];
  }

  /**
   * Validate that all required variables are provided
   */
  static validateVariables(template: string, variables: TemplateVariables): {
    isValid: boolean;
    missingVariables: string[];
  } {
    const requiredVariables = this.extractVariables(template);
    const missingVariables = requiredVariables.filter(
      variable => variables[variable] === undefined || variables[variable] === null
    );

    return {
      isValid: missingVariables.length === 0,
      missingVariables
    };
  }

  /**
   * Preview a template with sample data
   */
  static preview(template: string, sampleData: TemplateVariables = {}): string {
    const defaultSampleData: TemplateVariables = {
      user_name: 'John Doe',
      current_time: new Date().toLocaleTimeString(),
      streak_count: 7,
      habit_name: 'Daily Exercise',
      habit_time: '9:00 AM',
      weekly_summary: 'You had 5 journal entries this week with an average mood of 7/10.',
      total_entries: 5,
      mood_trend: 'improving'
    };

    const mergedData = { ...defaultSampleData, ...sampleData };
    return this.render(template, mergedData);
  }
}
