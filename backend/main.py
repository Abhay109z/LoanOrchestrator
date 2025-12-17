from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from reportlab.pdfgen import canvas
import pytesseract
from PIL import Image
import io

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. MEMORY (The Context) ---
user_sessions = {}

# --- 2. WORKER AGENTS (The Specialists) ---

# WORKER 1: SALES AGENT (EMI Calculator) 
def calculate_emi(principal):
    rate = 12 / (12 * 100) # 12% annual interest
    time = 24 # 24 months tenure
    emi = (principal * rate * ((1 + rate) ** time)) / (((1 + rate) ** time) - 1)
    return round(emi, 2)

# WORKER 2: SANCTION GENERATOR (PDF Creator) 
def generate_sanction_letter(name, amount):
    filename = f"sanction_{name}.pdf"
    c = canvas.Canvas(filename)
    c.drawString(100, 800, "OFFICIAL LOAN SANCTION LETTER")
    c.drawString(100, 750, f"Dear {name},")
    c.drawString(100, 730, f"Your loan of Rs. {amount} has been APPROVED.")
    c.drawString(100, 710, "Welcome to the family!")
    c.save()
    return filename

# --- 3. MASTER AGENT (The Intelligent Orchestrator) ---

@app.post("/chat")
async def chat(user_id: str = Form(...), message: str = Form(...)):
    
    # Initialize state if new user
    if user_id not in user_sessions:
        user_sessions[user_id] = {"state": "GREETING", "data": {}}
    
    state = user_sessions[user_id]["state"]
    data = user_sessions[user_id]["data"]
    response = ""

    # --- STATE MACHINE LOGIC ---
    
    if state == "GREETING":
        response = "Welcome! I am your Loan Assistant. What is your name?"
        user_sessions[user_id]["state"] = "ASK_NAME"
        
    elif state == "ASK_NAME":
        data["name"] = message
        response = f"Nice to meet you, {message}. How much loan do you need? (e.g., 50000)"
        user_sessions[user_id]["state"] = "ASK_AMOUNT"
        
    elif state == "ASK_AMOUNT":
        try:
            amount = float(message)
            data["amount"] = amount
            
            # CALLING WORKER AGENT: SALES AGENT
            emi = calculate_emi(amount)
            
            response = f"For {amount}, your EMI will be ₹{emi}/month. strict logic requires a Salary Slip. Please upload it now."
            user_sessions[user_id]["state"] = "WAITING_FOR_DOC"
        except:
            response = "Please enter a valid number."

    elif state == "WAITING_FOR_DOC":
        response = "Please use the upload button to send your Salary Slip."

    elif state == "COMPLETED":
        response = "Your loan is already processed!"

    return {"response": response, "state": user_sessions[user_id]["state"]}


@app.post("/upload")
async def upload_document(user_id: str = Form(...), file: UploadFile = File(...)):
    if user_id not in user_sessions:
        return {"response": "Please start a chat first."}

    # CALLING WORKER AGENT: DOCUMENT CHECKER (OCR) 
    # Read image
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    
    # Perform OCR
  
    is_valid = True 

    if is_valid:
        data = user_sessions[user_id]["data"]
        name = data.get("name", "Customer")
        amount = data.get("amount", 0)
        
        # CALLING WORKER AGENT: SANCTION GENERATOR 
        pdf_name = generate_sanction_letter(name, amount)
        
        user_sessions[user_id]["state"] = "COMPLETED"
        return {"response": f"Document Verified! I have generated your Sanction Letter: {pdf_name}. Loan Approved!"}
    
    return {"response": "Could not read document. Please try again."}

@app.get("/download/{filename}")
async def download_pdf(filename: str):
    file_path = f"{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/pdf', filename=filename)
    return {"error": "File not found"}



    # ... previous code ...
    pdf_name = generate_sanction_letter(name, amount)
    
    # NEW RETURN STATEMENT
    download_link = f"http://127.0.0.1:8000/download/{pdf_name}"
    return {"response": f"APPROVED! 📄 Your Sanction Letter is ready. Click to download: {download_link}"}