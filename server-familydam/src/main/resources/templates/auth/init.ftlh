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
    <STRONG>init.ftlh</STRONG><br/>
    <a href="/index.html">Home</a> | <a href="/logout.html">Logout</a> | <a href="/foo.html">Bad</a>
    <br/>

    <form method="post" action="/init.html">
        Name:<input name="name"></input><br/>
        Last Name:<input name="lastName"></input><br/>
        Password:<input name="password"></input><br/>
        Confirm Password:<input name="pwdConfirm"></input><br/>
        <input type="submit" value="Submit"></input>
    </form>
</p>
</body>
</html>