from flask import Flask
from app.views.hub_view import bp_hub
from app.views.velha_view import bp_velha
from app.views.forca_view import bp_forca
from app.views.memoria_view import bp_memoria


def create_app():
    app = Flask(__name__)
    app.secret_key = "ctrlplusfun"

    app.register_blueprint(bp_hub)
    app.register_blueprint(bp_velha)
    app.register_blueprint(bp_forca)
    app.register_blueprint(bp_memoria) 

    return app
