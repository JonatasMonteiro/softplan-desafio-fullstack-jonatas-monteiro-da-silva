// Serviço que retorna o header das requisições a serem feitas
export default function authHeader(flag) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    if(flag){
      return {Authorization: 'Bearer ' + user.token,
            'Content-Type':'text/plain'}
    }
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
