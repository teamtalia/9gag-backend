/* eslint-disable no-plusplus */
export function randomStr(length: number): string {
  const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(
    '',
  );
  const b = [];
  for (let i = 0; i < length; i++) {
    const j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join('');
}

export function validateUsername(str: string): string | null {
  let error = null;
  const illegalChars = /\W/; // allow letters, numbers, and underscores

  if (str === '') {
    error = 'Por favor, insira o nome de usuário.';
  } else if (str.length < 5 || str.length > 16) {
    error = 'O nome de usuário deve ter de 5 a 16 caracteres';
  } else if (illegalChars.test(str)) {
    error =
      'Por favor, insira um nome de usuário válido. Use apenas números,letras e caracteres especiais como "_".';
  }
  return error;
}
