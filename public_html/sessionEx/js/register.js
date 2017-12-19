window.onload = function ()
{
    closeConnection();
    getConnectionToken();

    var sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken !== null) {
        window.location.href = 'dashboard.html';
    }
};



var Script = function () {

    $.validator.setDefaults({
        submitHandler: function () {
            $("#response_message").html('<div class="alert alert-block alert-info fade in"> Registering please wait.</div>').fadeIn().delay(4000).fadeOut();

            var token_dev = getConnectionToken();
            jQuery.ajaxSetup({async: false});
            var checkId = checkUser();
            if (checkId == 0)
            {
                $("#response_message").html('<div class="alert alert-block alert-info fade in">' + 'UserId already registered!' + '</div>').fadeIn().delay(4000).fadeOut();

                return;
            }
            var email = $("#userId").val();

            var data = {
                userId: email,
                name: $("#name").val(),
                address: $("#address").val(),
                contact: $("#contact").val(),
                password: $("#password").val()
            };
//            alert(JSON.stringify(data));
            var templateStr = {
                userId: email
            };
            var jsonObj = {
                token: token_dev,
                dbName: "CompanyInfo",
                rel: "Users",
                cmd: "PUT",
                templateStr: templateStr,
                jsonStr: data
            };
            var jsonData = JSON.stringify(jsonObj);
            $.post(baseURL + "/api/iml",
                    jsonData,
                    function (result) {
                        var obj = jQuery.parseJSON(result);
                        var status = obj['status'];
                        var message = obj['message'];
                        if (status === 200) {

                            var emailTo = email;
                            var emailSubject = "Registration successful";
                            var emailContent = "Hi\n\nYou have been successfully registered.\n\nThanks,\nTeam";
                            var emailSt = sendEmail(token_dev, emailTo, "", "", emailSubject, emailContent);

                            $("#response_message").html('<div class="alert alert-block alert-info fade in"> Registered Successfully</div>').fadeIn().delay(4000).fadeOut();

                            setTimeout(function () {
                                window.location.href = "login.html";

                            }, 3000);


                        } else if (status === 400) {
                            $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                        }
                    });
        }
    });
    $().ready(function () {

// validate signup form on keyup and submit
        $("#register_form").validate({
            rules: {
                userId: {
                    required: true,
                    minlength: 2,
                    email: true
                },
                name: {
                    required: true,
                    minlength: 2
                },
                contact: {
                    required: true
                },
                address: {
                    required: true
                },
                password: {
                    required: true,
                    minlength: 5
                },
                rePassword: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password"
                }
            },
            messages: {
                userId: {
                    required: "Please enter UserId.",
                    minlength: "UserId must consist of at least 2 characters long."
                },
                name: {
                    required: "Please enter Name.",
                    minlength: "Name must consist of at least 2 characters long."
                },
                contact: {
                    required: "Please enter Contact number."
                },
                address: {
                    required: "Please enter the address."
                },
                password: {
                    required: "Please enter the password.",
                    minlength: "Password must consist of at least 5 characters long."

                },
                rePassword: {
                    required: "Please confirm the password",
                    minlength: "Password must consist of at least 5 characters long.",
                    equalTo: "The passwords does not match."
                },
                email: "Please enter valid email address."
            }
        });
    });
}();