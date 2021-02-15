package com.example.app.dto;

import com.example.app.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository("postgres")
public class PersonDataTransfer implements PersonDto{
    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public PersonDataTransfer(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    @Override
    public Person insertPerson(UUID id, Person person) {
        String query = "INSERT INTO person(id, name, bloodgroup, age) values(uuid_generate_v4(),'"
                       + person.getName() + "','"
                       + person.getBloodgroup() + "','"
                       + person.getAge() + "') RETURNING *";
        //System.out.println(query);
        return jdbcTemplate.queryForObject(query,((resultSet, i) -> {
            return new Person(
                    UUID.fromString(resultSet.getString("id")),
                    resultSet.getString("name"),
                    resultSet.getString("bloodgroup"),
                    Integer.parseInt(resultSet.getString("age"))
            );
        }));
    }

    @Override
    public List<Person> getAllPerson() {
        String query = "SELECT * FROM person";
        List<Person> persons = jdbcTemplate.query(query,(resultSet, i) -> {
            return new Person(
                    UUID.fromString(resultSet.getString("id")),
                    resultSet.getString("name"),
                    resultSet.getString("bloodgroup"),
                    Integer.parseInt(resultSet.getString("age"))
            );
        });
        return persons;
    }

    @Override
    public Optional<Person> selectPersonById(UUID id) throws Exception {
        String query = "SELECT * FROM person WHERE id = ?";
        Person person = jdbcTemplate.queryForObject(query,
                new Object[]{id},
                ((resultSet, i) -> {
                    return new Person(
                            UUID.fromString(resultSet.getString("id")),
                            resultSet.getString("name"),
                            resultSet.getString("bloodgroup"),
                            Integer.parseInt(resultSet.getString("age"))
                    );
                })
                );
        return Optional.ofNullable(person);
    }

    @Override
    public boolean deletePersonById(UUID id) throws Exception {
        String query = "DELETE FROM person WHERE id = '" + id + "' RETURNING id";
        try {
            return jdbcTemplate.query(query,(resultSet -> true));

        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Person updatePersonById(UUID id, Person person) throws Exception {
        Optional<Person> found = selectPersonById(id);
        if(found.isEmpty()){
            throw new Exception("User with credentials not found!");
        }else{
            String query = "UPDATE person SET name = '" + person.getName()
                           +"', age = '" + person.getAge() + "', bloodgroup = '"
                           + person.getBloodgroup()+"' WHERE id = '" + id + "' RETURNING *";
            System.out.println(query);
            try{
                return jdbcTemplate.queryForObject(query,((resultSet, i) -> {
                    return new Person(
                            UUID.fromString(resultSet.getString("id")),
                            resultSet.getString("name"),
                            resultSet.getString("bloodgroup"),
                            Integer.parseInt(resultSet.getString("age"))
                    );
                }));
            }catch (Exception e){
                throw new Exception(e.getMessage());
            }
        }
    }

    @Override
    public boolean deleteMultiple(List<String> ids) throws Exception {
        StringBuilder sb = new StringBuilder("DELETE FROM person WHERE id IN (");
        for(int i = 0; i < ids.size(); i++){
            if(i == ids.size() - 1){
                sb.append("'"+ids.get(i) + "') RETURNING id");
            }else{
                sb.append("'"+ids.get(i) + "',");
            }
        }
        System.out.println("query" + sb.toString());
        try{
            jdbcTemplate.query(sb.toString(),resultSet -> null);
            return true;
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }
}
