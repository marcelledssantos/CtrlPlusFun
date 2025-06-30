const tamanho = 12;
let letras = [];
let palavrasData = [];
let selecionadas = [];
let palavrasEncontradas = new Set();
let DEBUG = false;
let inicioSelecao = null;

const PALAVRAS = [
  "CACHORRO", "ELEFANTE", "GIRAFA", "TIGRE", "URSO", "MACACO", "PATO", "SAPO", "RATO", "LEAO", "ZEBRA", "COBRA",
  "FADA", "BOLA", "LIVRO", "CASA", "DADO", "FOLHA", "JOGO", "PEIXE", "BANANA", "TOMATE", "MORANGO", "CENOURA",
  "ABACAXI", "LIMAO", "MELANCIA", "PERA", "UVA", "GOIABA", "MANGA", "KIWI", "AMEIXA", "FIGO", "CAJU", "COCO", "PESSEGO",
  "BATATA", "ALFACE", "BROCOLIS", "ESPINAFRE", "ALHO", "CEBOLA", "PIMENTA", "SAL", "AZEITE", "OLEO", "VINAGRE", "ARROZ",
  "FEIJAO", "CARNE", "FRANGO", "OVO", "LEITE", "QUEIJO", "IOGURTE", "MANTEIGA", "CREME", "SORVETE", "BOLO", "BISCOITO",
  "PUDIM", "GELATINA", "FRUTA", "MAÇA", "LARANJA", "MELAO", "TAMARINDO", "JABUTICABA", "ACEROLA", "GRAVIOLA", "PITANGA",
  "SERIGUELA", "CUPUACU", "BACABA", "BURITI", "TUCUMA", "ARATICUM", "JENIPAPO", "MURICI", "CABELUDINHA", "CAMBUCI",
  "GUARANA", "MARACUJA", "SAPOTI", "UMBU", "INGA", "TAPEREBA", "MORINGA", "JILÓ", "QUIABO", "ABOBORA", "CHUCHU", "ERVILHA",
  "SAOPAULO", "RIODEJANEIRO", "BRASILIA", "SALVADOR", "FORTALEZA", "BELOHORIZONTE", "MANAUS", "CURITIBA", "RECIFE", "GOIANIA",
  "PORTOALEGRE", "BELEM", "CAMPINAS", "SAOLUIS", "NATAL", "TERESINA", "SAOJOSE", "JOAOPESSOA", "SANTOS", "CUIABA", "ARACAJU",
  "FLORIANOPOLIS", "VITORIA", "LONDRINA", "RIBEIRAOPRETO", "MARINGA", "JUNDIAI", "CAXIAS", "PETROLINA", "SOROCABA", "JOINVILLE"
];

function direcoesPossiveis() {
  return [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];
}

function encaixarPalavra(tabuleiro, palavra) {
  const direcoes = direcoesPossiveis();
  for (let tent = 0; tent < 100; tent++) {
    const dir = direcoes[Math.floor(Math.random() * direcoes.length)];
    const maxLinha = dir[0] === 0 ? tamanho : tamanho - (dir[0] * (palavra.length - 1));
    const maxCol = dir[1] === 0 ? tamanho : tamanho - (dir[1] * (palavra.length - 1));
    const linha = Math.floor(Math.random() * maxLinha);
    const coluna = Math.floor(Math.random() * maxCol);
    let posicoes = [];
    let pode = true;
    for (let i = 0; i < palavra.length; i++) {
      const l = linha + dir[0] * i;
      const c = coluna + dir[1] * i;
      if (l < 0 || l >= tamanho || c < 0 || c >= tamanho || tabuleiro[l][c]) {
        pode = false;
        break;
      }
      posicoes.push([l, c]);
    }
    if (pode) {
      for (let i = 0; i < palavra.length; i++) {
        const l = linha + dir[0] * i;
        const c = coluna + dir[1] * i;
        tabuleiro[l][c] = palavra[i];
      }
      return posicoes;
    }
  }
  return null;
}

async function carregarPalavras() {
  const palavrasSorteadas = PALAVRAS.sort(() => Math.random() - 0.5).slice(0, 8);
  let tabuleiro = Array.from({ length: tamanho }, () => Array(tamanho).fill(""));
  let palavrasComPosicoes = [];
  for (const palavra of palavrasSorteadas) {
    const posicoes = encaixarPalavra(tabuleiro, palavra);
    if (posicoes) {
      palavrasComPosicoes.push({ palavra, posicoes });
    }
  }
  letras = tabuleiro;
  return palavrasComPosicoes;
}

