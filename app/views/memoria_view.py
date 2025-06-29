from flask import Blueprint, render_template

bp_memoria = Blueprint('memoria', __name__)

@bp_memoria.route("/memoria")
def pagina_memoria():
    return render_template("memoria.html")
