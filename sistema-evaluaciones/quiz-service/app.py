from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

client = MongoClient(os.environ.get("MONGO_URI", "mongodb://mongo:27017"))
db = client["evaluaciones_db"]
exams_collection = db["exams"]

app = Flask(__name__)
CORS(app)

@app.route("/exams", methods=["POST"])
def crear_examen():
    data = request.get_json()
    title = data.get("title")
    teacher_id = data.get("teacher_id")
    questions = data.get("questions", [])

    if not title or not teacher_id or not questions:
        return jsonify({"error": "Datos incompletos. Se requiere al menos una pregunta."}), 400

    result = exams_collection.insert_one({
        "title": title,
        "teacher_id": teacher_id,
        "questions": questions
    })

    return jsonify({"message": "Examen creado exitosamente", "exam_id": str(result.inserted_id)})

@app.route("/exams", methods=["GET"])
def listar_examenes():
    exams = exams_collection.find()
    lista = []
    for exam in exams:
        lista.append({
            "_id": str(exam["_id"]),
            "title": exam["title"],
            "teacher_id": exam.get("teacher_id", "")
        })
    return jsonify(lista)

@app.route("/exams/<exam_id>", methods=["GET"])
def obtener_examen(exam_id):
    try:
        examen = exams_collection.find_one({"_id": ObjectId(exam_id)})
        if not examen:
            return jsonify({"error": "Examen no encontrado"}), 404

        preguntas = [
            {
                "id": p["id"],
                "type": p["type"],
                "question": p["question"],
                "options": p.get("options", []),
                "answer": p.get("answer", "")
            }
            for p in examen["questions"]
        ]

        return jsonify({
            "exam_id": exam_id,
            "title": examen["title"],
            "teacher_id": examen.get("teacher_id", ""),
            "questions": preguntas
        })
    except Exception as e:
        return jsonify({"error": f"ID inválido o error: {str(e)}"}), 400

@app.route("/exams/<exam_id>", methods=["DELETE"])
def eliminar_examen(exam_id):
    try:
        result = exams_collection.delete_one({"_id": ObjectId(exam_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Examen eliminado correctamente"}), 200
        else:
            return jsonify({"error": "Examen no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": f"Error al eliminar examen: {str(e)}"}), 500

@app.route("/exams/<exam_id>", methods=["PUT"])
def actualizar_examen(exam_id):
    try:
        data = request.get_json()
        title = data.get("title")
        teacher_id = data.get("teacher_id")
        questions = data.get("questions", [])

        if not title or not teacher_id or not questions:
            return jsonify({"error": "Faltan campos requeridos"}), 400

        result = exams_collection.update_one(
            {"_id": ObjectId(exam_id)},
            {"$set": {
                "title": title,
                "teacher_id": teacher_id,
                "questions": questions
            }}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Examen no encontrado"}), 404

        return jsonify({"message": "Examen actualizado correctamente"})

    except Exception as e:
        return jsonify({"error": f"Error al actualizar: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
