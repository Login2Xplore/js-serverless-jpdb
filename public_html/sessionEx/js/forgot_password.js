window.onload = function ()
{
    $('#reset-password-info').hide();
    $('#reset-password-danger').hide();
    var sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken !== null) {
        window.location.href = 'dashboard.html';
    }
};



var Script = function () {

    $.validator.setDefaults({
        submitHandler: function () {
            jQuery.ajaxSetup({async: false});

            var email = $("#userId").val();

            var checkSt = checkUser();

            if (checkSt == 1)
            {
                $("#reset-password-danger").html("Email Id not registered!").fadeIn().delay(3000).fadeOut();
                return;

            }


            var token_dev = getConnectionToken();

            var newPassword = generateRandom();

            var data = {
                password: newPassword
            };
            var record_number = parseInt(localStorage.getItem('rno'));
            var jsonStr = {
                [record_number] : data
            };
//    var dataObj = JSON.stringify(jsonStr);  //Not to be done
//    alert(jsonStr);
            var jsonObj = {
                token: token_dev,
                dbName: "CompanyInfo",
                rel: "Users",
                cmd: "UPDATE",
                jsonStr: jsonStr
            };
            var jsonReq = JSON.stringify(jsonObj);
//    alert(jsonReq);

            $.post(baseURL + "/api/iml",
                    jsonReq,
                    function (result) {

                        var obj = jQuery.parseJSON(result);
                        var status = obj['status'];
                        var message = obj['message'];

                        if (status == 200)
                        {
                                $("#reset-content").html('<b>Sending new password to the registered email id..<b>').fadeIn().delay(4000).fadeOut();

                            var emailTo = email;
                            var emailSubject = "Password Reset";
                            var emailContent = "Hi\nYour new password is: " + newPassword + "\nPlease login with this password and then you can change it.\nThanks,\nTeam";


                            var emailSt = sendEmail(token_dev, emailTo, "", "", emailSubject, emailContent);
                            if (emailSt === 200) {
                                $("#reset-password-info").html('<b>Password changed. Please check your registered email-Id<b>').fadeIn().delay(4000).fadeOut();
                                
                                setTimeout(function () {
                                window.location.href = "login.html";

                            }, 6000);

                            } else {
//                            $("#reset-password-danger").html("We couldn't find an account associated with " + email).fadeIn();
                                $("#reset-password-danger").html("Try again!").fadeIn().delay(4000).fadeOut();
                            }

                        } else
                        {
                            $("#reset-password-danger").html(message).fadeIn().delay(4000).fadeOut();
                            return;
                        }

//                alert(result);
                    });

        }
    });

    $().ready(function () {


        $("#forgot-pwd").validate({
            rules: {
                userId: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: "Please enter valid email address."
            }
        });

    });
}();

function generateRandom()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}