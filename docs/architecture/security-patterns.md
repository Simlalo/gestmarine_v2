# Security Patterns

This guide outlines security patterns and best practices used in the GestMarine application.

## Authentication

### 1. Token Management

```typescript
// services/auth/TokenManager.ts
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  public getToken(): string | null {
    return localStorage.getItem(TokenManager.TOKEN_KEY);
  }

  public setToken(token: string): void {
    localStorage.setItem(TokenManager.TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(TokenManager.REFRESH_TOKEN_KEY);
  }

  public setRefreshToken(token: string): void {
    localStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, token);
  }

  public clearTokens(): void {
    localStorage.removeItem(TokenManager.TOKEN_KEY);
    localStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp! * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
```

### 2. Authentication Context

```typescript
// contexts/AuthContext.tsx
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const tokenManager = new TokenManager();
  const authService = new AuthService();

  const login = async (credentials: LoginCredentials) => {
    const { token, refreshToken, user } = await authService.login(credentials);
    tokenManager.setToken(token);
    tokenManager.setRefreshToken(refreshToken);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    tokenManager.clearTokens();
    setUser(null);
  };

  const refreshToken = async () => {
    const currentRefreshToken = tokenManager.getRefreshToken();
    if (!currentRefreshToken) throw new Error('No refresh token');

    const { token, refreshToken } = await authService.refreshToken(
      currentRefreshToken
    );
    tokenManager.setToken(token);
    tokenManager.setRefreshToken(refreshToken);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: tokenManager.isAuthenticated(),
        user,
        login,
        logout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

## API Security

### 1. API Client Interceptors

```typescript
// api/interceptors/security.ts
export class SecurityInterceptor {
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = new TokenManager();
  }

  public request(config: RequestConfig): RequestConfig {
    // Add CSRF token
    const csrfToken = document.querySelector<HTMLMetaElement>(
      'meta[name="csrf-token"]'
    )?.content;

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add authentication token
    const token = this.tokenManager.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }

  public response(response: Response): Response {
    // Validate content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      throw new Error('Invalid content type');
    }

    return response;
  }
}
```

### 2. Input Sanitization

```typescript
// utils/security/sanitizers.ts
import DOMPurify from 'dompurify';

export const securityUtils = {
  sanitizeHTML: (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href']
    });
  },

  sanitizeObject: <T extends object>(obj: T): T => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        return {
          ...acc,
          [key]: DOMPurify.sanitize(value)
        };
      }
      if (typeof value === 'object' && value !== null) {
        return {
          ...acc,
          [key]: securityUtils.sanitizeObject(value)
        };
      }
      return {
        ...acc,
        [key]: value
      };
    }, {} as T);
  },

  escapeRegExp: (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
};
```

## Data Protection

### 1. Secure Storage

```typescript
// utils/security/storage.ts
import { AES, enc } from 'crypto-js';

export class SecureStorage {
  private encryptionKey: string;

  constructor(key: string) {
    this.encryptionKey = key;
  }

  public setItem(key: string, value: any): void {
    const encrypted = AES.encrypt(
      JSON.stringify(value),
      this.encryptionKey
    ).toString();
    localStorage.setItem(key, encrypted);
  }

  public getItem<T>(key: string): T | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = AES.decrypt(encrypted, this.encryptionKey).toString(
        enc.Utf8
      );
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
```

### 2. Data Masking

```typescript
// utils/security/masking.ts
export const maskingUtils = {
  maskEmail: (email: string): string => {
    const [username, domain] = email.split('@');
    const maskedUsername =
      username.charAt(0) +
      '*'.repeat(username.length - 2) +
      username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  },

  maskPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return '*'.repeat(cleaned.length - 4) + last4;
  },

  maskCreditCard: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return '*'.repeat(cleaned.length - 4) + last4;
  }
};
```

## CSRF Protection

### 1. CSRF Token Management

```typescript
// utils/security/csrf.ts
export class CSRFManager {
  private static readonly TOKEN_HEADER = 'X-CSRF-Token';
  private static readonly META_TAG_NAME = 'csrf-token';

  public static getToken(): string | null {
    const metaTag = document.querySelector<HTMLMetaElement>(
      `meta[name="${CSRFManager.META_TAG_NAME}"]`
    );
    return metaTag?.content || null;
  }

  public static setToken(token: string): void {
    let metaTag = document.querySelector<HTMLMetaElement>(
      `meta[name="${CSRFManager.META_TAG_NAME}"]`
    );

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = CSRFManager.META_TAG_NAME;
      document.head.appendChild(metaTag);
    }

    metaTag.content = token;
  }

  public static getHeaderName(): string {
    return CSRFManager.TOKEN_HEADER;
  }
}
```

## Best Practices

1. **Authentication**
   - Use secure token storage
   - Implement token refresh
   - Handle session expiry
   - Validate tokens

2. **API Security**
   - Use HTTPS
   - Implement CSRF protection
   - Validate content types
   - Sanitize inputs

3. **Data Protection**
   - Encrypt sensitive data
   - Implement data masking
   - Use secure storage
   - Handle data securely

4. **Error Handling**
   - Don't expose sensitive info
   - Log security events
   - Handle errors gracefully
   - Implement rate limiting

Remember to:
- Follow security best practices
- Keep dependencies updated
- Implement proper validation
- Use secure communication
- Handle sensitive data carefully
