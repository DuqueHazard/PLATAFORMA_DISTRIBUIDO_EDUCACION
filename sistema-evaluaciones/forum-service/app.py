from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from better_profanity import profanity

app = Flask(__name__)
CORS(app)

# Lista personalizada de malas palabras en español
spanish_bad_words = [
    'mierda', 'puta', 'puto', 'carajo', 'imbécil', 'estúpido',
    'idiota', 'gilipollas', 'culero', 'pendejo'
]

profanity.load_censor_words(spanish_bad_words)

# Conexión a la base de datos
client = MongoClient("mongodb://mongo:27017")
db = client["foro_db"]
posts = db["posts"]

# Endpoint para crear una nueva publicación
@app.route("/posts", methods=["POST"])
def create_post():
    data = request.json
    title = profanity.censor(data.get("title", ""))
    content = profanity.censor(data.get("content", ""))
    author = profanity.censor(data.get("author", ""))

    post = {
        "title": title,
        "content": content,
        "author": author,
        "comments": []
    }
    post_id = posts.insert_one(post).inserted_id
    return jsonify({"id": str(post_id)}), 201

# Endpoint para obtener todas las publicaciones
@app.route("/posts", methods=["GET"])
def get_posts():
    result = []
    for post in posts.find():
        post["_id"] = str(post["_id"])
        result.append(post)
    return jsonify(result)

# Endpoint para añadir un comentario a una publicación
@app.route("/posts/<post_id>/comment", methods=["POST"])
def add_comment(post_id):
    comment = request.json.get("comment")
    if not comment:
        return jsonify({"error": "Comentario vacío"}), 400

    censored_comment = profanity.censor(comment)

    posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"comments": censored_comment}}
    )
    return jsonify({"msg": "Comentario añadido"}), 200

# Endpoint para editar a una publicación
@app.route("/posts/<post_id>", methods=["PUT"])
def edit_post(post_id):
    data = request.json
    title = profanity.censor(data.get("title", ""))
    content = profanity.censor(data.get("content", ""))
    author = profanity.censor(data.get("author", ""))

    result = posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {
            "title": title,
            "content": content,
            "author": author
        }}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Post no encontrado"}), 404

    return jsonify({"msg": "Publicación actualizada"}), 200

# Endpoint para eliminar a una publicación
@app.route("/posts/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    result = posts.delete_one({"_id": ObjectId(post_id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Publicación no encontrada"}), 404

    return jsonify({"msg": "Publicación eliminada"}), 200

# Arrancar el servidor Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
