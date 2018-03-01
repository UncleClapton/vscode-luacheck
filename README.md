# Luacheck for Visual Studio Code

## Features
* Static analyze by [luacheck](https://github.com/mpeterv/luacheck) (default on)
* Syntax error check when luacheck is off
* Supports all platforms for Visual Studio Code with no dependency

![animation](https://raw.githubusercontent.com/rog2/vscode-luacheck/master/README.gif)

## Extension Settings

This extension contributes the following settings:

* `lualint.useLuacheck`: If true use [luacheck](https://github.com/mpeterv/luacheck) more detail analyze. Otherwise syntax error only check.
* `lualint.maxNumberOfReports`: Maximum number of code check reports.

## Known Issues

## Release Notes

### 0.0.5
- add watch .luacheckrc files
- add source name for report
- Exclude first line comment with #
- Fix wrong column with multibyte characters

### 0.0.4
- [luacheck](https://github.com/mpeterv/luacheck) is enabled by default.
- Fixed bug, even if closed the file, the problem messages remained displayed.

### 0.0.2
- Add repositry URL
