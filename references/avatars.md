# Avatars

## Contents

- Website Screenshots
- Initials Avatars
- Flags
- Credit Card Icons
- Browser Icons
- Favicon Fetch
- QR Codes
- Image Avatars
- Performance Tips
- Related

## Website Screenshots

Capture screenshots of any URL.

```dart
// Dart
final screenshot = avatars.getScreenshot(
    url: 'https://example.com',
    width: 1280,
    height: 720,
);
```

```python
# Python
screenshot = avatars.get_screenshot(
    url='https://example.com',
    width=1280,
    height=720,
)
```

```typescript
// TypeScript
const screenshot = await avatars.getScreenshot({
    url: 'https://example.com',
    width: 1280,
    height: 720,
});
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `url` | Target URL (required) | - |
| `width` | Screenshot width | 1920 |
| `height` | Screenshot height | 1080 |

### Use Cases

- Link previews
- OG image generation
- Competitor monitoring
- Documentation

---

## Initials Avatars

Generate avatars from user names.

```dart
// Dart
final avatar = avatars.getInitials(
    name: 'John Doe',
    width: 100,
    height: 100,
    background: 'ff5733',
);
```

```python
# Python
avatar = avatars.get_initials(
    name='John Doe',
    width=100,
    height=100,
    background='ff5733',
)
```

```typescript
// TypeScript
const avatar = await avatars.getInitials({
    name: 'John Doe',
    width: 100,
    height: 100,
    background: 'ff5733',
});
```

---

## Flags

Country flag images by ISO code.

```dart
// Dart - US flag
final flag = avatars.getFlag(code: 'us', width: 100);
```

---

## Credit Card Icons

```dart
// Dart - Visa icon
final icon = avatars.getCreditCard(code: 'visa', width: 100);
```

Supported codes: `visa`, `mastercard`, `amex`, `discover`, `jcb`, `unionpay`, `diners`

---

## Browser Icons

```dart
// Dart
final icon = avatars.getBrowser(code: 'chrome', width: 50);
```

Supported: `chrome`, `firefox`, `safari`, `edge`, `opera`, `brave`

---

## Favicon Fetch

Get favicon from any domain.

```dart
// Dart
final favicon = avatars.getFavicon(url: 'https://github.com');
```

---

## QR Codes

Generate QR codes from text or URLs.

```dart
// Dart
final qr = avatars.getQR(
    text: 'https://example.com/link',
    size: 300,
    margin: 2,
);
```

```python
# Python
qr = avatars.get_qr(
    text='https://example.com/link',
    size=300,
    margin=2,
)
```

```typescript
// TypeScript
const qr = await avatars.getQR({
    text: 'https://example.com/link',
    size: 300,
    margin: 2,
});
```

---

## Image Avatars

Generate placeholder images.

```dart
// Dart - Placeholder
final image = avatars.getImage(
    url: 'https://picsum.photos/200',
    width: 200,
    height: 200,
);
```

---

## Performance Tips

1. **Cache avatars** - URLs are deterministic
2. **Use CDN** - Serve from edge
3. **Size appropriately** - Match output dimensions to display size
4. **Batch with SSR** - Pre-generate for SSR pages

---

## Related

- Storage for custom avatars
- Functions for custom generation
