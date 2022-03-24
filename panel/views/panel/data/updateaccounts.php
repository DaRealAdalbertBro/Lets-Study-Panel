<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../../../config/db.php");
session_start();

if(isset($_POST['update'])) {
    $update = $_POST['update'];
} else {
    $update = "nope";
}

if(isset($_POST['delete'])) {
    $delete = $_POST['delete'];
} else {
    $delete = "nope";
}

$errors = "";

$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
require '../../../classes/encryption.php';
function logThis($action, $nonceValue) {
    date_default_timezone_set('Europe/Prague');
    $ipLOG = $_SERVER['REMOTE_ADDR'];
    $actionLOG = $action;
    $authorLOG = $_SESSION['user_name'];
    $dateLOG = date('Y-m-d-h-i');
    $curDateTime24LOG = date('H:i');
    $timeLOG = date('h:i A', strtotime($curDateTime24LOG));
    $locLOG;
    if(isset($_GET['loc'])) {if($_GET['loc'] == "nodata") {$locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/'.$ipLOG));if($locationLOG && $locationLOG['status'] == 'success'){$locLOG = $locationLOG['city'];} else {$locLOG = "---";}} else {$locationLOG = $Encryption->decrypt($_GET['loc'], $nonceValue);}} else {$locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/'.$ipLOG));if($locationLOG && $locationLOG['status'] == 'success'){$locLOG = $locationLOG['city'];} else {$locLOG = "---";}}
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $sqlLOG = $db->prepare("INSERT INTO administration (author, action, date, ip, time, location) VALUES (?, ?, ?, ?, ?, ?)");
    $sqlLOG->bind_param('ssssss', $authorLOG, $actionLOG, $dateLOG, $ipLOG, $timeLOG, $locLOG);
    $sqlLOG->execute();
    $db->close();
}

