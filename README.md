# 🧠 WorkWise AI — AI-Powered Internal Operations Automation

> An intelligent HR & Operations Assistant built with LangChain, Groq LLaMA 3.3, FastAPI, and React.

🌐 **Live Demo:** https://workwise-ai-two.vercel.app  
💻 **Backend API:** https://workwise-ai.onrender.com/docs  
📁 **GitHub:** https://github.com/Riyaa-18/workwise-ai

---

## 📌 Use Case Selected
**Internal Operations Automation** — Automating HR workflows including resume screening, candidate comparison, interview preparation, job description generation, and professional email drafting.

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| 📄 Resume Analyzer | Upload PDF resume → AI scores, ranks, and recommends shortlist/reject |
| 📤 Upload PDF | Direct PDF upload with instant AI analysis |
| ⚖️ Compare Candidates | Upload 2 resumes → AI compares and recommends best hire |
| 🎤 Interview Questions | Generate role-specific technical + behavioral questions |
| 📝 JD Generator | Describe a role → Get complete job description |
| ✉️ Email Drafter | Describe situation → Get professional HR email |

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** — REST API framework
- **LangChain** — AI agent orchestration framework
- **Groq API (LLaMA 3.3 70B)** — Ultra-fast LLM inference
- **PyPDF** — PDF text extraction
- **Python-dotenv** — Environment management

### Frontend
- **React + TypeScript** — UI framework
- **Canvas API** — Animated particle background
- **Fetch API** — Backend communication

### Deployment
- **Vercel** — Frontend hosting
- **Render** — Backend hosting
- **GitHub** — Version control

---

## 🏗️ Architecture
---

## 🔬 Part 1 — AI Tools Research & Comparison

### Problem Statement
HR teams spend 60-70% of their time on repetitive tasks — resume screening, writing JDs, drafting emails. This system automates these workflows using AI.

### Tools Compared

#### 1. Groq + LLaMA 3.3 70B (Selected ✅)
| Parameter | Details |
|-----------|---------|
| Capabilities | Ultra-fast inference, 70B parameter model, excellent reasoning |
| Pricing | Free tier: 14,400 req/day, Paid: $0.59/1M tokens |
| Scalability | High — distributed inference infrastructure |
| Ease of Integration | Very easy — OpenAI-compatible API |
| Limitations | Rate limits on free tier, no fine-tuning |
| Best Use Case | Production apps needing fast responses |

#### 2. OpenAI GPT-4o
| Parameter | Details |
|-----------|---------|
| Capabilities | Most capable, multimodal, function calling |
| Pricing | $5/1M input tokens, $15/1M output tokens |
| Scalability | Very high — enterprise grade |
| Ease of Integration | Easy — well documented SDK |
| Limitations | Expensive, slower than Groq |
| Best Use Case | Complex reasoning, vision tasks |

#### 3. Google Gemini 1.5 Pro
| Parameter | Details |
|-----------|---------|
| Capabilities | 1M context window, multimodal, strong reasoning |
| Pricing | Free tier available, $3.50/1M tokens |
| Scalability | High — Google Cloud infrastructure |
| Ease of Integration | Moderate — Google AI SDK required |
| Limitations | Inconsistent outputs, less community support |
| Best Use Case | Long document analysis, multimodal tasks |

#### 4. LangChain (Framework Used ✅)
| Parameter | Details |
|-----------|---------|
| Capabilities | Agent orchestration, chains, memory, RAG |
| Pricing | Open source — free |
| Scalability | Depends on underlying LLM |
| Ease of Integration | Moderate — good documentation |
| Limitations | Can be complex for simple use cases |
| Best Use Case | Multi-step AI workflows, agents |

### Why Groq + LangChain?
- **Speed:** Groq is 10x faster than OpenAI for same model size
- **Cost:** Free tier sufficient for POC, very cheap at scale
- **LangChain:** Provides clean abstraction for AI workflows — easy to swap models later
- **LLaMA 3.3:** Open source model, no vendor lock-in

---

## 📊 Part 3 — Recommendation Report

### Recommended Architecture
┌─────────────────┐
                │   React Frontend │
                │   (Vercel CDN)   │
                └────────┬────────┘
                         │ HTTPS
                ┌────────▼────────┐
                │  FastAPI Backend │
                │   (Render.com)   │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │ LangChain Agent  │
                │  Orchestration   │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │   Groq API       │
                │ LLaMA 3.3 70B    │
                └─────────────────┘
### Why These Tools?
1. **FastAPI** — Async support, automatic docs, high performance Python framework
2. **LangChain** — Future-proof: easily add RAG, agents, memory without rewriting
3. **Groq LLaMA 3.3** — Best price-performance ratio, 10x faster than OpenAI
4. **React + TypeScript** — Type safety, component reusability, industry standard
5. **Vercel + Render** — Zero-config deployment, free tier available

### 💰 Estimated Infrastructure Cost

| Component | Free Tier | Production (Monthly) |
|-----------|-----------|---------------------|
| Vercel (Frontend) | Free | $20/month (Pro) |
| Render (Backend) | Free (spins down) | $7/month (Starter) |
| Groq API | 14,400 req/day free | ~$10-50/month |
| **Total** | **$0** | **~$37-77/month** |

### ⚠️ Risks & Limitations

1. **Render Free Tier** — Spins down after 15 min inactivity (cold start ~30s)
   - Fix: Upgrade to paid tier or use Railway
2. **Groq Rate Limits** — Free tier limited to 14,400 req/day
   - Fix: Paid plan or implement request queuing
3. **PDF Extraction** — Complex PDFs with images may not extract well
   - Fix: Add OCR support (Tesseract/AWS Textract)
4. **No Authentication** — Currently open API
   - Fix: Add JWT auth + user management
5. **No Data Persistence** — Results not saved
   - Fix: Add PostgreSQL/Supabase database

### 📈 How to Scale in Production

**Phase 1 (0-100 users):** Current stack — Vercel + Render + Groq free tier

**Phase 2 (100-1000 users):**
- Add Redis caching for repeated queries
- Upgrade Render to paid tier
- Add PostgreSQL for storing results
- Implement user authentication

**Phase 3 (1000+ users):**
- Move to AWS/GCP infrastructure
- Add load balancing
- Implement RAG with Pinecone for company-specific knowledge base
- Add multi-model support (GPT-4 for complex, LLaMA for simple)
- Add analytics dashboard

### 🔮 Future Enhancements
- **RAG System** — Upload company handbook, auto-answer HR queries
- **Multi-agent workflow** — CrewAI for complex hiring pipeline automation
- **ATS Integration** — Connect with Greenhouse, Lever, Workday
- **Bulk Processing** — Screen 100 resumes in one click
- **Slack/Teams Bot** — HR assistant directly in messaging tools

---

## 🚀 Local Setup

### Backend
```bash
cd workwise-ai/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload
```

### Frontend
```bash
cd workwise-ai/frontend
npm install
npm start
```

---

## 👩‍💻 Built By
**Riyaa Sharma** — Final Year B.Tech CSE, Chandigarh University  
Assignment for: AI Researcher / AI Innovation Engineer — Webvory

---

*Built with ❤️ using LangChain + Groq + FastAPI + React*
