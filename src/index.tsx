import { type JSX, useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import type { Locale } from 'antd/lib/locale';
import de_DE from 'antd/locale/de_DE';
import en_GB from 'antd/locale/en_GB';
import { App } from './App';
import routePathNames from './appConfig';
import { queryClient } from './constants/client';
import { Login } from './pages/Login/Login';
import { Error404 } from './pages/Error404';
import { ProtectedRoute } from './router/ProtectedRoute';
import './i18n';
import { Imprint } from './pages/Imprint';
import { Privacy } from './pages/Privacy';
import { useAppConfigContext, UseAppConfigProvider } from './context/useAppConfig';
import { apiServerSettings } from './api/settings/apiServerSettings';
import { Initialization } from './components/Layout/Initialization';
import { AccessDenied } from './pages/ErrorPages/AccessDenied';

interface LangMap {
    [key: string]: Locale;
}

const myLanguages: LangMap = {
    'de-DE': de_DE,
    'en-GB': en_GB,
};

const appConfig = {
    locales: 'de-DE',
};

const languageToUse = (appConfig && appConfig.locales) || 'de-DE';

/**
 * ant design message config
 * @see {@link https://ant.design/components/message/#API}
 */
message.config({
    duration: 3,
    maxCount: 3,
    top: 100,
});

const AppSettingsWrapper = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [loaded, setLoaded] = useState(false);

    const { settings, setServerSettings } = useAppConfigContext();
    useEffect(() => {
        if (settings.useApiClusterSettings) {
            apiServerSettings()
                .then(setServerSettings)
                .finally(() => setLoaded(true));
        } else {
            setLoaded(true);
        }
    }, []);

    return loaded ? children : <Initialization />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}
createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
        <UseAppConfigProvider>
            <AppSettingsWrapper>
                <ConfigProvider
                    locale={myLanguages[languageToUse]}
                    theme={{
                        token: {
                            colorPrimary: '#273270',
                            colorLink: '#273270',
                            borderRadius: 4,
                            controlHeight: 40,
                            fontFamily:
                                "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
                        },
                        components: {
                            Layout: {
                                bodyBg: '#f2efea',
                                headerBg: '#ffffff',
                                headerHeight: 60,
                                footerBg: '#ece7df',
                            },
                            Input: {
                                colorBorder: 'rgba(0, 0, 0, 0.6)',
                                colorBgContainer: 'transparent',
                            },
                            Form: {
                                labelColor: 'rgba(0, 0, 0, 0.6)',
                                labelFontSize: 12,
                            },
                            Table: {
                                colorBgContainer: '#f2efea',
                                headerBg: '#f2efea',
                            },
                        },
                    }}
                >
                    <Router>
                        <Routes>
                            <Route path={routePathNames.login} element={<Login />} />
                            <Route path="/admin/404" element={<Error404 />} />
                            <Route path="/admin/access-denied" element={<AccessDenied />} />

                            <Route path={routePathNames.imprint} element={<Imprint />} />
                            <Route path={routePathNames.privacy} element={<Privacy />} />

                            {/* put protected routes at the end to act as a wildcard route fetcher */}
                            <Route
                                path="*"
                                element={
                                    <ProtectedRoute>
                                        <App />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </ConfigProvider>
            </AppSettingsWrapper>
        </UseAppConfigProvider>
    </QueryClientProvider>,
);
