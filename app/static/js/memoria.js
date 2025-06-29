const emojis = [
  "🍕",
  "🍔",
  "🍟",
  "🌭",
  "🥐",
  "🍩",
  "🍰",
  "🍫",
  "🍓",
  "🍇",
  "🍎",
  "🍒",
  "🍕",
  "🍔",
  "🍟",
  "🌭",
  "🥐",
  "🍩",
  "🍰",
  "🍫",
  "🍓",
  "🍇",
  "🍎",
  "🍒",
];

let cartas = [];
let cartaVirada = null;
let bloqueado = true;
let tempoRestante = 180;
let cronometro;

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function atualizarCronometro() {
  const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
  const segundos = String(tempoRestante % 60).padStart(2, "0");
  document.getElementById(
    "cronometro"
  ).textContent = `⏱️ ${minutos}:${segundos}`;
}

function mostrarMensagem(texto, cor = "#ffffff") {
  const msg = document.getElementById("mensagem");
  msg.textContent = texto;
  msg.style.color = cor;
}

function iniciarCronometro() {
  atualizarCronometro();
  cronometro = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    if (tempoRestante <= 0) {
      clearInterval(cronometro);
      mostrarMensagem("⏱️ Tempo esgotado! Você perdeu!", "#ff5555");
    }
  }, 1000);
}

function criarTabuleiro() {
  const tabuleiro = document.getElementById("tabuleiro");
  tabuleiro.innerHTML = "";
  embaralhar(emojis);
  cartas = emojis.map((emoji, index) => {
    const carta = document.createElement("div");
    carta.className = "carta oculta";
    carta.dataset.emoji = emoji;
    carta.dataset.index = index;
    carta.innerHTML = `<span class="icone">${emoji}</span>`;
    carta.addEventListener("click", revelarCarta);
    tabuleiro.appendChild(carta);
    return carta;
  });
}

function revelarCarta(event) {
  if (bloqueado) return;
  const carta = event.currentTarget;
  if (
    carta.classList.contains("revelada") ||
    carta.classList.contains("completa")
  )
    return;

  carta.classList.remove("oculta");
  carta.classList.add("revelada");

  if (!cartaVirada) {
    cartaVirada = carta;
  } else {
    if (carta.dataset.emoji === cartaVirada.dataset.emoji) {
      carta.classList.add("completa");
      cartaVirada.classList.add("completa");
      carta.classList.remove("revelada");
      cartaVirada.classList.remove("revelada");
      cartaVirada = null;

      if (
        document.querySelectorAll(".carta.completa").length === emojis.length
      ) {
        clearInterval(cronometro);
        mostrarMensagem(
          "🎉 Parabéns! Você encontrou todos os pares!",
          "#00ff88"
        );
      }
    } else {
      bloqueado = true;
      setTimeout(() => {
        carta.classList.add("oculta");
        carta.classList.remove("revelada");
        cartaVirada.classList.add("oculta");
        cartaVirada.classList.remove("revelada");
        cartaVirada = null;
        bloqueado = false;
      }, 1000);
    }
  }
}

document.getElementById("comecar").addEventListener("click", () => {
  document.getElementById("comecar").classList.add("oculto");
  document.getElementById("cronometro").style.display = "block";
  document.querySelector(".card-regras").style.display = "none";

  criarTabuleiro();

  cartas.forEach((c) => {
    c.classList.remove("oculta");
    c.classList.add("revelada");
  });

  bloqueado = true;

  setTimeout(() => {
    cartas.forEach((c) => {
      c.classList.add("oculta");
      c.classList.remove("revelada");
    });
    bloqueado = false;
    iniciarCronometro();
  }, 10000);
});
