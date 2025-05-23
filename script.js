// Frontend JavaScript - Fetch data and render visualization using Vis-Timeline

// Import vis-timeline CSS (Vite handles this)
import 'vis-timeline/styles/vis-timeline-graph2d.css';
// Import vis-timeline components
import { DataSet, Timeline } from "vis-timeline/standalone";
import {
    formatActionsForTooltip,
    formatActionsForBoxContent,
    getActionTypesSummary,
    formatActionsForContent
} from './actions.mjs';

console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender();
});

async function fetchDataAndRender() {
    try {
        // Fetch from backend API running on port 3001
        const response = await fetch('http://localhost:3001/api/buckets'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const buckets = await response.json();
        console.log('Fetched data:', buckets);
        renderTimeline(buckets);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        const vizElement = document.getElementById('visualization');
        if (vizElement) {
            vizElement.textContent = 'Error loading visualization data. Check console for details.';
        }
    }
}

// --- Helper Functions for Formatting --- 

function formatConditionsForTooltip(conditions) {
    if (!conditions || conditions.length === 0) return 'No conditions';
    return conditions.map(c => {
        let line = `- ${c.field} ${c.operator} ${c.value}`;
        if (c.field === 'AllBanksAnsweredAt' && c.operator === '==' && c.value === 'null') {
            line += ' (Pending Bank Answers)';
        }
        return line;
    }).join('<br>');
}

// Gets a simple list of action categories (ACE, MyPage, Ortto, S2)
function getActionCategories(actions) {
    let categories = [];
    if (actions.ace && actions.ace.length > 0) categories.push('ACE');
    if (actions.myPage && actions.myPage.length > 0) categories.push('MyPage');
    if (actions.ortto && actions.ortto.length > 0) categories.push('Ortto');
    if (actions.s2 && actions.s2.length > 0) categories.push('S2');
    return categories;
}

// NEW: Formats detailed actions specifically for the box content
// (Implementation moved to actions.mjs)

// Updated function to get a short summary of action types for the box content
// (Implementation moved to actions.mjs)

// Formatting function for inline icons representing actions
// (Implementation moved to actions.mjs)

// TODO: Improve time condition formatting for content if needed
// function formatTimeConditionsForContent(conditions) { ... }

// --- Main Rendering Logic --- 

function renderTimeline(buckets) {
    const container = document.getElementById('visualization');
    if (!container) {
        console.error('Visualization container not found');
        return;
    }

    // 1. Create Groups (using imported DataSet)
    const statusGroups = new Map();
    let groupCounter = 0;
    buckets.forEach(bucket => {
        const statusCondition = bucket.conditions.find(c => c.field === 'ApplicationStatus' && c.operator === '==');
        const status = statusCondition ? statusCondition.value : 'Unknown Status';
        if (!statusGroups.has(status)) {
            statusGroups.set(status, { id: groupCounter++, content: `Status: ${status}` });
        }
    });
    const groups = new DataSet(Array.from(statusGroups.values())); // Use imported DataSet

    // 2. Create Timeline Items (using imported DataSet)
    const items = new DataSet(); // Use imported DataSet
    const now = new Date();
    let minStartTime = Infinity;
    let maxStartTime = -Infinity;

    buckets.forEach((bucket, index) => {
        const statusCondition = bucket.conditions.find(c => c.field === 'ApplicationStatus' && c.operator === '==');
        const status = statusCondition ? statusCondition.value : 'Unknown Status';
        const groupId = statusGroups.get(status)?.id;

        const timeCondition = bucket.conditions.find(c => c.field === 'ApplicationCompletedAt' && c.operator === '>');
        let startTime = new Date(now);
        if (timeCondition && !isNaN(parseInt(timeCondition.value))) {
            const minutesOffset = parseInt(timeCondition.value);
            startTime.setMinutes(now.getMinutes() + minutesOffset);
        } else {
            startTime.setSeconds(now.getSeconds() + index * 5);
        }

        if (startTime.getTime() < minStartTime) minStartTime = startTime.getTime();
        if (startTime.getTime() > maxStartTime) maxStartTime = startTime.getTime();
        
        const actionBoxSummary = formatActionsForBoxContent(bucket.actions);
        const itemContent = `<b>${bucket.name || `Bucket ${index + 1}`}</b><br>` +
                          `<small>${bucket.conditionSummary || ''}</small><br>` +
                          `<small><i>${actionBoxSummary}</i></small>`;
        
        const itemTitle = `<b>${bucket.name || 'Unnamed Bucket'}</b><br>` +
                          `ID: ${bucket.id}<br>` +
                          `Priority: ${bucket.priority} | Track: ${bucket.track} | Sort: ${bucket.sortFunction}<br>` +
                          `--------------------<br>` +
                          `<b>Conditions:</b><br>${formatConditionsForTooltip(bucket.conditions)}<br>` +
                          `--------------------<br>` +
                          `<b>Actions:</b><br>${formatActionsForTooltip(bucket.actions)}`;

        if (groupId !== undefined) {
            items.add({
                id: bucket.id || index,
                group: groupId,
                content: itemContent,
                start: startTime,
                title: itemTitle,
                actions: bucket.actions // Keep actions for click listener
            });
        }
    });

    // 3. Configure Timeline Options
    const timelineStart = new Date(minStartTime - (1000 * 60 * 15));
    const timelineEnd = new Date(maxStartTime + (1000 * 60 * 60));

    const options = {
        stack: false,
        editable: false,
        margin: { item: 20, axis: 40 },
        tooltip: { followMouse: true, overflowMethod: "flip" },
        groupTemplate: function(group) {
            var container = document.createElement('div');
            var label = document.createElement('span');
            label.innerHTML = group.content + ' ';
            container.insertAdjacentElement('beforeend', label);
            container.style.width = '150px'; 
            container.style.textAlign = 'left'; 
            return container;
        },
        start: timelineStart,
        end: timelineEnd,
        zoomKey: 'ctrlKey',
        cluster: {
            maxItems: 1,
            titleTemplate: 'Cluster containing {count} buckets'
        }
    };

    // 4. Create and Render Timeline (using imported Timeline)
    console.log("Groups:", groups.get());
    console.log("Items:", items.get());
    console.log(`Setting timeline window: ${timelineStart.toISOString()} to ${timelineEnd.toISOString()}`);
    try {
        if (container.firstChild) {
            container.innerHTML = '';
        }
        const timeline = new Timeline(container, items, groups, options); // Use imported Timeline
        console.log("Timeline rendered successfully.");

        // --- RE-ADD Cluster Click Event Listener --- 
        timeline.on('click', function(props) {
            if (props.item === null) return; 

            const potentialClusterData = timeline.itemsData.get(props.item); 
            const isCluster = potentialClusterData && Array.isArray(potentialClusterData.items);
            
            if (isCluster && potentialClusterData.items) {
                const itemIdsInCluster = potentialClusterData.items.map(i => i.id);
                const clusteredItemsData = items.get(itemIdsInCluster, { returnType: 'Object' });

                let actionCounts = { aceCall: 0, aceSMS: 0, aceInvestigate: 0, orttoEmail: 0, orttoSMS: 0, myPage: 0, s2: 0 };
                let count = 0;

                for (const itemId in clusteredItemsData) {
                    count++;
                    const item = clusteredItemsData[itemId];
                    if (!item || !item.actions) continue;
                    
                    if (item.actions.ace && item.actions.ace.length > 0) {
                        item.actions.ace.forEach(a => {
                            if (a.aceActionType === 'Call') actionCounts.aceCall++;
                            else if (a.aceActionType === 'TwoWaySMS') actionCounts.aceSMS++;
                            else if (a.aceActionType === 'Investigate') actionCounts.aceInvestigate++;
                        });
                    }
                    if (item.actions.ortto && item.actions.ortto.length > 0) {
                        item.actions.ortto.forEach(a => {
                            if (a.orttoActionType === 'Email') actionCounts.orttoEmail++;
                            else if (a.orttoActionType === 'SMS') actionCounts.orttoSMS++;
                        });
                    }
                    if (item.actions.myPage && item.actions.myPage.length > 0) {
                        actionCounts.myPage += item.actions.myPage.length;
                    }
                     if (item.actions.s2 && item.actions.s2.length > 0) {
                        actionCounts.s2 += item.actions.s2.length;
                    }
                }

                // Build the alert string
                let alertText = `Cluster Details (${count} items):\n--------------------\n`;
                let details = [];
                if (actionCounts.aceCall > 0) details.push(`📞 Calls: ${actionCounts.aceCall}`);
                if (actionCounts.aceSMS > 0) details.push(`📱 ACE SMS: ${actionCounts.aceSMS}`);
                if (actionCounts.aceInvestigate > 0) details.push(`🔍 Investigate: ${actionCounts.aceInvestigate}`);
                if (actionCounts.orttoEmail > 0) details.push(`📧 Emails: ${actionCounts.orttoEmail}`);
                if (actionCounts.orttoSMS > 0) details.push(`📱 Ortto SMS: ${actionCounts.orttoSMS}`);
                if (actionCounts.myPage > 0) details.push(`📄 MyPage: ${actionCounts.myPage}`);
                
                alertText += details.join('\n');
                alert(alertText); 
            }
        });
        // --- END Cluster Click Event Listener ---

    } catch (error) {
        console.error("Error creating Vis Timeline:", error);
        container.textContent = 'Error rendering timeline. Check console.';
    }
} 