import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../stores/authStore';
import { useTranslation } from 'react-i18next';
import {
    Server,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Clock,
    Wrench,
    XCircle,
    Zap,
    Plus,
    Edit,
    Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type {
    GetAdminMcpServers200ResponseServersInner,
    GetAdminMcpServersByNameHealth200Response,
    GetAdminMcpServersByNameTools200ResponseToolsInner
} from '../lib/api-client';

export function McpServersManager() {
    const { clientApis } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [servers, setServers] = useState<GetAdminMcpServers200ResponseServersInner[]>([]);
    const [expandedServer, setExpandedServer] = useState<string | null>(null);
    const [serverTools, setServerTools] = useState<Record<string, GetAdminMcpServersByNameTools200ResponseToolsInner[]>>({});
    const [serverHealth, setServerHealth] = useState<Record<string, GetAdminMcpServersByNameHealth200Response>>({});
    
    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedServer, setSelectedServer] = useState<GetAdminMcpServers200ResponseServersInner | null>(null);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchServers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await clientApis.mcpManagement.getAdminMcpServers();
            setServers(response.servers || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load MCP servers');
            console.error('Failed to fetch MCP servers:', err);
        } finally {
            setLoading(false);
        }
    }, [clientApis]);

    const fetchServerTools = async (serverName: string) => {
        try {
            const response = await clientApis.mcpManagement.getAdminMcpServersByNameTools({ name: serverName });
            setServerTools(prev => ({
                ...prev,
                [serverName]: response.tools || []
            }));
        } catch (err) {
            console.error(`Failed to fetch tools for ${serverName}:`, err);
        }
    };

    const fetchServerHealth = async (serverName: string) => {
        try {
            const response = await clientApis.mcpManagement.getAdminMcpServersByNameHealth({ name: serverName });
            setServerHealth(prev => ({
                ...prev,
                [serverName]: response
            }));
        } catch (err) {
            console.error(`Failed to fetch health for ${serverName}:`, err);
        }
    };

    const handleRefresh = async () => {
        try {
            await clientApis.mcpManagement.postAdminMcpServersRefresh();
            await fetchServers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh servers');
            console.error('Failed to refresh MCP servers:', err);
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
            errors.name = t('Server name is required');
        } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
            errors.name = t('Server name must contain only lowercase letters, numbers, and hyphens');
        }
        
        if (!formData.url.trim()) {
            errors.url = t('Server URL is required');
        } else {
            try {
                new URL(formData.url);
            } catch {
                errors.url = t('Invalid URL format');
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddServer = async () => {
        if (!validateForm()) return;
        
        setSubmitting(true);
        try {
            await clientApis.mcpManagement.postAdminMcpServers({
                postAdminMcpServersRequest: {
                    name: formData.name,
                    url: formData.url,
                    description: formData.description || undefined
                }
            });
            setShowAddDialog(false);
            setFormData({ name: '', url: '', description: '' });
            await fetchServers();
        } catch (err) {
            setFormErrors({ submit: err instanceof Error ? err.message : 'Failed to add server' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditServer = async () => {
        if (!selectedServer) return;
        if (!validateForm()) return;
        
        setSubmitting(true);
        try {
            await clientApis.mcpManagement.patchAdminMcpServersByName({
                name: selectedServer.name!,
                patchAdminMcpServersByNameRequest: {
                    url: formData.url,
                    description: formData.description || undefined
                }
            });
            setShowEditDialog(false);
            setSelectedServer(null);
            setFormData({ name: '', url: '', description: '' });
            await fetchServers();
        } catch (err) {
            setFormErrors({ submit: err instanceof Error ? err.message : 'Failed to update server' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteServer = async () => {
        if (!selectedServer) return;
        
        setSubmitting(true);
        try {
            await clientApis.mcpManagement.deleteAdminMcpServersByName({
                name: selectedServer.name!
            });
            setShowDeleteDialog(false);
            setSelectedServer(null);
            await fetchServers();
        } catch (err) {
            setFormErrors({ submit: err instanceof Error ? err.message : 'Failed to delete server' });
        } finally {
            setSubmitting(false);
        }
    };

    const openAddDialog = () => {
        setFormData({ name: '', url: '', description: '' });
        setFormErrors({});
        setShowAddDialog(true);
    };

    const openEditDialog = (server: GetAdminMcpServers200ResponseServersInner) => {
        setSelectedServer(server);
        setFormData({
            name: server.name || '',
            url: server.url || '',
            description: server.description || ''
        });
        setFormErrors({});
        setShowEditDialog(true);
    };

    const openDeleteDialog = (server: GetAdminMcpServers200ResponseServersInner) => {
        setSelectedServer(server);
        setFormErrors({});
        setShowDeleteDialog(true);
    };

    const toggleServerExpansion = async (serverName: string) => {
        if (expandedServer === serverName) {
            setExpandedServer(null);
        } else {
            setExpandedServer(serverName);
            // Fetch tools and health if not already fetched
            if (!serverTools[serverName]) {
                await fetchServerTools(serverName);
            }
            if (!serverHealth[serverName]) {
                await fetchServerHealth(serverName);
            }
        }
    };

    useEffect(() => {
        fetchServers();
    }, [fetchServers]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'checking':
                return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
                return 'bg-emerald-500/5 dark:bg-emerald-400/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/20 border-emerald-500/20 dark:border-emerald-400/30';
            case 'error':
                return 'bg-red-500/5 dark:bg-red-400/10 hover:bg-red-500/10 dark:hover:bg-red-400/20 border-red-500/20 dark:border-red-400/30';
            case 'checking':
                return 'bg-yellow-500/5 dark:bg-yellow-400/10 hover:bg-yellow-500/10 dark:hover:bg-yellow-400/20 border-yellow-500/20 dark:border-yellow-400/30';
            default:
                return 'bg-gray-500/5 dark:bg-gray-400/10 hover:bg-gray-500/10 dark:hover:bg-gray-400/20 border-gray-500/20 dark:border-gray-400/30';
        }
    };

    const formatTimestamp = (timestamp?: string) => {
        if (!timestamp) return 'Never';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        if (diffSecs > 0) return `${diffSecs}s ago`;
        return 'Just now';
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-background min-h-full">
            {/* Header */}
            <div className="bg-muted/50 p-4 sm:p-6 lg:p-8 rounded-3xl border border-border/50 shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 tracking-tight">
                            {t('MCP Servers')}
                        </h1>
                        <div className="text-muted-foreground flex items-center text-lg">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                                <Server className="w-5 h-5 text-primary" />
                            </div>
                            {t('Model Context Protocol Server Management')}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            onClick={openAddDialog}
                            className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-green-500/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('Add Server')}
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-500/20"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            {t('Refresh Status')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Server List */}
            <div className="bg-card/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                            <Server className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">{t('Configured Servers')}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {servers.length} {servers.length === 1 ? t('server') : t('servers')}
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Server className="w-8 h-8 text-muted-foreground animate-pulse" />
                            </div>
                            <p className="text-muted-foreground text-sm">{t('Loading MCP servers...')}</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    ) : servers.length > 0 ? (
                        servers.map((server, index) => (
                            <div key={server.name || index}>
                                <div
                                    className={`flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-200 border cursor-pointer ${getStatusColor(server.status || 'unknown')}`}
                                    onClick={() => toggleServerExpansion(server.name!)}
                                >
                                    <div className="flex items-center flex-1">
                                        {getStatusIcon(server.status || 'unknown')}
                                        <div className="flex-1 ml-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-foreground font-medium">
                                                    {server.name}
                                                </span>
                                                <span className="text-xs bg-muted/80 px-2 py-1 rounded-full font-medium text-muted-foreground">
                                                    {server.type}
                                                </span>
                                            </div>
                                            {server.description && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {server.description}
                                                </div>
                                            )}
                                            {server.url && (
                                                <div className="text-xs text-muted-foreground mt-1 font-mono">
                                                    {server.url}
                                                </div>
                                            )}
                                            {server.lastChecked && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {t('Last checked')}: {formatTimestamp(server.lastChecked)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {server.toolCount !== undefined && (
                                            <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-lg">
                                                <Wrench className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-semibold text-foreground">
                                                    {server.toolCount} {server.toolCount === 1 ? t('tool') : t('tools')}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold">
                                            {server.status === 'connected' && (
                                                <span className="text-emerald-600 dark:text-emerald-400">{t('Connected')}</span>
                                            )}
                                            {server.status === 'error' && (
                                                <span className="text-red-600 dark:text-red-400">{t('Error')}</span>
                                            )}
                                            {server.status === 'unknown' && (
                                                <span className="text-gray-600 dark:text-gray-400">{t('Unknown')}</span>
                                            )}
                                            {!server.status && (
                                                <span className="text-gray-600 dark:text-gray-400">{t('Unknown')}</span>
                                            )}
                                        </span>
                                        {server.type === 'external' && (
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditDialog(server);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteDialog(server);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedServer === server.name && (
                                    <div className="mt-2 ml-12 p-4 bg-muted/20 rounded-xl border border-border/30">
                                        {/* Health Info */}
                                        {serverHealth[server.name!] && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                                                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                                    {t('Health Status')}
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="bg-background/50 p-2 rounded">
                                                        <span className="text-muted-foreground">{t('Status')}:</span>
                                                        <span className="ml-2 font-semibold text-foreground">
                                                            {serverHealth[server.name!].status}
                                                        </span>
                                                    </div>
                                                    {serverHealth[server.name!].responseTime !== undefined && (
                                                        <div className="bg-background/50 p-2 rounded">
                                                            <span className="text-muted-foreground">{t('Response Time')}:</span>
                                                            <span className="ml-2 font-semibold text-foreground">
                                                                {serverHealth[server.name!].responseTime}ms
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tools List */}
                                        {serverTools[server.name!] && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                                                    <Wrench className="w-4 h-4 mr-2 text-primary" />
                                                    {t('Available Tools')} ({serverTools[server.name!].length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {serverTools[server.name!].map((tool, toolIndex) => (
                                                        <div key={toolIndex} className="bg-background/50 p-3 rounded-lg border border-border/20">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Zap className="w-3 h-3 text-primary" />
                                                                        <span className="text-sm font-medium text-foreground">
                                                                            {tool.name}
                                                                        </span>
                                                                    </div>
                                                                    {tool.description && (
                                                                        <p className="text-xs text-muted-foreground mt-1 ml-5">
                                                                            {tool.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Server className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">{t('No MCP Servers')}</h4>
                            <p className="text-muted-foreground text-sm">
                                {t('No MCP servers have been configured yet.')}
                            </p>
                            <p className="text-muted-foreground text-xs mt-2">
                                {t('Configure MCP servers using environment variables:')}
                            </p>
                            <div className="mt-4 bg-muted/30 p-4 rounded-lg text-left max-w-md mx-auto">
                                <code className="text-xs font-mono text-foreground">
                                    GENERATED_MCP_URL=http://localhost:8081<br />
                                    EXTERNAL_MCP_SERVERS=[{"{"}name: ..., url: ...{"}"}]
                                </code>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Server Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t('Add MCP Server')}</DialogTitle>
                        <DialogDescription>
                            {t('Add a new external MCP server to the system.')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('Server Name')}</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="my-mcp-server"
                                className={formErrors.name ? 'border-red-500' : ''}
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-600">{formErrors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="url">{t('Server URL')}</Label>
                            <Input
                                id="url"
                                value={formData.url}
                                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="http://localhost:8082"
                                className={formErrors.url ? 'border-red-500' : ''}
                            />
                            {formErrors.url && (
                                <p className="text-sm text-red-600">{formErrors.url}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">{t('Description')} ({t('optional')})</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder={t('My custom MCP server')}
                            />
                        </div>
                        {formErrors.submit && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-sm text-red-600 dark:text-red-400">{formErrors.submit}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddDialog(false)}
                            disabled={submitting}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            onClick={handleAddServer}
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {submitting ? t('Adding...') : t('Add Server')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Server Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t('Edit MCP Server')}</DialogTitle>
                        <DialogDescription>
                            {t('Update the configuration for')} {selectedServer?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('Server Name')}</Label>
                            <Input
                                value={formData.name}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">{t('Server name cannot be changed')}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-url">{t('Server URL')}</Label>
                            <Input
                                id="edit-url"
                                value={formData.url}
                                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="http://localhost:8082"
                                className={formErrors.url ? 'border-red-500' : ''}
                            />
                            {formErrors.url && (
                                <p className="text-sm text-red-600">{formErrors.url}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">{t('Description')} ({t('optional')})</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder={t('My custom MCP server')}
                            />
                        </div>
                        {formErrors.submit && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-sm text-red-600 dark:text-red-400">{formErrors.submit}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowEditDialog(false)}
                            disabled={submitting}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            onClick={handleEditServer}
                            disabled={submitting}
                        >
                            {submitting ? t('Updating...') : t('Update Server')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Server Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('Delete MCP Server')}</DialogTitle>
                        <DialogDescription>
                            {t('Are you sure you want to delete')} <strong>{selectedServer?.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                {t('This action cannot be undone. The server will be permanently removed from the system.')}
                            </p>
                        </div>
                        {formErrors.submit && (
                            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-sm text-red-600 dark:text-red-400">{formErrors.submit}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={submitting}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            onClick={handleDeleteServer}
                            disabled={submitting}
                            variant="destructive"
                        >
                            {submitting ? t('Deleting...') : t('Delete Server')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
