# Authentication Patterns

## Contents

- MFA/2FA
- SSR Authentication
- SSR Hardening
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

Server-side session for Next.js, SvelteKit, Nuxt, etc.

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

## SSR Hardening

Use exact cookie name: `a_session_<PROJECT_ID>`. Generic `session` cookie breaks Appwrite SSR patterns.

Use admin client to create session or call privileged APIs. Use per-request session client to read user-scoped data.

Forward browser user agent on session client for debug + security context.

```dart
final adminClient = Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('PROJECT_ID')
    .setKey('API_KEY');

final session = request.cookies['a_session_[PROJECT_ID]'];
final sessionClient = Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('PROJECT_ID');

if (session != null) {
    sessionClient.setSession(session);
    sessionClient.setForwardedUserAgent(request.headers['user-agent']);
}
```

```python
admin_client = Client().set_endpoint('https://cloud.appwrite.io/v1').set_project('PROJECT_ID').set_key('API_KEY')

session = request.cookies.get('a_session_[PROJECT_ID]')
session_client = Client().set_endpoint('https://cloud.appwrite.io/v1').set_project('PROJECT_ID')

if session:
    session_client.set_session(session)
    session_client.set_forwarded_user_agent(request.headers.get('user-agent'))
```

```typescript
const adminClient = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('PROJECT_ID')
    .setKey('API_KEY');

const session = req.cookies['a_session_[PROJECT_ID]'];
const sessionClient = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('PROJECT_ID');

if (session) {
    sessionClient.setSession(session);
    sessionClient.setForwardedUserAgent(req.headers['user-agent']);
}
```

---

## User Labels

Role-based permissions. Server SDK only.

```dart
await users.updateLabels(userId: 'user_123', labels: ['premium', 'beta-tester']);

// Use in permissions
Permission.read(Role.label('premium'))
Permission.update(Role.label('admin'))
```

---

## JWT for Functions

JWT for server-side user context.

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

- [auth-methods.md](auth-methods.md) — OAuth, magic link, OTP, anonymous, phone, custom token, session mgmt
- Teams for group permissions
- Permissions for access control