<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $tableName = "users";
    $columns = ['user_name', 'user_id', 'user_permissions'];

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
            $query = "SELECT ".$columnName." FROM $tableName"." ORDER BY id ASC LIMIT 3;";
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


<div class="accountsPanel" id="accountsPanel">
    <h1 class="cTitle" style="margin-bottom: 24px;">Manage Accounts</h1>
    <table>
        <tbody id="accountTable">
        <tr>
            <th class="tableTitle">Username</th>
            <th class="tableTitle">ID</th>
            <th class="tableTitle">Permissions</th>
            <th class="tableTitle">New Pass</th>
        </tr>
        <?php
            if(is_array($fetchData)){      
                $sn=1;
                foreach($fetchData as $data){
        ?>
        <tr>
            <td><?php echo '<input maxlength="64" minlength="4" onkeyup="cleanUsername(this)" onkeydown="cleanUsername(this)" onchange="canSaveChanges(this)" id="' . $data['user_name'] . '" name="nameOfUser" type="text" value="' . $data['user_name'] .'">' ?></td>
            <td><?php echo $data['user_id']; ?></td>
            <td class="<?php echo $data['user_permissions']?>"><?php echo $data['user_permissions'] . '<i id="dropicon2" class="fas fa-exchange-alt" onclick="changeRole(this, this.parentElement.parentElement.childNodes[3], this.parentElement.className)"></i>'; ?></td>
            <td><?php echo '<input onpaste="return false;" ondrop="return false;" maxlength="255" minlength="8" onchange="canSaveChanges(this)" name="newpass" type="password" id="newpasswordInput">' ?><i id="showpass" onclick="showPassword(this)" class="far fa-eye-slash"></i></td>
            <td><?php echo '<i onclick="showWarning();removingUser=true;currentUser=this;" class="far fa-times-circle" id="removeFromUsers"></i>'?></td>
        </tr>
        <?php
            $sn++;}}else{
        ?>
        <tr>
        <td colspan="8">
    <?php echo $fetchData; ?>
  </td>
  <?php
    }?>
        </tbody>

    </table>
    <p id="thisiawhdj">ㅤ</p>
    <input class="save disabled" type="submit" name="save" id="save" value="Save Changes">
    <button id="addNew" onclick="showWarning('addNew');addingUser=true;currentUser=this;">Create New</button>
</div>

<?php
$db->close();
?>