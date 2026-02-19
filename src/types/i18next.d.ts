import 'react-i18next';

/**
 * Override TFunction in react-i18next to always return string.
 * In i18next v21, TFunction can return TFunctionResult (including 'object'),
 * which is incompatible with React 18's stricter ReactNode type.
 */
declare module 'react-i18next' {
    interface TFunction {
        (key: string | TemplateStringsArray, defaultValueOrOptions?: string | Record<string, unknown>): string;
    }
}
