
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { PasswordResetEmail } from './_templates/password-reset-email.tsx'
import { BetaInvitationEmail } from './_templates/beta-invitation-email.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthEmailRequest {
  type: 'welcome' | 'password_reset' | 'beta_invitation'
  email: string
  name?: string
  confirmationUrl?: string
  resetUrl?: string
  signupUrl?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const { type, email, name, confirmationUrl, resetUrl, signupUrl }: AuthEmailRequest = await req.json()

    let html: string
    let subject: string

    if (type === 'welcome') {
      if (!name || !confirmationUrl) {
        throw new Error('Name and confirmation URL are required for welcome emails')
      }
      
      html = await renderAsync(
        React.createElement(WelcomeEmail, {
          name,
          confirmationUrl,
        })
      )
      subject = 'Welcome to your personal growth journey! 🌱'
      
    } else if (type === 'password_reset') {
      if (!resetUrl) {
        throw new Error('Reset URL is required for password reset emails')
      }
      
      html = await renderAsync(
        React.createElement(PasswordResetEmail, {
          resetUrl,
        })
      )
      subject = 'Reset your password'
      
    } else if (type === 'beta_invitation') {
      if (!signupUrl) {
        throw new Error('Signup URL is required for beta invitation emails')
      }
      
      html = await renderAsync(
        React.createElement(BetaInvitationEmail, {
          email,
          signupUrl,
        })
      )
      subject = "You're invited to join the Lumatori Beta Program! 🌟"
      
    } else {
      throw new Error('Invalid email type')
    }

    const { data, error } = await resend.emails.send({
      from: 'Lumatori <noreply@yourdomain.com>', // Update with your domain
      to: [email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Error in send-auth-email function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
