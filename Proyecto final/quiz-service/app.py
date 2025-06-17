from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import psycopg2
import os

# 📦 Conexión a MongoDB
client = MongoClient(os.environ.get("MONGO_URI", "mongodb://mongo:27017"))
db = client["evaluaciones_db"]
exams_collection = db["exams"]

# 🐘 Conexión a PostgreSQL
pg_conn = psycopg2.connect(
    host=os.environ.get("POSTGRES_HOST", "postgres"),
    database=os.environ.get("POSTGRES_DB", "plataforma"),
    user=os.environ.get("POSTGRES_USER", "admin"),
    password=os.environ.get("POSTGRES_PASSWORD", "admin123")
)
pg_cursor = pg_conn.cursor()

# 🚀 Configuración de Flask
app = Flask(__name__)
CORS(app)


# 📌 Crear examen
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


# 📌 Listar exámenes mostrando nombre del docente
@app.route("/exams", methods=["GET"])
def listar_examenes():
    exams = exams_collection.find()
    lista = []

    for exam in exams:
        teacher_id = exam.get("teacher_id", "")
        nombre_docente = "Desconocido"

        try:
            pg_cursor.execute("SELECT nombre FROM usuarios WHERE id = %s", (teacher_id,))
            resultado = pg_cursor.fetchone()
            if resultado:
                nombre_docente = resultado[0]
        except Exception as e:
            print("❌ Error al consultar PostgreSQL:", e)

        lista.append({
            "_id": str(exam["_id"]),
            "title": exam["title"],
            "docente": nombre_docente
        })

    return jsonify(lista)


# 📌 Obtener examen por ID (con nombre del docente)
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

        # 🔎 Obtener nombre del docente
        teacher_id = examen.get("teacher_id", "")
        nombre_docente = "Desconocido"
        try:
            pg_cursor.execute("SELECT nombre FROM usuarios WHERE id = %s", (teacher_id,))
            resultado = pg_cursor.fetchone()
            if resultado:
                nombre_docente = resultado[0]
        except Exception as e:
            print("❌ Error al consultar PostgreSQL:", e)

        return jsonify({
            "exam_id": exam_id,
            "title": examen["title"],
            "docente": nombre_docente,
            "questions": preguntas
        })

    except Exception as e:
        return jsonify({"error": f"ID inválido o error: {str(e)}"}), 400


# 📌 Eliminar examen
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


# 📌 Actualizar examen
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


# 🔥 Iniciar servidor
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
