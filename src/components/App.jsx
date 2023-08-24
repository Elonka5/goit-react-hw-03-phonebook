import { Component } from 'react';
import { Form } from './Form/Form';
import { Section } from './Section/Section';
import { ContactsList } from './ContactsList/ContactsList';
import { Filter } from './Filter/Filter';
import localstorage from '../helpers/storage';

const LOCAL_STORAGE_KEY = 'contacts';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const lsContacts = localstorage.load(LOCAL_STORAGE_KEY);
    if (lsContacts) {
      this.setState({ contacts: lsContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts !== contacts) {
      localstorage.save(LOCAL_STORAGE_KEY, contacts);
    }
  }

  handleSubmit = idInputName => {
    const isExist = this.state.contacts.find(
      contact => contact.name.toLowerCase() === idInputName.name.toLowerCase()
    );
    if (isExist) {
      alert(`${idInputName.name} is already in contacts.`);
      return;
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, idInputName],
    }));
  };

  handleDeleteContact = idContact => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== idContact),
    }));
  };

  handleInputFilter = evt => {
    const { name, value } = evt.currentTarget;
    this.setState({ [name]: value });
  };

  render() {
    const filteredContacts = this.state.contacts.filter(contact =>
      contact.name
        .toLowerCase()
        .includes(this.state.filter.toLowerCase().trim())
    );
    return (
      <div className="container">
        <Section title="Phonebook">
          <Form onSubmit={this.handleSubmit}></Form>
        </Section>
        <Section title="Contacts">
          <Filter filterContact={this.handleInputFilter} />
          <ContactsList
            contacts={filteredContacts}
            onRemoveContact={this.handleDeleteContact}
          ></ContactsList>
        </Section>
      </div>
    );
  }
}
