from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from routellm.controller import ModelPair
from routellm.routers import routers
import uvicorn

app = FastAPI()
class RouteRequest(BaseModel):
    prompt: str
    threshold: float
    strong_model: str
    weak_model: str

router_instance = routers.MatrixFactorizationRouter("routellm/mf_gpt4_augmented")

@app.post("/route")
def route_model(request: RouteRequest):
    try:
        model_pair = ModelPair(strong=request.strong_model, weak=request.weak_model)
        routed_model = router_instance.route(request.prompt, request.threshold, model_pair)
        return {"routed_model": routed_model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)