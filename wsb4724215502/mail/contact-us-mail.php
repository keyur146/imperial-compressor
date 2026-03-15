<?php

header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $con_name = isset($_POST["con_name"]) ? strip_tags(trim($_POST["con_name"])) : "";
    $con_contact_no = isset($_POST["con_contact_no"]) ? trim($_POST["con_contact_no"]) : "";
    $con_email = isset($_POST["con_email"]) ? filter_var(trim($_POST["con_email"]), FILTER_SANITIZE_EMAIL) : "";
    $con_message = isset($_POST["con_message"]) ? trim($_POST["con_message"]) : "";

    if (
        empty($con_name) ||
        empty($con_contact_no) ||
        empty($con_message) ||
        !filter_var($con_email, FILTER_VALIDATE_EMAIL)
    ) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit();
    }

    $recipient = "hiralchauhan95@gmail.com";

    $subject = "New Website Inquiry";

    $email_content =
        "Name: $con_name\n".
        "Email: $con_email\n".
        "Phone: $con_contact_no\n\n".
        "Message:\n$con_message";

    // IMPORTANT HEADERS
    // $headers  = "From: info@imperialcompressors.net\r\n";
    // $headers .= "Reply-To: $con_email\r\n";
    // $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $headers = "From: info@imperialcompressors.net\r\n";
    $headers .= "Reply-To: $con_email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";

    $mailSent = mail($recipient,$subject,$email_content,$headers);

    if ($mailSent) {
        http_response_code(200);
        echo "Thank you! Your message has been sent successfully.";
    } else {
        http_response_code(500);
        echo "Mail server error. Please try again later.";
    }

} else {

    http_response_code(403);
    echo "Invalid request.";

}