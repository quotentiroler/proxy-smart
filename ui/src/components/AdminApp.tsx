import { SmartAppsManager } from './SmartAppsManager/SmartAppsManager';
import { FhirServersManager } from './FhirServersManager/FhirServersManager';
import { ScopeManager } from './ScopeManager';
import { LaunchContextManager } from './LaunchContextManager';
import { SmartProxyOverview } from './SmartProxyOverview';
import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { HealthcareUsersManager } from './HealthcareUsersManager/HealthcareUsersManager';
import { useAuth } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import { LoginForm } from './LoginForm';
import { cn } from '../lib/utils';
import { AlertDialogs } from './AlertDialogs';
import { AIChatOverlay } from './AIChatOverlay';
import {
    AppShell,
    Panel,
    Loading
} from '@medplum/react';
import {
    Stethoscope
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OAuthMonitoringDashboard } from './OAuthMonitoringDashboard';
import { IdPManager } from './IdPManager/IdPManager';

// Valid tab routes
const VALID_TABS = [
    'dashboard',
    'smart-apps',
    'users',
    'fhir-servers',
    'idp',
    'scopes',
    'launch-context',
    'oauth-monitoring'
] as const;

type ValidTab = typeof VALID_TABS[number];

// Get tab from URL hash
function getTabFromHash(): ValidTab {
    const hash = window.location.hash.slice(1); // Remove the '#'
    return VALID_TABS.includes(hash as ValidTab) ? (hash as ValidTab) : 'dashboard';
}

// Set tab in URL hash
function setTabInHash(tab: string) {
    window.location.hash = tab;
}

export function AdminApp() {
    const [currentView, setCurrentView] = useState<string>(() => getTabFromHash());
    const { isAuthenticated, loading, profile, clientApis } = useAuth();
    const { activeTab, setActiveTab, isAIAssistantEnabled, setIsAIAssistantEnabled } = useAppStore();
    const { t } = useTranslation();

    // Check AI Assistant status
    useEffect(() => {
        const checkAIAssistantStatus = async () => {
            // Only check if authenticated, not loading, has profile, and has clientApis
            if (!isAuthenticated || loading || !profile || !clientApis) {
                return;
            }
            
            try {
                const apps = await clientApis.smartApps.getAdminSmartApps();
                const aiAssistant = apps.find(app => app.clientId === 'ai-assistant-agent');
                setIsAIAssistantEnabled(aiAssistant?.enabled ?? false);
            } catch (error) {
                console.error('Failed to check AI Assistant status:', error);
                // Default to false if we can't fetch the status
                setIsAIAssistantEnabled(false);
            }
        };

        checkAIAssistantStatus();
    }, [isAuthenticated, loading, profile, clientApis, setIsAIAssistantEnabled]);

    // Sync with URL hash on mount and when hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const tabFromHash = getTabFromHash();
            setCurrentView(tabFromHash);
            setActiveTab(tabFromHash);
        };

        // Set initial tab from hash
        handleHashChange();

        // Listen for hash changes (back/forward navigation)
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [setActiveTab]);

    // Use activeTab from store or fallback to currentView for navigation
    const currentTab = activeTab || currentView;
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentView(tab);
        setTabInHash(tab); // Update URL hash
    };

    // Show loading state while fetching profile
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Panel className="max-w-md mx-auto">
                    <div className="text-center p-8">
                        <Loading />
                        <h2 className="mt-4 text-lg font-semibold text-foreground">
                            {t('Loading Admin Panel...')}
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            {t('Please wait while we initialize your workspace.')}
                        </p>
                    </div>
                </Panel>
            </div>
        );
    }

    // Show login form if not authenticated or no profile
    if (!isAuthenticated || !profile) {
        return <LoginForm />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background [&_.mantine-AppShell-main]:!pt-2 md:[&_.mantine-AppShell-main]:!pt-4">
            <Navigation 
                activeTab={currentTab} 
                onTabChange={handleTabChange} 
                profile={profile} 
            />
            <AppShell
                logo={
                    <div className="flex items-center space-x-3 animate-fade-in">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-2xl border border-primary/20">
                            <Stethoscope className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div>
                            <span className="font-bold text-xl text-foreground tracking-tight">
                                {t('Healthcare Administration')}
                            </span>
                            <div className="text-xs text-muted-foreground font-medium tracking-wide">
                                {t('Proxy Smart')}
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="w-full lg:w-[90%] max-w-none mx-auto">
                        <Panel className={cn("min-h-[600px] shadow-2xl border-0 bg-background backdrop-blur-sm rounded-3xl overflow-hidden border border-border/20 animate-fade-in w-full max-w-none", "max-w-none w-full")}>
                            {currentTab === 'dashboard' && <SmartProxyOverview onNavigate={handleTabChange} />}
                            {currentTab === 'smart-apps' && <SmartAppsManager />}
                            {currentTab === 'users' && <HealthcareUsersManager />}
                            {currentTab === 'fhir-servers' && <FhirServersManager />}
                            {currentTab === 'idp' && <IdPManager />}
                            {currentTab === 'scopes' && <ScopeManager />}
                            {currentTab === 'launch-context' && <LaunchContextManager />}
                            {currentTab === 'oauth-monitoring' && <OAuthMonitoringDashboard />}
                        </Panel>
                    </div>
                </div>
            </AppShell>

            {/* Alert Dialogs */}
            <AlertDialogs />

            {/* AI Chat Overlay - only show if AI Assistant is enabled */}
            {isAIAssistantEnabled && <AIChatOverlay />}
        </div>
    );
}
