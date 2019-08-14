package com.familydam.repository.utils;

import org.joda.time.DateTime;
import org.slf4j.Logger;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

/**
 * Stats collection for latency and throughput designed to avoid contention
 */
public class Stats {
    private class ThreadLocalLong {
        public long size;
    }

    private ScheduledExecutorService executor = Executors.newScheduledThreadPool(10);

    private List<List<Long>> allLatencies = new ArrayList<List<Long>>();
    private List<ThreadLocalLong> allSizes = new ArrayList<ThreadLocalLong>();

    private long startTime = 0;
    private long endTime = 0;

    private final ThreadLocal<List<Long>> tLatencies =
        new ThreadLocal<List<Long>>() {
            @Override
            protected List<Long> initialValue() {
                ArrayList<Long> list = new ArrayList<Long>();
                synchronized (allLatencies) {
                    allLatencies.add(list);
                }
                return list;
            }
        };

    Logger logger = null;

    public Stats(Logger logger_) {
        logger = logger_;
    }

    public void start() {
        startTime = DateTime.now().getMillis();
    }

    public void stop(long lastEventTime) {
        endTime = lastEventTime;
    }

    public void reset(){
        tLatencies.get().clear();
    }

    public void recordLatency(long latency) {
        tLatencies.get().add(latency);
    }

    public long getMessageCount() {
        long messageCount = 0;
        for (List<Long> latencies : allLatencies) {
            messageCount += latencies.size();
        }
        return messageCount;
    }


    public long getThroughput() {
        return getMessageCount() / ((endTime - startTime) / 1000);
    }

    public void printThroughput() {
        logger.debug(getMessageCount() / ((endTime - startTime) / 1000) +"ms");
    }


    public Map<Double, Long> getStats() {
        return getStats(50.0, 90.0, 95.0, 99.9);
    }

    public Map<Double, Long> getStats(Double... latency_) {
        Map<Double, Long> pctLatencies = new HashMap<Double, Long>();
        List<Long> combinedLatencies = new ArrayList<Long>();
        for (List<Long> latencies : allLatencies) {
            combinedLatencies.addAll(latencies);
        }
        Collections.sort(combinedLatencies);

        pctLatencies.put(50.0, combinedLatencies.get(combinedLatencies.size() / 2));
        for (Double latency : latency_) {
            //todo test to see if 50.0 with * matches 50.0 with /2
            pctLatencies.put(latency, combinedLatencies.get((int) (latency * combinedLatencies.size())));
        }
        return pctLatencies;
    }


    public void printStats(Double... latency_){
        Map<Double, Long> latencies;
        Long throughput = this.getThroughput();
        if( latency_ == null ) {
            latencies = this.getStats();
        }else{
            latencies = this.getStats(latency_);
        }

        logger.debug("Publishing complete.");
        logger.debug("Published " + this.getMessageCount() + " messages.");
        logger.debug("Publish latency");
        for (Map.Entry<Double, Long> latency : latencies.entrySet()) {
            logger.debug(" " + latency.getKey() + "th percentile: " + latency.getValue() + "ms");
        }
        logger.debug("Throughput: " + throughput + " messages/s");

        this.reset();
    }

}
