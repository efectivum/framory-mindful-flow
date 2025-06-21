
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

interface BetaInvitationEmailProps {
  email: string
  signupUrl: string
}

export const BetaInvitationEmail = ({
  email,
  signupUrl,
}: BetaInvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>You're invited to join the Lumatori Beta Program!</Preview>
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
          <div style={betaIconContainer}>
            <div style={betaIcon}>🌟</div>
          </div>
          
          <Heading style={h1}>You're Invited to Beta!</Heading>
          
          <Text style={text}>
            Congratulations! You've been selected to join the exclusive Lumatori Beta Program. 
            Experience the future of personal growth tracking before anyone else.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={signupUrl}>
              Join Beta Program ✨
            </Button>
          </Section>
          
          <Text style={featuresTitle}>
            As a beta user, you'll get access to:
          </Text>
          
          <Section style={featuresList}>
            <Text style={featureItem}>🚀 Early access to new features</Text>
            <Text style={featureItem}>💬 Direct feedback channel with our team</Text>
            <Text style={featureItem}>🎯 Advanced habit tracking & insights</Text>
            <Text style={featureItem}>🤖 Enhanced AI-powered coaching</Text>
            <Text style={featureItem}>📊 Exclusive analytics and reports</Text>
          </Section>
          
          <Section style={infoCard}>
            <Text style={infoText}>
              💡 Your feedback will help shape the future of Lumatori
            </Text>
          </Section>
        </Section>
        
        <Text style={footerText}>
          This invitation was sent to {email}. If you didn't expect this invitation, 
          you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          Welcome to the future of personal growth! 🚀
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

const betaIconContainer = {
  width: '64px',
  height: '64px',
  backgroundColor: 'rgba(251, 191, 36, 0.2)',
  borderRadius: '50%',
  margin: '0 auto 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const betaIcon = {
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

const featuresTitle = {
  color: '#f8fafc',
  fontSize: '16px',
  fontWeight: '500',
  margin: '24px 0 16px 0',
  textAlign: 'center' as const,
}

const featuresList = {
  margin: '0 0 24px 0',
}

const featureItem = {
  color: '#cbd5e1',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '8px 0',
  paddingLeft: '8px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: '1px solid rgba(251, 191, 36, 0.3)',
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

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '16px 0',
  textAlign: 'center' as const,
  fontWeight: '500',
}
