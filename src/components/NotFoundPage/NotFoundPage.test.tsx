import { render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import { NotFoundPage } from './NotFoundPage';

const renderNotFoundPage = () => {
  render(
    <MemoryRouter initialEntries={['/notFoundPage']}>
      <NotFoundPage />
    </MemoryRouter>
  );
};

describe('NotFoundPage', () => {
  it('отображает информацию об ошибке', () => {
    renderNotFoundPage();

    expect(screen.getByText('УПС! Страница не найдена!')).toBeInTheDocument();
  });

  it('ссылка ведет на Главную страницу', () => {
    renderNotFoundPage();

    const link = screen.getByRole('link', {
      name: 'вернуться домой',
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
