document.addEventListener('DOMContentLoaded', async () => {
  const settingsForm = document.getElementById('settingsForm');
  const apiKeyInput = document.getElementById('apiKey');
  const testConnectionBtn = document.getElementById('testConnection');
  const statusDiv = document.getElementById('status');

  // Load saved API key
  try {
    const result = await chrome.storage.local.get(['geminiApiKey']);
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
      // Show that API key is configured
      showStatus('✅ API key is configured and ready!', 'success');
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  // Handle form submission
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    try {
      // Save API key
      await chrome.storage.local.set({ geminiApiKey: apiKey });
      showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showStatus('Error saving settings', 'error');
    }
  });

  // Handle test connection
  testConnectionBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key first', 'error');
      return;
    }

    // Disable button during test
    testConnectionBtn.disabled = true;
    testConnectionBtn.textContent = 'Testing...';
    
    try {
      // Test the API with a simple request
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test. Please respond with "API connection successful".'
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 50,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0]) {
          showStatus('✅ API connection successful!', 'success');
          // Save the working API key
          await chrome.storage.local.set({ geminiApiKey: apiKey });
        } else {
          showStatus('❌ Unexpected API response', 'error');
        }
      } else {
        const errorData = await response.json();
        showStatus(`❌ API Error: ${errorData.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      showStatus('❌ Connection test failed. Check your internet connection.', 'error');
    } finally {
      // Re-enable button
      testConnectionBtn.disabled = false;
      testConnectionBtn.textContent = 'Test Connection';
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
});
