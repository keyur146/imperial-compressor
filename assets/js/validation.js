/*--------------------------------
    Ajax Contact Form
-------------------------------- */

$(function () {
  // Get the form.
  var form = $("#contact-form");
  // Get the messages div.
  var formMessages = $(".contact-us.form-messege");
  // Set up an event listener for the contact form.
  // line 12-46 added to validate the form before sending an email
  form.validate({
    errorClass: "error fail-alert",
    validClass: "valid success-alert",
    rules: {
      con_name: {
        required: true,
        minlength: 3,
      },
      con_contact_no: {
        required: true,
        number: true,
        minlength: 10,
        maxlength: 10,
      },
      con_email: {
        required: true,
        email: true,
      },
      con_message: {
        required: true,
      },
    },
    errorPlacement: function (error, element) {
      console.log("error", error);
      error.insertAfter(element); // default function
      //   error.insertBefore(element);
    },
    messages: {
      con_name: {
        required: "Please enter your Full name.",
        minlength: "Full name should be at least 3 characters.",
      },
      con_contact_no: {
        required: "Please enter your mobile number.",
        number: "Please enter a valid mobile number.",
        minlength: "Mobile number should be 10 digits.",
        maxlength: "Mobile number should be 10 digits.",
      },
      con_email: {
        required: "Please enter your email address.",
        email: "The email should be in the format: abc@domain.tld.",
      },
      con_message: {
        required: "Please enter your message.",
      },
    },
  });

  $(form).submit(function (e) {
    // Stop the browser from submitting the form.
    e.preventDefault();

    if ($("#contact-form").valid() == true) {
      
      // Build form data (FormData supports file uploads).
      var formData = new FormData(form[0]);
      // alert("Hello");

      // Submit the form using AJAX.
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
      })
        .done(function (response) {
          $(form)[0].reset();
          // response = $.parseJSON(response);

          // PHP echoes a plain string, not JSON — use response directly.
          $(formMessages).removeClass("error");
          $(formMessages).addClass("success");

          // Set the message text.
          $(formMessages).text(response);

          $(formMessages).fadeIn();

          // Hide the form on success.
          $(form).slideUp();
        })
        .fail(function (data) {
         
          // Make sure that the formMessages div has the 'error' class.
          $(formMessages).removeClass("success");
          $(formMessages).addClass("error");

          // Set the message text.
          if (data.responseText !== "") {
            $(formMessages).text(data.responseText);
            // echo '<meta http-equiv="refresh" content="10; url=?successfull-submit">';
          } else {
            $(formMessages).text(
              "Oops! An error occurred and your message could not be sent."
            );
          }
        });
   }
    return false;
  });
});
