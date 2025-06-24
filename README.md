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

[edit main.py](main.py) which contains the code to run the MCP server,

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

[edit /vscode-extensions-mcp-101/src/extension.ts](/vscode-extensions-mcp-101/src/extension.ts) which contains the code the vscode extension,

### edit command

[edit /vscode-extensions-mcp-101/package.json](/vscode-extensions-mcp-101/package.json) which contains settings for the vscode extension,

specificaly we change,

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
