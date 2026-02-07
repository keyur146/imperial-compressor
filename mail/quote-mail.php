<?php
header("Access-Control-Allow-Origin: *");

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace
    $quote_name = strip_tags(trim($_POST["quote_name"]));
    $quote_email = filter_var(trim($_POST["quote_email"]), FILTER_SANITIZE_EMAIL);
    $quote_phone = strip_tags(trim($_POST["quote_phone"]));
    $quote_subject = strip_tags(trim($_POST["quote_subject"]));
    $quote_message = trim($_POST["quote_message"]);

    // Check that data was sent to the mailer
    if (empty($quote_name) || empty($quote_phone) || empty($quote_subject) || empty($quote_message) || !filter_var($quote_email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete all required fields and try again.";
        exit();
    }

    // Set the recipient email address
    $recipient = "keyurbchauhan@gmail.com";

    // Build the email subject
    $email_subject = "Quote Request: " . $quote_subject;

    // Build the email content
    $email_content = "New Quote Request from Imperial Compressors Website\n\n";
    $email_content .= "Name: $quote_name\n";
    $email_content .= "Email: $quote_email\n";
    $email_content .= "Phone: $quote_phone\n";
    $email_content .= "Subject: $quote_subject\n\n";
    $email_content .= "Message:\n$quote_message\n\n";

    // Handle file upload if present
    $attachment = null;
    if (isset($_FILES['quote_file']) && $_FILES['quote_file']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_name = $_FILES['quote_file']['tmp_name'];
        $file_name = $_FILES['quote_file']['name'];
        $file_size = $_FILES['quote_file']['size'];
        $file_type = $_FILES['quote_file']['type'];

        // Check file size (5MB max)
        if ($file_size > 5242880) {
            http_response_code(400);
            echo "File size exceeds 5MB limit.";
            exit();
        }

        // Read file content
        $file_content = chunk_split(base64_encode(file_get_contents($file_tmp_name)));
        $attachment = array(
            'content' => $file_content,
            'name' => $file_name,
            'type' => $file_type
        );

        $email_content .= "Attachment: $file_name\n";
    }

    // Build the email headers
    $boundary = md5(time());
    $headers = "From: $quote_name <$quote_email>\r\n";
    $headers .= "Reply-To: $quote_email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";

    if ($attachment) {
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

        $message = "--$boundary\r\n";
        $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $message .= $email_content . "\r\n";
        $message .= "--$boundary\r\n";
        $message .= "Content-Type: {$attachment['type']}; name=\"{$attachment['name']}\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n";
        $message .= "Content-Disposition: attachment; filename=\"{$attachment['name']}\"\r\n\r\n";
        $message .= $attachment['content'] . "\r\n";
        $message .= "--$boundary--";
    } else {
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message = $email_content;
    }

    // Send the email
    if (mail($recipient, $email_subject, $message, $headers)) {
        http_response_code(200);
        echo "Thank you! Your quote request has been sent successfully. We'll get back to you within 24 hours.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your request. Please try again or contact us directly.";
    }

} else {
    // Not a POST request, set a 403 (forbidden) response code
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
    exit();
}
?>
