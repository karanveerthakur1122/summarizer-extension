# 🔍 Summarizer Chrome Extension

An advanced AI-powered Chrome extension that provides intelligent text summarization, code assistance, and image analysis directly in your browser. Features multimodal capabilities with Google Forms quiz support and robust compatibility with all webpage types, including protected content.

## ✨ Features

### 🎯 Core Functionality
- **Text Summarization**: AI-powered summarization of any selected text
- **Code Assistance**: Explain, complete, and fix code snippets
- **Text Improvement**: Grammar and clarity enhancement
- **Smart Selection**: Automatic text detection with intuitive UI

### 🖼️ Advanced Image Processing
- **Multimodal AI**: Analyze both text and images together
- **Google Forms Integration**: Automatic quiz answer generation with image support
- **Image-to-Text**: Convert and analyze diagrams, equations, charts, and photos
- **Background Image Detection**: Processes CSS background images

### 🔒 Protected Content Support
- **Universal Compatibility**: Works on all webpage types including protected content
- **Multiple Replacement Methods**: 7 different text replacement strategies
- **Clipboard Fallback**: Automatic clipboard copying with user instructions
- **Robust Error Handling**: Graceful fallbacks for restricted content

### ⌨️ Keyboard Shortcuts
- **Alt+S**: Open input panel anywhere or toggle Google Forms quiz mode
- **ESC**: Close all panels and popups
- **Enter**: Quick summarization in input mode

## 🚀 Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension is now ready to use!

## 🎮 Usage

### Basic Text Summarization
1. Select any text on a webpage
2. Click the 📄 icon that appears near your selection
3. Choose your desired action (Summarize, Fix, Code assistance)
4. View the AI-generated result
5. Replace original text, copy to clipboard, or dismiss

### Google Forms Quiz Mode
1. Navigate to any Google Form
2. Press **Alt+S** to activate quiz mode
3. AI will analyze all questions (including images) and provide answers
4. Press **Alt+S** again to hide answers

### Image-Based Questions
1. Select text near images (works automatically with Google Forms)
2. Extension detects and processes relevant images
3. AI analyzes both text and visual content
4. Provides comprehensive answers based on multimodal analysis

### Protected Content
1. Select text on protected/read-only pages
2. Extension automatically tries multiple replacement methods
3. If direct replacement fails, content is copied to clipboard
4. User receives clear instructions for manual replacement

## 🔧 Configuration

### API Key Setup
1. Click the extension icon in your toolbar
2. Enter your Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))
3. Save the configuration

### Development Mode
- Extension comes pre-configured with a development API key
- For production use, replace with your own API key

## 🧪 Testing

### Test Pages
- **debug.html**: Basic functionality testing
- **test-comprehensive.html**: Full feature testing with protected content
- **test-google-forms.html**: Google Forms simulation with image questions

### Console Commands
```javascript
// Test basic functionality
testSummarizerPopup()
testSummarizerAPI()

// Test code features
testCodeComplete()
testReplace()

// Test Google Forms mode
testGoogleForms()

// Run diagnostics
runAllTests()
showExtensionStatus()
```

## 🛠️ Technical Details

### Architecture
- **content.js**: Main content script with UI and processing logic
- **background.js**: API communication with Gemini AI
- **popup.js**: Settings and configuration interface
- **styles.css**: Complete styling for all UI components

### AI Models
- **Text Processing**: Gemini 1.5 Flash
- **Image Analysis**: Gemini 1.5 Flash (multimodal)
- **Fallback**: Multiple model support for reliability

### Image Processing Pipeline
1. **Detection**: Scans for relevant images (skips UI elements)
2. **Filtering**: Prioritizes content images over decorative ones
3. **Conversion**: Converts to base64 with size optimization
4. **Analysis**: Sends to Gemini Vision API with text context
5. **Integration**: Combines visual and textual analysis

### Text Replacement Methods
1. **Range API**: Standard DOM range manipulation
2. **Input Fields**: Direct value modification for form inputs
3. **execCommand**: Legacy browser command execution
4. **ContentEditable**: Specialized handling for editable content
5. **DOM Manipulation**: Direct text node modification
6. **Simulated Typing**: Event-based text input simulation
7. **Alternative execCommand**: Multiple command variations
8. **Clipboard Fallback**: Copy with user instructions

## 🎯 Google Forms Integration

### Automatic Detection
- Recognizes Google Forms URLs automatically
- Identifies quiz questions and images
- Processes multiple question types

### Image Processing
- Detects: Diagrams, equations, charts, photos, illustrations
- Supports: PNG, JPG, SVG, and other web formats
- Handles: Both direct images and CSS background images
- Optimizes: Size and quality for API processing

### Quiz Features
- **Mass Processing**: Alt+S processes all questions at once
- **Individual Analysis**: Select specific questions for detailed analysis
- **Visual Indicators**: Color-coded AI answers above questions
- **Toggle Mode**: Easy on/off switching

## 🔒 Privacy & Security

### Data Handling
- Text and images are sent to Google's Gemini API only when explicitly requested
- No persistent storage of user content
- API key stored locally in Chrome's secure storage
- No tracking or analytics

### Permissions
- **Active Tab**: Access current webpage content
- **Storage**: Save API key configuration
- **Host Permissions**: Work on all websites

## 🐛 Troubleshooting

### Extension Not Working
1. Check if extension is enabled in `chrome://extensions/`
2. Verify API key is configured in popup
3. Refresh the webpage and try again
4. Check browser console (F12) for error messages

### Text Replacement Issues
- Extension tries multiple methods automatically
- For protected content, use clipboard fallback
- Check console logs for specific error details

### Image Processing Problems
- Ensure images are loaded completely
- Check image format compatibility
- Verify stable internet connection
- Large images are automatically optimized

### Google Forms Not Detected
- Ensure you're on a forms.google.com URL
- Try refreshing the page
- Check console for detection messages

## 🚧 Development

### Setup
```bash
git clone <repository-url>
cd summarizer-extension
# Load in Chrome as unpacked extension
```

### File Structure
```
├── manifest.json          # Extension configuration
├── content.js             # Main content script
├── background.js          # Service worker
├── popup.html/js          # Settings interface
├── styles.css             # All styling
├── debug.html             # Basic testing
├── test-comprehensive.html # Full testing
├── test-google-forms.html  # Google Forms testing
└── README.md              # This file
```

### Key Functions
- `showInputPanel()`: Display main UI
- `sendToBackground()`: Process AI requests
- `replaceSelectedText()`: Handle text replacement
- `convertImageToBase64()`: Process images
- `extractQuestionText()`: Parse Google Forms questions

## 📈 Version History

### v2.0.0 (Current)
- ✅ Multimodal image processing
- ✅ Google Forms quiz integration
- ✅ Enhanced protected content support
- ✅ 7-method text replacement system
- ✅ Improved UI/UX with animations
- ✅ Comprehensive error handling
- ✅ Keyboard shortcuts (Alt+S, ESC)

### v1.0.0
- ✅ Basic text summarization
- ✅ Code assistance features
- ✅ Simple popup interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with provided test pages
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful language and vision models
- Chrome Extensions API for robust integration capabilities
- Open source community for inspiration and best practices

---

**🎯 Ready to enhance your browsing experience with AI-powered assistance!**

For support or questions, please check the console logs and test pages included with the extension.
