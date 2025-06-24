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
llm = Ollama(model="mistral")
index = VectorStoreIndex.from_documents(documents)
chat_engine = index.as_chat_engine()

# enter chat loop
while True:
    prompt = input("You: ")
    response = chat_engine.chat(prompt)
    print("Bot:", response.response)
