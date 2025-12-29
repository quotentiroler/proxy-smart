import React from 'react';
import { Md } from '@m2d/react-markdown/client';
import remarkGfm from 'remark-gfm';
import { ActionButton, type ActionConfig } from './ActionButton';

interface ActionMarkdownRendererProps {
    content: string;
    streaming?: boolean;
    onActionComplete?: (actionType: string, result: unknown) => void;
}

/**
 * Custom markdown renderer that supports interactive action buttons
 * 
 * Actions are only parsed and rendered when streaming is complete to avoid
 * performance issues during real-time updates.
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
export function ActionMarkdownRenderer({ content, streaming = false, onActionComplete }: ActionMarkdownRendererProps) {
    const [openForms, setOpenForms] = React.useState<Record<string, boolean>>({});

    // Parse action syntax from markdown - memoized to avoid re-parsing on every render
    // Skip action parsing while streaming to improve performance
    const { processedContent, actions } = React.useMemo(() => {
        // While streaming, just return the raw content without parsing actions
        if (streaming) {
            return { processedContent: content, actions: [] };
        }

        const parseActions = (text: string): Array<{ original: string; action: ActionConfig; id: string }> => {
            const actionRegex = /\[action:(navigate|refresh|api|external|form):([^\]]+)\]/gi;
            const actions: Array<{ original: string; action: ActionConfig; id: string }> = [];
            let match;
            let counter = 0;

            while ((match = actionRegex.exec(text)) !== null) {
                const [fullMatch, rawType, params] = match;
                const type = rawType.toLowerCase();
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
    }, [content, streaming]);

    // Simple component to render paragraph with inline action buttons
    const ParagraphComponent = React.useCallback(({ children }: { children?: React.ReactNode }) => {
        // Helper to extract plain text from possible nested children
        const extractText = (node: unknown): string => {
            if (node == null) return '';
            if (typeof node === 'string' || typeof node === 'number') return String(node);
            if (Array.isArray(node)) return node.map(extractText).join('');
            if (typeof node === 'object' && node !== null && 'props' in (node as Record<string, unknown>)) {
                const props = (node as Record<string, unknown>).props as { children?: unknown } | undefined;
                if (props && 'children' in props) {
                    return extractText(props.children);
                }
            }
            return '';
        };

        const childText = extractText(children);

        // Find all placeholders in this paragraph
        const re = /\{\{ACTION_([^}]+)\}\}/g;
        const segments: Array<{ type: 'text' | 'action'; value: string }> = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = re.exec(childText)) !== null) {
            const [full, id] = match;
            // Push preceding text
            if (match.index > lastIndex) {
                segments.push({ type: 'text', value: childText.slice(lastIndex, match.index) });
            }
            segments.push({ type: 'action', value: id });
            lastIndex = match.index + full.length;
        }
        // Push remaining text
        if (lastIndex < childText.length) {
            segments.push({ type: 'text', value: childText.slice(lastIndex) });
        }

        if (segments.length === 0) {
            return <p className="mb-2 last:mb-0">{children}</p>;
        }

        // If the paragraph contains actions, render a div wrapper instead of <p>
        // to avoid invalid DOM nesting (ActionButton currently renders block elements).
        return (
            <div className="mb-2 last:mb-0">
                {segments.map((seg, idx) => {
                    if (seg.type === 'text') return <span key={idx}>{seg.value}</span>;
                    const action = actions.find(a => a.id === seg.value);
                    if (!action) {
                        console.warn('⚠️ Action ID not found in actions array!', {
                            searchingFor: seg.value,
                            availableIds: actions.map(a => a.id),
                        });
                        return <span key={idx}>{`{{ACTION_${seg.value}}}`}</span>;
                    }
                    return (
                        <ActionButton
                            key={idx}
                            action={action.action}
                            formOpen={openForms[seg.value] || false}
                            onFormOpenChange={(open) => {
                                setOpenForms(prev => ({ ...prev, [seg.value]: open }));
                            }}
                            onComplete={(result) => {
                                onActionComplete?.(action.action.type, result);
                            }}
                        />
                    );
                })}
            </div>
        );
    }, [actions, openForms, onActionComplete]);

    // Custom list item component to render action buttons in lists
    const ListItemComponent = React.useCallback(({ children }: { children?: React.ReactNode }) => {
        // Same logic as Paragraph: support placeholders anywhere in the item
        const extractText = (node: unknown): string => {
            if (node == null) return '';
            if (typeof node === 'string' || typeof node === 'number') return String(node);
            if (Array.isArray(node)) return node.map(extractText).join('');
            if (typeof node === 'object' && node !== null && 'props' in (node as Record<string, unknown>)) {
                const props = (node as Record<string, unknown>).props as { children?: unknown } | undefined;
                if (props && 'children' in props) {
                    return extractText(props.children);
                }
            }
            return '';
        };
        const childText = extractText(children);
        const re = /\{\{ACTION_([^}]+)\}\}/g;
        const segments: Array<{ type: 'text' | 'action'; value: string }> = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = re.exec(childText)) !== null) {
            const [full, id] = match;
            if (match.index > lastIndex) {
                segments.push({ type: 'text', value: childText.slice(lastIndex, match.index) });
            }
            segments.push({ type: 'action', value: id });
            lastIndex = match.index + full.length;
        }
        if (lastIndex < childText.length) {
            segments.push({ type: 'text', value: childText.slice(lastIndex) });
        }

        if (segments.length === 0) {
            return <li>{children}</li>;
        }

        return (
            <li style={{ listStyle: 'none', marginBottom: '0.5rem' }}>
                {segments.map((seg, idx) => {
                    if (seg.type === 'text') return <span key={idx}>{seg.value}</span>;
                    const action = actions.find(a => a.id === seg.value);
                    if (!action) return <span key={idx}>{`{{ACTION_${seg.value}}}`}</span>;
                    return (
                        <ActionButton
                            key={idx}
                            action={action.action}
                            formOpen={openForms[seg.value] || false}
                            onFormOpenChange={(open) => {
                                setOpenForms(prev => ({ ...prev, [seg.value]: open }));
                            }}
                            onComplete={(result) => {
                                onActionComplete?.(action.action.type, result);
                            }}
                        />
                    );
                })}
            </li>
        );
    }, [actions, openForms, onActionComplete]);

    // While streaming, avoid the heavy markdown parsing/rendering path to reduce re-renders and memory usage
    if (streaming) {
        return (
            <div className="whitespace-pre-wrap break-words text-sm">
                {content}
            </div>
        );
    }

    // If the final content is excessively large, avoid heavy markdown rendering to prevent freezes
    const SAFE_MAX_MARKDOWN_CHARS = 100_000;
    if (processedContent.length > SAFE_MAX_MARKDOWN_CHARS) {
        console.log('🔍 ActionMarkdownRenderer: content too large, returning simple view');
        return (
            <div className="whitespace-pre-wrap break-words text-sm">
                {processedContent}
            </div>
        );
    }

    // Use lightweight @m2d/react-markdown with simplified paragraph component
    return (
        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <Md 
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ParagraphComponent,
                    li: ListItemComponent,
                }}
            >
                {processedContent}
            </Md>
        </div>
    );
}
