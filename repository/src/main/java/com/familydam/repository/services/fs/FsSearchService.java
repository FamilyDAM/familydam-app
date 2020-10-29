package com.familydam.repository.services.fs;

import com.familydam.repository.utils.NodeToMapUtil;
import org.springframework.stereotype.Service;

import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryResult;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Search for files by specific type
 */
@Service
public class FsSearchService
{

    public List<Map> search(Session session, String path, String type, String groupBy_, String orderField_, String orderDir_, Integer limit, Integer offset) throws RepositoryException
    {
        String _sql = "select * from [" +type +"] as _node " +
            " where isdescendantnode(_node, '" +path +"') " +
            " order by [" +orderField_ +"] " +orderDir_ +", [name] asc";
        Query query = session.getWorkspace().getQueryManager().createQuery(_sql, "JCR-SQL2");
        query.setLimit(limit);
        query.setOffset(offset);
        QueryResult queryResult = query.execute();
        NodeIterator nodeIterator = queryResult.getNodes();

        List<Map> results = new ArrayList<>();
        while(nodeIterator.hasNext()){
            results.add(NodeToMapUtil.convert(nodeIterator.nextNode()));
        }

        return results; //.stream().sorted((Comparator<Object>) (o1, o2) -> ((Map)o1).get(orderField_).toString().compareTo(((Map)o2).get(orderField_).toString())).collect(Collectors.toList());


        /** try this instead
         *return Files.fileTreeTraverser().postOrderTraversal(new File(path))
         *             .filter(new Predicate<File>() {
         *                 @Override
         *                 public boolean apply(File input) {
         *                     return input.isFile() &&
         *                         !input.getParent().equals(path);
         *                 }
         *             })
         *             .transform(new Function<File, DataRecord>() {
         *                 @Override
         *                 public DataRecord apply(File input) {
         *                     return new FileDataRecord(store, new DataIdentifier(input.getName()), input);
         *                 }
         *             }).iterator();
         */
    }

}
