<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
class Login
{
    /**
     * @var object The database connection
     */
    private $db_connection = null;
    /**
     * @var array Collection of error messages
     */
    public $errors = array();
    /**
     * @var array Collection of success / neutral messages
     */
    public $messages = array();

    /**
     * the function "__construct()" automatically starts whenever an object of this class is created,
     * you know, when you do "$login = new Login();"
     */
    public function __construct()
    {
        // create/read session, absolutely necessary
        session_start();

        // check the possible login actions:
        // if user tried to log out (happen when user clicks logout button)
        if (isset($_GET["logout"])) {
            $this->doLogout();
        }
        // login via post data (if user just submitted a login form)
        elseif (isset($_POST["login"])) {
            $this->dologinWithPostData();
        }
    }

    /**
     * log in with post data
     */
    private function dologinWithPostData()
    {
        // check login form contents
        if (empty($_POST['user_name'])) {
            $this->errors[] = "Username field was empty.";
        } elseif (empty($_POST['user_password'])) {
            $this->errors[] = "Password field was empty.";
        } elseif (!empty($_POST['user_name']) && !empty($_POST['user_password'])) {

            // create a database connection, using the constants from config/db.php (which we loaded in index.php)
            $this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

            // change character set to utf8 and check it
            if (!$this->db_connection->set_charset("utf8mb4")) {
                $this->errors[] = $this->db_connection->error;
            }

            // if no connection errors (= working database connection)
            if (!$this->db_connection->connect_errno) {

                // escape the POST stuff
                $user_name = $this->db_connection->real_escape_string($_POST['user_name']);

                // database query, getting all the info of the selected user (allows login via email address in the
                // username field)
                $sql = $this->db_connection->prepare("SELECT user_name, user_id, user_password_hash, user_permissions
                        FROM users
                        WHERE user_name = '" . $user_name . "'");
                $sql->execute();
                $result_of_login_check = $sql->get_result();

                // if this user exists
                if ($result_of_login_check->num_rows == 1) {

                    $result_row = $result_of_login_check->fetch_object();

                    if(password_verify($_POST['user_password'], $result_row->user_password_hash)) {
                        $_SESSION['user_name'] = $result_row->user_name;
                        $_SESSION['user_id'] = $result_row->user_id;
                        $_SESSION['user_login_status'] = 1;
                        $_SESSION['user_permissions'] = $result_row->user_permissions;

                        date_default_timezone_set('Europe/Prague');

                        require './classes/encryption.php';
                        
                        $ipLOG = $_SERVER['REMOTE_ADDR'];
                        $actionLOG = "Logged In";
                        $authorLOG = $_SESSION['user_name'];
                        $dateLOG = date('Y-m-d-h-i');
                        $curDateTime24LOG = date('H:i');
                        $timeLOG = date('h:i A', strtotime($curDateTime24LOG));
                        $nonceValue = "ENCRYPTION KEY WORDS";
                        $locLOG;
                        if(isset($_GET['loc'])) {if($_GET['loc'] == "nodata") {$locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/'.$ipLOG));if($locationLOG && $locationLOG['status'] == 'success'){$locLOG = $locationLOG['city'];} else {$locLOG = "---";}} else {$locationLOG = $Encryption->decrypt($_GET['loc'], $nonceValue);}} else {$locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/'.$ipLOG));if($locationLOG && $locationLOG['status'] == 'success'){$locLOG = $locationLOG['city'];} else {$locLOG = "---";}}

                        $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

                        $sqlLOG = $db->prepare("INSERT INTO administration (author, action, date, ip, time, location) VALUES (?, ?, ?, ?, ?, ?)");
                        $sqlLOG->bind_param('ssssss', $authorLOG, $actionLOG, $dateLOG, $ipLOG, $timeLOG, $locLOG);
                        $sqlLOG->execute();

                        $db->close();
                    } else {
                        $this->errors[] = "Wrong password. Try again.";
                    }
                } else {
                    $this->errors[] = "This user does not exist.";
                }
            } else {
                $this->errors[] = "Database connection problem.";
            }
        }
    }

    /**
     * perform the logout
     */
    public function doLogout()
    {
        date_default_timezone_set('Europe/Prague');
        require './classes/encryption.php';
        $ipLOG = $_SERVER['REMOTE_ADDR'];
        $actionLOG = "Logged out";
        $authorLOG = $_SESSION['user_name'];
        $dateLOG = date('Y-m-d-h-i');
        $curDateTime24LOG = date('H:i');
        $timeLOG = date('h:i A', strtotime($curDateTime24LOG));
        $locLOG;
        if(isset($_GET['loc'])) {if($_GET['loc'] == "nodata") {$locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/'.$ipLOG));if($locationLOG && $locationLOG['status'] == 'success'){$locLOG = $locationLOG['city'];} else {$locLOG = "---";}} else {$Encryption = new Encryption();$locationLOG = $Encryption->decrypt($_GET['loc'], $nonceValue);}} else {$locationLOG = @unserialize(file_get_contents('http://ip-api.com/php/'.$ipLOG));if($locationLOG && $locationLOG['status'] == 'success'){$locLOG = $locationLOG['city'];} else {$locLOG = "---";}}
        $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $sqlLOG = $db->prepare("INSERT INTO administration (author, action, date, ip, time, location) VALUES (?, ?, ?, ?, ?, ?)");
        $sqlLOG->bind_param('ssssss', $authorLOG, $actionLOG, $dateLOG, $ipLOG, $timeLOG, $locLOG);
        $sqlLOG->execute();
        $db->close();

        // delete the session of the user
        $_SESSION = array();
        session_destroy();
        // return a little feeedback message
        $this->messages[] = "You have been logged out.";

    }

    /**
     * simply return the current state of the user's login
     * @return boolean user's login status
     */
    public function isUserLoggedIn()
    {
        if (isset($_SESSION['user_login_status']) AND $_SESSION['user_login_status'] == 1) {
            return true;
        }
        // default return
        return false;
    }
}