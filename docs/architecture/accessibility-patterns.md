# Accessibility Patterns

This guide outlines accessibility patterns and best practices used in the GestMarine application.

## Semantic HTML

### 1. Page Structure

```typescript
// components/layout/Page/Page.tsx
export const Page: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => {
  return (
    <main role="main" aria-labelledby="page-title">
      <h1 id="page-title" className="sr-only">
        {title}
      </h1>
      {children}
    </main>
  );
};
```

### 2. Navigation

```typescript
// components/navigation/MainNav.tsx
export const MainNav: React.FC = () => {
  return (
    <nav aria-label="Main navigation">
      <ul role="menubar">
        {menuItems.map(item => (
          <li key={item.path} role="none">
            <Link
              to={item.path}
              role="menuitem"
              aria-current={isCurrentPath(item.path) ? 'page' : undefined}
            >
              {item.icon && (
                <span className="icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

## Keyboard Navigation

### 1. Focus Management

```typescript
// hooks/accessibility/useFocusTrap.ts
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
};
```

### 2. Skip Links

```typescript
// components/accessibility/SkipLinks.tsx
export const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#main-navigation" className="skip-link">
        Skip to main navigation
      </a>
    </div>
  );
};
```

## ARIA Attributes

### 1. Form Fields

```typescript
// components/form/FormField.tsx
interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  required,
  children
}) => {
  const fieldId = `field-${id}`;
  const errorId = `error-${id}`;

  return (
    <div role="group" aria-labelledby={fieldId}>
      <label id={fieldId} htmlFor={id}>
        {label}
        {required && (
          <span className="required" aria-label="required">
            *
          </span>
        )}
      </label>
      {React.cloneElement(children, {
        id,
        'aria-required': required,
        'aria-invalid': !!error,
        'aria-errormessage': error ? errorId : undefined
      })}
      {error && (
        <div id={errorId} className="error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

### 2. Loading States

```typescript
// components/feedback/LoadingState.tsx
export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading...'
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="loading-state"
    >
      <CircularProgress aria-hidden="true" />
      <span className="sr-only">{message}</span>
    </div>
  );
};
```

## Screen Reader Support

### 1. Announcements

```typescript
// hooks/accessibility/useAnnouncement.ts
export const useAnnouncement = () => {
  const [message, setMessage] = useState('');

  const announce = (newMessage: string, priority: 'polite' | 'assertive' = 'polite') => {
    setMessage(''); // Reset to trigger re-render
    setTimeout(() => setMessage(newMessage), 100);

    return (
      <div
        role="status"
        aria-live={priority}
        className="sr-only"
      >
        {message}
      </div>
    );
  };

  return { announce };
};
```

### 2. Hidden Content

```typescript
// components/accessibility/ScreenReaderOnly.tsx
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  as: Component = 'span'
}) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};
```

## Best Practices

1. **Semantic HTML**
   - Use proper heading hierarchy
   - Implement landmark regions
   - Use semantic elements
   - Add descriptive labels

2. **Keyboard Navigation**
   - Ensure focusable elements
   - Implement focus traps
   - Add skip links
   - Handle keyboard events

3. **ARIA Support**
   - Use proper ARIA roles
   - Add descriptive labels
   - Handle dynamic content
   - Implement live regions

4. **Screen Readers**
   - Provide text alternatives
   - Handle announcements
   - Hide decorative elements
   - Test with screen readers

Remember to:
- Follow WCAG guidelines
- Test with assistive technologies
- Maintain keyboard navigation
- Provide clear feedback
- Document accessibility features
