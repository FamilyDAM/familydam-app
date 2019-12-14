package com.familydam.repository.config.repo;

import org.apache.jackrabbit.oak.api.Type;
import org.apache.jackrabbit.oak.spi.lifecycle.RepositoryInitializer;
import org.apache.jackrabbit.oak.spi.nodetype.NodeTypeConstants;
import org.apache.jackrabbit.oak.spi.state.NodeBuilder;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InitialDAMContent implements RepositoryInitializer, NodeTypeConstants
{
    Logger log = LoggerFactory.getLogger(InitialDAMContent.class);

    public InitialDAMContent() {
        super();
    }

    @Override
    public void initialize(@NotNull NodeBuilder builder) {

        if( !builder.hasChildNode("content") ){
            NodeBuilder contentNodeBuilder = builder.setChildNode("content").setProperty(JCR_PRIMARYTYPE, NT_UNSTRUCTURED, Type.NAME);
            log.trace("Root '/content' Node was created");
        }

        if( !builder.child("content").hasChildNode("files") ){
            NodeBuilder fileNodeBuilder = builder.child("content").setChildNode("files").setProperty(JCR_PRIMARYTYPE, NT_UNSTRUCTURED, Type.NAME);
            log.trace("Content '/files' Node was created");
        }

        if( !builder.child("content").hasChildNode("email") ){
            NodeBuilder fileNodeBuilder = builder.child("content").setChildNode("email").setProperty(JCR_PRIMARYTYPE, NT_UNSTRUCTURED, Type.NAME);
            log.trace("Content '/files' Node was created");
        }

        if( !builder.child("content").hasChildNode("web") ){
            NodeBuilder fileNodeBuilder = builder.child("content").setChildNode("web").setProperty(JCR_PRIMARYTYPE, NT_UNSTRUCTURED, Type.NAME);
            log.trace("Content '/files' Node was created");
        }


        if( !builder.hasChildNode("dam:jobs") ){
            builder.setChildNode("dam:jobs").setProperty(JCR_PRIMARYTYPE, NT_UNSTRUCTURED, Type.NAME);
        }
    }



}
