<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../../../config/db.php");
session_start();

$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$from = $_POST['from'];
$to = $_POST['to'];
$dwm = $_POST['dwm'];

$date_now = date('Y-m-d');

if ($from > $to || $to < $from) {
    echo "No Results";
} else {
    if(strtolower($dwm) == "daily") {
        $query1 = $db->prepare("SELECT `total`, sumtotal, `date` FROM userMonitoring m
        INNER JOIN (SELECT  SUM(`new`) sumtotal, MIN(`date`) mindate  FROM userMonitoring GROUP BY DAY(`date`)) t1
        ON m.`date`= t1.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query1->bind_param('ss', $from, $to);
        $query1->execute();
        $results1 = $query1->get_result();

        $query2 = $db->prepare("SELECT sumnumber, sumvoice, `date` FROM messageMonitoring m
        INNER JOIN (SELECT  SUM(`number`) sumnumber, SUM(`voice`) sumvoice, MIN(`date`) mindate  FROM messageMonitoring GROUP BY DAY(`date`)) t1
        ON m.`date`= t1.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query2->bind_param('ss', $from, $to);
        $query2->execute();
        $results2 = $query2->get_result();

        $query3 = $db->prepare("SELECT sumkicks, sumbans, summutes, sumwarns, `date` FROM moderationMonitoring m
        INNER JOIN (SELECT  SUM(`kicks`) sumkicks, SUM(`bans`) sumbans, SUM(`warns`) sumwarns, SUM(`mutes`) summutes, MIN(`date`) mindate  FROM moderationMonitoring GROUP BY DAY(`date`)) t2
        ON m.`date`= t2.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query3->bind_param('ss', $from, $to);
        $query3->execute();
        $results3 = $query3->get_result();

        $obj1 = [];
        $obj2 = [];
        $obj3 = [];
        $mainArray = [];

        if($results1->num_rows < 1) {
            $obj1 = 0;
        } else {
            while($row = $results1->fetch_array()) {
                array_push($obj1, $row);
            }
        }

        if($results2->num_rows < 1) {
            $obj2 = 0;
        } else {
            while($row = $results2->fetch_array()) {
                array_push($obj2, $row);
            }
        }

        if($results3->num_rows < 1) {
            $obj3 = 0;
        } else {
            while($row = $results3->fetch_array()) {
                array_push($obj3, $row);
            }
        }
        
        array_push($mainArray, $obj1);
        array_push($mainArray, $obj2);
        array_push($mainArray, $obj3);
    

        if($obj1 == 0 && $obj2 == 0 && $obj3 == 0) {
            echo "No Results";
        } else {
            echo json_encode($mainArray);
        }

    } else if(strtolower($dwm) == "weekly") {
        $query1 = $db->prepare("SELECT `total`, sumtotal, `date` FROM userMonitoring m
        INNER JOIN (SELECT  SUM(`new`) sumtotal, MIN(`date`) mindate  FROM userMonitoring GROUP BY WEEK(`date`)) t1
        ON m.`date`= t1.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query1->bind_param('ss', $from, $to);
        $query1->execute();
        $results1 = $query1->get_result();

        $query2 = $db->prepare("SELECT sumnumber, sumvoice, `date` FROM messageMonitoring m
        INNER JOIN (SELECT  SUM(`number`) sumnumber, SUM(`voice`) sumvoice, MIN(`date`) mindate  FROM messageMonitoring GROUP BY WEEK(`date`)) t1
        ON m.`date`= t1.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query2->bind_param('ss', $from, $to);
        $query2->execute();
        $results2 = $query2->get_result();

        $query3 = $db->prepare("SELECT sumkicks, sumbans, summutes, sumwarns, `date` FROM moderationMonitoring m
        INNER JOIN (SELECT  SUM(`kicks`) sumkicks, SUM(`bans`) sumbans, SUM(`warns`) sumwarns, SUM(`mutes`) summutes, MIN(`date`) mindate  FROM moderationMonitoring GROUP BY WEEK(`date`)) t2
        ON m.`date`= t2.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query3->bind_param('ss', $from, $to);
        $query3->execute();
        $results3 = $query3->get_result();

        $obj1 = [];
        $obj2 = [];
        $obj3 = [];
        $mainArray = [];

        if($results1->num_rows < 1) {
            $obj1 = 0;
        } else {
            while($row = $results1->fetch_array()) {
                array_push($obj1, $row);
            }
        }

        if($results2->num_rows < 1) {
            $obj2 = 0;
        } else {
            while($row = $results2->fetch_array()) {
                array_push($obj2, $row);
            }
        }

        if($results3->num_rows < 1) {
            $obj3 = 0;
        } else {
            while($row = $results3->fetch_array()) {
                array_push($obj3, $row);
            }
        }
        
        array_push($mainArray, $obj1);
        array_push($mainArray, $obj2);
        array_push($mainArray, $obj3);
    

        if($obj1 == 0 && $obj2 == 0 && $obj3 == 0) {
            echo "No Results";
        } else {
            echo json_encode($mainArray);
        }
    } else if(strtolower($dwm) == "monthly") {
        $query1 = $db->prepare("SELECT `total`, sumtotal, `date` FROM userMonitoring m
        INNER JOIN (SELECT  SUM(`new`) sumtotal, MIN(`date`) mindate  FROM userMonitoring GROUP BY MONTH(`date`)) t1
        ON m.`date`= t1.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query1->bind_param('ss', $from, $to);
        $query1->execute();
        $results1 = $query1->get_result();

        $query2 = $db->prepare("SELECT sumnumber, sumvoice, `date` FROM messageMonitoring m
        INNER JOIN (SELECT  SUM(`number`) sumnumber, SUM(`voice`) sumvoice, MIN(`date`) mindate  FROM messageMonitoring GROUP BY MONTH(`date`)) t1
        ON m.`date`= t1.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query2->bind_param('ss', $from, $to);
        $query2->execute();
        $results2 = $query2->get_result();

        $query3 = $db->prepare("SELECT sumkicks, sumbans, summutes, sumwarns, `date` FROM moderationMonitoring m
        INNER JOIN (SELECT  SUM(`kicks`) sumkicks, SUM(`bans`) sumbans, SUM(`warns`) sumwarns, SUM(`mutes`) summutes, MIN(`date`) mindate  FROM moderationMonitoring GROUP BY MONTH(`date`)) t2
        ON m.`date`= t2.mindate
        WHERE m.`date` BETWEEN ? AND ?");
        $query3->bind_param('ss', $from, $to);
        $query3->execute();
        $results3 = $query3->get_result();

        $obj1 = [];
        $obj2 = [];
        $obj3 = [];
        $mainArray = [];

        if($results1->num_rows < 1) {
            $obj1 = 0;
        } else {
            while($row = $results1->fetch_array()) {
                array_push($obj1, $row);
            }
        }

        if($results2->num_rows < 1) {
            $obj2 = 0;
        } else {
            while($row = $results2->fetch_array()) {
                array_push($obj2, $row);
            }
        }

        if($results3->num_rows < 1) {
            $obj3 = 0;
        } else {
            while($row = $results3->fetch_array()) {
                array_push($obj3, $row);
            }
        }
        
        array_push($mainArray, $obj1);
        array_push($mainArray, $obj2);
        array_push($mainArray, $obj3);
    

        if($obj1 == 0 && $obj2 == 0 && $obj3 == 0) {
            echo "No Results";
        } else {
            echo json_encode($mainArray);
        }
    }
}

?>