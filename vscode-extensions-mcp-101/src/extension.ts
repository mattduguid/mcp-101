import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log("✅ MCP Extension Activated");
  vscode.window.showInformationMessage('MCP Chat extension is ready!');

  const command = 'mcp-101.chat';

  const showPanel = () => {
    console.log("📟 Showing MCP Panel");

    const panel = vscode.window.createWebviewPanel(
      'mcpChat',
      'MCP Assistant',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true
      }
    );

    panel.webview.html = getWebviewContent();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(command, showPanel)
  );
}

function getWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MCP Assistant</title>
  <style>
    body { font-family: sans-serif; padding: 1em; }
    #chat { height: 70vh; overflow-y: auto; border: 1px solid #ccc; padding: 10px; white-space: pre-wrap; background-color: #f9f9f9; }
    #input { width: 100%; margin-top: 10px; }
    button { margin-top: 5px; }
  </style>
</head>
<body>
  <h2>Local MCP Chat</h2>
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
    };

    // Optional: Send on Enter (with Shift+Enter for newline)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send.click();
      }
    });
  </script>
</body>
</html>`;
}

export function deactivate() {}
