export function getPostAuthPath() {
  const returnTo = new URLSearchParams(window.location.search).get('returnTo');

  // Разрешаем только внутренние адреса, чтобы нельзя было перенаправить
  // пользователя на внешний сайт.
  if (returnTo?.startsWith('/') && !returnTo.startsWith('//')) {
    return returnTo;
  }

  return '/dashboard';
}
