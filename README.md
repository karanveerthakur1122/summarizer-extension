# 🤖 AI Summarizer - Smart Text & Quiz Assistant

A powerful Chrome extension that provides AI-powered text summarization, Google Forms quiz solving, and intelligent text processing using Google Gemini API.

## ✨ Features

### 📄 Text Summarization
- **Smart Text Selection**: Select any text on any webpage
- **Multiple AI Actions**: Summarize, explain, fix text, complete code, and more
- **Context-Aware**: Add custom context for better results
- **Text Replacement**: Replace selected text with AI-generated content
- **Protected Content Support**: Clipboard fallback for restricted pages

### 🎓 Google Forms Quiz Mode
- **Automatic Quiz Solver**: Press `Alt+S` on Google Forms to get AI-generated answers
- **Image Question Support**: Processes both text and image-based questions
- **Multimodal AI**: Uses Google Gemini's vision capabilities for image analysis
- **Toggle Functionality**: Show/hide answers with a simple keyboard shortcut

### ⌨️ Keyboard Shortcuts
- `Alt+S`: Quick summarize selected text or toggle quiz mode on Google Forms
- `ESC`: Close extension panels

### 🔒 Security & Privacy
- **Your API Key**: Uses your own Google Gemini API key
- **No Data Collection**: All processing happens through your API key
- **Local Storage**: API key stored securely in browser storage

## 🚀 Installation

### From Chrome Web Store
1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Follow the installation prompts

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be loaded and ready to use

## ⚙️ Setup

1. **Get API Key**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free Google Gemini API key

2. **Configure Extension**:
   - Click the extension icon in your browser toolbar
   - Enter your API key in the popup
   - Click "Test Connection" to verify
   - Click "Save Settings"

## 📖 Usage

### Text Summarization
1. Select any text on a webpage
2. Click the small 📄 button that appears
3. Choose your desired action:
   - **Summarize**: Get a concise summary
   - **Fix Text**: Correct grammar and improve clarity
   - **Explain Code**: Get code explanations
   - **Complete Code**: Auto-complete code snippets
   - **Custom**: Add your own context/instructions

### Google Forms Quiz Mode
1. Navigate to any Google Form
2. Press `Alt+S` to activate quiz mode
3. AI will analyze questions and display answers above each question
4. Press `Alt+S` again to hide answers
5. Works with both text and image-based questions

## 🛠️ Technical Details

### Technologies Used
- **Manifest V3**: Latest Chrome extension standard
- **Google Gemini API**: Advanced AI language model
- **Multimodal AI**: Text and image processing capabilities
- **Content Scripts**: Seamless webpage integration

### Browser Compatibility
- Chrome 88+
- Chromium-based browsers (Edge, Brave, etc.)

### Permissions
- `activeTab`: Access current webpage for text selection
- `scripting`: Inject content scripts for functionality
- `storage`: Store API key securely
- `host_permissions`: Communicate with Google Gemini API

## 🔧 Development

### Project Structure
```
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── content.js             # Main content script
├── background.js          # Background service worker
├── styles.css             # UI styles
├── icons/                 # Extension icons
└── test-extension.html    # Test page for development
```

### Building from Source
1. Clone the repository:
   ```bash
   git clone https://github.com/karanveerthakur1122/summarizer-extension.git
   cd ai-summarizer-extension
   ```

2. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the project directory

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Karan Veer Thakur**
- 🌐 Portfolio: [karanveerthakur.com.np](https://karanveerthakur.com.np)
- 🐙 GitHub: [@karanveerthakur1122](https://github.com/karanveerthakur1122)

## 🙏 Acknowledgments

- Google Gemini API for powerful AI capabilities
- Chrome Extensions team for the robust platform
- Open source community for inspiration and resources

## 📋 Changelog

### Version 1.0.0
- Initial release
- Text summarization functionality
- Google Forms quiz mode
- Multimodal AI support
- Keyboard shortcuts
- Protected content handling

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/karanveerthakur1122/summarizer-extension/issues) page to report bugs or request features.

## ⭐ Support

If you find this extension useful, please:
- ⭐ Star this repository
- 📝 Leave a review on the Chrome Web Store
- 🐛 Report any bugs you encounter
- 💡 Suggest new features

---

**Made with ❤️ by Karan Veer Thakur**
