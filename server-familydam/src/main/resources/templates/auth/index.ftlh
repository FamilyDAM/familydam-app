<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <link rel="stylesheet" href="auth/auth.css"></link>
    <link rel="shortcut icon" href="/favicon.ico">

    <link href='http://fonts.googleapis.com/css?family=Roboto:500,300,400' rel='stylesheet' type='text/css'></link>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
    <script type="application/javascript" src="auth/clock/clock.js"></script>

    <title>FamilyD.A.M (Digital Asset Manager)</title>

    <script type="application/javascript">
        function selectUser(e){
            const id = e.currentTarget.attributes["data-id"].value;
            e.currentTarget.style="border-color:blue;width:56px;";
            document.getElementById('user').setAttribute('value', id);
            document.getElementById('password').disabled = false;
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('password').focus();
        }
    </script>
</head>
<body>
<div class="wrapper" style="background-image: url('${backgroundImage}')">

    <div class="login-grid-container">
        <div class="login">
            <form method="post" action="/login">
                <div>
                    <strong><center>FamilyD.A.M</center></strong>
                    <p>A digital asset manager for the whole family.</p>
                    <p>Select a family member and enter password</p>
                </div>


                <div class="userList">
                    <#list users as user>
                        <div onClick="selectUser(event)" data-id="${user.id}">
                            <img src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'
                                 alt="${user.name}" style="width:100%;">
                            <p style="width:100%;margin:auto;">${user.name}</p>
                        </div>
                    </#list>
                </div>
                <br clear="left"/><br clear="left"/>
                <div>
                    <fieldset>
                        <label>Password:</label>
                        <input type="password" id="password" name="password" autocomplete="current-password" disabled style="font-size: 24px;height:32px;width:100%"></input>
                    </fieldset>
                    <fieldset style="text-align: center">
                        <input type="submit" id="submitBtn" value="Login" disabled></input>
                        <input type="hidden" id="user" name="user" value="">
                    </fieldset>
                </div>
            </form>
        </div>
        <div class="clock">
            <auth-clock></auth-clock>
        </div>
    </div>




</div>

</body>
</html>
