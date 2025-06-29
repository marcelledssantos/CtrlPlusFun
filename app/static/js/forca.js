function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const container = document.querySelector(".container");

const todasPalavras = JSON.parse(container.dataset.todasPalavras);
const palavra = container.dataset.palavra;
const dicas = JSON.parse(container.dataset.dicas);
const palavraSelecionada = palavra.toUpperCase();
const palavraSemAcento = removerAcentos(palavraSelecionada);

const letrasContainer = document.getElementById("letras");
const palavraContainer = document.getElementById("palavra");
const errosContainer = document.getElementById("erros");
const dicaInicialContainer = document.getElementById("dica-inicial");
const maisDicaBtn = document.getElementById("pedir-dica");
const maisDicaContainer = document.getElementById("mais-dica");

let letrasErradas = [];
let letrasCertas = [];
let tentativas = 6;
let dicaAtual = 1;

dicaInicialContainer.textContent = dicas[0] || "Nenhuma dica disponível.";

function mostrarPalavra() {
  palavraContainer.innerHTML = "";
  for (let i = 0; i < palavraSelecionada.length; i++) {
    const letraOriginal = palavraSelecionada[i];
    const letraComparada = palavraSemAcento[i];

    const span = document.createElement("span");
    span.classList.add("letra");

    if (letrasCertas.includes(letraComparada)) {
      span.textContent = letraOriginal;
    } else if (letraOriginal === " ") {
      span.textContent = " ";
      span.classList.add("espaco");
    } else {
      span.textContent = "_";
    }

    palavraContainer.appendChild(span);
  }
}

function criarTeclado() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  letrasContainer.innerHTML = "";

  const linha1 = document.createElement("div");
  const linha2 = document.createElement("div");

  linha1.classList.add("linha-teclado");
  linha2.classList.add("linha-teclado");

  for (let i = 0; i < letras.length; i++) {
    const letra = letras[i];
    const btn = document.createElement("button");
    btn.classList.add("btn-letra");
    btn.textContent = letra;
    btn.addEventListener("click", () => verificarLetra(letra, btn));

    (i < 13 ? linha1 : linha2).appendChild(btn);
  }

  letrasContainer.appendChild(linha1);
  letrasContainer.appendChild(linha2);
}

function verificarLetra(letra, btn) {
  btn.disabled = true;

  if (palavraSemAcento.includes(letra)) {
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
  const revelada = palavraSemAcento
    .split("")
    .every((l, i) => l === " " || letrasCertas.includes(l) || palavraSelecionada[i] === " ");

  if (revelada) {
    errosContainer.textContent = "🎉 Parabéns! Você acertou!";
    desativarTeclado();
  } else if (tentativas <= 0) {
    errosContainer.textContent = `😢 Você perdeu! A palavra era: ${palavraSelecionada}`;
    desativarTeclado();
  }
}

function desativarTeclado() {
  document.querySelectorAll(".btn-letra").forEach(btn => btn.disabled = true);
  maisDicaBtn.style.opacity = "0.5";
  maisDicaBtn.style.cursor = "not-allowed";
  maisDicaBtn.removeEventListener("click", mostrarMaisDica);
}

function mostrarMaisDica() {
  if (dicaAtual < dicas.length) {
    maisDicaContainer.textContent = dicas[dicaAtual];
    dicaAtual++;
    if (dicaAtual === dicas.length) {
      maisDicaBtn.style.opacity = "0.5";
      maisDicaBtn.style.cursor = "not-allowed";
      maisDicaBtn.title = "Dicas esgotadas";
    }
  }
}

mostrarPalavra();
criarTeclado();
maisDicaBtn.addEventListener("click", mostrarMaisDica);

document.getElementById("btn-recomecar").addEventListener("click", () => {
  let usadas = JSON.parse(localStorage.getItem("palavrasUsadas")) || [];
  const restantes = todasPalavras.filter(p => !usadas.includes(p.palavra));

  if (restantes.length === 0) {
    alert("Você já jogou com todas as palavras! Reiniciando...");
    localStorage.removeItem("palavrasUsadas");
    location.reload();
    return;
  }

  const nova = restantes[Math.floor(Math.random() * restantes.length)];
  usadas.push(nova.palavra);
  localStorage.setItem("palavrasUsadas", JSON.stringify(usadas));

  const params = new URLSearchParams();
  params.set("palavra", nova.palavra);
  window.location.href = "/forca?palavra=" + encodeURIComponent(nova.palavra);
});
