package com.example.app.api;
import com.example.app.model.Person;
import com.example.app.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@RequestMapping("api/v1/person")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PersonController {
    private final PersonService personService;
    @Autowired
    public PersonController(PersonService personService){
        this.personService = personService;
    }
    @PostMapping
    public Person addPerson(@Valid @NotNull @RequestBody Person person){
        return personService.insertPerson(person);
    }
    @GetMapping
    public List<Person> getAllPerson(){
        return personService.getAllPerson();
    }
    @GetMapping(path = "{id}")
    public Person getPersonById(@PathVariable("id") UUID id) throws Exception{
        return personService.getPersonById(id).orElse(null);
    }
    @PutMapping(path = "{id}")
    public Person updatePerson(@PathVariable("id") UUID id,
                               @Valid @NotNull @RequestBody Person person)
            throws Exception{
        return personService.updatePersonById(id, person);
    }
    @DeleteMapping(path = "{id}")
    public boolean removePerson(@PathVariable("id") UUID id) throws Exception{
        return personService.deletePersonById(id);
    }
    @PutMapping
    public boolean deleteMultiple(@RequestBody List<String> ids) throws Exception{
        return personService.deleteMultiple(ids);
    }
}
