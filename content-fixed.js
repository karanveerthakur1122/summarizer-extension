(() => {
  'use strict';
  
  console.log('Summarizer extension content script loaded');

  let selectedText = '';
  let selectedRange = null;
  let summarizeButton = null;
  let inputPanel = null;
  let resultPopup = null;
  let isLoading = false;
  let googleFormsAnswers = null;
  let answersVisible = false;

  // Create and show the summarize button
  function showSummarizeButton(x, y) {
    hideSummarizeButton();
    
    summarizeButton = document.createElement('div');
    summarizeButton.className = 'summarizer-button';
    summarizeButton.innerHTML = '📄';
    
    // Ensure button is positioned correctly and visible
    summarizeButton.style.position = 'absolute';
    summarizeButton.style.left = `${x}px`;
    summarizeButton.style.top = `${y}px`;
    summarizeButton.style.zIndex = '999999';
    summarizeButton.style.display = 'block';
    
    // Add click handler to show input panel
    summarizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Main summarize button clicked, showing input panel');
      showInputPanel(x, y + 40);
    });
    
    console.log('Appending button to body');
    document.body.appendChild(summarizeButton);
  }

  // Show the input panel with suggestions
  function showInputPanel(x, y) {
    console.log('showInputPanel called at position:', x, y);
    hideInputPanel();

    inputPanel = document.createElement('div');
    inputPanel.className = 'summarizer-input-panel';
    inputPanel.style.left = `${x}px`;
    inputPanel.style.top = `${y}px`;
    inputPanel.style.position = 'absolute';
    inputPanel.style.zIndex = '999998';

    // Create header with close button
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '10px';
    header.style.paddingBottom = '5px';
    header.style.borderBottom = '1px solid #eee';
    
    const title = document.createElement('span');
    title.textContent = '📄 Summarizer';
    title.style.fontWeight = 'bold';
    title.style.color = '#333';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#666';
    closeBtn.style.padding = '2px 6px';
    closeBtn.style.borderRadius = '3px';
    closeBtn.title = 'Close (ESC)';
    
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Close button clicked');
      hideInputPanel();
    });
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#f0f0f0';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'none';
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create input field
    const inputField = document.createElement('textarea');
    inputField.className = 'summarizer-input';
    inputField.placeholder = 'Add context or questions...';
    inputField.rows = 3;

    // Create suggestion buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '8px';
    
    // First row - General actions
    const generalRow = document.createElement('div');
    generalRow.style.display = 'flex';
    generalRow.style.gap = '5px';
    
    const summarizeButton = document.createElement('button');
    summarizeButton.innerHTML = '📄 Summarize';
    summarizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Summarize button clicked');
      sendToBackground('summarize');
    });

    const fixButton = document.createElement('button');
    fixButton.innerHTML = '✏️ Fix Text';
    fixButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Fix Text button clicked');
      sendToBackground('fix');
    });
    
    generalRow.appendChild(summarizeButton);
    generalRow.appendChild(fixButton);

    // Second row - Code actions
    const codeRow = document.createElement('div');
    codeRow.style.display = 'flex';
    codeRow.style.gap = '5px';
    
    const explainCodeButton = document.createElement('button');
    explainCodeButton.innerHTML = '💡 Explain Code';
    explainCodeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Explain Code button clicked');
      sendToBackground('explain-code');
    });

    const completeCodeButton = document.createElement('button');
    completeCodeButton.innerHTML = '🔧 Complete Code';
    completeCodeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Complete Code button clicked');
      sendToBackground('complete-code');
    });
    
    const fixCodeButton = document.createElement('button');
    fixCodeButton.innerHTML = '🐛 Fix Code';
    fixCodeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Fix Code button clicked');
      sendToBackground('fix-code');
    });
    
    codeRow.appendChild(explainCodeButton);
    codeRow.appendChild(completeCodeButton);
    codeRow.appendChild(fixCodeButton);

    // Add rows to container
    buttonContainer.appendChild(generalRow);
    buttonContainer.appendChild(codeRow);

    // Add all elements to panel
    inputPanel.appendChild(header);
    inputPanel.appendChild(inputField);
    inputPanel.appendChild(buttonContainer);

    // Add enter key listener
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('Enter key pressed, sending to background');
        sendToBackground('summarize');
      }
    });

    // Add ESC key listener to close panel
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        console.log('ESC key pressed, closing panel');
        hideInputPanel();
      }
    });

    // Prevent panel from closing when interacting with it
    inputPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    inputPanel.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    
    inputPanel.addEventListener('mouseup', (e) => {
      e.stopPropagation();
    });
    
    console.log('Appending input panel to body');
    document.body.appendChild(inputPanel);
    console.log('Input panel appended successfully');
    
    // Focus the input field
    setTimeout(() => {
      inputField.focus();
    }, 50);
  }

  // Hide the summarize button
  function hideSummarizeButton() {
    if (summarizeButton) {
      summarizeButton.remove();
      summarizeButton = null;
    }
  }

  // Hide the input panel
  function hideInputPanel() {
    if (inputPanel) {
      console.log('Hiding input panel');
      inputPanel.remove();
      inputPanel = null;
    }
  }

  // Send the selection and context to the background script
  function sendToBackground(action) {
    console.log('sendToBackground called with action:', action);
    console.log('selectedText:', selectedText);
    
    if (!selectedText.trim()) {
      console.log('No selected text, aborting');
      alert('Please select some text first!');
      return;
    }

    const additionalContext = inputPanel ? inputPanel.querySelector('.summarizer-input').value.trim() : '';
    console.log('additionalContext:', additionalContext);

    const messageData = {
      action: 'summarize',
      mode: action,
      text: selectedText,
      context: additionalContext
    };
    
    console.log('Sending message to background:', messageData);
    
    // Show loading state
    if (inputPanel) {
      const buttons = inputPanel.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
      });
    }

    chrome.runtime.sendMessage(messageData, (response) => {
      console.log('=== RESPONSE RECEIVED ===');
      console.log('Raw response:', response);
      
      // Re-enable buttons
      if (inputPanel) {
        const buttons = inputPanel.querySelectorAll('button');
        buttons.forEach(btn => {
          btn.disabled = false;
          btn.style.opacity = '1';
        });
      }
      
      if (chrome.runtime.lastError) {
        console.error('Chrome runtime error:', chrome.runtime.lastError);
        alert('Extension error: ' + chrome.runtime.lastError.message);
        return;
      }
      
      if (response && response.success && response.summary) {
        console.log('SUCCESS! About to show popup with:', response.summary);
        showResultPopup(response.summary);
      } else {
        console.error('API returned error:', response ? response.error : 'No response received');
        alert('API Error: ' + (response ? response.error : 'No response received'));
      }
    });
  }

  // Show the result in a popup
  function showResultPopup(summary) {
    console.log('=== SHOWING RESULT POPUP ===');
    console.log('Summary:', summary);
    
    if (!summary) {
      console.error('No summary provided to showResultPopup');
      alert('Error: No summary to display');
      return;
    }
    
    // Hide input panel and button
    hideInputPanel();
    hideSummarizeButton();
    
    // Remove any existing popup
    if (resultPopup) {
      resultPopup.remove();
    }
    
    // Create result popup
    resultPopup = document.createElement('div');
    resultPopup.className = 'summarizer-result-popup';
    
    // Create header with close button
    const header = document.createElement('div');
    header.className = 'summarizer-result-header';
    header.innerHTML = `
      <span>📄 Result</span>
      <button class="summarizer-close-btn">✕</button>
    `;
    
    // Create content area
    const content = document.createElement('div');
    content.className = 'summarizer-result-content';
    content.textContent = summary;
    
    // Create action buttons
    const actions = document.createElement('div');
    actions.className = 'summarizer-result-actions';
    
    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'summarizer-action-btn summarizer-replace-btn';
    replaceBtn.innerHTML = '🔄 Replace Original';
    replaceBtn.onclick = () => {
      replaceSelectedText(summary);
      resultPopup.remove();
      resultPopup = null;
    };
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'summarizer-action-btn summarizer-copy-btn';
    copyBtn.innerHTML = '📋 Copy to Clipboard';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(summary).then(() => {
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => copyBtn.innerHTML = '📋 Copy to Clipboard', 2000);
      });
    };
    
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'summarizer-action-btn summarizer-dismiss-btn';
    dismissBtn.innerHTML = '❌ Dismiss';
    dismissBtn.onclick = () => {
      resultPopup.remove();
      resultPopup = null;
    };
    
    // Add buttons to actions
    actions.appendChild(replaceBtn);
    actions.appendChild(copyBtn);
    actions.appendChild(dismissBtn);
    
    // Add close button functionality
    header.querySelector('.summarizer-close-btn').onclick = () => {
      resultPopup.remove();
      resultPopup = null;
    };
    
    // Prevent popup from closing when clicked
    resultPopup.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Assemble popup
    resultPopup.appendChild(header);
    resultPopup.appendChild(content);
    resultPopup.appendChild(actions);
    
    // Add to page
    console.log('Appending popup to document body');
    document.body.appendChild(resultPopup);
    
    // Animate appearance
    setTimeout(() => {
      resultPopup.classList.add('summarizer-popup-visible');
      console.log('Popup should now be visible');
    }, 50);
    
    console.log('=== POPUP CREATION COMPLETE ===');
  }
  
  // Enhanced text replacement function - works with all webpage types
  function replaceSelectedText(summary) {
    console.log('=== ENHANCED REPLACE TEXT FUNCTION ===');
    console.log('Summary to replace with:', summary);
    console.log('Selected range:', selectedRange);
    console.log('Selected text:', selectedText);
    
    if (!summary) {
      console.error('No summary provided for replacement');
      alert('Cannot replace text: No summary available');
      return;
    }
    
    if (!selectedRange && !selectedText) {
      console.error('No selection available for replacement');
      copyToClipboardWithInstructions(summary);
      return;
    }
    
    // Method 1: Handle input fields and textareas (most reliable)
    try {
      console.log('Attempting Method 1: Input field replacement');
      
      // Check if we have a pseudo-range for input fields
      if (selectedRange && selectedRange.element && selectedRange.start !== undefined) {
        const element = selectedRange.element;
        const start = selectedRange.start;
        const end = selectedRange.end;
        const currentValue = element.value;
        
        element.value = currentValue.substring(0, start) + summary + currentValue.substring(end);
        element.selectionStart = element.selectionEnd = start + summary.length;
        element.focus();
        
        // Trigger events to notify the page of the change
        ['input', 'change', 'keyup'].forEach(eventType => {
          const event = new Event(eventType, { bubbles: true });
          element.dispatchEvent(event);
        });
        
        console.log('✅ Text replaced in input field using pseudo-range');
        return;
      }
      
      // Check for currently active input elements
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const start = activeElement.selectionStart || 0;
        const end = activeElement.selectionEnd || activeElement.value.length;
        const text = activeElement.value;
        
        // Check if the selected text matches what we expect
        const selectedInField = text.substring(start, end);
        if (selectedInField.trim() === selectedText.trim() || start !== end) {
          activeElement.value = text.substring(0, start) + summary + text.substring(end);
          activeElement.selectionStart = activeElement.selectionEnd = start + summary.length;
          activeElement.focus();
          
          // Trigger events
          ['input', 'change', 'keyup'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            activeElement.dispatchEvent(event);
          });
          
          console.log('✅ Text replaced in active input field');
          return;
        }
      }
    } catch (error1) {
      console.log('❌ Input field method failed:', error1);
    }
    
    // Method 2: Standard Range API replacement (for contentEditable and regular text)
    try {
      console.log('Attempting Method 2: Standard Range API');
      
      // Ensure we have a valid range
      if (selectedRange && typeof selectedRange.getBoundingClientRect === 'function') {
        const selection = window.getSelection();
        selection.removeAllRanges();
        
        // Try to select the range again to ensure it's still valid
        try {
          selection.addRange(selectedRange);
        } catch (rangeError) {
          console.log('Range invalid, trying fresh selection...');
          throw new Error('Range invalid');
        }
        
        if (!selectedRange.collapsed) {
          selectedRange.deleteContents();
          const textNode = document.createTextNode(summary);
          selectedRange.insertNode(textNode);
          
          // Position cursor after the inserted text
          selectedRange.setStartAfter(textNode);
          selectedRange.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(selectedRange);
          
          console.log('✅ Text replaced successfully using Standard Range API');
          return;
        }
      }
    } catch (error2) {
      console.log('❌ Standard Range API failed:', error2);
    }
    
    // Method 3: Try to find and replace using current selection
    try {
      console.log('Attempting Method 3: Fresh selection approach');
      
      const selection = window.getSelection();
      const currentSelectedText = selection.toString().trim();
      
      // If current selection matches our stored text, use it
      if (currentSelectedText === selectedText.trim() && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(summary));
        
        console.log('✅ Text replaced using fresh selection');
        return;
      }
    } catch (error3) {
      console.log('❌ Fresh selection approach failed:', error3);
    }
    
    // Method 4: ContentEditable replacement
    try {
      console.log('Attempting Method 4: ContentEditable replacement');
      
      if (selectedRange && selectedRange.commonAncestorContainer) {
        const container = selectedRange.commonAncestorContainer;
        let editableElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
        
        while (editableElement && !editableElement.isContentEditable && editableElement !== document.body) {
          editableElement = editableElement.parentElement;
        }
        
        if (editableElement && editableElement.isContentEditable) {
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(selectedRange);
          
          selectedRange.deleteContents();
          selectedRange.insertNode(document.createTextNode(summary));
          
          // Trigger events for contentEditable
          ['input', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            editableElement.dispatchEvent(event);
          });
          
          console.log('✅ Text replaced in contentEditable element');
          return;
        }
      }
    } catch (error4) {
      console.log('❌ ContentEditable method failed:', error4);
    }
    
    // Method 5: execCommand approach
    try {
      console.log('Attempting Method 5: execCommand');
      
      if (selectedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectedRange);
        
        if (document.execCommand && document.execCommand('insertText', false, summary)) {
          console.log('✅ Text replaced using execCommand');
          return;
        }
      }
    } catch (error5) {
      console.log('❌ execCommand failed:', error5);
    }
    
    // Method 6: Text node manipulation (direct DOM approach)
    try {
      console.log('Attempting Method 6: Direct text node manipulation');
      
      if (selectedRange && selectedRange.startContainer && selectedRange.startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = selectedRange.startContainer;
        const startOffset = selectedRange.startOffset;
        const endOffset = selectedRange.endOffset;
        const originalText = textNode.textContent;
        
        const newText = originalText.substring(0, startOffset) + summary + originalText.substring(endOffset);
        textNode.textContent = newText;
        
        console.log('✅ Text replaced using direct text node manipulation');
        return;
      }
    } catch (error6) {
      console.log('❌ Direct text node manipulation failed:', error6);
    }
    
    // Method 7: Search and replace approach (last resort before clipboard)
    try {
      console.log('Attempting Method 7: Search and replace');
      
      // Try to find the selected text in the document and replace it
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        const nodeText = node.textContent;
        if (nodeText.includes(selectedText.trim())) {
          node.textContent = nodeText.replace(selectedText.trim(), summary);
          console.log('✅ Text replaced using search and replace');
          return;
        }
      }
    } catch (error7) {
      console.log('❌ Search and replace failed:', error7);
    }

    // Final fallback: Copy to clipboard with detailed instructions
    console.log('All replacement methods failed, using clipboard fallback');
    copyToClipboardWithInstructions(summary);
  }
  
  // Enhanced clipboard fallback with better user experience
  function copyToClipboardWithInstructions(summary) {
    console.log('Using clipboard fallback method');
    
    try {
      navigator.clipboard.writeText(summary).then(() => {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          background: linear-gradient(135deg, #4CAF50, #45a049) !important;
          color: white !important;
          padding: 15px 20px !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
          z-index: 999999 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-size: 14px !important;
          max-width: 300px !important;
          animation: slideIn 0.3s ease-out !important;
        `;
        
        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">📋</span>
            <div>
              <div style="font-weight: bold; margin-bottom: 5px;">Text Copied!</div>
              <div style="font-size: 12px; opacity: 0.9;">
                Content may be protected. Please:
                <br>1. Select the original text
                <br>2. Press Ctrl+V to paste
              </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 5000);
        
        console.log('✅ Text copied to clipboard with notification');
      }).catch(() => {
        // If clipboard API fails, show prompt
        const shortSummary = summary.length > 200 ? summary.substring(0, 200) + '...' : summary;
        prompt(
          `🔒 Cannot directly replace text on this protected page.\n\nYour result is below - please copy it manually:\n\n` +
          `Instructions:\n1. Select the original text\n2. Copy this result and paste it\n\n` +
          `Result:`,
          summary
        );
        console.log('Showed result in prompt as clipboard fallback');
      });
    } catch (error) {
      console.log('All replacement methods failed:', error);
      alert(`🔒 Protected content detected. Result: ${summary.substring(0, 100)}${summary.length > 100 ? '...' : ''}`);
    }
  }

  // Handle text selection with comprehensive compatibility
  function handleTextSelection(event) {
    // Don't interfere if user is interacting with our UI
    if (event && event.target) {
      const isOurElement = event.target.closest('.summarizer-input-panel') || 
                          event.target.closest('.summarizer-result-popup') ||
                          event.target.closest('.summarizer-button') ||
                          event.target.closest('.gforms-ai-answer');
      if (isOurElement) {
        return;
      }
    }
    
    // Don't process if input panel is open
    if (inputPanel) {
      return;
    }
    
    setTimeout(() => {
      let text = '';
      let range = null;
      
      try {
        // Method 1: Try standard window.getSelection()
        const selection = window.getSelection();
        text = selection.toString().trim();
        
        if (text.length > 0 && selection.rangeCount > 0) {
          range = selection.getRangeAt(0).cloneRange();
        }
      } catch (error1) {
        console.log('Standard selection failed:', error1);
      }
      
      // Method 2: Try document.getSelection() if window fails
      if (!text && document.getSelection) {
        try {
          const docSelection = document.getSelection();
          text = docSelection.toString().trim();
          if (text.length > 0 && docSelection.rangeCount > 0) {
            range = docSelection.getRangeAt(0).cloneRange();
          }
        } catch (error2) {
          console.log('Document selection failed:', error2);
        }
      }
      
      // Method 3: Try to get text from active input/textarea elements
      if (!text) {
        try {
          const activeElement = document.activeElement;
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            if (start !== end) {
              text = activeElement.value.substring(start, end).trim();
              // Create a pseudo-range for input fields
              range = { start, end, element: activeElement };
            }
          }
        } catch (error3) {
          console.log('Input field selection failed:', error3);
        }
      }
      
      // Method 4: Try contentEditable elements
      if (!text) {
        try {
          const editableElements = document.querySelectorAll('[contenteditable="true"]');
          for (let element of editableElements) {
            if (element.contains(document.activeElement) || element === document.activeElement) {
              const elementSelection = element.ownerDocument.getSelection();
              if (elementSelection) {
                text = elementSelection.toString().trim();
                if (text.length > 0 && elementSelection.rangeCount > 0) {
                  range = elementSelection.getRangeAt(0).cloneRange();
                  break;
                }
              }
            }
          }
        } catch (error4) {
          console.log('ContentEditable selection failed:', error4);
        }
      }
      
      console.log('Text selection detected:', text.length > 0 ? 'YES' : 'NO', text.substring(0, 50));
      
      if (text.length > 10) {
        selectedText = text;
        selectedRange = range;
        
        let rect;
        try {
          if (range && range.getBoundingClientRect) {
            rect = range.getBoundingClientRect();
          } else if (range && range.element) {
            // For input fields, get element rect
            rect = range.element.getBoundingClientRect();
          } else {
            // Fallback to current selection
            const currentSelection = window.getSelection();
            if (currentSelection.rangeCount > 0) {
              rect = currentSelection.getRangeAt(0).getBoundingClientRect();
            }
          }
        } catch (rectError) {
          console.log('Could not get selection rect:', rectError);
          // Use viewport center as fallback
          rect = {
            left: window.innerWidth / 2,
            bottom: window.innerHeight / 2
          };
        }
        
        if (rect) {
          const x = Math.max(10, rect.left + window.scrollX);
          const y = Math.max(10, rect.bottom + window.scrollY + 10);
          
          console.log('Showing button at:', x, y);
          showSummarizeButton(x, y);
        }
      } else {
        selectedText = '';
        selectedRange = null;
        hideSummarizeButton();
      }
    }, 150); // Increased timeout for better compatibility
  }

  // Handle clicks outside the extension UI
  function handleDocumentClick(event) {
    const clickedElement = event.target;
    const isExtensionElement = clickedElement.closest('.summarizer-button') || 
                              clickedElement.closest('.summarizer-input-panel') ||
                              clickedElement.closest('.summarizer-result-popup') ||
                              clickedElement.closest('.gforms-ai-answer');
    
    if (!isExtensionElement) {
      console.log('Outside click - hiding button only');
      hideSummarizeButton();
      // Don't auto-hide input panel - user must close manually
    }
  }

  // Comprehensive event listeners for all content types
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection); // For keyboard selection
  document.addEventListener('click', handleDocumentClick);
  
  // Additional listeners for better compatibility
  document.addEventListener('selectionchange', handleTextSelection);
  window.addEventListener('mouseup', handleTextSelection); // Fallback for window events
  
  // Special handling for input fields and textareas
  document.addEventListener('input', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      setTimeout(handleTextSelection, 100);
    }
  });
  
  // Handle focus events for contentEditable elements
  document.addEventListener('focusin', (event) => {
    if (event.target.isContentEditable) {
      setTimeout(handleTextSelection, 100);
    }
  });
  
  // Cross-frame support (for iframes)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.addEventListener('mouseup', handleTextSelection);
    }
  } catch (crossOriginError) {
    console.log('Cross-origin frame access blocked (normal for security)');
  }
  
  // Global keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // ALT + S to open summarizer panel or toggle Google Forms answers
    if (event.altKey && event.key.toLowerCase() === 's') {
      event.preventDefault();
      console.log('ALT + S pressed');
      
      // Priority 1: Handle Google Forms quiz mode
      if (isGoogleForm()) {
        console.log('Google Form detected - toggling quiz answers');
        toggleGoogleFormsAnswers();
        return;
      }
      
      // Priority 2: Regular summarizer functionality
      console.log('Regular mode - opening summarizer panel');
      
      // Try to get current text selection
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 0) {
        selectedText = text;
        selectedRange = selection.getRangeAt(0).cloneRange();
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        const x = Math.max(10, rect.left + window.scrollX);
        const y = rect.bottom + window.scrollY + 10;
        showInputPanel(x, y);
      } else {
        // Show panel at center of screen if no text selected
        const x = Math.max(10, (window.innerWidth / 2) - 160);
        const y = Math.max(10, (window.innerHeight / 2) - 100);
        showInputPanel(x, y);
        
        // Try to use any previously selected text
        if (!selectedText) {
          alert('Please select some text first, then press ALT+S');
        }
      }
      return;
    }
    
    // ESC to close panels
    if (event.key === 'Escape') {
      if (resultPopup) {
        resultPopup.remove();
        resultPopup = null;
        console.log('ESC pressed - closing result popup');
      } else if (inputPanel) {
        hideInputPanel();
        console.log('ESC pressed - closing input panel');
      }
    }
  });
  
  // ===== GOOGLE FORMS QUIZ FUNCTIONALITY =====
  
  function isGoogleForm() {
    return window.location.hostname === 'docs.google.com' && 
           window.location.pathname.includes('/forms/');
  }
  
  function toggleGoogleFormsAnswers() {
    if (!isGoogleForm()) {
      console.log('Not a Google Form - ignoring quiz mode');
      return false;
    }
    
    console.log('Google Form detected - toggling answers');
    
    if (answersVisible) {
      hideGoogleFormsAnswers();
    } else {
      showGoogleFormsAnswers();
    }
    
    return true;
  }
  
  function showGoogleFormsAnswers() {
    console.log('🎓 Showing Google Forms answers...');
    
    // Find all questions in the form using multiple selectors
    const questions = document.querySelectorAll([
      '[role="listitem"]',
      '.freebirdFormviewerViewItemsItemItem',
      '.freebirdFormviewerViewItemsItemItemTitle',
      '[data-item-id]',
      '.Qr7Oae'
    ].join(', '));
    
    console.log(`Found ${questions.length} potential questions`);
    
    let processedCount = 0;
    questions.forEach((question, index) => {
      try {
        // Extract question text and images
        const questionData = extractQuestionText(question);
        
        if (questionData && (questionData.text.length > 10 || questionData.hasImage)) {
          // Generate answer using AI
          generateQuizAnswer(questionData, question, index);
          processedCount++;
        }
      } catch (error) {
        console.log(`Error processing question ${index}:`, error);
      }
    });
    
    answersVisible = true;
    console.log(`✅ Processed ${processedCount} questions with AI analysis`);
    
    // Show notification
    showNotification(`🎓 Processing ${processedCount} quiz questions...`, 'success');
  }
  
  function hideGoogleFormsAnswers() {
    console.log('🧹 Hiding Google Forms answers...');
    
    // Remove all answer displays
    const answerElements = document.querySelectorAll('.gforms-ai-answer');
    answerElements.forEach(element => element.remove());
    
    answersVisible = false;
    console.log(`✅ Removed ${answerElements.length} answer displays`);
    
    // Show notification
    showNotification(`🧹 Cleared ${answerElements.length} AI answers`, 'info');
  }
  
  function extractQuestionText(questionElement) {
    let questionText = '';
    let hasImage = false;
    let imageData = [];
    
    // Try multiple selectors to find question text
    const textSelectors = [
      '.freebirdFormviewerViewItemsItemItemTitle',
      '[role="heading"]',
      '.exportLabel',
      '.freebirdFormviewerViewItemsTextTextValue',
      '.freebirdFormviewerViewItemsItemItemHeader',
      '.freebirdFormviewerViewItemsItemItemTitleContainer',
      '.freebirdFormviewerViewItemsItemItemTitle div',
      'h1', 'h2', 'h3', 'h4', // Generic headings
      '.question-title', '.question-text', // Common question selectors
      '.M7eMe', '.geS5n', '.AgroKb' // Google Forms specific classes
    ];
    
    for (const selector of textSelectors) {
      const element = questionElement.querySelector(selector);
      if (element && element.textContent.trim()) {
        questionText = element.textContent.trim();
        if (questionText.length > 5) break; // Only accept meaningful text
      }
    }
    
    // Enhanced image detection
    const images = questionElement.querySelectorAll('img');
    if (images.length > 0) {
      console.log(`🖼️ Found ${images.length} images in question`);
      
      for (const img of images) {
        // Skip icons, logos, and decorative images
        const skipPatterns = [
          'icon', 'logo', 'avatar', 'profile', 'decoration', 'ui', 'button', 'arrow',
          'google', 'forms', 'menu', 'close', 'check', 'radio', 'checkbox'
        ];
        
        const imgSrc = img.src || '';
        const imgAlt = (img.alt || '').toLowerCase();
        const imgClass = (img.className || '').toLowerCase();
        
        // Skip if it's clearly a UI element
        const isUIElement = skipPatterns.some(pattern => 
          imgSrc.toLowerCase().includes(pattern) ||
          imgAlt.includes(pattern) ||
          imgClass.includes(pattern)
        );
        
        // Only include meaningful images
        if (!isUIElement && imgSrc && 
            ((img.naturalWidth > 100 && img.naturalHeight > 100) || // Reasonable size
             (!img.naturalWidth && img.width > 100 && img.height > 100))) {
          
          hasImage = true;
          imageData.push({
            src: imgSrc,
            alt: img.alt || '',
            width: img.naturalWidth || img.width || 0,
            height: img.naturalHeight || img.height || 0,
            className: img.className || '',
            title: img.title || ''
          });
          
          console.log('📸 Relevant image found:', {
            src: imgSrc.substring(0, 80) + '...',
            alt: img.alt,
            size: `${img.naturalWidth || img.width}x${img.naturalHeight || img.height}`
          });
        }
      }
    }
    
    // Check for background images in CSS
    const elementsWithBgImages = questionElement.querySelectorAll('*');
    for (const element of elementsWithBgImages) {
      try {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
          const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
          if (urlMatch && urlMatch[1] && !urlMatch[1].includes('data:image/svg')) {
            hasImage = true;
            imageData.push({
              src: urlMatch[1],
              alt: 'Background image',
              width: element.offsetWidth || 0,
              height: element.offsetHeight || 0,
              className: element.className || '',
              type: 'background'
            });
            console.log('🖼️ Background image found:', urlMatch[1].substring(0, 80));
          }
        }
      } catch (styleError) {
        // Ignore style access errors
      }
    }
    
    // If no direct question text found, try to extract from surrounding context
    if (!questionText || questionText.length < 10) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        questionElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            const text = node.textContent.trim();
            return text.length > 5 && !text.match(/^[\d\.\)]+$/) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        },
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node.textContent.trim());
      }
      
      if (textNodes.length > 0) {
        questionText = textNodes.join(' ').trim();
        // Limit length to avoid noise
        if (questionText.length > 800) {
          questionText = questionText.substring(0, 800) + '...';
        }
      }
    }
    
    // Return null if no meaningful content found
    if (!questionText && !hasImage) {
      return null;
    }
    
    return {
      text: questionText || 'Image-based question',
      hasImage: hasImage,
      imageData: imageData,
      imageCount: imageData.length
    };
  }
  
  async function generateQuizAnswer(questionData, questionElement, index) {
    if (!questionData) {
      console.log(`No question data for question ${index}`);
      return;
    }
    
    const { text, hasImage, imageData, imageCount } = questionData;
    console.log(`🤖 Generating answer for question ${index}: ${text.substring(0, 60)}...`);
    console.log(`📊 Question has ${imageCount || 0} images`);
    
    let messageData = {
      action: 'summarize',
      mode: 'quiz-answer',
      text: text,
      context: 'This is a quiz question. Please provide a concise, accurate answer.',
      hasImage: hasImage
    };
    
    // If there are images, process the most relevant one
    if (hasImage && imageData && imageData.length > 0) {
      try {
        console.log(`🖼️ Processing ${imageData.length} images for question ${index}`);
        
        // Sort images by relevance (larger images first, background images last)
        const sortedImages = imageData.sort((a, b) => {
          if (a.type === 'background' && b.type !== 'background') return 1;
          if (b.type === 'background' && a.type !== 'background') return -1;
          return (b.width * b.height) - (a.width * a.height);
        });
        
        // Try to convert the most relevant image
        let base64Image = null;
        let usedImageInfo = null;
        
        for (const imgInfo of sortedImages) {
          try {
            console.log(`🔄 Converting image: ${imgInfo.src.substring(0, 60)}...`);
            base64Image = await convertImageToBase64(imgInfo.src);
            if (base64Image) {
              usedImageInfo = imgInfo;
              console.log(`✅ Successfully converted image for question ${index}`);
              break;
            }
          } catch (error) {
            console.log(`❌ Failed to convert image: ${error.message}`);
            continue;
          }
        }
        
        if (base64Image && usedImageInfo) {
          messageData.imageData = {
            base64: base64Image,
            alt: usedImageInfo.alt,
            description: `Image in question ${index}. Alt: "${usedImageInfo.alt || 'none'}". Size: ${usedImageInfo.width}x${usedImageInfo.height}`,
            originalSrc: usedImageInfo.src
          };
          messageData.context = `This is a quiz question with an image (${usedImageInfo.width}x${usedImageInfo.height}). Analyze both the text and image to provide an accurate answer. Image description: "${usedImageInfo.alt || 'none'}"`;
          console.log(`🎯 Image data included for question ${index}`);
        } else {
          console.log(`⚠️ Failed to process any images for question ${index}`);
          messageData.context = `This is a quiz question that may contain images, but they couldn't be processed. Focus on the text: "${text}"`;
        }
      } catch (error) {
        console.log(`❌ Error processing images for question ${index}:`, error);
        messageData.context = `This is a quiz question with images that couldn't be processed. Focus on the text.`;
      }
    }
    
    // Send to background for AI processing
    console.log(`📤 Sending question ${index} to AI...`);
    
    chrome.runtime.sendMessage(messageData, (response) => {
      if (response && response.success && response.summary) {
        displayQuizAnswer(questionElement, response.summary, index, hasImage);
        console.log(`✅ Generated answer for question ${index}`);
      } else {
        console.log(`❌ Failed to generate answer for question ${index}:`, response ? response.error : 'No response');
        // Show fallback answer for image questions
        if (hasImage) {
          displayQuizAnswer(questionElement, '🖼️ Image question detected - manual review recommended', index, hasImage);
        } else {
          displayQuizAnswer(questionElement, '❌ Failed to generate answer - please try again', index, hasImage);
        }
      }
    });
  }
  
  // Enhanced helper function to convert image to base64
  async function convertImageToBase64(imageSrc) {
    try {
      console.log('🔄 Converting image to base64:', imageSrc.substring(0, 80));
      
      // Handle data URLs directly
      if (imageSrc.startsWith('data:image/')) {
        console.log('✅ Image is already a data URL');
        return imageSrc;
      }
      
      // Handle relative URLs
      let fullImageSrc = imageSrc;
      if (imageSrc.startsWith('/')) {
        fullImageSrc = window.location.origin + imageSrc;
      } else if (imageSrc.startsWith('./')) {
        fullImageSrc = window.location.href.replace(/[^/]*$/, '') + imageSrc.substring(2);
      } else if (!imageSrc.startsWith('http')) {
        fullImageSrc = window.location.href.replace(/[^/]*$/, '') + imageSrc;
      }
      
      // Try multiple methods to load and convert the image
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          console.log('⏰ Image conversion timeout after 10 seconds');
          resolve(null);
        }, 10000);
        
        // Method 1: Create canvas and draw image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          try {
            clearTimeout(timeoutId);
            console.log(`📏 Image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
            
            // Set canvas size to image size (limit to reasonable dimensions for API)
            const maxSize = 1024; // Reasonable limit for API processing
            let { width, height } = img;
            
            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height);
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
              console.log(`📐 Resizing image to: ${width}x${height}`);
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to base64 with good quality
            const base64 = canvas.toDataURL('image/jpeg', 0.85);
            console.log(`✅ Image converted to base64: ${Math.round(base64.length / 1024)}KB`);
            resolve(base64);
          } catch (error) {
            clearTimeout(timeoutId);
            console.log('❌ Canvas conversion failed:', error);
            resolve(null);
          }
        };
        
        img.onerror = (error) => {
          clearTimeout(timeoutId);
          console.log('❌ Image load failed:', error);
          
          // Method 2: Try fetching as blob and converting
          fetch(fullImageSrc)
            .then(response => {
              if (!response.ok) throw new Error('Fetch failed');
              return response.blob();
            })
            .then(blob => {
              const reader = new FileReader();
              reader.onload = () => {
                console.log('✅ Image converted via fetch + FileReader');
                resolve(reader.result);
              };
              reader.onerror = () => {
                console.log('❌ FileReader failed');
                resolve(null);
              };
              reader.readAsDataURL(blob);
            })
            .catch(fetchError => {
              console.log('❌ Fetch method also failed:', fetchError);
              resolve(null);
            });
        };
        
        // Configure image loading
        img.crossOrigin = 'anonymous'; // Try to handle CORS
        
        // Try different approaches for loading
        try {
          img.src = fullImageSrc;
        } catch (error) {
          console.log('❌ Direct image loading failed:', error);
          resolve(null);
        }
      });
    } catch (error) {
      console.log('❌ Image conversion error:', error);
      return null;
    }
  }
  
  function displayQuizAnswer(questionElement, answer, index, hasImage) {
    // Remove any existing answer for this question
    const existingAnswer = questionElement.querySelector('.gforms-ai-answer');
    if (existingAnswer) {
      existingAnswer.remove();
    }
    
    // Create answer display element
    const answerDiv = document.createElement('div');
    answerDiv.className = 'gforms-ai-answer';
    answerDiv.style.cssText = `
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
      color: white !important;
      padding: 8px 12px !important;
      margin: 5px 0 10px 0 !important;
      border-radius: 8px !important;
      font-size: 13px !important;
      font-weight: bold !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      z-index: 1000 !important;
      position: relative !important;
      border: 1px solid #45a049 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      line-height: 1.4 !important;
      animation: slideInFromTop 0.3s ease-out !important;
    `;
    
    const imageIcon = hasImage ? '🖼️ ' : '';
    answerDiv.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="font-size: 16px; margin-top: 1px;">🤖</span>
        <div style="flex: 1;">
          <div style="font-size: 11px; opacity: 0.9; margin-bottom: 3px;">
            ${imageIcon}AI Answer #${index + 1}
          </div>
          <div style="font-weight: normal; font-size: 12px;">
            ${answer}
          </div>
        </div>
      </div>
    `;
    
    // Insert at the top of the question
    questionElement.insertBefore(answerDiv, questionElement.firstChild);
    
    console.log(`✅ Displayed answer for question ${index}`);
  }
  
  // Utility function to show notifications
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
      success: '#4CAF50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196F3'
    };
    
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: ${colors[type]} !important;
      color: white !important;
      padding: 12px 16px !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
      z-index: 999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      max-width: 280px !important;
      animation: slideIn 0.3s ease-out !important;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
  
  console.log('Event listeners attached successfully (including ALT+S shortcut)');
  
  // Check if this is a Google Form and show special message
  if (isGoogleForm()) {
    console.log('\n🎯 GOOGLE FORMS QUIZ MODE AVAILABLE!');
    console.log('📋 Special Features:');
    console.log('  • ALT+S → Toggle quiz answers on/off');
    console.log('  • AI analyzes both text and images in questions');
    console.log('  • Answers appear above each question');
    console.log('  • Press ALT+S again to hide answers');
    console.log('');
    
    showNotification('🎓 Google Forms detected! Press ALT+S for quiz mode.', 'info');
  }
  
  console.log('\n🎯 SUMMARIZER EXTENSION READY!');
  console.log('📋 Features:');
  console.log('  • Select text → 📄 icon appears');
  console.log('  • ALT+S → Open panel anywhere');
  console.log('  • Multiple modes: Summarize, Fix Text, Explain/Complete/Fix Code');
  console.log('  • Works on all webpage types (protected content supported)');
  console.log('  • ESC to close panels');
  if (isGoogleForm()) {
    console.log('  • Google Forms: ALT+S for quiz answers with image support');
  }
  console.log('');

  // Test functions for debugging
  window.testSummarizerPopup = function() {
    showResultPopup('This is a test popup to verify the functionality is working correctly!');
  };
  
  window.testSummarizerAPI = function() {
    selectedText = 'This is a test text to summarize.';
    sendToBackground('summarize');
  };
  
  window.testCodeComplete = function() {
    selectedText = 'function calculateSum(a, b) {';
    sendToBackground('complete-code');
  };
  
  window.testGoogleForms = function() {
    if (isGoogleForm()) {
      toggleGoogleFormsAnswers();
    } else {
      console.log('Not on a Google Form. Navigate to a Google Form to test this feature.');
      showNotification('Not on a Google Form', 'warning');
    }
  };
  
  window.testReplace = function() {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      selectedText = text;
      selectedRange = selection.getRangeAt(0).cloneRange();
      console.log('Testing replace with selected text:', text);
      replaceSelectedText('REPLACED: ' + text);
    } else {
      alert('Please select some text first, then run testReplace()');
    }
  };
  
  console.log('🧪 Test functions available:');
  console.log('  • testSummarizerPopup() - Test popup display');
  console.log('  • testSummarizerAPI() - Test full API flow');
  console.log('  • testCodeComplete() - Test code completion');
  console.log('  • testReplace() - Test text replacement (select text first)');
  if (isGoogleForm()) {
    console.log('  • testGoogleForms() - Toggle quiz answers (Google Forms only)');
  }
  console.log('\n💡 Try ALT+S after selecting text!');
  if (isGoogleForm()) {
    console.log('🏆 On Google Forms: ALT+S toggles quiz answers with image support!');
  }
})();
