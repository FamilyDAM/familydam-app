package com.familydam.repository.services.fs;

import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.InputStream;

@Service
public class FsReadFileService
{
    Logger log = LoggerFactory.getLogger(FsListService.class);

    public InputStream readFile(Node node) throws RepositoryException
    {
        return JcrUtils.readFile(node);
    }
}
