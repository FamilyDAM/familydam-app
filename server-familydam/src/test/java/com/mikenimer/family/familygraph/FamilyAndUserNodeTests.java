package com.mikenimer.family.familygraph;

import com.mikenimer.familydam.modules.core.models.Family;
import com.mikenimer.familydam.modules.core.models.User;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.neo4j.DataNeo4jTest;
import org.springframework.data.neo4j.core.Neo4jTemplate;

import java.util.Optional;

@DataNeo4jTest
class FamilyAndUserNodeTests extends InMemorySetup {

    Family family;

    @Before
    public void setup(@Autowired Neo4jTemplate neo4jTemplate){
        Family f = new Family();
        f.setName("Smith");
        family = neo4jTemplate.save(f);
    }

    @Test
    public void testFamilyUsersCreation(@Autowired Neo4jTemplate neo4jTemplate) throws InterruptedException
    {
        Family f = new Family();
        f.setName("Smith");
        f = neo4jTemplate.save(f);

        User u1 = new User();
        u1.setFamily(f);
        u1.setName("Mike");
        u1 = neo4jTemplate.save(u1);

        User u2 = new User();
        u2.setFamily(f);
        u2.setName("Susan");
        u2 = neo4jTemplate.save(u2);

        Optional<Family> family = neo4jTemplate.findById(f.getId(), Family.class);
        Assertions.assertThat(family.isPresent());
    }


}
