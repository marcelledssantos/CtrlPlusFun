function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

describe('embaralhar', () => {
  it('deve embaralhar o array sem perder elementos', () => {
    const original = [1, 2, 3, 4, 5, 6];
    const copia = [...original];
    embaralhar(copia);
    expect([...copia].sort()).toEqual([...original].sort());
  });

  it('pode manter a ordem original (caso raro), mas normalmente muda', () => {
    const original = [1, 2, 3, 4, 5, 6];
    let mudou = false;
    for (let i = 0; i < 10; i++) {
      const copia = [...original];
      embaralhar(copia);
      if (copia.join() !== original.join()) {
        mudou = true;
        break;
      }
    }
    expect(mudou).toBe(true);
  });
});
