<?php

header("Access-Control-Allow-Origin: *");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// INCLUDE PHPMailer
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

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

    $mail = new PHPMailer(true);

    try {
         // SMTP SETTINGS
        $mail->isSMTP();
        //$mail->SMTPDebug = 2;
        $mail->Host       = 'smtp.ionos.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@imperialcompressors.net';
        $mail->Password   = 'imperial@2303'; // 🔴 replace this
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        // $mail->DKIM_domain = 'imperialcompressors.net';
        // $mail->DKIM_selector = 'default';
        // $mail->DKIM_identity = $mail->From;
        $mail->SMTPKeepAlive = false;
        $mail->Timeout = 10;
        // FROM / TO
        $mail->setFrom('info@imperialcompressors.net', 'Imperial Compressors');
        $mail->addAddress('info@imperialcompressors.net');
        $mail->addAddress('hiralchauhan95@gmail.com');

        // Reply to user
        $mail->addReplyTo($quote_email, $quote_name);

        $mail->CharSet = 'UTF-8';

        // SUBJECT
        $mail->Subject = "Quote Request: " . $quote_subject;

        // BODY
        $body = "New Expert Compressor Solutions Details\n\n";
        $body .= "Name: $quote_name\n";
        $body .= "Email: $quote_email\n";
        $body .= "Phone: $quote_phone\n";
        $body .= "Subject: $quote_subject\n\n";
        $body .= "Message:\n$quote_message\n";

        $mail->Body = $body;
        $mail->isHTML(false);

        // ✅ ATTACHMENT (clean version)
        if (isset($_FILES['quote_file']) && $_FILES['quote_file']['error'] == UPLOAD_ERR_OK) {

            if ($_FILES['quote_file']['size'] > 5242880) {
                throw new Exception("File exceeds 5MB.");
            }

            $mail->addAttachment(
                $_FILES['quote_file']['tmp_name'],
                $_FILES['quote_file']['name']
            );
        }

        // SEND
        $mail->send();

        http_response_code(200);
        echo "Thank you! Your quote request has been sent successfully. We'll get back to you within 24 hours.";

    } catch (Exception $e) {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your request. Please try again or contact us directly." . $mail->ErrorInfo;
    }

} else {
    http_response_code(403);
    echo "Invalid request.";
}
?>