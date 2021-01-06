package com.familydam.repository.modules.files.services;

import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.InputStream;

/**
 * Return InputStream of a nt:file
 */
@Service
public class FsReadFileService implements IRestService
{
    Logger log = LoggerFactory.getLogger(FsListService.class);

    public InputStream readFile(Node node) throws RepositoryException
    {
        return JcrUtils.readFile(node);
    }

}
