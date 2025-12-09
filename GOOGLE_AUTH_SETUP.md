# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your application.

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required fields:
     - App name: Your app name
     - User support email: Your email
     - Developer contact information: Your email
   - Click **Save and Continue**
   - Add scopes: `email`, `profile`
   - Add test users (if in testing mode)
   - Click **Save and Continue**
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Your app name
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click **Create**
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root directory of your project
2. Add the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

3. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as the value for `NEXTAUTH_SECRET`

## Step 3: Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Click **Sign in with Google**
4. You should be redirected to Google's consent screen
5. After granting permission, you'll be redirected back to your dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in your Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check that there are no trailing slashes or extra characters

### Error: "invalid_client"
- Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in your `.env.local` file
- Make sure there are no extra spaces or quotes around the values

### Error: "NEXTAUTH_SECRET is not set"
- Ensure `.env.local` file exists in the root directory
- Restart your development server after creating/modifying `.env.local`

### Session not persisting
- Check that `NEXTAUTH_URL` matches your current URL (including port number)
- Ensure cookies are enabled in your browser

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. Add your production redirect URI to Google Cloud Console:
   - `https://yourdomain.com/api/auth/callback/google`

3. Ensure all environment variables are set in your hosting platform (Vercel, Netlify, etc.)

4. Use a strong, randomly generated `NEXTAUTH_SECRET` for production

