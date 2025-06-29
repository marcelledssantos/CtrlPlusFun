from flask import Blueprint, render_template, current_app
import os, json, random

bp_forca = Blueprint('forca', __name__, url_prefix='/forca')

@bp_forca.route('/')
def forca():
    caminho_json = os.path.join(current_app.root_path, 'static', 'data', 'palavras_forca.json')
    with open(caminho_json, encoding='utf-8') as f:
        palavras = json.load(f)

    escolha = random.choice(palavras)
    palavra = escolha['palavra']
    categoria = escolha['categoria']
    dicas = escolha['dicas']

    return render_template(
        'forca.html',
        palavra=palavra,
        categoria=categoria,
        dicas=dicas,
        todas_palavras=palavras
    )

