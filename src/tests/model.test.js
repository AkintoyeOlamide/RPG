import Model from '../Model';

test('create model successfully', () => {
  const model = new Model();
  expect(model.musicOn).toBe(true);
});

test('expect bgMusicPlaying to be false', () => {
  const model = new Model();
  expect(model.bgMusicPlaying).toBe(false);
});
