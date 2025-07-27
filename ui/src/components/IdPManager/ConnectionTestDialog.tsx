import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';

interface IdP {
  id: string;
  name: string;
}

interface ConnectionTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  connectionResults: Record<string, { success: boolean; message: string }>;
  idps: IdP[];
}

export function ConnectionTestDialog({ 
  isOpen, 
  onClose, 
  connectionResults, 
  idps 
}: ConnectionTestDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/40 rounded-xl flex items-center justify-center shadow-sm">
              <TestTube className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                Connection Test Results
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium mt-1">
                Results from testing identity provider connections
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(connectionResults).map(([idpId, result]) => {
            const idp = idps.find(i => i.id === idpId);
            return (
              <div key={idpId} className="bg-card/50 p-6 rounded-xl border border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                    result.success 
                      ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/40' 
                      : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/40'
                  }`}>
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground">{idp?.name}</span>
                      <Badge className={`${
                        result.success 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
                      } shadow-sm`}>
                        {result.success ? 'Connection Successful' : 'Connection Failed'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-6">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="px-8 py-3 border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
