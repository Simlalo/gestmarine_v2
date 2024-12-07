# Security Best Practices

This guide outlines security patterns and best practices implemented in the GestMarine application.

## Authentication

### 1. Token Management

```typescript
// utils/auth/tokenManager.ts
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static setTokens(accessToken: string, refreshToken: string): void {
    // Store tokens securely
    sessionStorage.setItem(this.TOKEN_KEY, accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static getAccessToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const decoded = jwt_decode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
```

### 2. Protected Routes

```typescript
// components/auth/ProtectedRoute.tsx
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRoles?: string[];
}> = ({ children, requiredRoles }) => {
  const { isAuthenticated, userRoles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
      navigate('/unauthorized', { replace: true });
    }
  }, [isAuthenticated, userRoles, requiredRoles]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};
```

## API Security

### 1. Axios Interceptors

```typescript
// utils/api/interceptors.ts
export const setupAxiosInterceptors = (axios: AxiosInstance) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = TokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const newToken = await refreshAccessToken();
          TokenManager.setTokens(newToken.accessToken, newToken.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
          return axios(originalRequest);
        } catch {
          TokenManager.clearTokens();
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};
```

### 2. Input Sanitization

```typescript
// utils/security/sanitization.ts
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};

// Usage in forms
const FormField: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    onChange(sanitizedValue);
  };

  return <input value={value} onChange={handleChange} />;
};
```

## XSS Prevention

### 1. Content Security Policy

```typescript
// public/index.html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.gestmarine.com;
">
```

### 2. Safe HTML Rendering

```typescript
// components/common/SafeHTML.tsx
const SafeHTML: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = useMemo(() => ({
    __html: DOMPurify.sanitize(content)
  }), [content]);

  return <div dangerouslySetInnerHTML={sanitizedContent} />;
};
```

## CSRF Protection

```typescript
// utils/security/csrf.ts
export const setupCSRFProtection = () => {
  const token = generateCSRFToken();
  
  // Add token to all forms
  document.querySelectorAll('form').forEach(form => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_csrf';
    input.value = token;
    form.appendChild(input);
  });
  
  // Add meta tag for JavaScript usage
  const meta = document.createElement('meta');
  meta.name = 'csrf-token';
  meta.content = token;
  document.head.appendChild(meta);
};
```

## Secure Data Storage

### 1. Sensitive Data Handling

```typescript
// utils/security/storage.ts
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

  static setItem(key: string, value: any): void {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      this.ENCRYPTION_KEY
    ).toString();
    
    sessionStorage.setItem(key, encrypted);
  }

  static getItem<T>(key: string): T | null {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        this.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }
}
```

### 2. Password Handling

```typescript
// components/auth/PasswordField.tsx
const PasswordField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl>
      <InputLabel>Password</InputLabel>
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
```

## Error Handling

```typescript
// utils/security/errorHandling.ts
export const handleError = (error: unknown): void => {
  // Log error without sensitive information
  const sanitizedError = {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
    url: window.location.pathname
  };

  // Log to monitoring service
  logError(sanitizedError);

  // Show user-friendly message
  showErrorNotification(
    'An error occurred. Please try again later.'
  );
};
```

## Best Practices

1. **Authentication**
   - Use secure token storage
   - Implement token refresh
   - Enforce strong passwords
   - Use secure session management

2. **Data Protection**
   - Sanitize all user inputs
   - Encrypt sensitive data
   - Use HTTPS only
   - Implement proper CORS policies

3. **API Security**
   - Use authentication tokens
   - Implement rate limiting
   - Validate request parameters
   - Use proper error handling

4. **XSS Prevention**
   - Sanitize HTML content
   - Use Content Security Policy
   - Escape user-generated content
   - Avoid innerHTML when possible

5. **CSRF Protection**
   - Use CSRF tokens
   - Validate origin
   - Implement SameSite cookies
   - Use proper headers

Remember to:
- Regularly update dependencies
- Conduct security audits
- Follow security best practices
- Monitor for vulnerabilities
- Implement proper logging
