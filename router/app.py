from fastapi import FastAPI
from pydantic import BaseModel
import torch
from model import MatrixFactorizationRouter
import time


app = FastAPI()

strong_model = 'llama-2-70b-chat'
weak_model = 'llama-2-7b-chat'

# Initialize the model
model_weights_path = 'routellm/mf_mmlu_augmented'
model = MatrixFactorizationRouter(model_weights_path, strong_model=strong_model, weak_model=weak_model)

class InputText(BaseModel):
    text: str  # Define the input structure

@app.post("/predict")
def predict(input: InputText):
    prompt = input.text  # Get the prompt from the input
    print(prompt)
    start_time = time.time()  # Start timing
    with torch.no_grad():
        winrate = model.calculate_strong_win_rate(prompt)  # Run inference
    inference_time = time.time() - start_time  # Calculate elapsed time
    return {"winrate": winrate, "inference_time": inference_time}  # Return the winrate and inference time

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)