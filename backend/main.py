from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import List
from dotenv import load_dotenv
load_dotenv()

import pinecone

from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain.llms import OpenAI
from langchain import PromptTemplate, LLMChain



from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_ENV = os.environ.get("PINECONE_ENV")
INDEX_NAME = os.environ.get("INDEX_NAME")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
CHUNK_SIZE = os.environ.get("CHUNK_SIZE")

pinecone.init(
  api_key=os.getenv("PINECONE_API_KEY"), 
  environment=os.getenv("PINECONE_ENV"), 
)

app = FastAPI()
origins = [
  "http://localhost",
  "http://localhost:3000",
  "http://94.131.101.194:3000"
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

def get_ref_data(input):
  embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
  index_name = f"{INDEX_NAME}-{CHUNK_SIZE}"
  docsearch = Pinecone.from_existing_index(index_name, embeddings)

  found_docs = docsearch.similarity_search(input)
  ref_data = ""
  for i, doc in enumerate(found_docs):
    ref_data = ref_data + doc.page_content
  return ref_data

def get_llm_answer(question, ref_data):
  template = """Question: {question} Please use the following information when you write. If the question is not related to the information, please write such like I don't know well.
                Answer:
                Information: {ref_data}
            """
  prompt = PromptTemplate(template=template, input_variables=["question", "ref_data"])
  llm = OpenAI(openai_api_key=OPENAI_API_KEY)
  llm_chain = LLMChain(prompt=prompt, llm=llm)
  return llm_chain.run({"question":question, "ref_data":ref_data})

@app.post("/get_answer")
async def get_answer(request: Request):
  data = await request.json()
  parameter = data.get('input')
  
  ref_data = get_ref_data(parameter)
  
  answer = get_llm_answer(parameter, ref_data)
  print(answer)
  return {"question": parameter, "answer":answer}

@app.post("/get_chat_answer")
async def get_chat_answer(request: Request):
  data = await request.json()
  parameter = data.get("input")

  prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You are a chatbot having a conversation with a human."), # The persistent system prompt
    MessagesPlaceholder(variable_name="chat_history"), # Where the memory will be stored.
    HumanMessagePromptTemplate.from_template("{human_input}"), # Where the human input will injectd
  ])
    
  memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

  llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY)

  chat_llm_chain = LLMChain(
      llm=llm,
      prompt=prompt,
      verbose=True,
      memory=memory,
  )
  ref_data = get_ref_data(parameter)
  input = f"{parameter} If you don't know well when an user ask, you can use the following information. information: {ref_data}"
  answer = chat_llm_chain.predict(human_input=input)
  return {"question": parameter, "answer":answer}


@app.post("/chunk_test")
async def chunk_test(files: list[UploadFile] = File(...)):
  file = files[0]
  loader = PyPDFLoader(f"./data/{file.filename}")
  data = loader.load()
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=int(CHUNK_SIZE), chunk_overlap=0)
  texts = text_splitter.split_documents(data)
  count_of_chunks = len(texts)
  print(f"count of chunks is {count_of_chunks}")
  return {"result": texts}

@app.post("/build_index")
async def build_index(files: list[UploadFile] = File(...)):
  file = files[0]
  loader = PyPDFLoader(f"./data/{file.filename}")
  data = loader.load()
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=int(CHUNK_SIZE), chunk_overlap=0)
  texts = text_splitter.split_documents(data)
  count_of_chunks = len(texts)
  print(f"count of chunks is {count_of_chunks}")

  embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

  index_name = f"{INDEX_NAME}-{CHUNK_SIZE}"

  if index_name not in pinecone.list_indexes():
    print("creating index ...")
    pinecone.create_index(
      name=index_name,
      metric='cosine',
      dimension=1536  
    )
    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)
    return {"result": f"{count_of_chunks} chunks were saved in index-{index_name} successfully!"}
  return {"result": f"index-{index_name} already exist!"}
  
if __name__ == "__main__":
  uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)