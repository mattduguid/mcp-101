import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log("✅ MCP Extension Activated");
  vscode.window.showInformationMessage('Matt Chat mcp-101 extension is ready!');
  vscode.window.showInformationMessage('MCP Chat ready! Press Ctrl+Alt+M (Win/Linux) or Cmd+Option+M (Mac) to open it.');

  const command = 'mcp-101.chat';

  const showPanel = () => {
    console.log("📟 Showing MCP Panel");

    const panel = vscode.window.createWebviewPanel(
      'mcpChat',
      'Matt Chat mcp-101',
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewContent();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(command, showPanel)
  );

  // ✅ Add a status bar item so you can launch your chat easily from anywhere
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(comment-discussion) Matt Chat mcp-101";
  statusBarItem.command = command;
  statusBarItem.tooltip = "Open Matt Chat mcp-101";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // ✅ Add a setup command to register the MCP server in settings.json
  const setupCommand = vscode.commands.registerCommand('mcp-101.setup', async () => {
    const config = vscode.workspace.getConfiguration();
    await config.update(
      'mcp.servers.mcp-101',
      { type: 'http', url: 'http://127.0.0.1:8000' },
      vscode.ConfigurationTarget.Global
    );
    vscode.window.showInformationMessage('✅ MCP server "Matt Chat mcp-101" has been added to your settings!');
  });
  context.subscriptions.push(setupCommand);
}

function getWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Matt Chat mcp-101</title>
  <style>
  html, body { 
    height: 100%; 
    margin: 0; 
    font-family: sans-serif; 
    background-color: black; 
    color: white; 
  }
  #chat { 
    height: 70vh; 
    overflow-y: auto; 
    border: 1px solid #555; 
    padding: 10px; 
    white-space: pre-wrap; 
    background-color: #111; 
    color: white; 
  }
  #input { 
    width: 100%; 
    margin-top: 10px; 
    background-color: #222; 
    color: white; 
    border: 1px solid #555; 
  }
  button { 
    margin-top: 5px; 
    background-color: #333; 
    color: white; 
    border: 1px solid #555; 
    padding: 0.5em 1em; 
    cursor: pointer;
  }
  button:hover {
    background-color: #555;
  }
</style>
</head>
<body>
  <h2>Matt Chat mcp-101</h2>
  <div id="chat"></div>
  <textarea id="input" rows="3" placeholder="Ask something..."></textarea>
  <br/>
  <button id="send">Send</button>

  <script>
    const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    const send = document.getElementById('send');

    send.onclick = async () => {
      const query = input.value.trim();
      if (!query) return;

      chat.innerHTML += '\\n\\n🧑 You: ' + query;
      input.value = '';

      try {
        const res = await fetch('http://localhost:8000/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        const json = await res.json();
        chat.innerHTML += '\\n🤖 Bot: ' + json.answer;
      } catch (err) {
        chat.innerHTML += '\\n❌ Error: ' + err.message;
        console.error(err);
      }

      chat.scrollTop = chat.scrollHeight;
      input.focus(); // ✅ Refocus input after send
    };

    // Allow Enter to send (Shift+Enter for newline)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send.click();
      }
    });

    input.focus(); // ✅ Focus input on initial load
  </script>
</body>
</html>`;
}

export function deactivate() {}
