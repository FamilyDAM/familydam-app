package com.familydam.apps.photos.cron;

import com.familydam.apps.photos.FamilyDAMConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.apache.sling.event.jobs.ScheduledJobInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Check all dam:images for images that have not had their EXIF date parsed
 *
 * Created by mike on 12/18/16.
 */
@Component(immediate = true)
@Service(value = Runnable.class)
@org.apache.felix.scr.annotations.Properties({
        @org.apache.felix.scr.annotations.Property(name = "scheduler.period", value = "*/2 * * * *"), //"15 0 * * *" == 12:15am
        @org.apache.felix.scr.annotations.Property(name="scheduler.concurrent", boolValue=true)
})
public class EXIFParseValidationCronJob implements Runnable {

    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Reference
    private JobManager jobManager;


    @Reference
    private ResourceResolverFactory resolverFactory;

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

                Calendar exifDT = n.getProperty("dam:dateexifparsed").getDate();
                Calendar phashDT = n.getProperty("dam:datephashparsed").getDate();

                // create JOB payload
                final Map<String, Object> payload = new HashMap<String, Object>();
                payload.put("resourcePath", n.getPath());
                payload.put("resourceType", n.getPrimaryNodeType());
                payload.put("eventUserId", session.getUserID());

                if( exifDT == null ){
                    Boolean exifJobExists = false;

                    ScheduledJobInfo jobInfo = null;
                    for (Object o : payload.values()) {
                        jobInfo = (ScheduledJobInfo)o;
                        exifJobExists = jobInfo.getJobTopic().equalsIgnoreCase(FamilyDAMConstants.EXIF_JOB_TOPIC) && jobInfo.getJobProperties().get("resourcePath").equals(n.getPath());
                        if( exifJobExists  ) break;
                    }

                    if( !exifJobExists ) {
                        Job exifJob = this.jobManager.addJob(FamilyDAMConstants.EXIF_JOB_TOPIC, payload);
                    }else if(jobInfo != null){
                        jobInfo.reschedule();
                    }
                }



                if( phashDT == null ){
                    Boolean phashJobExists = false;

                    ScheduledJobInfo jobInfo = null;
                    for (Object o : payload.values()) {
                        jobInfo = (ScheduledJobInfo)o;
                        phashJobExists = jobInfo.getJobTopic().equalsIgnoreCase(FamilyDAMConstants.PHASH_JOB_TOPIC) && jobInfo.getJobProperties().get("resourcePath").equals(n.getPath());
                        if( phashJobExists  ) break;
                    }

                    if( !phashJobExists ) {
                        Job exifJob = this.jobManager.addJob(FamilyDAMConstants.PHASH_JOB_TOPIC, payload);
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
