
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WeeklyInsightsEmailProps {
  name: string
  insights: {
    moodTrend: string
    topEmotion: string
    habitProgress: string
    weeklyStreak: number
  }
  dashboardUrl: string
}

export const WeeklyInsightsEmail = ({
  name,
  insights,
  dashboardUrl,
}: WeeklyInsightsEmailProps) => (
  <Html>
    <Head />
    <Preview>Your weekly growth insights are ready</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* App Icon */}
        <Section style={iconSection}>
          <div style={iconContainer}>
            <div style={calendarIcon}>📅</div>
          </div>
          <Heading style={brandName}>Lumatori</Heading>
          <Text style={brandTagline}>Your personal growth companion</Text>
        </Section>

        {/* Glass Card */}
        <Section style={glassCard}>
          <div style={insightsIconContainer}>
            <div style={insightsIcon}>📊</div>
          </div>
          
          <Heading style={h1}>Your Week in Review, {name}</Heading>
          
          <Text style={text}>
            Here's a summary of your personal growth journey this week:
          </Text>
          
          <Section style={insightSection}>
            <Text style={insightTitle}>📈 Mood Trend</Text>
            <Text style={insightText}>{insights.moodTrend}</Text>
          </Section>
          
          <Section style={insightSection}>
            <Text style={insightTitle}>💭 Most Frequent Emotion</Text>
            <Text style={insightText}>{insights.topEmotion}</Text>
          </Section>
          
          <Section style={insightSection}>
            <Text style={insightTitle}>🎯 Habit Progress</Text>
            <Text style={insightText}>{insights.habitProgress}</Text>
          </Section>
          
          <Section style={insightSection}>
            <Text style={insightTitle}>🔥 Weekly Streak</Text>
            <Text style={insightText}>{insights.weeklyStreak} days of consistent tracking</Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Full Dashboard
            </Button>
          </Section>
        </Section>
        
        <Text style={footerText}>
          Keep up the great work on your personal growth journey!
        </Text>
        
        <Text style={footer}>
          Growing stronger every day 💪
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#0f172a',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  minHeight: '100vh',
  padding: '40px 0',
}

const container = {
  backgroundColor: 'transparent',
  margin: '0 auto',
  padding: '0 20px',
  maxWidth: '600px',
}

const iconSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const iconContainer = {
  width: '64px',
  height: '64px',
  backgroundColor: 'rgba(59, 130, 246, 0.2)',
  borderRadius: '16px',
  margin: '0 auto 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(59, 130, 246, 0.3)',
}

const calendarIcon = {
  fontSize: '32px',
  lineHeight: '1',
}

const brandName = {
  color: '#f8fafc',
  fontSize: '24px',
  fontWeight: '300',
  margin: '0 0 8px 0',
  letterSpacing: '-0.025em',
}

const brandTagline = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '0 0 32px 0',
  fontWeight: '400',
}

const glassCard = {
  backgroundColor: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(55, 65, 81, 0.5)',
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '24px',
  backdropFilter: 'blur(12px)',
}

const insightsIconContainer = {
  width: '64px',
  height: '64px',
  backgroundColor: 'rgba(16, 185, 129, 0.2)',
  borderRadius: '50%',
  margin: '0 auto 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const insightsIcon = {
  fontSize: '32px',
  lineHeight: '1',
}

const h1 = {
  color: '#f8fafc',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
  letterSpacing: '-0.025em',
}

const text = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
  letterSpacing: '0.025em',
}

const insightSection = {
  backgroundColor: 'rgba(55, 65, 81, 0.3)',
  borderRadius: '12px',
  margin: '16px 0',
  padding: '20px',
  border: '1px solid rgba(75, 85, 99, 0.5)',
}

const insightTitle = {
  color: '#f8fafc',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const insightText = {
  color: '#cbd5e1',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #10b981, #059669)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '24px 0 16px',
  textAlign: 'center' as const,
}

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '16px 0',
  textAlign: 'center' as const,
  fontWeight: '500',
}
