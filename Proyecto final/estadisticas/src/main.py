from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Servicio de estadísticas activo"}