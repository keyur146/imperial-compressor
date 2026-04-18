<?php

header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // FORM DATA
    $quote_name = strip_tags(trim($_POST["quote_name"] ?? ""));
    $quote_email = filter_var(trim($_POST["quote_email"] ?? ""), FILTER_SANITIZE_EMAIL);
    $quote_phone = strip_tags(trim($_POST["quote_phone"] ?? ""));
    $quote_subject = strip_tags(trim($_POST["quote_subject"] ?? ""));
    $quote_message = trim($_POST["quote_message"] ?? "");

    // VALIDATION
    if (
        empty($quote_name) ||
        empty($quote_phone) ||
        empty($quote_subject) ||
        empty($quote_message) ||
        !filter_var($quote_email, FILTER_VALIDATE_EMAIL)
    ) {
        http_response_code(400);
        echo "Please complete all required fields.";
        exit();
    }

    // RECEIVER
    $to = "info@imperialcompressors.net";

    // SUBJECT
    $subject = "Quote Request: " . $quote_subject;

    // MESSAGE
    $message = "New Expert Compressor Solutions Details\n\n";
    $message .= "Name: $quote_name\n";
    $message .= "Email: $quote_email\n";
    $message .= "Phone: $quote_phone\n";
    $message .= "Subject: $quote_subject\n\n";
    $message .= "Message:\n$quote_message\n";

    // BOUNDARY
    $boundary = md5(time());

    // HEADERS
    $headers = "From: info@imperialcompressors.net\r\n";
    $headers .= "Reply-To: $quote_email\r\n";
    $headers .= "Return-Path: info@imperialcompressors.net\r\n";
    $headers .= "MIME-Version: 1.0\r\n";

    // CHECK FILE
    if (isset($_FILES['quote_file']) && $_FILES['quote_file']['error'] == UPLOAD_ERR_OK) {

        if ($_FILES['quote_file']['size'] > 5242880) {
            http_response_code(400);
            echo "File exceeds 5MB.";
            exit();
        }

        $file_tmp = $_FILES['quote_file']['tmp_name'];
        $file_name = $_FILES['quote_file']['name'];
        $file_type = $_FILES['quote_file']['type'];

        $file_content = chunk_split(base64_encode(file_get_contents($file_tmp)));

        // MULTIPART HEADER
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

        // MESSAGE WITH ATTACHMENT
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $message . "\r\n";

        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n\r\n";
        $body .= $file_content . "\r\n";
        $body .= "--$boundary--";

    } else {
        // SIMPLE MESSAGE (NO FILE)
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body = $message;
    }

    // SEND
    if (mail($to, $subject, $body, $headers, "-finfo@imperialcompressors.net")) {
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