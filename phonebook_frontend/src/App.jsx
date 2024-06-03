import React, { useState, useEffect, useCallback } from 'react';
import Notification from './components/Notification';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import phonebook from './services/phonebook';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = useCallback(() => {
    phonebook.getAll()
      .then((data) => {
        setPersons(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  const handleChangeName = (event) => {
    const newName = event.target.value;
    const hasNoDigits = !/\d/.test(newName);
    if (hasNoDigits) {
      setNewName(newName);
    }
  };

  const handleChangeNumber = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9-]/g, "");
    setNewNumber(numericValue);
  };

  const personAlreadyExists = (name, number) => {
    return persons.some(
      (person) =>
        person.name.toLowerCase() === name.toLowerCase() || person.number === number
    );
  };


  const handleSubmit = (event) => {
  event.preventDefault();
  const newPerson = { name: newName, number: newNumber };
  if (personAlreadyExists(newPerson.name, newPerson.number)) {
    setShowMessage(`${newPerson.name} or ${newPerson.number} already exists`);
    setTimeout(() => {
      setShowMessage(""); 
    }, 3000);
    return;
  }
  phonebook.create(newPerson)
    .then((returnedPerson) => {
      setPersons((prevPersons) => [...prevPersons, returnedPerson]);
      setNewName("");
      setNewNumber("");
      console.log('New person added to the server:', returnedPerson);
      setShowMessage(`Added ${newPerson.name} ${newPerson.number}`);
      setTimeout(() => {
        setShowMessage(""); 
      }, 3000);
    })
    .catch((error) => {
      console.log("Error adding new person:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setShowMessage(error.response.data.error);
        setTimeout(() => {
          setShowMessage(""); 
        }, 3000);
      } else {
        setShowMessage("Failed to add person. Please try again.");
        setTimeout(() => {
          setShowMessage("");  
        }, 3000);
      }
    });
};
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );
    if (!shouldDelete) return;
    phonebook.remove(id)
      .then((response) => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person.id !== id)
        );
        console.log("Person deleted from the server:", response);
        if (!personToDelete) {
          alert(
            `Information ${personToDelete} was already deleted from the server`
          );
        }
      })
      .catch((error) => {
        console.log("Error deleting person:", error);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={showMessage} />
      <Filter id="search" value={searchTerm} onChange={handleSearch}>
        filter shown with:
      </Filter>
      <hr />
      <h3>Add a name and number below:</h3>
      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        handleChangeName={handleChangeName}
        newNumber={newNumber}
        handleChangeNumber={handleChangeNumber}
      />
      <h2>Contacts</h2>
      <Persons list={searchPersons} onDelete={handleDelete} />
    </div>
  );
};

export default App;