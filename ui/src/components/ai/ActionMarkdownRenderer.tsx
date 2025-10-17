import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ActionButton, type ActionConfig } from './ActionButton';

interface ActionMarkdownRendererProps {
    content: string;
    onActionComplete?: (actionType: string, result: unknown) => void;
}

/**
 * Custom markdown renderer that supports interactive action buttons
 * 
 * Syntax examples:
 * 
 * Navigate to tab:
 * [action:navigate:Go to SMART Apps:smart-apps]
 * 
 * Refresh page:
 * [action:refresh:Refresh Data]
 * 
 * External link:
 * [action:external:View Documentation:https://docs.example.com]
 * 
 * API call with form:
 * [action:api:Create User:POST:/admin/users:name|text|User Name|true,email|email|Email|true]
 * 
 * Simple API call:
 * [action:api:Fetch Data:GET:/admin/stats]
 */
export function ActionMarkdownRenderer({ content, onActionComplete }: ActionMarkdownRendererProps) {
    // Parse action syntax from markdown - memoized to avoid re-parsing on every render
    const { processedContent, actions } = React.useMemo(() => {
        const parseActions = (text: string): Array<{ original: string; action: ActionConfig; id: string }> => {
            const actionRegex = /\[action:(navigate|refresh|api|external|form):([^\]]+)\]/g;
            const actions: Array<{ original: string; action: ActionConfig; id: string }> = [];
            let match;
            let counter = 0;

            while ((match = actionRegex.exec(text)) !== null) {
                const [fullMatch, type, params] = match;
                const parts = params.split(':');
                const id = `action-${counter++}`;

                try {
                    let action: ActionConfig | null = null;

                    switch (type) {
                        case 'navigate':
                            // Format: [action:navigate:Label:target-tab]
                            if (parts.length >= 2) {
                                action = {
                                    type: 'navigate',
                                    label: parts[0],
                                    tab: parts[1],
                                };
                            }
                            break;

                        case 'refresh':
                            // Format: [action:refresh:Label]
                            action = {
                                type: 'refresh',
                                label: parts[0] || 'Refresh',
                            };
                            break;

                        case 'external':
                            // Format: [action:external:Label:URL]
                            if (parts.length >= 2) {
                                action = {
                                    type: 'external-link',
                                    label: parts[0],
                                    target: parts[1],
                                };
                            }
                            break;

                        case 'api':
                            // Format: [action:api:Label:METHOD:endpoint:field1|type|label|required,field2|...]
                            if (parts.length >= 3) {
                                const fields = parts[3] ? parts[3].split(',').map(fieldStr => {
                                    const [name, type, label, required, options] = fieldStr.split('|');
                                    return {
                                        name: name.trim(),
                                        type: (type?.trim() as 'text' | 'email' | 'number' | 'select') || 'text',
                                        label: label?.trim() || name.trim(),
                                        required: required?.trim() === 'true',
                                        options: options?.split(';').map(o => o.trim()),
                                    };
                                }) : undefined;

                                action = {
                                    type: 'api-call',
                                    label: parts[0],
                                    method: parts[1].toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE',
                                    endpoint: parts[2],
                                    fields,
                                };
                            }
                            break;

                        case 'form':
                            // Format: [action:form:Label:field1|type|label|required,field2|...]
                            if (parts.length >= 2) {
                                const fields = parts[1].split(',').map(fieldStr => {
                                    const [name, type, label, required, options] = fieldStr.split('|');
                                    return {
                                        name: name.trim(),
                                        type: (type?.trim() as 'text' | 'email' | 'number' | 'select') || 'text',
                                        label: label?.trim() || name.trim(),
                                        required: required?.trim() === 'true',
                                        options: options?.split(';').map(o => o.trim()),
                                    };
                                });

                                action = {
                                    type: 'form',
                                    label: parts[0],
                                    fields,
                                };
                            }
                            break;
                    }

                    if (action) {
                        actions.push({ original: fullMatch, action, id });
                    }
                } catch (error) {
                    console.error('Error parsing action:', fullMatch, error);
                }
            }

            return actions;
        };

        // Replace action markers with placeholders
        const actions = parseActions(content);
        let processedContent = content;
        
        actions.forEach(({ original, id }) => {
            processedContent = processedContent.replace(original, `{{ACTION_${id}}}`);
        });

        return { processedContent, actions };
    }, [content]);

    // Component to handle inline text that might contain action placeholders
    // For inline contexts (list items, emphasis, etc), we just strip action placeholders
    const InlineTextWithActions = ({ children }: { children: React.ReactNode }) => {
        if (typeof children !== 'string') {
            return <>{children}</>;
        }

        // Remove action placeholders from inline contexts (they should only be in paragraphs)
        const cleanText = children.replace(/\{\{ACTION_[^}]+\}\}/g, '');
        return <>{cleanText}</>;
    };

    // Custom component to render paragraphs with action buttons
    // This component detects action placeholders and renders them as separate block elements
    const ParagraphWithActions = ({ children }: { children: React.ReactNode }) => {
        if (typeof children !== 'string') {
            return <p className="mb-2 last:mb-0">{children}</p>;
        }

        const actionPlaceholderRegex = /\{\{ACTION_([^}]+)\}\}/g;
        const hasActions = actionPlaceholderRegex.test(children);
        
        if (!hasActions) {
            return <p className="mb-2 last:mb-0">{children}</p>;
        }

        // Reset regex
        actionPlaceholderRegex.lastIndex = 0;
        
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;
        let key = 0;

        while ((match = actionPlaceholderRegex.exec(children)) !== null) {
            // Add text before the action as a paragraph
            const textBefore = children.substring(lastIndex, match.index).trim();
            if (textBefore) {
                parts.push(
                    <p key={`text-${key++}`} className="mb-2 last:mb-0">
                        {textBefore}
                    </p>
                );
            }

            // Add the action button as a block element
            const actionId = match[1];
            const actionData = actions.find(a => a.id === actionId);

            if (actionData) {
                parts.push(
                    <div key={`action-${key++}`} className="my-2">
                        <ActionButton
                            action={actionData.action}
                            compact={true}
                            onComplete={(result) => {
                                onActionComplete?.(actionData.action.type, result);
                            }}
                        />
                    </div>
                );
            }

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text as a paragraph
        const textAfter = children.substring(lastIndex).trim();
        if (textAfter) {
            parts.push(
                <p key={`text-${key++}`} className="mb-2 last:mb-0">
                    {textAfter}
                </p>
            );
        }

        return <>{parts}</>;
    };

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => (
                        <ParagraphWithActions>{children}</ParagraphWithActions>
                    ),
                    ul: ({ children }) => <ul className="ml-4 mb-2 last:mb-0 list-disc">{children}</ul>,
                    ol: ({ children }) => <ol className="ml-4 mb-2 last:mb-0 list-decimal">{children}</ol>,
                    li: ({ children }) => (
                        <li className="mb-1">
                            <InlineTextWithActions>{children}</InlineTextWithActions>
                        </li>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                            <InlineTextWithActions>{children}</InlineTextWithActions>
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic">
                            <InlineTextWithActions>{children}</InlineTextWithActions>
                        </em>
                    ),
                    code: ({ children }) => (
                        <code className="bg-muted/60 px-1 py-0.5 rounded text-xs font-mono">
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => (
                        <pre className="bg-muted/40 p-3 rounded-lg overflow-x-auto text-xs my-2">
                            {children}
                        </pre>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2">
                            {children}
                        </blockquote>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                            <table className="min-w-full divide-y divide-border">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="px-3 py-2 text-left text-xs font-semibold bg-muted">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-3 py-2 text-xs border-t border-border">
                            {children}
                        </td>
                    ),
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
