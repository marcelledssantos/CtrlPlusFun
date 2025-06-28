# app/views/hub_view.py

from flask import Blueprint, render_template

bp_hub = Blueprint('hub', __name__)

@bp_hub.route("/")
def index():
    return render_template("index.html")
