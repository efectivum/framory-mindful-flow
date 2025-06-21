
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

interface PasswordResetEmailProps {
  resetUrl: string
}

export const PasswordResetEmail = ({
  resetUrl,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
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
          <div style={securityIconContainer}>
            <div style={securityIcon}>🔒</div>
          </div>
          
          <Heading style={h1}>Password Reset Request</Heading>
          
          <Text style={text}>
            We received a request to reset your password. If you didn't make this request, 
            you can safely ignore this email.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          
          <Section style={infoCard}>
            <Text style={infoText}>
              ⏰ This link will expire in 24 hours for security reasons.
            </Text>
          </Section>
        </Section>
        
        <Text style={footerText}>
          If the button doesn't work, copy and paste this link into your browser:
        </Text>
        
        <Section style={linkContainer}>
          <Text style={linkText}>
            {resetUrl}
          </Text>
        </Section>
        
        <Text style={footer}>
          Stay secure! 🔒
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

const securityIconContainer = {
  width: '64px',
  height: '64px',
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  borderRadius: '50%',
  margin: '0 auto 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const securityIcon = {
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
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
  letterSpacing: '0.025em',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: '1px solid rgba(220, 38, 38, 0.3)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}

const infoCard = {
  backgroundColor: 'rgba(55, 65, 81, 0.3)',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  border: '1px solid rgba(75, 85, 99, 0.5)',
}

const infoText = {
  color: '#fbbf24',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
  fontWeight: '500',
}

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '24px 0 16px',
  textAlign: 'center' as const,
}

const linkContainer = {
  backgroundColor: 'rgba(55, 65, 81, 0.3)',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0 24px',
  border: '1px solid rgba(75, 85, 99, 0.5)',
}

const linkText = {
  color: '#60a5fa',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  wordBreak: 'break-all' as const,
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