function gerarLetraAleatoria() {
  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alfabeto[Math.floor(Math.random() * alfabeto.length)];
}

function inicializarGrade() {
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (!letras[i][j]) letras[i][j] = gerarLetraAleatoria();
    }
  }
}

function renderizarGrade() {
  const grade = document.getElementById("grade");
  grade.innerHTML = "";
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      const celula = document.createElement("div");
      celula.className = "celula";
      celula.textContent = letras[i][j];
      celula.dataset.linha = i;
      celula.dataset.coluna = j;
      celula.onclick = () => {
        const linha = +celula.dataset.linha;
        const coluna = +celula.dataset.coluna;
        if (!inicioSelecao) {
          inicioSelecao = [linha, coluna];
          selecionadas = [[linha, coluna]];
          document.querySelectorAll('.selecionada').forEach(c => c.classList.remove('selecionada'));
          celula.classList.add('selecionada');
        } else {
          const fim = [linha, coluna];
          selecionadas = getCaminho(inicioSelecao, fim);
          document.querySelectorAll('.selecionada').forEach(c => c.classList.remove('selecionada'));
          selecionadas.forEach(([li, co]) => {
            const c = document.querySelector(`[data-linha='${li}'][data-coluna='${co}']`);
            if (c) c.classList.add('selecionada');
          });
          verificarSelecao();
          inicioSelecao = null;
        }
      };
      grade.appendChild(celula);
    }
  }
}

function getCaminho(inicio, fim) {
  const [li, ci] = inicio;
  const [lf, cf] = fim;
  const dl = Math.sign(lf - li);
  const dc = Math.sign(cf - ci);
  const tam = Math.max(Math.abs(lf - li), Math.abs(cf - ci));
  let caminho = [];
  for (let k = 0; k <= tam; k++) {
    const l = li + dl * k;
    const c = ci + dc * k;
    if (l < 0 || l >= tamanho || c < 0 || c >= tamanho) break;
    caminho.push([l, c]);
  }
  return caminho;
}

function renderizarPalavras() {
  const lista = document.getElementById("palavras");
  lista.innerHTML = "";
  palavrasData.forEach(({ palavra }) => {
    const span = document.createElement("span");
    span.className = "palavra-item";
    span.textContent = palavra;
    span.id = `palavra-${palavra}`;
    lista.appendChild(span);
  });
}

function verificarSelecao() {
  const selStr = JSON.stringify(selecionadas);
  for (const { palavra, posicoes } of palavrasData) {
    const normal = JSON.stringify(posicoes);
    const inversa = JSON.stringify([...posicoes].reverse());
    if ((selStr === normal || selStr === inversa) && !palavrasEncontradas.has(palavra)) {
      palavrasEncontradas.add(palavra);
      posicoes.forEach(([i, j]) => {
        const celula = document.querySelector(`[data-linha='${i}'][data-coluna='${j}']`);
        if (celula) celula.classList.add("encontrada");
      });
      const item = document.getElementById(`palavra-${palavra}`);
      if (item) item.style.textDecoration = "line-through";
      if (palavrasEncontradas.size === palavrasData.length) {
        const mensagem = document.getElementById("mensagem-vitoria");
        if (mensagem) mensagem.style.display = "block";
      }
      selecionadas = [];
      document.querySelectorAll(".selecionada").forEach(c => c.classList.remove("selecionada"));
      return;
    }
  }
  if (selecionadas.length > 12) {
    selecionadas = [];
    document.querySelectorAll(".selecionada").forEach(c => c.classList.remove("selecionada"));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  palavrasData = await carregarPalavras();
  inicializarGrade();
  renderizarGrade();
  renderizarPalavras();
  document.getElementById("btn-recomecar").addEventListener("click", async () => {
    document.getElementById("mensagem-vitoria").style.display = "none";
    palavrasEncontradas.clear();
    palavrasData = await carregarPalavras();
    inicializarGrade();
    renderizarGrade();
    renderizarPalavras();
    selecionadas = [];
  });
});
