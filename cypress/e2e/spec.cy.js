describe('Home', () => {
  it('uses a relative URL for the Home link', () => {
    cy.visit('http://localhost:3000/');

    cy.contains('Home').should('have.attr', 'href', './');
  });

  it('can initiate a search', () => {
    cy.visit('http://localhost:3000/');

    cy.get('nav input').type('video');
    cy.get('nav form').submit();
    cy.url().should('eq', 'http://localhost:3000/search?q=video');
  });
});

describe('Search results', () => {
  it('uses a relative URL for the Home link', () => {
    cy.visit('http://localhost:3000/search?q=video');

    cy.get('nav').contains('Home').should('have.attr', 'href', '../');
  });

  it('uses relative URLs for search results', () => {
    cy.visit('http://localhost:3000/search?q=video');

    cy.get('main a').should(($a) => {
      console.log('$a', $a.attr('href'));
      expect($a.attr('href')).to.match(/^\.\.\/channel\/[^?]*\?feedUrl=.*$/);
    });
  });
});

describe('Channel overview', () => {
  it('uses a relative URL for the Home link', () => {
    cy.visit('http://localhost:3000/channel/anything?feedUrl=https://feed.podbean.com/boyt/feed.xml');

    cy.get('nav').contains('Home').should('have.attr', 'href', '../../');
  });
});
