package com.example.app.model;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

public class Person {
    private final UUID id;
    @NotBlank
    private final String name;
    @NotBlank
    private final String bloodgroup;
    @NotNull
    private final int age;

    public UUID getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getBloodgroup() {
        return bloodgroup;
    }
    public int getAge() {
        return age;
    }


    public Person(@JsonProperty("id") UUID id,
                  @JsonProperty("name") String name,
                  @JsonProperty("bloodgroup") String bloodGroup,
                  @JsonProperty("age") int age) {
        this.id = id;
        this.name = name;
        this.bloodgroup = bloodGroup;
        this.age = age;
    }

}
