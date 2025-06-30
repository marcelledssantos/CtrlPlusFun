const checkWinner = require('../app/static/js/velhaUtils');

describe('checkWinner', () => {
  it('detecta vitória na horizontal', () => {
    const board = [
      ['X', 'X', 'X'],
      ['', '', ''],
      ['', '', '']
    ];
    expect(checkWinner(board)).toBe('X');
  });
  it('detecta vitória na vertical', () => {
    const board = [
      ['O', '', ''],
      ['O', '', ''],
      ['O', '', '']
    ];
    expect(checkWinner(board)).toBe('O');
  });
  it('detecta vitória na diagonal', () => {
    const board = [
      ['X', '', ''],
      ['', 'X', ''],
      ['', '', 'X']
    ];
    expect(checkWinner(board)).toBe('X');
  });
  it('detecta empate', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'O', 'X'],
      ['O', 'X', 'O']
    ];
    expect(checkWinner(board)).toBe('Empate');
  });
  it('retorna null se o jogo não acabou', () => {
    const board = [
      ['X', '', 'O'],
      ['', '', 'X'],
      ['O', '', '']
    ];
    expect(checkWinner(board)).toBe(null);
  });
});
