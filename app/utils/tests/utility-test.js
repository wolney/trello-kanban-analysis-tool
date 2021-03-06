import { test } from 'tape';
import R from 'ramda';

import {
  argsToArray,
  countByWith,
  groupByWith,
  round,
} from '../utility';

test('argsToArray', (assert) => {
  assert.deepEquals(
    argsToArray(1, 'lorem', 3),
    [1, 'lorem', 3],
    'should convert arguments into an array'
  );
  assert.end();
});

test('countByWith', (assert) => {
  const data = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
  const fn = (a, b) => ({ number: a, count: b });

  const expected = [
    { number: '1', count: 3 },
    { number: '2', count: 2 },
    { number: '3', count: 1 },
  ];
  const result = countByWith(Math.floor, fn, data);
  const resultCurried1 = countByWith(Math.floor, fn);
  const resultCurried2 = countByWith(Math.floor);

  assert.looseEquals(
    expected,
    result,
    'should return a collection of counted parsed objects'
  );
  assert.looseEquals(
    expected,
    resultCurried1(data),
    'should work if we pass last argument later'
  );
  assert.looseEquals(
    expected,
    resultCurried2(fn)(data),
    'should work if we pass arguments one by one'
  );

  assert.end();
});

test('groupByWith', (assert) => {
  const fn = (a, b) => ({ grade: a, list: b });
  const data = [
    { grade: 'A', name: 'Aby' },
    { grade: 'A', name: 'Georges' },
    { grade: 'B', name: 'Pascal' },
    { grade: 'A', name: 'Freddy' },
    { grade: 'C', name: 'Nick' },
    { grade: 'C', name: 'Jane' },
  ];

  const expected = [
    {
      grade: 'A',
      list: [
        { grade: 'A', name: 'Aby' },
        { grade: 'A', name: 'Georges' },
        { grade: 'A', name: 'Freddy' },
      ],
    },
    {
      grade: 'B',
      list: [{ grade: 'B', name: 'Pascal' }],
    },
    {
      grade: 'C',
      list: [
        { grade: 'C', name: 'Nick' },
        { grade: 'C', name: 'Jane' },
      ],
    },
  ];

  assert.looseEquals(
    groupByWith(R.prop('grade'), fn, data),
    expected,
    'should return a collection of grouped parsed objects'
  );
  assert.looseEquals(
    groupByWith(R.prop('grade'), fn)(data),
    expected,
    'should work if we pass last argument later'
  );
  assert.looseEquals(
    groupByWith(R.prop('grade'))(fn)(data),
    expected,
    'should work if we pass arguments one by one'
  );
  assert.looseEquals(
    groupByWith(R.prop('grade'), fn, {}),
    [],
    'should return an empty array if data is an object'
  );

  assert.end();
});

test('round', (assert) => {
  assert.equals(round(12.18653), 12.19, 'should round given float to the second decimal');
  assert.equals(round(12.18353), 12.18, 'should round to the floor when appropriate');
  assert.equals(round(12), 12, 'should not change given integer');
  assert.equals(round(-12.1827), -12.18, 'should deal with negatives');
  assert.equals(round(12.1), 12.1, 'should not change floats that have less than 2 decimals');
  assert.end();
});
