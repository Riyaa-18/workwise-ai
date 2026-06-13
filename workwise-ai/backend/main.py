from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
import pypdf
import io

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

class TextRequest(BaseModel):
    text: str
    job_role: str = ""

class CompareRequest(BaseModel):
    resume1: str
    resume2: str
    job_role: str = ""

@app.get("/")
def root():
    return {"message": "WorkWise AI is running!"}

@app.post("/analyze-resume")
async def analyze_resume(request: TextRequest):
    prompt = f"""You are an expert HR assistant. Analyze this resume for the role of {request.job_role}.

Resume:
{request.text}

Provide:
1. Overall Score (out of 10)
2. Key Strengths (3 points)
3. Missing Skills
4. Recommendation (Shortlist / Maybe / Reject)
5. One line summary"""
    response = llm.invoke(prompt)
    return {"result": response.content}

@app.post("/generate-jd")
async def generate_jd(request: TextRequest):
    prompt = f"""You are an expert HR assistant. Generate a professional Job Description for: {request.text}

Include:
1. Role Overview
2. Key Responsibilities (5 points)
3. Required Skills
4. Nice to have skills
5. Experience required"""
    response = llm.invoke(prompt)
    return {"result": response.content}

@app.post("/draft-email")
async def draft_email(request: TextRequest):
    prompt = f"""You are an HR assistant. Draft a professional email for this situation: {request.text}

Write a complete email with subject line and body."""
    response = llm.invoke(prompt)
    return {"result": response.content}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), job_role: str = Form("")):
    content = await file.read()
    pdf_reader = pypdf.PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    prompt = f"""You are an expert HR assistant. Analyze this resume for the role of {job_role}.

Resume:
{text}

Provide:
1. Overall Score (out of 10)
2. Key Strengths (3 points)
3. Missing Skills
4. Recommendation (Shortlist / Maybe / Reject)
5. One line summary"""
    response = llm.invoke(prompt)
    return {"result": response.content}

@app.post("/compare-resumes")
async def compare_resumes(request: CompareRequest):
    prompt = f"""You are an expert HR assistant. Compare these two candidates for the role of {request.job_role}.

Candidate 1:
{request.resume1}

Candidate 2:
{request.resume2}

Provide:
1. Candidate 1 Score (out of 10) with 3 strengths
2. Candidate 2 Score (out of 10) with 3 strengths
3. Key Differences
4. Final Recommendation: Who should be hired and why?"""
    response = llm.invoke(prompt)
    return {"result": response.content}

@app.post("/interview-questions")
async def interview_questions(request: TextRequest):
    prompt = f"""You are an expert HR interviewer. Generate interview questions for a {request.job_role} candidate.

Resume/Context:
{request.text}

Generate:
1. 3 Technical Questions (role-specific)
2. 3 Behavioral Questions
3. 2 Situational Questions
4. 1 Culture Fit Question

For each question, add a brief note on what to look for in the answer."""
    response = llm.invoke(prompt)
    return {"result": response.content}

@app.post("/salary-estimate")
async def salary_estimate(request: TextRequest):
    prompt = f"""You are an expert HR compensation analyst. Estimate salary range for: {request.text}

Provide:
1. Entry Level Range (0-2 years)
2. Mid Level Range (2-5 years)
3. Senior Level Range (5+ years)
4. Key factors affecting salary
5. Top companies hiring for this role in India
6. Skills that increase salary the most"""
    response = llm.invoke(prompt)
    return {"result": response.content}
