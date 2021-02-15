package com.example.app.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.example.app.model.Person;
import org.springframework.stereotype.Repository;

@Repository("dummyPerson")
public class InMemoryPersonDataTransferService implements PersonDto {
    private static List<Person> DB = new ArrayList<Person>();

    @Override
    public Person insertPerson(UUID id, Person person) {
        Person newPerson = new Person(id, person.getName(), person.getBloodgroup(), person.getAge());
        try {
            DB.add(newPerson);
            return newPerson;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @Override
    public List<Person> getAllPerson() {
        return DB;
    }

    @Override
    public Optional<Person> selectPersonById(UUID id) throws Exception {
        try {
            Optional<Person> found = DB.stream().filter(person -> person.getId().equals(id)).findFirst();
            if (found.isEmpty()) {
                throw new Exception("Users with credentials not found!");
            }
            return found;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public boolean deletePersonById(UUID id) throws Exception {
        Optional<Person> found = selectPersonById(id);
        System.out.println(id);
        if (found.isEmpty()) {
            throw new Exception("User with credentials not found!");
        } else {
            try {
                DB.remove(found.get());
                return true;
            } catch (Exception e) {
                throw new Exception(e.getMessage());
            }
        }
    }

    @Override
    public Person updatePersonById(UUID id, Person person) throws Exception {
        Optional<Person> found = selectPersonById(id);
        if (found.isEmpty()) {
            throw new Exception("User with credentials not found!");
        } else {
            try {
                DB.set(DB.indexOf(found.get()), person);
                return person;
            } catch (Exception e) {
                throw new Exception(e.getMessage());
            }
        }
    }

    @Override
    public boolean deleteMultiple(List<String> ids) throws Exception {
        return false;
    }
}
