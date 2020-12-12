<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Home page</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="auth/auth.css"></link>
    <script type="application/javascript" src="auth/clock/clock.js"></script>
</head>
<body>
<p>
    <STRONG>index.ftlh</STRONG><br/>
    <a href="/index.html">Login</a> | <a href="home/index.html">Home</a> | <a href="files/index.html">Files</a> | <a href="/logout.html">Logout</a> | <a href="/foo.html">Bad</a>
    <br/>
    <form method="post" action="/login">
        Username: <input type="text" name="user" value="41a5dd20-bc67-4b49-b28c-659e1a18725f"></input><br/>
        Password: <input type="password" name="password" value="admin"></input><br/>
        <input type="submit" value="Login"></input>

    </form>
    <auth-clock/>
</p>
</body>
</html>