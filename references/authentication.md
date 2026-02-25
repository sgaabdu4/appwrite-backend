# Authentication Patterns

## Contents

- MFA/2FA
- SSR Authentication
- User Labels
- JWT for Functions
- Security Settings
- Email/Password Auth
- Related

## MFA/2FA

### List Available Factors

```dart
final factors = await account.listMfaFactors();
// Returns: totp, email, phone, recoveryCode
```

### TOTP Setup

```dart
// Create TOTP authenticator
final totp = await account.createMfaAuthenticator(type: 'totp');
// totp.secret - Base32 secret for authenticator app
// totp.uri - OTP auth URI for QR code

// Verify TOTP to activate
await account.updateMfaAuthenticator(type: 'totp', otp: '123456');
```

### MFA Challenge Flow

```dart
try {
    await account.createEmailPasswordSession(email: email, password: password);
} on AppwriteException catch (e) {
    if (e.type == 'user_more_factors_required') {
        final challenge = await account.createMfaChallenge(factor: 'totp');
        await account.updateMfaChallenge(
            challengeId: challenge.$id, otp: userEnteredCode);
    }
}
```

### Recovery Codes

```dart
final codes = await account.createMfaRecoveryCodes();
// Store securely — one-time use

// Regenerate (invalidates previous)
final newCodes = await account.updateMfaRecoveryCodes();
```

---

## SSR Authentication

Server-side session handling for Next.js, SvelteKit, Nuxt, etc.

### Create Session Server-Side

```typescript
export async function POST({ request }) {
    const { email, password } = await request.json();
    
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('PROJECT_ID');
    
    const account = new Account(client);
    const session = await account.createEmailPasswordSession({ email, password });
    
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            'Set-Cookie': `session=${session.secret}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
    });
}
```

### Verify Session Server-Side

```typescript
export async function GET({ cookies }) {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('PROJECT_ID')
        .setSession(cookies.get('session'));
    
    const account = new Account(client);
    
    try {
        const user = await account.get();
        return { user };
    } catch {
        return { user: null };
    }
}
```

---

## User Labels

Labels enable role-based permissions. Server SDK only.

```dart
await users.updateLabels(userId: 'user_123', labels: ['premium', 'beta-tester']);

// Use in permissions
Permission.read(Role.label('premium'))
Permission.update(Role.label('admin'))
```

---

## JWT for Functions

Create JWT for server-side user context.

```dart
final jwt = await users.createJWT(userId: 'user_123');

final client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('PROJECT_ID')
    .setJWT(jwt.jwt);
```

---

## Security Settings

Console → Auth → Security:

| Setting | Description |
|---------|-------------|
| Password dictionary | Block common passwords |
| Password history | Prevent password reuse |
| Personal data | Block name/email in password |
| Session limits | Max sessions per user |
| Session length | Default session duration |

---

## Email/Password Auth

```dart
// Create account
await account.create(userId: ID.unique(), email: 'user@example.com', password: 'password');

// Create session
await account.createEmailPasswordSession(email: 'user@example.com', password: 'password');
```

---

## Related

- [auth-methods.md](auth-methods.md) — OAuth, magic link, OTP, anonymous, phone, custom token, session management
- Teams for group permissions
- Permissions for access control
