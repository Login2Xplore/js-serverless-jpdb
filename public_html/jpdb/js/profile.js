
window.onload = function ()
{
    checkSession();
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
    dataLoadServerCall(jsonData);

};



function dataLoadServerCall(jsonData) {

    jQuery.ajaxSetup({async: false});
    $.post(baseURL + "/api/irl",
            jsonData,
            function (result) {
//                alert(result);
                var obj = jQuery.parseJSON(result);
                var status = obj['status'];
                var message = obj['message'];
                var jsonData = obj['data'];
                var jsonDataElement = jQuery.parseJSON(jsonData);
                if (status === 200) {
//                    record_number = jsonDataElement['record_number'];
//                    localStorage.setItem('record_number', record_number);
//                    var record = jsonDataElement['record'];
//                    alert(record);
                    var userId = jsonDataElement['userId'];
                    var name = jsonDataElement['name'];
                    var address = jsonDataElement['address'];
                    var contact = jsonDataElement['contact'];
                    document.getElementById("userId").value = userId;
//                    $('#emp_id').val(emp_id);
                    $('#name').val(name);
                    $('#address').val(address);
                    $('#contact').val(contact);
                } else if (status === 400) {

                    $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                }
            });

    jQuery.ajaxSetup({async: true});
}



function updateRecord()
{
    var token_dev = getConnectionToken();
    var data = {
        name: $("#name").val(),
        address: $("#address").val(),
        contact: $("#contact").val(),
    };
    var record_number = parseInt(localStorage.getItem('rno'));
    var jsonStr = {
        [record_number] : data
    }
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
                $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();

//                alert(result);
            });
}