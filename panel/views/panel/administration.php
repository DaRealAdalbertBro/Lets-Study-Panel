<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$tableName = "administration";
$columns = ['id', 'action', 'author', 'date', 'ip', 'time', 'location'];

$fetchData = fetch_data($db, $tableName, $columns);

function fetch_data($db, $tableName, $columns){
    if(empty($db)){
        $msg= "Database connection error";
    }elseif (empty($columns) || !is_array($columns)) {
        $msg="columns Name must be defined in an indexed array";
    }elseif(empty($tableName)){
        $msg= "Table Name is empty";
    }else{
    $columnName = implode(", ", $columns);
    if($tableName == "administration") {
        $query = "SELECT ".$columnName." FROM $tableName"." ORDER BY id DESC LIMIT 10;";
    } else if ($tableName == "users") {
        $query = "SELECT ".$columnName." FROM $tableName".";";
    }

    $result = $db->query($query);
    
    if($result== true){ 
        if ($result->num_rows > 0) {
            $row= mysqli_fetch_all($result, MYSQLI_ASSOC);
            $msg= $row;
        } else {
            $msg= "No Data Found"; 
        }
        }else{
            $msg= mysqli_error($db);
        }
        }
        return $msg;
    }
?>

<div class="administrationPanel" id="administrationPanel">
    <h1 class="cTitle">Administration</h1>
    <table>
        <tbody id="tbodyAdminisration">
            <tr id="tableTitle">
                <th class="tableTitle">ACTION</th>
                <th class="tableTitle">TIME</th>
                <th class="tableTitle">AUTHOR</th>
                <th class="tableTitle">IP</th>
                <th class="tableTitle">LOCATION</th>
                <th class="tableTitle">ID</th>
            </tr>
            <tr>
            <?php
            if(is_array($fetchData)){      
                $sn=1;
                foreach($fetchData as $data){
            ?>
            <td><?php echo $data['action']; ?></td>
            <td><?php echo substr($data['date'], 2) . "⠀" . $data['time']?></td>
            <td><?php echo $data['author']; ?></td>
            <td><?php echo $data['ip']; ?></td>
            <td id="location"><?php echo $data['location'];?></td>
            <td><?php echo $data['id']; ?></td>
        </tr>
        <?php
            $sn++;}}else{
        ?>
        <tr>
        <td colspan="8"><?php echo $fetchData; ?></td>
        </tr>
  <?php
    }?>
    <tr id="tableArrows">
        <td style="position:absolute;margin-left:12px;margin-top:12px;cursor:pointer;font-size:20px" onclick="pagingPrev()"><i class="far fa-arrow-alt-circle-left"></i></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="position:absolute;margin-left:32px;margin-top:12px;cursor:pointer;font-size:20px" onclick="pagingNext()"><i class="far fa-arrow-alt-circle-right"></i></td>
        </tr>
        </tbody>
    </table>
</div>

<?php
$db->close();
?>