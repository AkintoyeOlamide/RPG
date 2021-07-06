import 'jest-localstorage-mock';
import checkUser from '../components/checkUser';
import addUser from '../components/addUser';

test('return false if user is not stored', () => {
  expect(checkUser()).toBe(false);
});

test('check if user is already created', () => {
  addUser('any');
  expect(checkUser()).toBe(true);
});
