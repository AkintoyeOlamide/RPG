const addUser = (user) => {
  if (!localStorage.getItem('current_player')) {
    localStorage.setItem('current_player', user);

    return localStorage.getItem('current_player');
  }

  return localStorage.getItem('current_player');
};

export default addUser;