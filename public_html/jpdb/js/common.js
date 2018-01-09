var baseURL = "http://dev1api.login2explore.com:5577";
var loginURL = baseURL + "/user";
var DataBaseName = "CompanyInfo";
var RelationName = "Users";

function getConnectionToken() {
    var token_dev = localStorage.getItem('token_dev');
    if (token_dev == null) {
        var userID = "nunna2000@gmail.com";
        var password = "dfdfdf";
        $.ajaxSetup({async: false});
        $.post(loginURL + "/login",
                {
                    email: userID,
                    password: password
                },
                function (result) {
                    var obj = jQuery.parseJSON(result);
                    var status = obj['status'];
                    var message = obj['message'];
                    if (status === 200) {
                        token_dev = obj['token'];
                        localStorage.setItem('token_dev', token_dev);
                    } else if (status === 400) {
                        $("#response_message").html('<div class="alert alert-block alert-info fade in">'
                                + 'Connection Token not generated - Incorrect JPDB user or password'
                                + '</div>').fadeIn().delay(4000).fadeOut();


//                        window.location.href = "index.html";
                    }
                });
        $.ajaxSetup({async: true});
    }
    return token_dev;
}


function closeConnection() {
    var tempTokenConn = getConnectionToken();
    localStorage.removeItem('token_dev');
    if (tempTokenConn != null) {
        $.ajaxSetup({async: false});
        $.post(loginURL + "/logout",
                {
                    token: tempTokenConn
                },
                function (result) {
                    var obj = jQuery.parseJSON(result);
                    var status = obj['status'];
                });
        $.ajaxSetup({async: true});
    }
}


function myLogout()
{
    var token_dev = localStorage.getItem('token_dev');
    var sessionToken = localStorage.getItem('sessionToken');
    var sessionObj = {
        token: token_dev,
        jsonStr: {
            sessionToken: sessionToken
        }
    };
    var sessionReq = JSON.stringify(sessionObj);
//                            alert(sessionReq);

    $.post(baseURL + "/session/remove_session",
            sessionReq,
            function (sessionRes) {
//                alert(sessionRes);
            }
    );

    localStorage.removeItem('sessionToken');
    window.location.href = "index.html";
}

function sendEmail(token_dev, emailTo, emailCc, emailBcc, emailSubject, emailContent)
{
    var jsonReq = {
        token: token_dev,
        jsonStr: {
            emailTo: emailTo,
            emailCc: emailCc,
            emailBcc: emailBcc,
            emailSubject: emailSubject,
            emailContent: emailContent
        }
    }
    var jsonReqObj = JSON.stringify(jsonReq);
    var status;
    $.post(baseURL + "/serverless/send_email",
            jsonReqObj
            ,
            function (result) {
//                alert(result);
                var obj = jQuery.parseJSON(result);
                status = obj['status'];
                var message = obj['message'];
            });
    return status;
}


function checkUser()
{
    jQuery.ajaxSetup({async: false});
    var flag;
    var token_dev = getConnectionToken();
    var userId = $("#userId").val();
    var jsonObj = {
        token: token_dev,
        dbName: "CompanyInfo",
        rel: "Users",
        cmd: "FIND_RECORD",
        jsonStr: {
            userId: userId
        }
    };
    var jsonData = JSON.stringify(jsonObj);
    $.post(baseURL + "/api/irl",
            jsonData,
            function (result) {

                var obj = jQuery.parseJSON(result);
                var status = obj['status'];
                var message = obj['message'];
//                alert(status);
                if (status === 200) {
                    flag = 0;
                } else if (status === 400) {
                    flag = 1;
                }
            });

    return flag;
    jQuery.ajaxSetup({async: true});
}
