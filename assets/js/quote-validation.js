/*--------------------------------
    Ajax Quote Form
-------------------------------- */

// Custom jQuery Validate method: allowed file extensions
$.validator.addMethod("fileExtension", function (value, element, param) {
    if (element.files.length === 0) return true; // optional field — skip if no file
    var ext = value.split(".").pop().toLowerCase();
    return $.inArray(ext, param) !== -1;
}, "Please attach a valid file type.");

// Custom jQuery Validate method: max file size
$.validator.addMethod("maxFileSize", function (value, element, param) {
    if (element.files.length === 0) return true; // optional field — skip if no file
    return element.files[0].size <= param;
}, "File size must not exceed 5MB.");

$(function () {
    // Get the form and message container.
    var form = $("#quoteForm");
    var formMessages = $("#quoteFormMessage");

    // Validate the form before submitting.
    form.validate({
        errorClass: "error fail-alert",
        validClass: "valid success-alert",
        rules: {
            quote_name: {
                required: true,
                minlength: 3,
            },
            quote_email: {
                required: true,
                email: true,
            },
            quote_phone: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10,
            },
            quote_subject: {
                required: true,
                minlength: 3,
            },
            quote_message: {
                required: true,
            },
            quote_file: {
                fileExtension: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
                maxFileSize: 5242880, // 5MB in bytes
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        messages: {
            quote_name: {
                required: "Please enter your full name.",
                minlength: "Full name should be at least 3 characters.",
            },
            quote_email: {
                required: "Please enter your email address.",
                email: "The email should be in the format: abc@domain.tld.",
            },
            quote_phone: {
                required: "Please enter your mobile number.",
                digits: "Please enter a valid mobile number (digits only).",
                minlength: "Mobile number should be 10 digits.",
                maxlength: "Mobile number should be 10 digits.",
            },
            quote_subject: {
                required: "Please enter a subject.",
                minlength: "Subject should be at least 3 characters.",
            },
            quote_message: {
                required: "Please describe your requirements.",
            },
            quote_file: {
                fileExtension: "Only PDF, DOC, DOCX, JPG, or PNG files are allowed.",
                maxFileSize: "File size must not exceed 5MB.",
            },
        },
    });

    form.submit(function (e) {
        e.preventDefault();

        if (!form.valid()) {
            return false;
        }

        // Show loading spinner, disable submit button.
        var $btn = form.find(".btn-submit");
        var $btnText = $btn.find(".btn-text");
        var $btnLoader = $btn.find(".btn-loader");
        $btnText.hide();
        $btnLoader.show();
        $btn.prop("disabled", true);

        // Build FormData (required for file upload).
        var formData = new FormData(form[0]);

        // Submit via AJAX.
        $.ajax({
            type: "POST",
            url: form.attr("action"),
            data: formData,
            contentType: false,
            processData: false,
            cache: false,
        })
            .done(function (response) {
                // PHP echoes a plain string — use response directly.
                form[0].reset();

                formMessages.removeClass("error").addClass("success");
                formMessages.text(response);
                formMessages.fadeIn();

                // Hide the form on success.
                form.slideUp();
            })
            .fail(function (data) {
                formMessages.removeClass("success").addClass("error");

                if (data.responseText !== "") {
                    formMessages.text(data.responseText);
                } else {
                    formMessages.text(
                        "Oops! An error occurred and your request could not be sent. Please try again."
                    );
                }

                formMessages.fadeIn();
            })
            .always(function () {
                // Restore submit button state.
                $btnText.show();
                $btnLoader.hide();
                $btn.prop("disabled", false);
            });

        return false;
    });
});
