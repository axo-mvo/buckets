export function formatActionsForTooltip(actions) {
    if (!actions) return 'No actions';
    let formatted = [];
    if (actions.ace && actions.ace.length > 0) {
        actions.ace.forEach(a => formatted.push(`- ACE: ${a.aceActionType} (${a.clientRole || 'N/A'})` + (a.description ? ` - ${a.description}` : '')));
    }
    if (actions.myPage && actions.myPage.length > 0) {
        actions.myPage.forEach(a => formatted.push(`- MyPage: Template ${a.templateId || 'N/A'}`));
    }
    if (actions.ortto && actions.ortto.length > 0) {
        actions.ortto.forEach(a => formatted.push(`- Ortto: ${a.orttoActionType}` + (a.description ? ` - ${a.description}` : '')));
    }
    if (actions.s2 && actions.s2.length > 0) {
        actions.s2.forEach(a => formatted.push(`- S2: ${JSON.stringify(a)}`));
    }
    return formatted.length > 0 ? formatted.join('<br>') : 'No actions';
}

export function formatActionsForBoxContent(actions) {
    if (!actions) return 'No actions';
    let details = [];

    if (actions.ace && actions.ace.length > 0) {
        const aceTypes = [...new Set(actions.ace.map(a => `${a.aceActionType} (${a.clientRole || '?'})`))];
        if (aceTypes.length > 0) {
            details.push(`ACE: ${aceTypes.join(', ')}`);
        }
    }

    if (actions.myPage && actions.myPage.length > 0) {
        details.push('MyPage Action');
    }

    if (actions.ortto && actions.ortto.length > 0) {
        const orttoTypes = [...new Set(actions.ortto.map(a => a.orttoActionType))];
        if (orttoTypes.length > 0) {
            details.push(`Ortto: ${orttoTypes.join(', ')}`);
        }
    }

    if (actions.s2 && actions.s2.length > 0) {
        details.push('S2 Action');
    }

    return details.length > 0 ? details.join(' | ') : 'No actions';
}

export function getActionTypesSummary(actions) {
    if (!actions) return 'No actions';
    let types = [];
    if (actions.ace && actions.ace.length > 0) types.push('ACE');
    if (actions.myPage && actions.myPage.length > 0) types.push('MyPage');
    if (actions.ortto && actions.ortto.length > 0) types.push('Ortto');
    if (actions.s2 && actions.s2.length > 0) types.push('S2');
    return types.length > 0 ? `Actions: ${types.join(', ')}` : 'No actions';
}

export function formatActionsForContent(actions) {
    if (!actions) return 'No actions';
    let icons = [];
    if (actions.ace && actions.ace.length > 0) icons.push('👤');
    if (actions.myPage && actions.myPage.length > 0) icons.push('📄');
    if (actions.ortto && actions.ortto.find(a => a.orttoActionType === 'Email')) icons.push('📧');
    if (actions.ortto && actions.ortto.find(a => a.orttoActionType === 'SMS')) icons.push('📱');
    if (actions.ace && actions.ace.find(a => a.aceActionType === 'Call' || a.aceActionType === 'TwoWaySMS')) icons.push('📞');
    return icons.length > 0 ? icons.join(' ') : 'No actions';
}
