import {
  Server,
  Check,
  X,
  ExternalLink,
  AlertTriangle,
  Copy,
  Info,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FhirServerDetailsResponse } from '@/lib/types/api';

export function ServerDetails(server: FhirServerDetailsResponse) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-card/70 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm">
            <Server className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{server.serverName || server.name}</h2>
            <p className="text-muted-foreground font-medium">{server.name}</p>
          </div>
        </div>
        <Badge
          variant={server.supported ? "default" : "destructive"}
          className={server.supported
            ? "bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-400/30 shadow-sm px-4 py-2"
            : "bg-destructive/10 text-destructive border-destructive/30 shadow-sm px-4 py-2"
          }
        >
          {server.supported ? (
            <><Check className="w-4 h-4 mr-2" /> Supported</>
          ) : (
            <><X className="w-4 h-4 mr-2" /> Unsupported</>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                <Info className="w-4 h-4 text-primary" />
              </div>
              Server Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                <span className="text-sm font-semibold text-muted-foreground">Server Name:</span>
                <span className={`text-sm font-bold ${(server.serverName === 'Unknown FHIR Server' || !server.serverName) ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {server.serverName || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                <span className="text-sm font-semibold text-muted-foreground">FHIR Version:</span>
                <span className={`text-sm font-bold ${server.fhirVersion === 'Unknown' ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {server.fhirVersion}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                <span className="text-sm font-semibold text-muted-foreground">Server Version:</span>
                <span className={`text-sm font-bold ${(!server.serverVersion || server.serverVersion === 'Unknown') ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {server.serverVersion || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <div className="w-8 h-8 bg-emerald-500/10 dark:bg-emerald-400/20 rounded-lg flex items-center justify-center mr-3">
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Connection
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Base URL:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(server.url)}
                  className="h-8 px-3 rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-foreground bg-muted/50 p-3 rounded-xl font-mono break-all border border-border">
                {server.url}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints - only show for servers without connection errors */}
      {server.fhirVersion !== 'Unknown' && server.supported && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center">
            <div className="w-8 h-8 bg-purple-500/10 dark:bg-purple-400/20 rounded-lg flex items-center justify-center mr-3">
              <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            API Endpoints
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(server.endpoints).map(([key, url]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-all duration-200">
                <div className="flex-1">
                  <p className="font-semibold text-foreground capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm text-muted-foreground font-mono break-all">{url}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(url)}
                    className="h-10 px-3 rounded-xl hover:bg-background transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                    className="h-10 px-3 rounded-xl hover:bg-background transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection Error Message for servers with issues */}
      {(server.fhirVersion === 'Unknown' || !server.supported) && (
        <div className="mt-8">
          <div className="bg-destructive/10 p-6 rounded-xl border border-destructive/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold text-destructive">Connection Error</h4>
                <p className="text-destructive/80 text-sm">Unable to connect to this FHIR server or retrieve metadata</p>
              </div>
            </div>
            <p className="text-destructive/70 text-sm">
              This server cannot be reached or does not respond with valid FHIR metadata.
              API endpoints and advanced features are not available for this server.
            </p>
          </div>
        </div>
      )}

      {/* Launch Context Associations */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
            <Database className="w-4 h-4 text-primary" />
          </div>
          Associated Launch Contexts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sample launch contexts - in a real app, these would come from API */}
          <div className="p-4 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl border border-blue-500/20 dark:border-blue-400/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Patient Chart Launch</h4>
              <Badge variant="secondary" className="bg-blue-500/10 dark:bg-blue-400/20 text-blue-800 dark:text-blue-300 border-blue-500/30 dark:border-blue-400/30">
                Global
              </Badge>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">Standard patient chart context for EHR integration</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Active</span>
            </div>
          </div>

          <div className="p-4 bg-purple-500/10 dark:bg-purple-400/10 rounded-xl border border-purple-500/20 dark:border-purple-400/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Provider Summary</h4>
              <Badge variant="secondary" className="bg-purple-500/10 dark:bg-purple-400/20 text-purple-800 dark:text-purple-300 border-purple-500/30 dark:border-purple-400/30">
                Server-specific
              </Badge>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">Provider-focused clinical decision support context</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Active</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-xl border border-emerald-500/20 dark:border-emerald-400/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Encounter Context</h4>
              <Badge variant="secondary" className="bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-400/30">
                Global
              </Badge>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">Encounter-specific clinical workflow context</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
            </div>
          </div>

          <div className="p-4 bg-orange-500/10 dark:bg-orange-400/10 rounded-xl border border-orange-500/20 dark:border-orange-400/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100">Quality Reporting</h4>
              <Badge variant="secondary" className="bg-orange-500/10 dark:bg-orange-400/20 text-orange-800 dark:text-orange-300 border-orange-500/30 dark:border-orange-400/30">
                Server-specific
              </Badge>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">Clinical quality measure reporting context</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
