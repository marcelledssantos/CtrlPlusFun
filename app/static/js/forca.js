const letrasContainer = document.getElementById("letras");
const palavraContainer = document.getElementById("palavra");
const errosContainer = document.getElementById("erros");
const categoriaContainer = document.getElementById("categoria");
const dicaInicialContainer = document.getElementById("dica-inicial");
const maisDicaBtn = document.getElementById("pedir-dica");
const maisDicaContainer = document.getElementById("mais-dica");
const container = document.querySelector('.container');

const palavra = container.dataset.palavra;
const categoria = container.dataset.categoria;
const dicas = JSON.parse(container.dataset.dicas);

const palavraSelecionada = palavra.toUpperCase();

let letrasErradas = [];
let letrasCertas = [];
let tentativas = 6;
let dicaAtual = 1;

function mostrarPalavra() {
  palavraContainer.innerHTML = "";

  for (let letra of palavraSelecionada) {
    const span = document.createElement("span");
    span.classList.add("letra");

    if (letrasCertas.includes(letra)) {
      span.textContent = letra;
    } else if (letra === " ") {
      span.textContent = " ";
      span.classList.add("espaco");
    } else {
      span.textContent = "_";
    }

    palavraContainer.appendChild(span);
  }
}

function criarTeclado() {
  const A_Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letra of A_Z) {
    const btn = document.createElement("button");
    btn.classList.add("btn-letra");
    btn.textContent = letra;
    btn.addEventListener("click", () => verificarLetra(letra, btn));
    letrasContainer.appendChild(btn);
  }
}

function verificarLetra(letra, btn) {
  btn.disabled = true;

  if (palavraSelecionada.includes(letra)) {
    letrasCertas.push(letra);
  } else {
    letrasErradas.push(letra);
    tentativas--;
    errosContainer.textContent = `Erros: ${letrasErradas.join(", ")} (${tentativas} tentativas restantes)`;
  }

  mostrarPalavra();
  checarFimDeJogo();
}

function checarFimDeJogo() {
  const palavraRevelada = [...palavraSelecionada].every(l => l === " " || letrasCertas.includes(l));

  if (palavraRevelada) {
    errosContainer.textContent = "🎉 Parabéns! Você acertou!";
    desativarTeclado();
  } else if (tentativas <= 0) {
    errosContainer.textContent = `😢 Você perdeu! A palavra era: ${palavraSelecionada}`;
    desativarTeclado();
  }
}

function desativarTeclado() {
  document.querySelectorAll(".btn-letra").forEach(btn => btn.disabled = true);
  maisDicaBtn.disabled = true;
}

categoriaContainer.textContent = `Categoria: ${categoria}`;
dicaInicialContainer.textContent = `Dica: ${dicas[0] || "Nenhuma dica disponível."}`;

mostrarPalavra();
criarTeclado();

maisDicaBtn.addEventListener("click", () => {
  if (dicaAtual < dicas.length) {
    maisDicaContainer.textContent = dicas[dicaAtual];
    dicaAtual++;
    if (dicaAtual === dicas.length) {
      maisDicaBtn.disabled = true;
      maisDicaBtn.textContent = "💡 Dicas esgotadas";
    }
  }
});
