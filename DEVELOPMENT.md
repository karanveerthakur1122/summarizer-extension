# Development Guide

## Project Structure

The Summarizer Extension is built using vanilla JavaScript and follows the Manifest V3 standard for Chrome extensions.

### Core Files

1. **manifest.json** - Extension configuration and permissions
2. **content.js** - Injected into webpages to handle text selection and UI
3. **background.js** - Service worker for API calls and message handling
4. **styles.css** - Styling for injected UI elements
5. **popup.html/popup.js** - Extension popup for settings

## Development Setup

1. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

2. Make changes to the code

3. Reload the extension:
   - Click the refresh icon on the extension card in `chrome://extensions/`
   - Or use Ctrl+R while focused on the extensions page

## Key Components

### Content Script (content.js)

**Purpose**: Handles text selection detection and UI injection

**Key Functions**:
- `handleTextSelection()` - Detects when user selects text
- `showSummarizeButton()` - Creates and positions the summarize button
- `handleSummarizeClick()` - Sends text to background script for processing
- `showSummary()` - Displays the summary in a modal container

**Event Listeners**:
- `mouseup` and `keyup` for text selection
- `click` for UI interaction and cleanup

### Background Script (background.js)

**Purpose**: Handles API communication with Google Gemini

**Key Functions**:
- `handleSummarization()` - Main API call logic
- `getApiKey()` - Retrieves stored API key
- Message listener for content script communication

**API Configuration**:
- Model: gemini-pro
- Temperature: 0.7
- Max tokens: 1024

### Popup Interface (popup.html/popup.js)

**Purpose**: Settings management and API key configuration

**Features**:
- API key input and storage
- Connection testing
- Usage instructions
- Status feedback

## Styling

The extension uses a blue-purple gradient theme (`#667eea` to `#764ba2`) with modern CSS features:

- CSS Grid and Flexbox for layout
- CSS transitions and animations
- Custom scrollbars
- Responsive design
- High z-index values to ensure visibility

## Security Considerations

1. **API Key Storage**: Stored in `chrome.storage.local` (not synced)
2. **Content Security Policy**: Defined in manifest
3. **Permissions**: Minimal required permissions only
4. **HTTPS**: All API calls use HTTPS

## Testing

### Manual Testing Checklist

1. **Text Selection**:
   - [ ] Button appears on text selection
   - [ ] Button positioned correctly
   - [ ] Button disappears when clicking elsewhere

2. **Summarization**:
   - [ ] Basic summarization works
   - [ ] Context-aware summarization works
   - [ ] Loading states display correctly
   - [ ] Error handling works

3. **UI/UX**:
   - [ ] Animations smooth and appealing
   - [ ] Modal centers correctly
   - [ ] Responsive on different screen sizes
   - [ ] No conflicts with website styling

4. **Settings**:
   - [ ] API key saves correctly
   - [ ] Connection test works
   - [ ] Settings persist between sessions

### Test Websites

Good sites for testing:
- Wikipedia articles (long text)
- News websites (articles)
- Blog posts
- Documentation sites
- Various responsive layouts

## Common Issues

### Text Selection Not Working
- Check if website has `user-select: none` CSS
- Verify content script injection
- Check for JavaScript errors in console

### API Calls Failing
- Verify API key is correct
- Check network connectivity
- Confirm API quotas/limits
- Review error messages in background script

### UI Conflicts
- Adjust z-index values if needed
- Check for CSS namespace collisions
- Test on sites with custom CSS frameworks

## Building for Distribution

1. Remove development files:
   ```bash
   # Remove if present
   rm -rf node_modules/
   rm package-lock.json
   rm .git/
   ```

2. Add proper icons (16x16, 48x48, 128x128 PNG files)

3. Update manifest.json version

4. Create zip file:
   ```bash
   npm run zip
   ```

## Browser Compatibility

- **Chrome**: Full support (primary target)
- **Firefox**: Should work with minimal changes
- **Edge**: Compatible with Chrome extension format
- **Safari**: Would require conversion to Safari extension format

## Performance Considerations

- Minimal DOM manipulation
- Efficient event listeners
- Lazy loading of UI elements
- Proper cleanup on page unload
- Reasonable API rate limiting

## Future Enhancements

Potential features to add:
- Multiple AI model support
- Offline summarization
- Summary history
- Custom prompt templates
- Keyboard shortcuts
- Summary export options
