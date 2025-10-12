import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiAssistant, type ChatMessage, type DocumentChunk } from '../lib/ai-assistant';
import { useAIChatStore } from '../stores/aiChatStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Bot,
    Minimize2,
    X,
    Send,
    Mic,
    MicOff,
    Brain,
    Sparkles,
    FileText,
    RotateCcw
} from 'lucide-react';

interface AIChatOverlayProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AIChatOverlay({ isOpen: externalIsOpen, onClose: externalOnClose }: AIChatOverlayProps = {}) {
    const { t } = useTranslation();
    
    // Use the persistent store for chat state
    const {
        messages: chatMessages,
        isMinimized,
        isOpen: storedIsOpen,
        conversationId,
        addMessage,
        updateMessage,
        setIsMinimized,
        setIsOpen: setStoredIsOpen,
        setConversationId,
        resetChat,
    } = useAIChatStore();
    
    // Handle external vs internal open state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : storedIsOpen;
    const handleSetOpen = (open: boolean) => {
        if (externalIsOpen === undefined) {
            setStoredIsOpen(open);
        }
        if (externalOnClose && !open) {
            externalOnClose();
        }
    };
    const onClose = externalOnClose || (() => handleSetOpen(false));
    
    // Non-persistent UI state
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpenAIReady, setIsOpenAIReady] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const available = await aiAssistant.isOpenAIAvailable();
                if (isMounted) {
                    setIsOpenAIReady(available);
                }
            } catch (error) {
                console.warn('Failed to determine OpenAI availability:', error);
                if (isMounted) {
                    setIsOpenAIReady(false);
                }
            }
        })();

        // Initialize conversation ID if not set
        if (!conversationId) {
            setConversationId(crypto.randomUUID());
        }

        return () => {
            isMounted = false;
        };
    }, [conversationId, setConversationId]);

    const handleClearChat = () => {
        resetChat();
        setConversationId(crypto.randomUUID());
    };

    const handleMicToggle = () => {
        setIsListening(!isListening);
        // TODO: Implement actual voice recognition here
        // For now, we'll just toggle the visual state
        if (!isListening) {
            // Start listening
            console.log('Starting voice input...');
        } else {
            // Stop listening
            console.log('Stopping voice input...');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim() || isProcessing) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: currentMessage,
            timestamp: new Date()
        };

        addMessage(userMessage);
        setCurrentMessage('');
        setIsProcessing(true);

        // Create placeholder message for streaming
        const agentMessageId = (Date.now() + 1).toString();
        const agentMessage: ChatMessage = {
            id: agentMessageId,
            type: 'agent',
            content: '',
            timestamp: new Date(),
            sources: [],
            streaming: true
        };

        addMessage(agentMessage);

        try {
            // Use streaming API
            let fullContent = '';
            let sources: DocumentChunk[] = [];
            let streamingFailed = false;

            for await (const chunk of aiAssistant.generateResponseStream(userMessage.content, conversationId || undefined)) {
                if (chunk.type === 'sources' && chunk.sources) {
                    sources = chunk.sources;
                } else if (chunk.type === 'content' && chunk.content) {
                    fullContent += chunk.content;
                    
                    // Update the message with accumulated content
                    updateMessage(agentMessageId, { content: fullContent, sources });
                } else if (chunk.type === 'done') {
                    // Mark streaming as complete
                    updateMessage(agentMessageId, { streaming: false, sources });
                } else if (chunk.type === 'error') {
                    console.error('Streaming error:', chunk.error);
                    
                    // Check if we should fall back to non-streaming
                    if (chunk.error?.includes('temporarily unavailable') || chunk.error?.includes('not supported')) {
                        console.log('Streaming not available, falling back to non-streaming...');
                        streamingFailed = true;
                        break;
                    }
                    
                    // Show user-friendly error message
                    const errorMessage = chunk.error || 'I encountered an issue processing your request. Please try again.';
                    
                    updateMessage(agentMessageId, {
                        content: `⚠️ ${errorMessage}`,
                        streaming: false
                    });
                    break; // Stop processing stream
                }
            }
            
            // Fallback to non-streaming if streaming failed
            if (streamingFailed) {
                const ragResponse = await aiAssistant.generateResponse(userMessage.content, conversationId || undefined);
                
                updateMessage(agentMessageId, {
                    content: ragResponse.answer,
                    sources: ragResponse.sources,
                    streaming: false
                });
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // Determine user-friendly error message
            let errorMessage = t('I\'m sorry, I\'m having trouble processing your request right now. Please try again.');
            
            if (error instanceof Error) {
                const errorStr = error.message.toLowerCase();
                if (errorStr.includes('timeout') || errorStr.includes('timed out')) {
                    errorMessage = t('The request took too long to complete. Please try again with a shorter question.');
                } else if (errorStr.includes('network') || errorStr.includes('fetch')) {
                    errorMessage = t('Unable to connect to the AI service. Please check your connection and try again.');
                }
            }
            
            // Update the placeholder with user-friendly error message
            updateMessage(agentMessageId, {
                content: `⚠️ ${errorMessage}`,
                streaming: false
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Floating Chat Button - only show when using internal state and chat is closed */}
            {externalIsOpen === undefined && !isOpen && (
                <div className="fixed bottom-4 right-4 z-[50]">
                    <Button
                        onClick={() => handleSetOpen(true)}
                        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl border border-primary/20 transition-all duration-300 hover:scale-105"
                        title={t('Open AI Assistant')}
                    >
                        {isOpenAIReady ? (
                            <Brain className="w-6 h-6 text-primary-foreground" />
                        ) : (
                            <Bot className="w-6 h-6 text-primary-foreground" />
                        )}
                    </Button>
                </div>
            )}

            {/* Chat Overlay */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 z-[60] w-96 max-w-[calc(100vw-2rem)]">
                    <Card className="bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/50 p-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                                {isOpenAIReady ? (
                                    <Brain className="w-4 h-4 text-primary-foreground" />
                                ) : (
                                    <Bot className="w-4 h-4 text-primary-foreground" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <CardTitle className="text-sm font-semibold text-foreground">
                                        {t('SMART Assistant')}
                                    </CardTitle>
                                    {isOpenAIReady && (
                                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {isOpenAIReady 
                                        ? t('AI-powered with RAG knowledge base')
                                        : t('Semantic search with knowledge base')
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearChat}
                                className="h-6 w-6 p-0 hover:bg-muted rounded-md"
                                title={t('Clear chat history')}
                            >
                                <RotateCcw className="w-3 h-3 text-muted-foreground" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="h-6 w-6 p-0 hover:bg-muted rounded-md"
                                title={isMinimized ? t('Expand chat') : t('Minimize chat')}
                            >
                                <Minimize2 className="w-3 h-3 text-muted-foreground" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-6 w-6 p-0 hover:bg-muted rounded-md"
                                title={t('Close chat')}
                            >
                                <X className="w-3 h-3 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="p-0">
                        {/* Chat Messages */}
                        <div className="h-64 overflow-y-auto p-4 space-y-3">
                            {chatMessages.map((message) => (
                                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${message.type === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-muted text-foreground rounded-bl-sm'
                                        }`}>
                                        {message.type === 'agent' ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        ul: ({ children }) => <ul className="ml-4 mb-2 last:mb-0 list-disc">{children}</ul>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                                        em: ({ children }) => <em className="italic">{children}</em>,
                                                        code: ({ children }) => <code className="bg-muted/60 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap">{message.content}</div>
                                        )}
                                        
                                        
                                        {/* Show sources for agent messages */}
                                        {message.type === 'agent' && message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 pt-2 border-t border-border/20">
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                                    <FileText className="w-3 h-3" />
                                                    <span>{t('Sources')}:</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {message.sources.slice(0, 3).map((source, index) => (
                                                        <div key={index} className="text-xs bg-background/50 rounded px-2 py-1 border border-border/30">
                                                            <div className="font-medium">{source.title}</div>
                                                            <div className="text-muted-foreground text-[10px]">{source.category}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Processing indicator */}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-muted text-foreground p-3 rounded-lg rounded-bl-sm text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            <span>{t('Assistant is thinking')}...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-border/50 p-4">
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <Input
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder={t('Ask me about SMART on FHIR...')}
                                    className="flex-1 text-sm rounded-lg border-input focus:border-ring focus:ring-ring"
                                    disabled={isProcessing}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleMicToggle}
                                    variant={isListening ? "destructive" : "secondary"}
                                    className={`rounded-lg px-3 transition-all duration-300 ${isListening ? 'animate-pulse' : ''}`}
                                    disabled={isProcessing}
                                    title={isListening ? t('Stop listening') : t('Start voice input')}
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isProcessing || !currentMessage.trim()}
                                    className={`rounded-lg px-3 transition-all duration-300 ${isProcessing ? 'animate-pulse' : ''}`}
                                    title={t('Send message')}
                                >
                                    {isProcessing ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
        )}
        </>
    );
}
