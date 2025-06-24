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

```text
llama-index
llama-index-llms-ollama
llama-index-readers-web
llama-index-readers-file
```

```bash
pip install -r requirements.txt
```

## create folder of content to be searched

```bash
mkdir /data
# copy in any text files you want searched eg: *.pdf, *.md, *.txt, etc
```

## create POC MCP server from content that is searched

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

## run it

```bash
python main.py
```

