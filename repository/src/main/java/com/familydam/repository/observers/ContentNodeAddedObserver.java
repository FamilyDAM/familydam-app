package com.familydam.repository.observers;

import com.familydam.repository.config.RepositoryConfig;
import org.apache.jackrabbit.oak.plugins.observation.NodeObserver;
import org.apache.jackrabbit.oak.spi.commit.CommitInfo;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Set;


/**
 * Listen for changes in /Content and create a "JOB" node for each entry.
 * The job node will be monitored for async work to do
 */
public class ContentNodeAddedObserver extends NodeObserver {

    Logger log = LoggerFactory.getLogger(RepositoryConfig.class);

    public ContentNodeAddedObserver(String path, String... propertyNames) {
        super(path, propertyNames);
    }

    @Override
    protected void added(@NotNull String path, @NotNull Set<String> added, @NotNull Set<String> deleted, @NotNull Set<String> changed, @NotNull Map<String, String> properties, @NotNull CommitInfo commitInfo) {
        log.debug("ADDED: " +path.toString() +" | props=" +properties.toString() +" | THREAD=" +Thread.currentThread().getId());
    }

    @Override
    protected void deleted(@NotNull String path, @NotNull Set<String> added, @NotNull Set<String> deleted, @NotNull Set<String> changed, @NotNull Map<String, String> properties, @NotNull CommitInfo commitInfo) {
        log.debug("DELETED: " +path.toString());
    }

    @Override
    protected void changed(@NotNull String path, @NotNull Set<String> added, @NotNull Set<String> deleted, @NotNull Set<String> changed, @NotNull Map<String, String> properties, @NotNull CommitInfo commitInfo) {
        log.debug("CHANGED: " +path.toString());
    }

}
