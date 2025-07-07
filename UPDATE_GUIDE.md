# Extension Update Guide

## 🔄 Version Update Process

### 1. Before Making Changes
```bash
# Create a new branch for changes
git checkout -b feature/new-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Update Version Number
Edit `manifest.json`:
```json
{
  "version": "1.0.1"  // Increment as needed
}
```

Version numbering:
- Major: `1.0.0` → `2.0.0` (breaking changes)
- Minor: `1.0.0` → `1.1.0` (new features)
- Patch: `1.0.0` → `1.0.1` (bug fixes)

### 3. Update Changelog
Add to `README.md` changelog section:
```markdown
### Version 1.0.1
- Fixed text replacement on certain websites
- Improved quiz mode accuracy
- Enhanced error handling
```

### 4. Test Thoroughly
1. Load extension in Chrome developer mode
2. Test all features:
   - Text summarization
   - Quiz mode on Google Forms
   - All keyboard shortcuts
   - API key functionality
3. Test on different websites
4. Verify no console errors

### 5. Commit and Push
```bash
git add .
git commit -m "Version 1.0.1: Fix text replacement and improve quiz mode"
git push origin feature/new-feature-name
```

### 6. Create Pull Request
1. Go to GitHub repository
2. Create pull request from feature branch to main
3. Review changes
4. Merge to main branch

### 7. Create Release
```bash
# Tag the release
git tag -a v1.0.1 -m "Version 1.0.1 release"
git push origin v1.0.1
```

### 8. Update Chrome Web Store
1. Create new ZIP package (excluding development files)
2. Upload to Chrome Web Store Developer Dashboard
3. Update store listing if needed
4. Submit for review

## 🧪 Testing Checklist

Before each release:
- [ ] Text selection works on various websites
- [ ] Summarization produces quality results
- [ ] Quiz mode works on Google Forms
- [ ] Image processing works correctly
- [ ] Keyboard shortcuts function properly
- [ ] API key setup and testing works
- [ ] Error handling is appropriate
- [ ] Extension popup displays correctly
- [ ] No console errors
- [ ] Works on protected/restricted sites

## 🚀 Release Notes Template

```markdown
## Version X.Y.Z - Release Date

### ✨ New Features
- Feature description

### 🐛 Bug Fixes
- Bug fix description

### 🔧 Improvements
- Improvement description

### 📋 Technical Changes
- Technical change description
```

## 📦 Build Process

For production builds:
1. Remove all test files
2. Minify code if needed
3. Optimize images
4. Create clean ZIP package
5. Test package before upload

---

This process ensures quality releases and proper version control.
