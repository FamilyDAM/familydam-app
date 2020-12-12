package com.mikenimer.family.familygraph;

import com.mikenimer.familydam.modules.auth.models.Family;
import org.assertj.core.api.Assertions;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.neo4j.DataNeo4jTest;
import org.springframework.data.neo4j.core.Neo4jTemplate;

import java.util.List;
import java.util.Optional;

@DataNeo4jTest
class FamilyNodeTests extends InMemorySetup {

    @Test
    public void testFamilyCreation(@Autowired Neo4jTemplate neo4jTemplate)
    {
        Family f = new Family();
        f.setName("Smith");
        neo4jTemplate.save(f);

        Optional<Family> f2 = neo4jTemplate.findById(f.getId(), Family.class);

        Assertions.assertThat(f2.isPresent());
    }


    @Test
    public void testUniqueFamilyCreation(@Autowired Neo4jTemplate neo4jTemplate)
    {
        Family f1 = new Family();
        f1.setName("Smith");
        neo4jTemplate.save(f1);

        Family f2 = new Family();
        f2.setName("Smith");
        neo4jTemplate.save(f2);

        List<Family> f = neo4jTemplate.findAll(Family.class);

        Assert.assertEquals(1, f.size());
    }


}
