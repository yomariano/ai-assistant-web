# Stripe Test Payment Cards

Use these card details when testing payments in Stripe test mode.

## Successful Payment Cards

| Card Type | Number | CVC | Expiry |
|-----------|--------|-----|--------|
| Visa | `4242 4242 4242 4242` | Any 3 digits | Any future date |
| Mastercard | `5555 5555 5555 4444` | Any 3 digits | Any future date |
| American Express | `3782 822463 10005` | Any 4 digits | Any future date |

## Declined Payment Cards

| Scenario | Number |
|----------|--------|
| Generic decline | `4000 0000 0000 0002` |
| Insufficient funds | `4000 0000 0000 9995` |
| Lost card | `4000 0000 0000 9987` |
| Expired card | `4000 0000 0000 0069` |
| Incorrect CVC | `4000 0000 0000 0127` |

## 3D Secure Test Cards

| Scenario | Number |
|----------|--------|
| 3D Secure required | `4000 0025 0000 3155` |
| 3D Secure optional | `4000 0000 0000 3220` |

## Other Test Details

- **Expiry Date**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`) or 4 digits for Amex
- **ZIP/Postal Code**: Any 5 digits (e.g., `12345`)
- **Name**: Any name
- **Email**: Any valid email format

## Quick Test

For a quick successful test payment, use:
```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
```

## Documentation

For more test cards and scenarios, see: https://docs.stripe.com/testing
