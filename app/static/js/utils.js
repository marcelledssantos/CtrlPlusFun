function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = removerAcentos;
}
