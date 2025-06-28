from flask import Flask
from app.views.hub_view import bp_hub
from app.views.velha_view import bp_velha

def create_app():
    app = Flask(__name__)
    app.secret_key = "ctrlplusfun"

    app.register_blueprint(bp_hub)
    app.register_blueprint(bp_velha)

    return app
