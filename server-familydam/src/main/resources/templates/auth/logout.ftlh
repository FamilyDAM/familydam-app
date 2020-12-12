<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Home page</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="auth/auth.css"></link>
</head>
<body>
<p>
    <STRONG>logout.ftlh - ${name} | ${ts?datetime}</STRONG><br/>
    <a href="/index.html">Home</a> | <a href="/logout.html">Logout</a> | <a href="/foo.html">Bad</a>
</p>
</body>
</html>