import * as React from 'react';
import { mount } from '@cypress/react';
import Counselor from './Counselor';

it('Counselor', () => {
    mount(<Counselor />);
    cy.get('form').contains('phone').click();
});
