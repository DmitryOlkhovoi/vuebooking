// https://on.cypress.io/api

describe('My First Test', () => {

  // Selectors are generated, it's better to use TEST IDS, data-id etc
  it('checks inputs', () => {
    cy.visit('/')

    cy.get(':nth-child(1) > .p-inputgroup > .p-autocomplete > .p-autocomplete-input').type('rome')
    cy.get('#pv_id_3_1').click();

    cy.get(':nth-child(3) > .p-inputgroup > .p-autocomplete > .p-autocomplete-input').type('nyc')
    cy.get('#pv_id_4_0').click();

    // test validation etc
  })
})
