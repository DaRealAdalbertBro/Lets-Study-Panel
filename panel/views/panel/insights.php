<?php
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
?>

<div class="serverData" id="serverData">
    <div class="settings" id="settings">
        <h1 class="sTitle">Settings</h1>
        <div class="dropdown" id="dropdown" onclick="showDropdownData()">
            <button id="dropbtn" class="dropbtn">Daily</button><i id="dropicon" class="fas fa-caret-down"></i>
            <div id="interval" class="dropdown-content">
                <a id="daily" onclick="changeInterval(this)">Daily</a>
                <a id="weekly" onclick="changeInterval(this)">Weekly</a>
                <a id="monthly" onclick="changeInterval(this)">Monthly</a>
            </div>
            </div>
        <span class="text">FROM</span>

        <div class="from" id="from">
            <input id="calendarFrom" class="calendarFrom" type="text" value="----  --  --" autocomplete="off"></input><i id="calendariconFrom" class="fas fa-calendar-day" onclick="showCalendar('fromCal')"></i>
            <div class="container" id="fromCal">
                <div id="titleMonth">
                    <span class="switchL"><i class="fas fa-chevron-left"></i></span>
                    <div class="dateTitle">
                        <div id="month">xxxxxxxx</div>
                        <span>-</span>
                        <div id="year">xxxx</div>
                    </div>
                    <span class="switchR"><i class="fas fa-chevron-right"></i></span>
                </div>
                <div class="calendar-body">
                    <div class="days">
                        <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                    </div>
                    <div class="calendar-days" id="calendar-days">
                        <div class="last-date">-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div class="next-date">-</div><div class="next-date">-</div><div class="next-date">-</div><div class="next-date">-</div>
                    </div>
                </div>
            </div>
        </div>
        <span class="text">TO</span>
        <div class="to" id="to">
            <input id="calendarTo" class="calendarTo" type="text" value="----  --  --" autocomplete="off"></input><i id="calendariconTo" class="fas fa-calendar-day" onclick="showCalendar('toCal')"></i>
            <div class="container" id="toCal">
                <div id="titleMonth">
                    <span class="switchL" id="switchLTO"><i class="fas fa-chevron-left"></i></span>
                    <div class="dateTitle">
                        <div id="month" class="monthTO">xxxxxxxx</div>
                        <span>-</span>
                        <div id="year" class="yearTO">xxxx</div>
                    </div>
                    <span class="switchR" id="switchRTO"><i class="fas fa-chevron-right"></i></span>
                </div>
                <div class="calendar-body">
                    <div class="days">
                        <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                    </div>
                    <div class="calendar-days" id="calendar-daysTO">
                        <div class="last-dateTO">-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div>-</div><div class="next-dateTO">-</div><div class="next-dateTO">-</div><div class="next-dateTO">-</div><div class="next-dateTO">-</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="analytics">
        <h1 class="cTitle">Analytics</h1>
        <div class="container">
            <div class="chart-canvas">
            <div id="noresults"><p>No Results</p></div>
                <canvas id="memberCount" height='400'></canvas>
            </div>
        </div>
        <div class="secc">
            <div class="sec">
                <div class="container">
                    <div class="chart-canvas">
                    <div id="noresults2"><p>No Results</p></div>
                        <canvas id="messageCount" height='400'></canvas>
                    </div>
                </div>
                <div class="container">
                    <div class="chart-canvas">
                    <div id="noresults3"><p>No Results</p></div>
                        <canvas id="moderationCount" height='400'></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="./views/charts.js"></script>
<script src="./views/calendar.js"></script>