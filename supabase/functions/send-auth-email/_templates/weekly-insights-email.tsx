
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
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const insightSection = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  margin: '16px 40px',
  padding: '20px',
}

const insightTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const insightText = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#10b981',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  margin: '0 auto',
}

const footerText = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '32px 0 16px',
  padding: '0 40px',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  margin: '16px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}
