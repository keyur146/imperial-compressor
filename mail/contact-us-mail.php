<?php
header("Access-Control-Allow-Origin: *");

// Only process POST requests.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace.
    $con_name = strip_tags(trim($_POST["con_name"]));
    $con_contact_no = trim($_POST["con_contact_no"]);
    $con_email = filter_var(trim($_POST["con_email"]), FILTER_SANITIZE_EMAIL);
    // $need = trim($_POST["need"]);
    $con_message = trim($_POST["con_message"]);

    $subject = "Inquiry:";

    // secret key, response key, and user IP required to verify captcha with google api
    // $secretKey = "6LfqDC0pAAAAALNqTXz8-jF4Htm61vhK-LkuX7xK";
    // $responseKey = $_POST['g-recaptcha-response'];
    // $UserIP = $_SERVER['REMOTE_ADDR'];

    // Check that data was sent to the mailer.
    if (empty($con_name) or empty($con_contact_no) or empty($con_message) or !filter_var($con_email, FILTER_VALIDATE_EMAIL)) {
        // Set a 400 (bad request) response code and exit.
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit();
    }

    // Set the recipient email address.
    $recipient = "farithiplywood@gmail.com";

    // Build the email content.
    $email_content = "Name: $con_name\n";
    $email_content .= "Email: $con_email\n";
    $email_content .= "Message: $con_message\n";
    $email_content .= "Contact-no: $con_contact_no\n";

    // Build the email headers.
    $email_headers = "From: $con_name <$con_email>";

    // // Verify captcha with Google API before sending an email.
    // $url = "https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$responseKey&remoteip=$UserIP";
    // $response = file_get_contents($url);
    // $response = json_decode($response);

    // if ($response->success) {
    // Send the email.
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Set a 200 (okay) response code.
        http_response_code(200);
        echo "Thank You! Your message has been sent.";

    } else {
        // Set a 500 (internal server error) response code.
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

    // }  else {
    //     http_response_code(400);
    //     echo "Invalid captcha";
    // }

} else {
    // Not a POST request, set a 403 (forbidden) response code.
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}

?>