import { normalize } from './normalize';

describe('normalize', () => {
  it('приводит строку к нижнему регистру', () => {
    expect(normalize('GERMANY')).toBe('germany');
  });
});

it('убирает пробелы по краям', () => {
  expect(normalize(' france ')).toBe('france');
});

it('обрабатывает пустую строку', () => {
  expect(normalize('')).toBe('');
});

it('обрабатывает строку с пробелами внутри - не трогает их', () => {
  expect(normalize('South Korea')).toBe('south korea');
});
