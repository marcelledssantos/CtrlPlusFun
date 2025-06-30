from flask import Blueprint, render_template

bp_caca = Blueprint('caca', __name__)

@bp_caca.route("/caca")
def pagina_caca():
    return render_template("caca.html")

