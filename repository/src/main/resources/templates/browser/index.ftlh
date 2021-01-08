<html>
<head>
    <meta charset="UTF-8" />
    <title>Repository Browser</title>
</head>
<body>
Repository Browser
<table>
    <thead>
    <tr>
        <td><a href="${'/app/browser.html?path=' +parent}" >...</a></td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <#list nodes as node>
        <td><a href="${'/app/browser.html?path=' +node.path}">${node.name}</a></td>
        </#list>
    </tr>
    </tbody>
</table>


<br/><br/>
<div>
    <table border="0" cellpadding="1" >
        <thead>
        <#if properties?is_hash_ex>
            <#list properties?keys as key>
                <tr>
                    <td align="right">${key}</td>
                    <td>=</td>
                    <td>
                        <#if properties[key]?is_hash_ex>
                            <#list properties[key] as key2, value2>
                                <#if value2?is_string>
                                    [${key2}=${value2}]<br/>
                                <#elseif value2?is_number>
                                    [${key2}=${value2}]<br/>
                                <#else >
                                    ${key2},
                                </#if>
                            </#list>
                        <#elseif properties[key]?is_sequence>
                            <#list properties[key] as item>
                                ${item}
                            </#list>
                        <#else>
                            ${properties[key]}
                        </#if>
                    </td>
                </tr>
            </#list>
        </#if>
        </thead>
    </table>

</div>
</body>
</html>