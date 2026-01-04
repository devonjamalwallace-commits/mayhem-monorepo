#!/bin/bash
# Git Secrets Configuration Script
# Run this once per repository to block commits containing secrets

# Install git-secrets patterns for this repo
git secrets --install -f

# Add AWS credential patterns
git secrets --register-aws

# Add Stripe key patterns
git secrets --add 'sk_live_[A-Za-z0-9]{99,}'
git secrets --add 'sk_test_[A-Za-z0-9]{99,}'
git secrets --add 'pk_live_[A-Za-z0-9]{99,}'
git secrets --add 'pk_test_[A-Za-z0-9]{99,}'
git secrets --add 'STRIPE_SECRET_KEY.*=.*sk_'
git secrets --add 'STRIPE_PUBLISHABLE_KEY.*=.*pk_'

# Add Supabase patterns (JWT tokens)
git secrets --add 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+'
git secrets --add 'SUPABASE_SERVICE_ROLE_KEY.*=.*eyJ'
git secrets --add 'SUPABASE_ANON_KEY.*=.*eyJ'

# Add database URL patterns
git secrets --add 'postgres://[^:]+:[^@]+@[^/]+'
git secrets --add 'POSTGRES.*URL.*=.*postgres://'
git secrets --add 'DATABASE.*URL.*=.*postgres://'

# Add Twilio patterns
git secrets --add 'TWILIO_ACCOUNT_SID.*=.*AC[a-z0-9]{32}'
git secrets --add 'TWILIO_AUTH_TOKEN.*=.*[a-z0-9]{32}'

# Add SendGrid patterns
git secrets --add 'SENDGRID_API_KEY.*=.*SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}'

# Add WorkOS patterns
git secrets --add 'WORKOS_API_KEY.*=.*sk_'
git secrets --add 'sk_live_[A-Za-z0-9]{32,}'

# Add Firebase patterns
git secrets --add 'private_key.*-----BEGIN PRIVATE KEY-----'
git secrets --add 'client_email.*@.*\.iam\.gserviceaccount\.com'

# Add n8n patterns
git secrets --add 'N8N_API_KEY.*=.*eyJ'

# Add generic API key patterns
git secrets --add 'api[_-]?key.*=.*[A-Za-z0-9]{32,}'
git secrets --add 'secret.*=.*[A-Za-z0-9]{32,}'
git secrets --add 'password.*=.*[^\s]{8,}'

echo "✅ Git secrets configuration complete!"
echo "Test it with: echo 'sk_live_test123...' | git secrets --scan -"
