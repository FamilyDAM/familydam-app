<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <link rel="stylesheet" href="auth/auth.css"></link>
    <link rel="shortcut icon" href="/favicon.ico">

    <link href='http://fonts.googleapis.com/css?family=Roboto:500,300,400' rel='stylesheet' type='text/css'></link>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
    <script type="application/javascript" src="auth/clock/clock.js"></script>

    <title>FamilyD.A.M (Digital Asset Manager)</title>

    <script>
        function blockDblSubmit(event){
            btn = document.getElementById("submitBtn");
            btn.disabled = true;
            return this;
        }

        function validateForm(event){
            fn = document.getElementById("name");
            ln = document.getElementById("lastName");
            p = document.getElementById("password");
            pc = document.getElementById("passwordConfirm");
            btn = document.getElementById("submitBtn");

            if( fn.value.trim().length > 0
                && ln.value.trim().length > 0
                && p.value.trim().length > 0
                && pc.value.trim().length > 0
                && p.value.trim() === pc.value.trim()
            ) {
                btn.disabled=false;
            }else{
                btn.disabled=true;
            }
        }
    </script>
</head>
<body>
<div class="wrapper" style="background-image: url('${backgroundImage}')">


    <div class="signupFormWrapper">
        <div class="signupForm">
            <form method="post" action="init.html" onsubmit="blockDblSubmit(event)">
            <div class="signup-grid-container">
                <div class="header">
                    <h2><span>Create First User</span></h2>
                </div>
                <div class="description">
                    <p>The first thing we need to do is create an login for you that will be registered as the <strong>"Administrator"</strong> of this system.</p>
                    <p>After you login, you will be able to create accounts for each member of your family, in the <strong>User Manager</strong> section.</p>
                </div>
                <div class="firstname">
                    <fieldset>
                        <label>First Name</label>
                        <input type="text" id="name" name="name" onchange="validateForm(event)"></input>
                    </fieldset>
                </div>
                <div class="lastname" style="grid-area: lastname">
                    <fieldset>
                        <label>Last Name</label>
                        <input type="text" id="lastName" name="lastName" onchange="validateForm(event)"></input>
                    </fieldset>
                </div>
                <div class="password">
                    <fieldset>
                        <label>Password</label>
                        <input type="password" id="password" name="password" onchange="validateForm(event)"></input>
                    </fieldset>
                </div>
                <div class="passwordConfirm">
                    <fieldset>
                        <label>Confirm Password</label>
                        <input type="password" id="passwordConfirm" name="passwordConfirm" onchange="validateForm(event)"></input>
                    <fieldset>
                </div>
                <div class="action" style="text-align: center">
                    <input type="submit" id="submitBtn" value="Login" disabled></input>
                </div>
            </div>
            </form>
        </div>
    </div>


    <auth-clock></auth-clock>
</div>

</body>
</html>
