<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Let's Study | Admin Panel</title>
    <meta name="description" content="Let's Study | Admin Panel">
    <meta name="url" content="https://letsstudy.com/">
    <meta name="image" content="./views/img/blue.png">
    <meta name="title" content="Let's Study">
    <meta property="description" content="Let's Study | Admin Panel">
    <meta property="url" content="https://letsstudy.com/">
    <meta property="image" content="./views/img/blue.png">
    <meta property="title" content="Let's Study">

    <meta name="og:description" content="Let's Study | Admin Panel">
    <meta name="og:url" content="https://letsstudy.com/">
    <meta name="og:image" content="./views/img/blue.png">
    <meta name="og:title" content="Let's Study">
    <meta property="og:description" content="Let's Study | Admin Panel">
    <meta property="og:url" content="https://letsstudy.com/">
    <meta property="og:image" content="./views/img/blue.png">
    <meta property="og:title" content="Let's Study">
    <link rel="icon" href="./views/img/blue.png">
    <link rel="stylesheet" href="./views/panel.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.6.0/dist/chart.min.js"></script>
    <script src="./cryptojs/crypto-js.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <link href="./views/fontawesome-free-5.15.4-web/css/all.css" rel="stylesheet">
</head>

<body>
    <div id="popup">
        <div class="box">
            <h1>Are you sure?</h1>
            <div class="line"></div>
            <p id="popupPar">If you will continue, the following account will be completly deleted from the database. Click on the <span class="bold">CONTINUE</span> button, if you really agree with this action.</p>
            <button class="continue" onclick="removeWarning('continue')">CONTINUE</button>
            <button class="nevermind" onclick="removeWarning('nevermind')">NEVERMIND</button>
        </div>
    </div>
    <div class="top" id="top">
        <img src="./views/img/blue.png" alt="Logo" class="logo">
        <div class="content">
            <span class="user_name"><?php echo $_SESSION['user_name']; ?> </span>
            <span class="position"><?php echo $_SESSION['user_permissions']; ?></span>
        </div>

    </div>
    <section class="main" id="main">
        <div class="nav">
            <div class="box">
                <img id="logo" src="./views/img/white.png" alt="Logo" class="logo"><span class="title" id="title">LS-Panel</span>
            </div>
            <div class="line" id="brandLine"></div>
            <div class="box">
                <?php
                if ($_SESSION['user_permissions'] == "Administrator" || $_SESSION['user_permissions'] == "Moderator" || $_SESSION['user_permissions'] == "Head Moderator") {
                    echo '<div class="item" id="server">
                    <i class="fas fa-server"></i>
                    <span>Server Insights</span>
                    </div>';
                    echo '<script></script>';
                }
                ?>
                <?php
                if ($_SESSION['user_permissions'] == "Administrator" || $_SESSION['user_permissions'] == "Moderator" || $_SESSION['user_permissions'] == "Head Moderator") {
                    echo '<div class="item" id="manageposts">
                    <i class="fas fa-mail-bulk"></i>
                    <span>Manage Posts</span>
                    </div>';
                }
                ?>
                <?php
                if ($_SESSION['user_permissions'] == "Administrator") {
                    echo '<div class="item" id="administration">
                    <i class="fas fa-users-cog"></i>
                    <span>Administration</span>
                    </div>';
                }
                ?>
                <?php
                if ($_SESSION['user_permissions'] == "Administrator") {
                    echo '<div class="item" id="accounts">
                    <i class="far fa-plus-square"></i>
                    <span>Accounts</span>
                </div>';
                }
                ?>
                <div class="item" onclick='window.location="panel?logout"' id="logout">
                    <i class="fas fa-power-off"></i>
                    <span>Log out</span>
                </div>
            </div>
        </div>
        <?php
        function logThis($action, $nonceValue)
        {
            date_default_timezone_set('Europe/Prague');
            require './classes/encryption.php';
            $ipLOG = $_SERVER['REMOTE_ADDR'];
            $actionLOG = $action;
            $authorLOG = $_SESSION['user_name'];
            $dateLOG = date('Y-m-d-h-i');
            $curDateTime24LOG = date('H:i');
            $timeLOG = date('h:i A', strtotime($curDateTime24LOG));
            $locLOG;
            if (isset($_GET['loc'])) {
                if ($_GET['loc'] == "nodata") {
                    $locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/' . $ipLOG));
                    if ($locationLOG && $locationLOG['status'] == 'success') {
                        $locLOG = $locationLOG['city'];
                    } else {
                        $locLOG = "---";
                    }
                } else {
                    $Encryption = new Encryption();
                    $locationLOG = $Encryption->decrypt($_GET['loc'], $nonceValue);
                }
            } else {
                $locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/' . $ipLOG));
                if ($locationLOG && $locationLOG['status'] == 'success') {
                    $locLOG = $locationLOG['city'];
                } else {
                    $locLOG = "---";
                }
            }
            $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $sqlLOG = $db->prepare("INSERT INTO administration (author, action, date, ip, time, location) VALUES (?, ?, ?, ?, ?, ?)");
            $sqlLOG->bind_param('ssssss', $authorLOG, $actionLOG, $dateLOG, $ipLOG, $timeLOG, $locLOG);
            $sqlLOG->execute();
            $db->close();
        }

        if (isset($_GET['data'])) {
            if ($_GET['data'] == "insights") {
                require_once('./views/panel/insights.php');
            } elseif ($_GET['data'] == "accounts" || $_GET['data'] == "manageaccounts") {
                require_once('./views/panel/accounts.php');
            } elseif ($_GET['data'] == "administration" || $_GET['data'] == "administration&page") {
                require_once('./views/panel/administration.php');
            } elseif ($_GET['data'] == "manageposts" || $_GET['data'] == "posts") {
                require_once('./views/panel/posts.php');
            }
        } else {
            require_once('./views/panel/insights.php');
        }
        ?>
    </section>
    <script src="./views/encryption.js"></script>
    <script src="./views/panel.js"></script>
</body>

</html>