var sessionFlag = false;

function checkSession()
{

//    alert("onload common");
    var token_dev = localStorage.getItem('token_dev');
    var sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken == null || token_dev == null)
    {
        window.location.href = "login.html";

    }

    var sessionObj = {
        token: token_dev,
        jsonStr: {
            sessionToken: sessionToken
        }
    };
    var sessionReq = JSON.stringify(sessionObj);

    $.post(baseURL + "/session/validate_session",
            sessionReq,
            function (sessionRes) {
                var obj = jQuery.parseJSON(sessionRes);
                var status = obj['status'];
                var message = obj['message'];
                if (status === 400) {
                    localStorage.removeItem('sessionToken');
                    window.location.href = "login.html";
                }
                sessionFlag = true;
            }
    );

}

