// utils/auth.js
// Funções utilitárias para gerenciamento de autenticação via localStorage.
// Centraliza o acesso aos tokens JWT e dados do usuário,
// evitando o uso direto de strings hardcoded espalhadas pelo código.

/**
 * Salva os dados de autenticação retornados pelo backend após o login.
 * @param {string} access  - Token de acesso JWT (curta duração)
 * @param {string} refresh - Token de refresh JWT (longa duração)
 * @param {string} username - Nome do usuário autenticado
 */
export const saveAuthData = (access, refresh, username) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
  localStorage.setItem('username', username);
};

/**
 * Remove todos os dados de autenticação do localStorage.
 * Deve ser chamado no logout.
 */
export const clearAuthData = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('username');
};

/**
 * Retorna o token de acesso armazenado, ou null se não existir.
 * @returns {string|null}
 */
export const getAccessToken = () => localStorage.getItem('access');

/**
 * Retorna o token de refresh armazenado, ou null se não existir.
 * @returns {string|null}
 */
export const getRefreshToken = () => localStorage.getItem('refresh');

/**
 * Retorna o username do usuário logado, ou null se não existir.
 * @returns {string|null}
 */
export const getUsername = () => localStorage.getItem('username');

/**
 * Verifica se o usuário está autenticado (possui token de acesso).
 * @returns {boolean}
 */
export const isAuthenticated = () => Boolean(getAccessToken());
