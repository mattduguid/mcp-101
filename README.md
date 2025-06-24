# mcp-101

## install ollama

- mac
  - https://ollama.com/download/mac
- linux
  - https://ollama.com/download/linux
- windows
  - https://ollama.com/download/windows

## run ollama

```bash
# start a model, downloads on first run ~4.1GB
ollama run mistral
```

## create requirements.txt for python and install

[edit requirements.txt](requirements.txt) and add,
```text
llama-index
llama-index-llms-ollama
llama-index-readers-web
llama-index-readers-file
```

```bash
pip3 install -r requirements.txt
```

## create folder of content to be searched

```bash
mkdir /data
# copy in any text files you want searched eg: *.pdf, *.md, *.txt, etc
```

## create MCP server from content to be searched

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.ollama import Ollama
from llama_index.readers.web import SimpleWebPageReader

# load local files
local_docs = SimpleDirectoryReader(input_dir="./data").load_data()

# load multiple websites
urls = [
    "https://www.stuff.co.nz",
    "https://www.nzherald.co.nz",
    "https://www.cnn.com"
]
web_docs = SimpleWebPageReader().load_data(urls)

# combine documents
documents = local_docs + web_docs

# create index and chat
llm = Ollama(model="mistral") # <-- this is where it used the container downloaded in section above "run ollama"
index = VectorStoreIndex.from_documents(documents)
chat_engine = index.as_chat_engine()

# enter chat loop
while True:
    prompt = input("You: ")
    response = chat_engine.chat(prompt)
    print("Bot:", response.response)
```

## run and test (from cli)

```bash
python3 main.py
```

## create visual studio plugin

### install node

- mac

```bash
# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js
nvm install 22

# Verify the Node.js version
node -v # Should print "v22.16.0".
nvm current # Should print "v22.16.0".

# Verify npm version
npm -v # Should print "10.9.2".
```

- linux

```bash
# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js
nvm install 22

# Verify the Node.js version
node -v # Should print "v22.16.0".

nvm current # Should print "v22.16.0".

# Verify npm version
npm -v # Should print "10.9.2".
```

- windows

```powershell
# Download and install Chocolatey
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Node.js
choco install nodejs-lts --version="22"

# Verify the Node.js version
node -v # Should print "v22.16.0".

# Verify npm version
npm -v # Should print "10.9.2".
```

### scaffold a Visual Studio Code (VS Code) extension

```bash/powershell
# create folder for vscode extension
cd <PATH_TO_REPO>
mkdir vscode-extensions-mcp-101
cd vscode-extensions-mcp-101

# create vscode extension scaffold
npm install -g yo generator-code
yo code

? What type of extension do you want to create? New Extension (TypeScript)
? What's the name of your extension? mcp-101
? What's the identifier of your extension? mcp-101
? What's the description of your extension? mcp-101
? Initialize a git repository? No
? Which bundler to use? webpack
? Which package manager to use? npm

Writing in /<OMITTED>/mcp-101...
   create mcp-101/.vscode/extensions.json
   create mcp-101/.vscode/launch.json
   create mcp-101/.vscode/settings.json
   create mcp-101/.vscode/tasks.json
   create mcp-101/package.json
   create mcp-101/tsconfig.json
   create mcp-101/.vscodeignore
   create mcp-101/webpack.config.js
   create mcp-101/vsc-extension-quickstart.md
   create mcp-101/README.md
   create mcp-101/CHANGELOG.md
   create mcp-101/src/extension.ts
   create mcp-101/src/test/extension.test.ts
   create mcp-101/.vscode-test.mjs
   create mcp-101/eslint.config.mjs

added 364 packages, and audited 365 packages in 9s

88 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Your extension mcp-101 has been created!

To start editing with Visual Studio Code, use the following commands:

     code mcp-101

Open vsc-extension-quickstart.md inside the new extension for further instructions
on how to modify, test and publish your extension.

To run the extension you need to install the recommended extension 'amodio.tsl-problem-matcher'.

For more information, also visit http://code.visualstudio.com and follow us @code.
```

### add code to scaffold

edit <PATH_TO_REPO/vscode-extensions-mcp-101/src/extension.ts
add,

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const command = 'mcp-101.chat'; // command name to launch sidebar
  context.subscriptions.push(
    vscode.commands.registerCommand(command, () => {
      const panel = vscode.window.createWebviewPanel(
        'mcpChat',
        'Local MCP Chat',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      panel.webview.html = getWebviewContent();
    })
  );
}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 10px; }
        #chat { height: 80vh; overflow-y: auto; border: 1px solid #ccc; padding: 10px; }
        textarea { width: 100%; margin-top: 10px; }
        button { margin-top: 5px; }
      </style>
    </head>
    <body>
      <h2>Ask your local assistant</h2>
      <div id="chat"></div>
      <textarea id="input" rows="3"></textarea>
      <button id="send">Send</button>
      <script>
        const chat = document.getElementById('chat');
        const input = document.getElementById('input');
        const send = document.getElementById('send');

        send.onclick = async () => {
          const query = input.value.trim();
          if (!query) return;
          chat.innerHTML += '<p><b>You:</b> ' + query + '</p>';
          input.value = '';
          try {
            const res = await fetch('http://localhost:8000/ask', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query })
            });
            const json = await res.json();
            chat.innerHTML += '<p><b>Bot:</b> ' + json.answer + '</p>';
            chat.scrollTop = chat.scrollHeight;
          } catch (err) {
            chat.innerHTML += '<p><b>Bot:</b> [Error: could not connect]</p>';
          }
        };
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}
```

### edit command

edit <PATH_TO_REPO>/vscode-extensions-mcp-101/package.json
change,

```json
"activationEvents": [],

..etc...

"contributes": {
    "commands": [
      {
        "command": "mcp-101.helloWorld",
        "title": "Hello World"
      }
    ]
  },
```

to,

```json
"activationEvents": [
  "onCommand:mcp-101.chat"
],

...etc...

"contributes": {
    "commands": [
      {
        "command": "mcp-101.chat",
        "title": "MCP Chat: Open Local Assistant"
      }
    ]
  },
```

### Run a VS Code Extension

Launch extension dev host,

- mac
 - Fn + F5 or Cmd + Fn + F5
- linux
  - F5 or Ctrl + F5
- windows
  - F5




