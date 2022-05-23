function display(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    $('#resetPasswordId').html('Reset');
    $('#resetPasswordId').attr('disabled', false);
}

function messageDialog(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
}

$(document).ready(function () {

    $('#responseCarrier').hide();

    $('input:password').focus(function () {

        if ($(this).val() == '') {
            $('#passwordId').attr('placeholder', 'Enter your new Password');
            $('#repeatpasswordId').attr('placeholder', 'ReType new Password');  
            
            $(this).css('border-color', 'red');
        } 

        $(this).keyup(function () { 
            var thisValue = $(this).val();

            if (thisValue == '') {
                $('#passwordId').attr('placeholder', 'Enter your new Password');
                $('#repeatpasswordId').attr('placeholder', 'ReType new Password'); 
                
            }
        });
        
    }).blur(function () { 
        var inputField = $('input:password').val();

        if (inputField == '') {
            $('#passwordId').attr('placeholder', 'Enter your new Password');
            $('#repeatpasswordId').attr('placeholder', 'ReType new Password'); 
        } else{
            $(this).next().attr('disabled', false);
        }
    });

    // the reset button
    $('#resetPasswordId').click(function () { 
        var password = $('#passwordId').val();
        var repeatPassword = $('#repeatpasswordId').val();

        // check if any of the fields is empty
        if (password == '' || repeatPassword == '') {
            messageDialog('Both fields are required to be filled.', 'yellow', 'red');
            if(password == '' && repeatPassword == ''){
                $('#passwordId').css('border-color', 'red').attr('placeholder', 'Enter your new Password');
                $('#repeatpasswordId').css('border-color', 'red').attr('placeholder', 'ReType new Password');
            } else{
                if(repeatPassword == ''){
                    $('#repeatpasswordId').css('border-color', 'red').attr('placeholder', 'ReType new Password');
                } else {
                    $('#passwordId').css('border-color', 'red').attr('placeholder', 'Enter your new Password');
                }
            }
        } else{
            // checking if the passwords matched
            if(password == repeatPassword){

                $(this).attr('disabled', true);
                $(this).html('Please wait, Resetting password ...');

                $.ajax({
                    type: "POST",
                    url: "",
                    data: JSON.stringify(
                        {
                            password : password,
                            repeatPassword: repeatPassword
                        }
                    ),
                    dataType: "json",
                    success: function (response) {
                        var result = response;
                        var value  = result.message;

                        display(value, 'white', 'green');
                            
                        if(value == 'Login successful!'){
                            // redirect to creating a new password
                            window.location.replace('login.html');
                        }
                    },
                    statusCode: {
                        404: function() {
                            display('This page is not found.', 'yellow', 'red');
                        }
                    },
                    complete: function(data){
                        if(data.readyState != 4){
                            display('Bad Network, Try Again.', 'yellow', 'red');
                        } else{
                            if(data.statusText == 'Unauthorized'){
                                display('Sorry, You are not yet authorized.', 'yellow', 'red');
                            }
                        }
                    }
                });
            } else{
                messageDialog('Passwords Mismatched.', 'yellow', 'red');
            }
        }
    });
});