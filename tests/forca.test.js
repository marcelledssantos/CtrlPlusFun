const removerAcentos = require('../app/static/js/utils');

describe('removerAcentos', () => {
  it('remove acentos de uma string', () => {
    expect(removerAcentos('ação')).toBe('acao');
    expect(removerAcentos('coração')).toBe('coracao');
    expect(removerAcentos('PÃO')).toBe('PAO');
    expect(removerAcentos('pingüim')).toBe('pinguim');
    expect(removerAcentos('árvore')).toBe('arvore');
    expect(removerAcentos('')).toBe('');
  });
});
