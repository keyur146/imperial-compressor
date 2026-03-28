<?php

header("Access-Control-Allow-Origin: *");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// INCLUDE FILES (IMPORTANT PATH)
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

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
        echo "Please complete the form correctly.";
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
        // OPTIONAL DEBUG (remove later)
        // $mail->SMTPDebug = 2;

        // FROM & TO
        $mail->setFrom('info@imperialcompressors.net', 'Imperial Compressors');
        $mail->addAddress('info@imperialcompressors.net');
        $mail->addAddress('hiralchauhan95@gmail.com');
        
        $mail->CharSet = 'UTF-8';
        // EMAIL CONTENT
        $mail->isHTML(false);
        $mail->Subject = "Contact Us Details";

        $mail->Body =
            "Name: $con_name\n".
            "Email: $con_email\n".
            "Phone: $con_contact_no\n\n".
            "Message:\n$con_message";

        // SEND
        $mail->send();

        http_response_code(200);
        
        echo "Thank you! Your quote request has been sent successfully. We'll get back to you within 24 hours.";

    } catch (Exception $e) {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your request. Please try again or contact us directly. " . $mail->ErrorInfo;
    }

} else {
    http_response_code(403);
    echo "Invalid request.";
}