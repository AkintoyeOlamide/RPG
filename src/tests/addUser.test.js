import 'jest-localstorage-mock';
import addUser from '../components/addUser';

test('add user successfully', () => {
  const user = addUser('any');
  expect(user).toBe('any');
});
