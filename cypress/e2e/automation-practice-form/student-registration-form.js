/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

// All the const could be located in the separate json file as best practice
const firstName = faker.lorem.word(7);
const lastName = faker.lorem.word(7);
const email = faker.internet.email();
const phoneNumber = faker.string.octal({ length: 4, prefix: '380990' });
const address = faker.lorem.word(7);

var date = new Date();
date.setDate(date.getDate());

var todaysYear = date.getFullYear();
var todaysMonth = date.toLocaleString("default", { month: "long" });
var todaysDay = date.getDate();

describe("Student registration form tests", () => {
    beforeEach(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        })
        cy.visit("https://demoqa.com/automation-practice-form"); // Url could be also configured in the cypress.config.js like: baseUrl: "https://demoqa.com/", and then each page as separate command
        cy.url().should('include', 'automation-practice-form');
    })

    it("Student with with valid input in all fields could be successfully created", () => {
        // Paje Object model could be used for easier code reading and reusing
        // For example:
        // class Student_Registration_Form_Po {
        //     Fill_FirstName_field(firstName) {
        //         cy.get('#firstName').type(firstName); // Fill the first name field
        //     }
        // }
        // export default AutoStore_Homepage_Po;
        //
        // Or custom commands like:
        // Cypress.Commands.add("LocateFieldAndEnterValue", (locator, value) => {
        //     cy.get(locator).type(value);
        //   })
        cy.log("Student with with valid input in all fields could be successfully created")
        cy.get('#firstName').type(firstName); // Fill the first name field
        cy.get('#lastName').type(lastName); // Fill the last name field
        cy.get('#userEmail').type(email); // Fill the email field
        cy.get('[value="Male"]').check({ force: true }).should('be.checked'); // check the male radiobutton
        cy.get('[value="Male"]').invoke('text').as('male'); // invoke the male radiobutton text
        cy.get('#userNumber').type(phoneNumber); // Fill the phone number field
        // Date of birth today's date selected by default, would check that on results screen
        // Select first item in subject appeared list
        cy.get('#subjectsContainer').type('a');
        cy.get('#react-select-2-option-0').invoke('text').as('subjectItem');
        cy.get('#react-select-2-option-0').click();
        // Check the first hobbie checkbox
        cy.get('input[type="checkbox"]').check("1", { force: true }).should('be.checked').invoke('val').as('firstHobbieOption');
        // Upload test file to picture
        cy.get('#uploadPicture').selectFile("cypress/fixtures/testFile_JPG_1MB.jpg");
        cy.get('#currentAddress').type(address);// Fill the address field
        // Select first option in the state select dropdown and invoke value
        cy.get('#state').click();
        cy.get('#react-select-3-option-0').invoke('text').as('selectedState');
        cy.get('#react-select-3-option-0').click();
        // Select first option in the city select dropdown and invoke value
        cy.get('#city').click();
        cy.get('#react-select-4-option-0').invoke('text').as('selectedCity');
        cy.get('#react-select-4-option-0').click();
        cy.get('#submit').click(); // Click on the submit button
        // Check that all info on the submit modal window
        cy.get('[class="modal-body"]').as('submitFormInfo').then(function () {
            cy.get('@submitFormInfo')
                .should('contain', firstName)
                .and('contain', lastName)
                .and('contain', email)
                .and('contain', this.male)
                .and('contain', phoneNumber)
                .and('contain', todaysDay + " " + todaysMonth + "," + todaysYear)
                .and('contain', this.subjectItem)
                .and('contain', this.firstHobbieOption)
                .and('contain', 'testFile_JPG_1MB.jpg')
                .and('contain', address)
                .and('contain', this.selectedState + " " + this.selectedCity)
        })
    })
});

