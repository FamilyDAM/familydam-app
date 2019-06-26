package com.familydam.apps.photos.cron;

import com.familydam.apps.photos.FamilyDAMConstants;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.apache.sling.event.jobs.ScheduledJobInfo;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Check all dam:images for images that have not had their EXIF date parsed
 *
 * Created by mike on 12/18/16.
 */
//todo: enable the cron job
//@Component(metatype = true, immediate = true)
//@Service(value = Runnable.class)
//@org.apache.felix.scr.annotations.Properties({
//        @Property(name = "scheduler.expression", value = "0 0 1 1/1 * ? *",
//                label="Quartz Cron Expression", description="Quartz Scheduler specific cron expression. Do not put unix cron expression"), //1:00am // 0 0/1 * 1/1 * ? * == 1min
//        @Property(name="scheduler.concurrent", propertyPrivate=true, boolValue=false)
//})
public class EXIFParseValidationCronJob implements Runnable {

    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Reference
    private JobManager jobManager;


    @Reference
    private ResourceResolverFactory resolverFactory;


    @Activate
    protected void activate(ComponentContext componentContext) throws Exception {
        this.logger.info("EXIFParseValidationCronJob");
    }

    @Override
    public void run() {
        try {
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);


            StringBuffer sql = new StringBuffer("SELECT * FROM [dam:image] ");
            sql.append(" WHERE [dam:dateexifparsed] is null OR [dam:datephashparsed] is null");

            QueryManager queryManager = session.getWorkspace().getQueryManager();
            Query query = queryManager.createQuery(sql.toString(), "JCR-SQL2");
            // Execute the query and get the results ...
            QueryResult result = query.execute();


            //get current scheduled jobs
            Collection<ScheduledJobInfo> jobs = this.jobManager.getScheduledJobs();


            NodeIterator nodeItr = result.getNodes();
            while(nodeItr.hasNext())
            {
                Node n = (Node)nodeItr.next();


                // create JOB payload
                final Map<String, Object> payload = new HashMap<String, Object>();
                payload.put("resourcePath", n.getPath());
                payload.put("resourceType", n.getPrimaryNodeType().getName());
                payload.put("eventUserId", session.getUserID());

                if( !n.hasProperty("dam:dateexifparsed") || n.getProperty("dam:dateexifparsed") == null ){
                    Boolean exifJobExists = false;

                    ScheduledJobInfo jobInfo = null;
                    Iterator itr = jobs.iterator();
                    while( itr.hasNext() ){
                        jobInfo = (ScheduledJobInfo)itr.next();
                        exifJobExists = jobInfo.getJobTopic().equalsIgnoreCase(FamilyDAMConstants.EXIF_JOB_TOPIC) && jobInfo.getJobProperties().get("resourcePath").equals(n.getPath());
                        if( exifJobExists  ) break;
                    }

                    if( !exifJobExists ) {
                        Job job = this.jobManager.addJob(FamilyDAMConstants.EXIF_JOB_TOPIC, payload);
                    }else if(jobInfo != null){
                        jobInfo.reschedule();
                    }
                }



                if( !n.hasProperty("dam:datephashparsed") || n.getProperty("dam:datephashparsed") == null ){
                    Boolean phashJobExists = false;

                    ScheduledJobInfo jobInfo = null;
                    Iterator itr = jobs.iterator();
                    while( itr.hasNext() ){
                        jobInfo = (ScheduledJobInfo)itr.next();
                        phashJobExists = jobInfo.getJobTopic().equalsIgnoreCase(FamilyDAMConstants.PHASH_JOB_TOPIC) && jobInfo.getJobProperties().get("resourcePath").equals(n.getPath());
                        if( phashJobExists  ) break;
                    }

                    if( !phashJobExists ) {
                        Job job = this.jobManager.addJob(FamilyDAMConstants.PHASH_JOB_TOPIC, payload);
                    }else if(jobInfo != null){
                        jobInfo.reschedule();
                    }

                }
            }


        }catch (Exception le){
            logger.error(le.getMessage(), le);
        }
    }

}
