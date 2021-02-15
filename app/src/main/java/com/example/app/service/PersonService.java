package com.example.app.service;
import com.example.app.dto.PersonDto;
import com.example.app.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PersonService {
    private final PersonDto personDto;
    @Autowired
    public PersonService(@Qualifier("postgres") PersonDto personDto){
        this.personDto = personDto;
    }
    public Person insertPerson(Person person){
        return  personDto.insertPerson(person);
    }
    public List<Person> getAllPerson(){
        return personDto.getAllPerson();
    }
    public Optional<Person> getPersonById(UUID id) throws Exception{
        return  personDto.selectPersonById(id);
    }
    public boolean deletePersonById(UUID id) throws Exception{
        return personDto.deletePersonById(id);
    }
    public Person updatePersonById(UUID id, Person person) throws Exception{
        return personDto.updatePersonById(id, person);
    }
    public boolean deleteMultiple(List<String> ids) throws Exception{
        return personDto.deleteMultiple(ids);
    }
}
