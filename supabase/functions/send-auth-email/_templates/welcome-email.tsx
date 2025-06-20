
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  name: string
  confirmationUrl: string
}

export const WelcomeEmail = ({
  name,
  confirmationUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to your personal growth journey</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Your Journey, {name}!</Heading>
        
        <Text style={text}>
          We're excited to have you join our community of growth-minded individuals. 
          Your personal development journey starts here.
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Verify Your Email
          </Button>
        </Section>
        
        <Text style={text}>
          Once verified, you'll be able to:
        </Text>
        
        <Text style={listItem}>• Track your daily moods and reflections</Text>
        <Text style={listItem}>• Build lasting habits</Text>
        <Text style={listItem}>• Get AI-powered insights</Text>
        <Text style={listItem}>• Monitor your progress over time</Text>
        
        <Text style={footerText}>
          If you didn't create this account, you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          Happy reflecting! 🌱
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

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
  padding: '0 40px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#007ee6',
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
