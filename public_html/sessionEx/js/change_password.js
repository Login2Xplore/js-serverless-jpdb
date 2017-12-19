var Script = function () {

//    if($("#password").val() !== $("#confirmPassword").val()) {
//        $("#match-pwd").html("password is not matching. please fill same password");
//        return;
//    }

    $.validator.setDefaults({
        submitHandler: function () {
            var oldPassword = $("#oldPassword").val();
            var password = $("#password").val();

            var token_dev = getConnectionToken();


            var rno = parseInt(localStorage.getItem('rno'));
//    disableAllInputs();
            var jsonObj = {
                token: token_dev,
                dbName: "CompanyInfo",
                rel: "Users",
                record: rno,
                cmd: "GET_RECORD"
            };
            var jsonData = JSON.stringify(jsonObj);

            jQuery.ajaxSetup({async: false});
            $.post(baseURL + "/api/irl",
                    jsonData,
                    function (result) {
//                        alert(result);
                        var obj = jQuery.parseJSON(result);
                        var status = obj['status'];
                        var message = obj['message'];
                        var jsonData = obj['data'];
//                        alert(jsonData);
                        var jsonDataElement = jQuery.parseJSON(jsonData);
                        if (status === 200) {
                            var passwordStored = jsonDataElement['password'];

                            if (passwordStored === oldPassword)
                            {

                                if (oldPassword == password)
                                {
                                    $("#response_message").html('<div class="alert alert-block alert-danger fade in"> New password is same as existing password! Try again with a new password</div>').fadeIn().delay(4000).fadeOut();
                                    return;
                                }

                                var data = {
                                    password: password
                                };

                                var jsonStr = {
                                    [rno] : data
                                };

                                var jsonObj = {
                                    token: token_dev,
                                    dbName: "CompanyInfo",
                                    rel: "Users",
                                    cmd: "UPDATE",
                                    jsonStr: jsonStr
                                };
                                var jsonReq = JSON.stringify(jsonObj);

                                $.post(baseURL + "/api/iml",
                                        jsonReq,
                                        function (result) {
//                                            alert(result);
                                            var obj = jQuery.parseJSON(result);
                                            var status = obj['status'];
                                            var message = obj['message'];
                                            $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();

                                        });
                                setTimeout(function () {
                                    myLogout();

                                }, 3000);
                            } else
                            {
                                $("#response_message").html('<div class="alert alert-block alert-danger fade in">' + 'Old password is incorrect!' + '</div>').fadeIn().delay(4000).fadeOut();

                            }
                        } else if (status === 400) {
                            $("#response_message").html('<div class="alert alert-block alert-danger fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                            myLogout();
                        }
                    });

        }
    });

    $().ready(function () {
        // validate the comment form when it is submitted
        //$("#feedback_form").validate();
        // validate signup form on keyup and submit
        $("#change-pw-form").validate({
            rules: {
                oldPassword: {
                    required: true,
                    minlength: 5
                },
                password: {
                    required: true,
                    minlength: 5
                },
                confirmPassword: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password"
                }
            },
            messages: {
                oldPassword: {
                    required: "Please provide password.",
                    minlength: "Your password must be at least 5 characters long."
                },
                password: {
                    required: "Please provide password.",
                    minlength: "Your password must be at least 5 characters long."
                },
                confirmPassword: {
                    required: "Please provide password.",
                    minlength: "Your password must be at least 6 characters long.",
                    equalTo: "Please enter the same password as above."
                }
            }
        });

    });
}();



window.onload = function ()
{
//    alert("onlad");
    checkSession();
};



function updatePassword()
{


}