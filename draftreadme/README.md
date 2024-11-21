# BashAI Chatbot [Group: EsanLamSing Supreme]
an AI interface for bash coffee shop. This project for ITCS473_Software Quality Assurance and Testing and ITCS379_Practical Software Engineering course.

## Requirements
- OpenAI API Key for flowise
- Docker

## How to Setup
1. Run `docker compose up -d`
2. Go to https://localhost:15542 for set up flowise
3. Create Flow and then go to folder Chat for flowise and import it to that flow you created.
4. You need to add OpenAI API key into node called `ChatOpenAI` (only 1 node) and `OpenAI Embedding` (2 node)
5. And then click `Upsert Vector Database` button to import the necessary file for LLM.
6. Finally, Go to https://localhost:5173 for Chat Interface.

---