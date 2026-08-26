# IDE Environment & Extension Rules

- **IDE Path**: `D:\Antigravity IDE\Antigravity IDE.exe`
- **CLI Executable**: `D:\Antigravity IDE\bin\antigravity-ide.cmd`
- **Extensions Directory**: `C:\Users\cshsd\.antigravity-ide\extensions`

### Extension Management Guidelines:
1. Always install or manage editor extensions using the Antigravity IDE CLI:
   ```powershell
   & "D:\Antigravity IDE\bin\antigravity-ide.cmd" --install-extension <extension-id>
   ```
2. Do NOT use standard VS Code (`code --install-extension` or `C:\Users\cshsd\.vscode\extensions`) as they are isolated and will not appear in Antigravity IDE.
