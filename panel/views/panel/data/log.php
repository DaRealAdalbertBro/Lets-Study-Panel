<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../../../config/db.php");

if(isset($_GET['page'])) {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $page = $db->real_escape_string(strip_tags($_GET['page']));

    if(ctype_digit($page)) {
        $test = $db->prepare("SELECT id FROM administration");
        $test->execute();
        $result = $test->get_result();
        $row_count = $result->num_rows;
        $items_per_page = 10;
        $page = intval($page);
        $offset = ($page - 1) * $items_per_page;
        $page_count = (int)ceil($row_count / $items_per_page);

        if($page > $page_count) {
            $page = 1;
            $offset = ($page - 1) * $items_per_page;
            $page_count = (int)ceil($row_count / $items_per_page);
            $sql = $db->prepare("SELECT * FROM administration ORDER BY id DESC LIMIT ?, ?");
            $sql->bind_param('ii', $offset, $items_per_page);
            $sql->execute();
            $res = mysqli_fetch_all($sql->get_result(), MYSQLI_ASSOC);
            echo 0;
            echo json_encode($res);
        } else {
            if($page < 1) {
                $page = $page_count;
                $offset = ($page - 1) * $items_per_page;
                echo $page_count;
                echo "&";

                $sql = $db->prepare("SELECT * FROM administration ORDER BY id DESC LIMIT ?, ?");
                $sql->bind_param('ii', $offset, $items_per_page);
                $sql->execute();
                $res = mysqli_fetch_all($sql->get_result(), MYSQLI_ASSOC);
                echo json_encode($res);
            } else {
                $sql = $db->prepare("SELECT * FROM administration ORDER BY id DESC LIMIT ?, ?");
                $sql->bind_param('ii', $offset, $items_per_page);
                $sql->execute();
                $res = mysqli_fetch_all($sql->get_result(), MYSQLI_ASSOC);
                echo json_encode($res);
            }
        }

    } else {
        echo "Error!";
    }
}

$db->close();
?>