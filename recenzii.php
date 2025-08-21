<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "site_dynamic";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  exit("Conexiune eșuată.");
}
$conn->set_charset("utf8mb4");

/** utilitar scurt pt redirect */
function go($status = null) {
  $url = 'index.php';
  if ($status) $url .= '?status='.$status;
  $url .= '#recenzii';
  header('Location: ' . $url);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nume  = trim($_POST['nume'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $text  = trim($_POST['text_recenzie'] ?? '');

  if ($nume === '' || $email === '' || $text === '') {
    go('invalid');
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    go('invalid_email');
  }
  if (mb_strlen($nume) > 100 || mb_strlen($email) > 255 || mb_strlen($text) > 5000) {
    go('too_long');
  }

  $sql = "INSERT INTO recenzii (nume, email, text_recenzie) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  if ($stmt) {
    $stmt->bind_param("sss", $nume, $email, $text);
    $ok = $stmt->execute();
    $stmt->close();
    $conn->close();
    go($ok ? 'ok' : 'err');
  } else {
    $conn->close();
    go('err');
  }
} else {
  $conn->close();
  go(); 
}
