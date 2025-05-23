import assert from 'assert';
import {
    formatActionsForTooltip,
    formatActionsForBoxContent,
    getActionTypesSummary,
    formatActionsForContent
} from '../actions.mjs';

// Tests for falsy input
assert.strictEqual(formatActionsForTooltip(null), 'No actions');
assert.strictEqual(formatActionsForTooltip(undefined), 'No actions');

assert.strictEqual(formatActionsForBoxContent(null), 'No actions');
assert.strictEqual(formatActionsForBoxContent(undefined), 'No actions');

assert.strictEqual(getActionTypesSummary(null), 'No actions');
assert.strictEqual(getActionTypesSummary(undefined), 'No actions');

assert.strictEqual(formatActionsForContent(null), 'No actions');
assert.strictEqual(formatActionsForContent(undefined), 'No actions');

console.log('All action helper tests passed.');
