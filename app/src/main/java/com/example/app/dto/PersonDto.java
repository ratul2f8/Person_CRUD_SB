package com.example.app.dto;
import com.example.app.model.Person;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonDto {
    Person insertPerson(UUID id, Person person);
    default Person insertPerson(Person person){
        UUID generatedUUID = UUID.randomUUID();
        return insertPerson(generatedUUID, person);
    }
    List<Person> getAllPerson();
    Optional<Person> selectPersonById(UUID id) throws Exception;
    boolean deletePersonById(UUID id) throws Exception;
    Person updatePersonById(UUID id, Person person) throws Exception;
    boolean deleteMultiple(List<String> ids) throws Exception;
}
