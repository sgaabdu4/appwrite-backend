# Authentication Methods

## OAuth 2.0 Login

Redirect user to 3rd-party provider.

### Client-Side

```dart
// Flutter mobile: let the SDK own the callback and session cookie.
await account.createOAuth2Session(
    provider: OAuthProvider.google,
);
```

```dart
// Flutter web: success/failure URLs are optional navigation targets.
await account.createOAuth2Session(
    provider: OAuthProvider.google,
    success: 'https://yourapp.com/auth/callback',
    failure: 'https://yourapp.com/auth/failure',
);
```

```typescript
// React/browser
await account.createOAuth2Session({
    provider: OAuthProvider.Google,
    success: `${window.location.origin}/auth/callback`,
    failure: `${window.location.origin}/auth/failure`,
});
```

### Flutter Mobile

- Use `Account.createOAuth2Session`; do not hand-roll `/account/tokens/oauth2`, parse callback credentials, or create the session yourself.
- Omit `success` and `failure` on mobile. The Flutter SDK returns through `appwrite-callback-<PROJECT_ID>` and persists the Appwrite session cookie.
- iOS = add `appwrite-callback-<PROJECT_ID>` to `CFBundleURLSchemes`; no other OAuth callback configuration is required.
- Android = register `com.linusu.flutter_web_auth_2.CallbackActivity` with the same scheme.
- Console platform identifier = exact iOS bundle ID or Android package name.

### Apple Provider Gate

Before declaring Apple login fixed:

1. Appwrite provider = enabled + Services ID + Team ID + Key ID + P8 private key.
2. Apple Services ID = associated with the app's primary App ID.
3. Services ID website entry = Appwrite domain + exact Appwrite Console callback URL; complete `Done → Continue → Save`.
4. Apple key = Sign in with Apple enabled + associated with the same primary App ID.
5. Actual device flow = `createOAuth2Session` returns + `account.get()` succeeds + provider identity/session readback exists.

P8 values are write-only. Upload through a trusted Console or secret-safe API path; never place the P8, authorization code, callback `key`, callback `secret`, or session value in logs, shell arguments, commits, or receipts.

### Apple Failure Diagnosis

`Invalid OAuth2 Response. Key and Secret not available` = the SDK received a callback without a successful Appwrite session payload. Diagnose the provider exchange before changing client parsing:

1. Capture only callback field names + sanitized Appwrite error type/code in an isolated local diagnostic build; remove the probe before commit.
2. Verify every Apple/Appwrite association in the gate above.
3. Probe Apple's token endpoint with the candidate client assertion + a dummy authorization code:
   - `invalid_client` → identifier/assertion/key configuration is rejected.
   - `invalid_grant` → client credentials were accepted for that probe; the dummy code is invalid as expected.
4. If a real authorization code still fails after a passing dummy-code credential probe, check Apple service status/recent official reports and allow configuration propagation; do not rotate credentials blindly.
5. Re-run the actual device flow. A candidate probe alone is never a fixed receipt.

### Server-Side (SSR)

```dart
// Step 1: Generate OAuth token (returns redirect URL)
final result = await account.createOAuth2Token(
    provider: OAuthProvider.google,
    success: 'https://yourapp.com/auth/callback',
    failure: 'https://yourapp.com/auth/failure',
);
// Redirect user to result.url

// Step 2: In callback, exchange for session
final session = await account.createSession(userId: userId, secret: secret);
```

Pass `scopes: [...]` for provider-specific grants beyond the default profile scope.

Supported: Google, Apple, GitHub, Microsoft, Discord, Spotify, Twitch, Facebook, Amazon, LinkedIn, [30+ more](https://appwrite.io/docs/products/auth/oauth2).

---

## Magic Link Login

Passwordless via email link.

```dart
// Step 1: Send magic link
final token = await account.createMagicURLToken(
    userId: ID.unique(),
    email: 'user@example.com',
    url: 'https://yourapp.com/auth/magic',
);

// Step 2: User clicks link → callback receives userId + secret
final session = await account.createSession(userId: userId, secret: secret);
```

---

## Email OTP

6-digit code via email. Security phrase blocks phishing.

```dart
// Send OTP
final token = await account.createEmailToken(
    userId: ID.unique(), email: 'user@example.com');

// Verify OTP
await account.createSession(userId: token.userId, secret: '123456');
```

---

## Phone Auth

```dart
await account.createPhoneToken(userId: ID.unique(), phone: '+14155552671');
await account.updatePhoneSession(userId: userId, secret: '123456');
```

### Mock Phone Numbers

Test, no SMS cost. Console → Auth → Security → Mock Numbers. Add: `+15551234567` → OTP: `123456`.

---

## Anonymous Session

Guest user, convert to permanent later.

```dart
final session = await account.createAnonymousSession();

// Later: convert to permanent
await account.updateEmail(email: 'user@example.com', password: 'securepassword');
```

---

## Custom Token Login

Biometric, passkey, custom flows.

```typescript
// Server SDK — create token
const token = await users.createToken({ userId: 'user_123', length: 32, expire: 900 });

// Client SDK — create session
await account.createSession({ userId: token.userId, secret: token.secret });
```

---

## Email Verification

```dart
// Send verification email
await account.createVerification(url: 'https://app.com/verify');

// User clicks link → extract userId and secret from URL
await account.updateVerification(userId: userId, secret: secretFromUrl);

// Check status
final user = await account.get();
print(user.emailVerification); // true
```

---

## Password Recovery

```dart
// Request reset
await account.createRecovery(
    email: 'user@example.com', url: 'https://app.com/reset-password');

// User clicks link → extract userId and secret
await account.updateRecovery(
    userId: userId, secret: secretFromUrl, password: 'newPassword123');
```

---

## Session Management

```dart
// List active sessions
final sessions = await account.listSessions();

// Delete specific session
await account.deleteSession(sessionId: 'session-id');

// Delete all except current
await account.deleteSessions();

// Get current
final current = await account.getSession(sessionId: 'current');
```

---

## User Preferences

Store user settings (max 64KB).

```dart
await account.updatePrefs(prefs: {'theme': 'dark', 'notifications': true});
final prefs = await account.getPrefs();
```

---

## Session Alerts

Notify user on new session from unknown device/location.

```dart
await account.updatePrefs(prefs: {'sessionAlerts': true});
```

---

## Related

- [authentication.md](authentication.md) — MFA, SSR, JWT, security settings
- Teams for group permissions
