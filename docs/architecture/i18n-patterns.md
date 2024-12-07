# Internationalization (i18n) Patterns

This guide outlines internationalization patterns and best practices used in the GestMarine application.

## Translation Setup

### 1. i18n Configuration

```typescript
// i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
```

### 2. Translation Loading

```typescript
// i18n/loader.ts
export const loadTranslations = async (lang: string) => {
  const modules = {
    common: await import(`./locales/${lang}/common.json`),
    validation: await import(`./locales/${lang}/validation.json`),
    barques: await import(`./locales/${lang}/barques.json`),
    gerants: await import(`./locales/${lang}/gerants.json`)
  };

  Object.entries(modules).forEach(([namespace, translations]) => {
    i18n.addResourceBundle(lang, namespace, translations.default, true, true);
  });
};
```

## Translation Components

### 1. Language Switcher

```typescript
// components/i18n/LanguageSwitcher.tsx
export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label={t('common:selectLanguage')}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => handleLanguageChange('fr')}
          selected={i18n.language === 'fr'}
        >
          Français
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          selected={i18n.language === 'en'}
        >
          English
        </MenuItem>
      </Menu>
    </>
  );
};
```

### 2. Translated Text

```typescript
// components/i18n/Text.tsx
interface TextProps {
  i18nKey: string;
  values?: Record<string, any>;
  components?: Record<string, React.ReactNode>;
}

export const Text: React.FC<TextProps> = ({
  i18nKey,
  values,
  components
}) => {
  const { t } = useTranslation();

  return (
    <Trans
      i18nKey={i18nKey}
      values={values}
      components={components}
    >
      {t(i18nKey, values)}
    </Trans>
  );
};
```

## Formatting Utilities

### 1. Date Formatting

```typescript
// utils/i18n/formatters.ts
import { format, formatRelative } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const locales = {
  fr,
  en: enUS
};

export const i18nFormatters = {
  formatDate: (date: Date | string, formatStr = 'PP') => {
    const { i18n } = useTranslation();
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    return format(parsedDate, formatStr, {
      locale: locales[i18n.language as keyof typeof locales]
    });
  },

  formatRelativeDate: (date: Date | string) => {
    const { i18n } = useTranslation();
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    return formatRelative(parsedDate, new Date(), {
      locale: locales[i18n.language as keyof typeof locales]
    });
  }
};
```

### 2. Number Formatting

```typescript
// utils/i18n/numbers.ts
export const i18nNumbers = {
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => {
    const { i18n } = useTranslation();
    
    return new Intl.NumberFormat(i18n.language, options).format(value);
  },

  formatCurrency: (value: number, currency = 'EUR') => {
    const { i18n } = useTranslation();
    
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency
    }).format(value);
  },

  formatPercentage: (value: number, decimals = 1) => {
    const { i18n } = useTranslation();
    
    return new Intl.NumberFormat(i18n.language, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  }
};
```

## Translation Hooks

### 1. Form Translation

```typescript
// hooks/i18n/useFormTranslation.ts
export const useFormTranslation = (formName: string) => {
  const { t } = useTranslation();

  return {
    getFieldLabel: (fieldName: string) => 
      t(`${formName}.fields.${fieldName}.label`),
    
    getFieldPlaceholder: (fieldName: string) =>
      t(`${formName}.fields.${fieldName}.placeholder`),
    
    getFieldError: (fieldName: string, error: string) =>
      t(`validation:${error}`, {
        field: t(`${formName}.fields.${fieldName}.label`).toLowerCase()
      }),
    
    getSubmitLabel: () => t(`${formName}.submit`),
    
    getCancelLabel: () => t(`${formName}.cancel`)
  };
};
```

### 2. Dynamic Translation

```typescript
// hooks/i18n/useDynamicTranslation.ts
export const useDynamicTranslation = () => {
  const { t, i18n } = useTranslation();

  const translateWithFallback = (
    key: string,
    fallback: string,
    options?: any
  ) => {
    const translation = t(key, options);
    return translation === key ? fallback : translation;
  };

  const translateEnum = (
    enumValue: string,
    enumNamespace: string
  ) => {
    return t(`enums:${enumNamespace}.${enumValue}`);
  };

  return {
    translateWithFallback,
    translateEnum
  };
};
```

## Best Practices

1. **Translation Management**
   - Organize translations by feature
   - Use namespaces effectively
   - Handle pluralization
   - Support RTL languages

2. **Component Design**
   - Create reusable components
   - Handle dynamic content
   - Support nested translations
   - Handle loading states

3. **Formatting**
   - Use locale-aware formatters
   - Handle different formats
   - Support custom formats
   - Handle edge cases

4. **Performance**
   - Implement lazy loading
   - Cache translations
   - Optimize bundles
   - Handle fallbacks

Remember to:
- Follow i18n best practices
- Test with different locales
- Handle loading states
- Document translations
- Support RTL languages
