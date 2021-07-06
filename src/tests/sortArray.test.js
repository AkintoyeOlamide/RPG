import sortArray from '../components/sortArray';

test('given array should be sorted in descending order', () => {
  const array = [
    {
      user: 'any',
      score: 89,
    },
    {
      user: 'any',
      score: 34,
    },
    {
      user: 'any',
      score: 140,
    },
  ];
  expect(sortArray(array)).toEqual([
    {
      user: 'any',
      score: 140,
    },
    {
      user: 'any',
      score: 89,
    },
    {
      user: 'any',
      score: 34,
    },
  ]);
});
