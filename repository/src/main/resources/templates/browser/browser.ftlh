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
    <tr th:each="node: ${nodes}">
        <td><a href="${'/app/browser.html?path=' +node.path}">${node.name}</a></td>
    </tr>
    </tbody>
</table>


<br/><br/>
<div>
    <table border="0" cellpadding="4">
        <thead>
            <#list properties as map>
                <tr>
                    <#list map as mapEntry>
                        <td>${mapEntry.key}</td>
                        <td>=</td>
                        <td>${mapEntry.value}</td>
                    </#list>
                </tr>
            </#list>
        </thead>
    </table>

</div>
</body>
</html>