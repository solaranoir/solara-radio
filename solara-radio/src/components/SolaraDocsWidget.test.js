import { render, screen } from '@testing-library/react';
import SolaraDocsWidget, { SOLARA_DOCS_URL } from './SolaraDocsWidget';
import CodingProjectsWidget from './CodingProjectsWidget';

test('Tools card links to Solara Docs and says it is invite only', () => {
  render(<SolaraDocsWidget />);
  const link = screen.getByRole('link', { name: /Open Solara Docs/ });
  expect(link).toHaveAttribute('href', SOLARA_DOCS_URL);
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText('Invite only')).toBeInTheDocument();
});

test('Solara Docs appears in the coding projects with GitHub and live links', () => {
  render(<CodingProjectsWidget />);
  const card = screen.getByRole('heading', { name: 'Solara Docs' }).closest('article');
  const links = Array.from(card.querySelectorAll('a')).map((a) => a.getAttribute('href'));
  expect(links).toEqual(['https://github.com/solaranoir/docs_dup_exercise', SOLARA_DOCS_URL]);
});
