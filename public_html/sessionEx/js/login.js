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
            var token_dev = getConnectionToken();

            var userId = $("#userId").val();
            var password = $("#password").val();

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
                        if (status == 200) {
                            var resData = obj['data'];

                            var record = resData[0];
                            var seedValue = record["record number"];
                            var recStored = record["record"];
//                            var recordData = JSON.parse(record["record"]);

                            var passwordStored = recStored["password"];
                            if (passwordStored !== password)
                            {
                                $("#response_message").html('<div class="alert alert-block alert-danger fade in">' + 'Wrong credentials!' + '</div>').fadeIn().delay(4000).fadeOut();
                                return;
                            }
                            localStorage.setItem('rno', seedValue);

                            var sessionObj = {
                                token: token_dev,
                                jsonStr: {
                                    seedValue: seedValue
                                }
                            };
                            var sessionReq = JSON.stringify(sessionObj);
//                            alert(sessionReq);

                            $.post(baseURL + "/session/get_new_session",
                                    sessionReq,
                                    function (sessionRes) {
//                                        alert(sessionRes);

                                        var obj = jQuery.parseJSON(sessionRes);
                                        var status = obj['status'];
                                        var message = obj['message'];

                                        if (status == 200)
                                        {

                                            var data = obj['data'];
                                            var obj = jQuery.parseJSON(data);
                                            var sessionToken = obj['sessionToken'];
                                            localStorage.setItem('sessionToken', sessionToken);
//                                        alert(sessionToken);
                                            window.location.href = "dashboard.html";

                                        } else
                                        {
                                            $("#response_message").html('<div class="alert alert-block .alert-danger fade in">' + 'Try again!' + '</div>').fadeIn().delay(4000).fadeOut();
                                            return;
                                        }

                                    });


                        } else if (status == 400) {
                            $("#response_message").html('<div class="alert alert-block alert-danger fade in">' + 'Email Id not registered!' + '</div>').fadeIn().delay(4000).fadeOut();
                        }
                    });
        }
    });

    $().ready(function () {

        // validate signup form on keyup and submit
        $("#login_form").validate({
            rules: {
                userId: {
                    required: true,
                    minlength: 2,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                userId: {
                    required: "Please enter UserId.",
                    minlength: "UserId must consist of at least 2 characters long."
                },
                password: {
                    required: "Please enter Password.",
                    minlength: "Password must consist of at least 5 characters long."
                },
                email: "Please enter valid email address."
            }
        });

    });


}();