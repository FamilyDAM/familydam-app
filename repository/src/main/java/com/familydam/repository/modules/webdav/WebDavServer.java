package com.familydam.repository.modules.webdav;

import org.apache.jackrabbit.server.BasicCredentialsProvider;
import org.apache.jackrabbit.server.CredentialsProvider;
import org.apache.jackrabbit.server.SessionProvider;
import org.apache.jackrabbit.server.SessionProviderImpl;
import org.apache.jackrabbit.server.jcr.JCRWebdavServer;
import org.apache.jackrabbit.webdav.*;
import org.apache.jackrabbit.webdav.jcr.DavLocatorFactoryImpl;
import org.apache.jackrabbit.webdav.jcr.DavResourceFactoryImpl;
import org.apache.jackrabbit.webdav.jcr.observation.SubscriptionManagerImpl;
import org.apache.jackrabbit.webdav.jcr.transaction.TxLockManagerImpl;
import org.apache.jackrabbit.webdav.server.AbstractWebdavServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Repository;
import java.io.IOException;

//@Controller
public class WebDavServer extends AbstractWebdavServlet
{
    Logger log = LoggerFactory.getLogger(WebDavServer.class);

    Repository repository;
    DavSessionProvider davSessionProvider;
    DavLocatorFactory davLocatorFactory;
    DavResourceFactory davResourceFactory;


    public WebDavServer(Repository repository) {
        this.repository = repository;
        this.davSessionProvider = new JCRWebdavServer(repository, getSessionProvider());
        this.davLocatorFactory = new DavLocatorFactoryImpl("/webdav");
        this.davResourceFactory = new DavResourceFactoryImpl(new TxLockManagerImpl(), new SubscriptionManagerImpl());
    }

    /**
     * Returns a new instanceof <code>BasicCredentialsProvider</code>.
     *
     * @return a new credentials provider
     */
    protected CredentialsProvider getCredentialsProvider() {
        BasicCredentialsProvider provider = new BasicCredentialsProvider("admin");
        return provider;
    }

    /**
     * Returns a new instanceof <code>SessionProviderImpl</code>.
     *
     * @return a new session provider
     */
    protected SessionProvider getSessionProvider() {
        return new SessionProviderImpl(getCredentialsProvider());
    }


    @Override
    protected boolean isPreconditionValid(WebdavRequest webdavRequest, DavResource davResource) {
        return true;
    }

    @Override
    public DavSessionProvider getDavSessionProvider() {
        return davSessionProvider;
    }

    @Override
    public void setDavSessionProvider(DavSessionProvider davSessionProvider) {
        this.davSessionProvider = davSessionProvider;
    }

    @Override
    public DavLocatorFactory getLocatorFactory() {
        return davLocatorFactory;
    }

    @Override
    public void setLocatorFactory(DavLocatorFactory davLocatorFactory) {
        this.davLocatorFactory = davLocatorFactory;
    }

    @Override
    public DavResourceFactory getResourceFactory() {
        return davResourceFactory;
    }

    @Override
    public void setResourceFactory(DavResourceFactory davResourceFactory) {
        this.davResourceFactory = davResourceFactory;
    }


    @Override
    protected void doPut(WebdavRequest request, WebdavResponse response, DavResource resource) throws IOException, DavException {
        super.doPut(request, response, resource);
    }

}
