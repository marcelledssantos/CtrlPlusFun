# app/views/velha_view.py
from flask import Blueprint, render_template, request, redirect, url_for
import random

bp_velha = Blueprint('velha', __name__, url_prefix='/velha')

def criar_tabuleiro():
    return [['' for _ in range(3)] for _ in range(3)]

def verificar_vitoria(tabuleiro, jogador):
    for linha in tabuleiro:
        if all(celula == jogador for celula in linha):
            return True
    for col in range(3):
        if all(tabuleiro[linha][col] == jogador for linha in range(3)):
            return True
    if all(tabuleiro[i][i] == jogador for i in range(3)) or all(tabuleiro[i][2-i] == jogador for i in range(3)):
        return True
    return False

def tabuleiro_cheio(tabuleiro):
    return all(all(celula != '' for celula in linha) for linha in tabuleiro)

@bp_velha.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        tabuleiro = [request.form.getlist(f"row{i}") for i in range(3)]
        for i in range(3):
            tabuleiro[i] = [cell if cell in ['X', 'O'] else '' for cell in tabuleiro[i]]

        jogador = "X"
        computador = "O"

        if verificar_vitoria(tabuleiro, jogador):
            return render_template("velha.html", tabuleiro=tabuleiro, mensagem="Você venceu!")
        
        if not tabuleiro_cheio(tabuleiro):
            jogadas_possiveis = [(i, j) for i in range(3) for j in range(3) if tabuleiro[i][j] == '']
            if jogadas_possiveis:
                i, j = random.choice(jogadas_possiveis)
                tabuleiro[i][j] = computador

        if verificar_vitoria(tabuleiro, computador):
            return render_template("velha.html", tabuleiro=tabuleiro, mensagem="Computador venceu!")
        
        if tabuleiro_cheio(tabuleiro):
            return render_template("velha.html", tabuleiro=tabuleiro, mensagem="Empate!")

        return render_template("velha.html", tabuleiro=tabuleiro)

    tabuleiro = criar_tabuleiro()
    return render_template("velha.html", tabuleiro=tabuleiro)
