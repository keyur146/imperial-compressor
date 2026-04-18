<?php

header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $con_name = strip_tags(trim($_POST["con_name"] ?? ""));
    $con_contact_no = trim($_POST["con_contact_no"] ?? "");
    $con_email = filter_var(trim($_POST["con_email"] ?? ""), FILTER_SANITIZE_EMAIL);
    $con_message = trim($_POST["con_message"] ?? "");

    if (
        empty($con_name) ||
        empty($con_contact_no) ||
        empty($con_message) ||
        !filter_var($con_email, FILTER_VALIDATE_EMAIL)
    ) {
        http_response_code(400);
        echo "Please complete the form correctly.";
        exit();
    }

    $to = "info@imperialcompressors.net";
    $subject = "Contact Us Details";

    $message = "Name: $con_name\n";
    $message .= "Email: $con_email\n";
    $message .= "Phone: $con_contact_no\n\n";
    $message .= "Message:\n$con_message\n";

    $headers = "From: info@imperialcompressors.net\r\n";
    $headers .= "Reply-To: $con_email\r\n";
    $headers .= "Return-Path: info@imperialcompressors.net\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $subject, $message, $headers, "-finfo@imperialcompressors.net")) {
        http_response_code(200);
        echo "Thank you! Your quote request has been sent successfully. We'll get back to you within 24 hours.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your request. Please try again or contact us directly.";
    }

} else {
    http_response_code(403);
    echo "Invalid request.";
}
?>