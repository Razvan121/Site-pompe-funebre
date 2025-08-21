<?php
$conn = new mysqli("localhost", "root", "", "site_dynamic");
if ($conn->connect_error) {
  echo "<p>Momentan nu putem afișa recenziile.</p>";
  exit();
}
$conn->set_charset("utf8mb4");

$sql = "SELECT nume, text_recenzie, data FROM recenzii ORDER BY data DESC LIMIT 50";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $nume = htmlspecialchars($row['nume'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $text = nl2br(htmlspecialchars($row['text_recenzie'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    $data = htmlspecialchars($row['data'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    echo "<article class='recenzie'>";
    echo "  <h4 class='review-author'>{$nume}</h4>";
    echo "  <time datetime='{$data}'>{$data}</time>";
    echo "  <p>{$text}</p>";
    echo "</article>";
  }
} else {
  echo "<p>Nu există recenzii.</p>";