if($update == null && $delete == null) {
    $errors = 4;
} else if($update == "nope") {

    for($i = 0;$i < count($delete);$i++) {
        $sql = $db->prepare('DELETE FROM users WHERE user_id = ?');
        $del = $db->real_escape_string(strip_tags(intval($delete[$i]), ENT_QUOTES));
        $sql->bind_param('i', $del);

        $sql->execute();
        if($_SESSION['user_id'] == $del) {
            logThis("Deleted his Account", "ENCRYPTION KEY WORDS");
            $_SESSION = array();
            session_destroy();
            $errors = 0;
        }

        logThis("Deleted Account", "ENCRYPTION KEY WORDS");
    }
    $errors = 0;

} else if($delete == "nope") {
    foreach($update as $newdata) {
        $name_data = $db->real_escape_string(strip_tags($newdata['name'], ENT_QUOTES));
        $id_data = $db->real_escape_string(strip_tags($newdata['id'], ENT_QUOTES));
        $perms_data = $db->real_escape_string(strip_tags($newdata['perms'], ENT_QUOTES));
        $newpass_data = $db->real_escape_string(strip_tags($newdata['newpass'], ENT_QUOTES));

        $permarr = array('Administrator', 'Head Moderator', 'Moderator', 'Trial Moderator', 'AnD', 'MORE');

        if($name_data == "" || $id_data == "" || $perms_data == "" || strlen($name_data) < 4 || strlen($name_data) > 64 || intval($id_data) < 314748364 || intval($id_data) > 2147483647 || in_array($perms_data, $permarr) == 0) {
            $errors = 1;
        } else {

            $main = $db->prepare('SELECT * FROM users WHERE user_id = ?');
            $idata = intval($id_data);

            $main->bind_param('i', $idata);
            $main->execute();

            $results = $main->get_result();

            if(($results) && ($results->num_rows !== 0)) {
                // account exists
                if($newpass_data !== "") {
                    if(strlen($newpass_data) < 8 || strlen($newpass_data) > 256) {
                        $errors = 1;

                    } else {
                        // set new password
                        $sql4 = $db->prepare("UPDATE users SET
                        user_name = ?,
                        user_password_hash = ?,
                        user_permissions = ?
                        WHERE user_id = ?");

                        $idaa = intval($id_data);
                        $nameaa = strval($name_data);
                        $permsadata = strval($perms_data);
                        $pass_data = strval(password_hash($newpass_data, PASSWORD_DEFAULT));

                        $sql4->bind_param('sssi', $nameaa, $pass_data, $permsadata, $idaa);
                        $sql4->execute();

                        $errors = 0;
                        logThis("Updated Accounts", "ENCRYPTION KEY WORDS");
                    }
    
                } else {
                    // set without new password
                    $sql3 = $db->prepare('UPDATE users SET
                    user_name = ?,
                    user_permissions = ?
                    WHERE user_id = ?');

                    $idaa = intval($id_data);
                    $nameaa = strval($name_data);
                    $permsadata = strval($perms_data);

                    $sql3->bind_param('ssi', $nameaa, $perms_data, $idaa);
                    $sql3->execute();

                    $errors = 0;
                    logThis("Updated Accounts", "ENCRYPTION KEY WORDS");
                }
            } else {
                // user does not exist
                if($newpass_data == "") {
                    $errors = 2;

                } else {
                    if(strlen($newpass_data) < 8 || strlen($newpass_data) > 256) {
                        $errors = 1;

                    } else {
                        $sql2 = $db->prepare('INSERT INTO users (user_id, user_name, user_password_hash, user_permissions)
                        VALUES(?, ?, ?, ?)');

                        $idaa = intval($id_data);
                        $nameaa = strval($name_data);
                        $permsadata = strval($perms_data);
                        $pass_data = strval(password_hash($newpass_data, PASSWORD_DEFAULT));

                        $sql2->bind_param('isss', $idaa, $nameaa, $pass_data, $permsadata);
                        $sql2->execute();

                        $errors = 0;
                        
                        logThis("Created Account", "ENCRYPTION KEY WORDS");
                    }
                }


            }
            
        }

    }

} else {

    foreach($update as $newdata) {
        $name_data = $db->real_escape_string(strip_tags($newdata['name'], ENT_QUOTES));
        $id_data = $db->real_escape_string(strip_tags($newdata['id'], ENT_QUOTES));
        $perms_data = $db->real_escape_string(strip_tags($newdata['perms'], ENT_QUOTES));
        $newpass_data = $db->real_escape_string(strip_tags($newdata['newpass'], ENT_QUOTES));

        $permarr = array('Administrator', 'Head Moderator', 'Moderator', 'Trial Moderator', 'Verified Helper', 'Chromatic');

        if($name_data == "" || $id_data == "" || $perms_data == "" || strlen($name_data) < 4 || strlen($name_data) > 64 || intval($id_data) < 314748364 || intval($id_data) > 2147483647 || in_array($perms_data, $permarr) == 0) {
            $errors = 1;
        } else {

            $main = $db->prepare('SELECT * FROM users WHERE user_id = ?');
            $idata = intval($id_data);

            $main->bind_param('i', $idata);
            $main->execute();

            $results = $main->get_result();

            if(($results) && ($results->num_rows !== 0)) {
                // account exists
                if($newpass_data !== "") {
                    if(strlen($newpass_data) < 8 || strlen($newpass_data) > 256) {
                        $errors = 1;

                    } else {
                        // set new password
                        $sql4 = $db->prepare("UPDATE users SET
                        user_name = ?,
                        user_password_hash = ?,
                        user_permissions = ?
                        WHERE user_id = ?");

                        $idaa = intval($id_data);
                        $nameaa = strval($name_data);
                        $permsadata = strval($perms_data);
                        $pass_data = strval(password_hash($newpass_data, PASSWORD_DEFAULT));

                        $sql4->bind_param('sssi', $nameaa, $pass_data, $permsadata, $idaa);
                        $sql4->execute();

                        $errors = 0;
                        logThis("Updated Accounts", "ENCRYPTION KEY WORDS");
                    }
    
                } else {
                    // set without new password
                    $sql3 = $db->prepare('UPDATE users SET
                    user_name = ?,
                    user_permissions = ?
                    WHERE user_id = ?');

                    $idaa = intval($id_data);
                    $nameaa = strval($name_data);
                    $permsadata = strval($perms_data);

                    $sql3->bind_param('ssi', $nameaa, $perms_data, $idaa);
                    $sql3->execute();

                    $errors = 0;
                    logThis("Updated Accounts", "ENCRYPTION KEY WORDS");
                }
            } else {
                // user does not exist
                if($newpass_data == "") {
                    $errors = 2;

                } else {
                    if(strlen($newpass_data) < 8 || strlen($newpass_data) > 256) {
                        $errors = 1;

                    } else {
                        $sql2 = $db->prepare('INSERT INTO users (user_id, user_name, user_password_hash, user_permissions)
                        VALUES(?, ?, ?, ?)');

                        $idaa = intval($id_data);
                        $nameaa = strval($name_data);
                        $permsadata = strval($perms_data);
                        $pass_data = strval(password_hash($newpass_data, PASSWORD_DEFAULT));

                        $sql2->bind_param('isss', $idaa, $nameaa, $pass_data, $permsadata);
                        $sql2->execute();
                        
                        $errors = 0;
                        logThis("Created Accounts", "ENCRYPTION KEY WORDS");
                    }
                }


            }
            
        }

    }

    for($i2 = 0;$i2 < count($delete);$i2++) {
        $sql23 = $db->prepare('DELETE FROM users WHERE user_id = ?');
        $del23 = $db->real_escape_string(strip_tags(intval($delete[$i2]), ENT_QUOTES));
        $sql23->bind_param('i', $del23);

        $sql23->execute();
        if($_SESSION['user_id'] == $del23) {
            logThis("Deleted his Account", "ENCRYPTION KEY WORDS");
            $_SESSION = array();
            session_destroy();
            $errors = 0;
        }

        $errors = 0;
    }

}

if($errors == 0) {
    echo "Changes has been saved.";
} else if($errors == 2) {
    echo "Invalid passwords at new accounts.";
} else if($errors == 4) {
    echo "Nothing has changed...";
} else {
    echo "Something went wrong!";
}

?>
