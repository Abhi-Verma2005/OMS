# Google OAuth Error 403: disallowed_useragent - Fix Guide

## Problem
Your client is encountering a Google OAuth error: **"Error 403: disallowed_useragent"** which occurs when Google's "Use secure browsers" policy blocks the OAuth request.

## Root Causes
1. **Incorrect Redirect URIs** in Google Cloud Console
2. **Missing or incorrect OAuth consent screen configuration**
3. **Browser security policies** blocking the request
4. **User agent string issues** in embedded browsers
5. **Mobile-specific issues** - Very common on phones, especially in-app browsers
6. **Missing viewport meta tag** - Causes mobile rendering issues

## Solutions

### 1. Fix Google Cloud Console Configuration

#### Step 1: Update OAuth 2.0 Client IDs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Find your OAuth 2.0 Client ID and click **Edit**
4. Update **Authorized redirect URIs** with these exact URLs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
   Replace `yourdomain.com` with your actual domain.

#### Step 2: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Make sure your app is in **Testing** or **Production** mode
3. Add these scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

#### Step 3: Add Test Users (if in Testing mode)
1. In OAuth consent screen, add your client's email to **Test users**
2. This allows them to sign in even in testing mode

### 2. Update Environment Variables

Make sure your `.env.local` has the correct Google OAuth credentials:

```env
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_URL=http://localhost:3000  # or your production URL
```

### 3. Browser-Specific Solutions

#### For Users Experiencing the Error:
1. **Try incognito/private browsing mode**
2. **Use a different browser** (Chrome, Firefox, Safari)
3. **Clear browser cache and cookies**
4. **Disable browser extensions** temporarily
5. **Update the browser** to the latest version

#### For Mobile Users (Most Common Issue):
- **In-App Browsers**: Instagram, Facebook, TikTok, etc. often block Google OAuth
  - Solution: Use "Open in Browser" option or copy link to default browser
- **Mobile WebView**: Some apps use restricted WebView components
  - Solution: Open in Chrome, Safari, or Firefox instead
- **Mobile Browser Issues**: Some mobile browsers have security restrictions
  - Solution: Try incognito mode or different browser

#### For Mobile Apps:
- If this is happening in a mobile app's WebView, consider using:
  - **Chrome Custom Tabs** (Android)
  - **SFSafariViewController** (iOS)
  - **System browser** instead of embedded WebView

### 4. Code-Level Fixes Applied

The following changes have been made to your codebase:

1. **Enhanced Google OAuth configuration** with proper authorization parameters
2. **Improved error handling** with specific guidance for the disallowed_useragent error
3. **User-friendly error messages** with step-by-step troubleshooting
4. **Proactive guidance** on the sign-in page
5. **Mobile-specific detection and guidance** for in-app browsers
6. **Added viewport meta tag** for proper mobile rendering
7. **Smart mobile component** that detects browser type and provides specific advice

### 5. Testing the Fix

1. **Test in incognito mode** first
2. **Test with different browsers**
3. **Test on different devices**
4. **Verify redirect URIs** are working correctly

### 6. Alternative Authentication Methods

If Google OAuth continues to cause issues, users can:
- **Use Discord OAuth** (already configured)
- **Sign in with email/password** (credentials provider)
- **Use email verification** (Resend provider)

## Prevention

1. **Always test OAuth flows** in multiple browsers
2. **Keep redirect URIs updated** when changing domains
3. **Monitor OAuth consent screen** status
4. **Provide alternative sign-in methods**

## Support

If the issue persists after following these steps:
1. Check Google Cloud Console for any additional errors
2. Review browser console for JavaScript errors
3. Test with a fresh Google account
4. Contact Google OAuth support if needed

---

**Note**: This error is commonly caused by Google's security policies and is not necessarily a problem with your code. The solutions above address the most common causes and provide workarounds for users.
