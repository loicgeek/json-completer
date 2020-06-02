# json-completer

Json-completer is a vscode extension that allows developper to autocomplete nested object from a json file.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

\!\[feature X\]\(images/feature-x.png\)

## Requirements

> You should configure the .jcompleter.config file at the root of your project. This file must give the path to you model json file

`{ "model_path":"locales/locale_en.json", "accepted_functions":["AllTranslation.text","translate"] //optional }`

> `accepted_functions` parameter let user choose which functions he want this plugin to suggest json completion for.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

**Note:** You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
