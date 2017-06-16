import { KnightRiderPage } from './app.po';

describe('knight-rider App', () => {
  let page: KnightRiderPage;

  beforeEach(() => {
    page = new KnightRiderPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
