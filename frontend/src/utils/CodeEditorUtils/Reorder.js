function reorderTabsInTree(node, activeId, overId) {
  if (node.type === "panel") {
    const oldIndex = node.tabs.indexOf(activeId);
    const newIndex = node.tabs.indexOf(overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTabs = [...node.tabs];
      const [moved] = newTabs.splice(oldIndex, 1);
      newTabs.splice(newIndex, 0, moved);

      return {
        ...node,
        tabs: newTabs
      };
    }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child =>
        reorderTabsInTree(child, activeId, overId)
      )
    };
  }

  return node;
}

function removeTabFromTree(node, tabId) {
  if (node.type === "panel") {
    return {
      ...node,
      tabs: node.tabs.filter(t => t !== tabId)
    };
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child =>
        removeTabFromTree(child, tabId)
      )
    };
  }

  return node;
}

function addTabToPanel(node, targetId, tabId, beforeTabId = null) {
  if (node.type === "panel" && node.id === targetId) {
    // If beforeTabId is specified, insert before that tab
    if (beforeTabId) {
      const index = node.tabs.indexOf(beforeTabId);
      const newTabs = [...node.tabs];
      newTabs.splice(index, 0, tabId);
      return {
        ...node,
        tabs: newTabs
      };
    }
    // Otherwise add to end
    return {
      ...node,
      tabs: [...node.tabs, tabId]
    };
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child =>
        addTabToPanel(child, targetId, tabId, beforeTabId)
      )
    };
  }

  return node;
}

function splitPanelInTree(node, panelId, position, tabId) {
  if (node.type === "panel" && node.id === panelId) {
    const newPanel = {
      type: "panel",
      id: `panel-${Date.now()}`,
      tabs: [tabId]
    };


    if (position === "left" || position === "right") {
      return {
        type: "row",
        children:
          position === "left"
            ? [newPanel, node]
            : [node, newPanel]
      };
    }

  
    if (position === "top" || position === "bottom") {
      return {
        type: "column",
        children:
          position === "top"
            ? [newPanel, node]
            : [node, newPanel]
      };
    }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child =>
        splitPanelInTree(child, panelId, position, tabId)
      )
    };
  }

  return node;
}

function cleanupEmptyPanels(node) {
  if (!node) return null;

  if (node.type === "panel") {
    return node.tabs.length === 0 ? null : node;
  }

  if (node.children) {
    const cleanedChildren = node.children
      .map(cleanupEmptyPanels)
      .filter(Boolean);

    if (cleanedChildren.length === 0) return null;
    if (cleanedChildren.length === 1) return cleanedChildren[0];

    return {
      ...node,
      children: cleanedChildren
    };
  }

  return node;
}

export { reorderTabsInTree, removeTabFromTree, addTabToPanel, splitPanelInTree, cleanupEmptyPanels }