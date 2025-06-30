function encaixarPalavra(tabuleiro, palavra) {
  const direcoes = [
    [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1],
  ];
  for (let tent = 0; tent < 100; tent++) {
    const dir = direcoes[Math.floor(Math.random() * direcoes.length)];
    const tamanho = tabuleiro.length;
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

describe('encaixarPalavra', () => {
  it('deve encaixar uma palavra em um tabuleiro vazio', () => {
    const tabuleiro = Array.from({ length: 12 }, () => Array(12).fill(""));
    const palavra = "TESTE";
    const posicoes = encaixarPalavra(tabuleiro, palavra);
    expect(posicoes.length).toBe(palavra.length);
    posicoes.forEach(([l, c], i) => {
      expect(tabuleiro[l][c]).toBe(palavra[i]);
    });
  });
});
