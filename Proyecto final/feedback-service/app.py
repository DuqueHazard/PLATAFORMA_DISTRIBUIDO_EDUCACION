from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

# Conexión a MongoDB
client = MongoClient(os.environ.get("MONGO_URI", "mongodb://mongo:27017"))
db = client["evaluaciones_db"]
exams_collection = db["exams"]
results_collection = db["results"]

app = Flask(__name__)
CORS(app)

@app.route("/exams/<exam_id>", methods=["GET"])
def get_exam_by_id(exam_id):
    try:
        examen = exams_collection.find_one({"_id": ObjectId(exam_id)})
        if not examen:
            return jsonify({"error": "Examen no encontrado"}), 404

        examen["_id"] = str(examen["_id"])
        return jsonify(examen)

    except Exception as e:
        return jsonify({"error": f"ID inválido o error: {str(e)}"}), 400


@app.route("/exams", methods=["GET"])
def listar_examenes():
    try:
        examenes = list(exams_collection.find())
        for examen in examenes:
            examen["_id"] = str(examen["_id"])  # Convertir ObjectId a string para el frontend
        return jsonify(examenes)
    except Exception as e:
        return jsonify({"error": f"Error al obtener exámenes: {str(e)}"}), 500


@app.route("/submit", methods=["POST"])
def submit_answers():
    data = request.get_json()
    student_id = data.get("student_id")
    exam_id = data.get("exam_id")
    responses = data.get("responses", [])

    if not student_id or not exam_id:
        return jsonify({"error": "Faltan datos necesarios"}), 400

    try:
        examen = exams_collection.find_one({"_id": ObjectId(exam_id)})
        if not examen:
            return jsonify({"error": "Examen no encontrado"}), 404

        correct_dict = {q["id"]: q["answer"] for q in examen["questions"]}
        feedback = []
        score = 0

        for qid, correcta in correct_dict.items():
            # 🔧 Corrección aplicada aquí:
            respuesta_usuario = next(
                (r["answer"] for r in responses if int(r["id"]) == int(qid)), None
            )

            if respuesta_usuario is not None:
                resultado = "correcto" if respuesta_usuario.strip().lower() == correcta.strip().lower() else "incorrecto"
            else:
                resultado = "no respondida"

            feedback.append({
                "id": qid,
                "respuesta_usuario": respuesta_usuario if respuesta_usuario else "",
                "resultado": resultado
            })

            if resultado == "correcto":
                score += 1

        nota_final = round((score / len(correct_dict)) * 100, 2)

        results_collection.insert_one({
            "student_id": student_id,
            "exam_id": exam_id,
            "nota": nota_final,
            "respuestas": feedback
        })

        return jsonify({
            "student_id": student_id,
            "exam_id": exam_id,
            "nota": nota_final,
            "feedback": feedback
        })

    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
