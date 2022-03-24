var switchR = document.querySelector('.switchR');
var switchL = document.querySelector('.switchL');
var switchLTO = document.querySelector('#switchLTO');
var switchRTO = document.querySelector('#switchRTO');

var calendarFrom = document.querySelector('.calendarFrom');
var calendarTo = document.querySelector('.calendarTo');

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var thirtyOneDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
var thirtyDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
var leapFebDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
var normalFebDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
var lastNumber = 0;
var lastNumber2 = 0;

var thirtyOneDaysReversed = [31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var thirtyDaysReversed = [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var leapFebDaysReversed = [29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var normalFebDaysReversed = [28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

var selectedDateFrom = undefined;
var selectedDateFrom2 = undefined;

var yearIndex = {value: new Date().getFullYear()}
var monthIndex = {value: new Date().getMonth()+1}
var dayIndex = {value: new Date().getDate()}

var yearIndex2 = {value: new Date().getFullYear()}
var monthIndex2 = {value: new Date().getMonth()+1}
var dayIndex2 = {value: new Date().getDate()}

calendarFrom.value = `${yearIndex.value}-${monthIndex.value}-${dayIndex.value}`;
calendarTo.value = `${yearIndex2.value}-${monthIndex2.value}-${dayIndex2.value}`;


switchR.addEventListener('click', e => {
    var calendar_header_month = document.querySelector('#month');
    var calendar_header_year = document.querySelector('#year');

    var hopTo = null;
    if(month_names.indexOf(calendar_header_month.innerHTML) === month_names.length - 1) {
        hopTo = -11;
        yearIndex.value += 1
        calendar_header_year.innerHTML = yearIndex.value;
    }
    else hopTo = 1;
    
    monthIndex.value = month_names.indexOf(calendar_header_month.innerHTML) + hopTo
    calendar_header_month.innerHTML = month_names[monthIndex.value];
    generateCalendar(monthIndex.value, yearIndex.value);
})

switchL.addEventListener('click', e => {
    var calendar_header_month = document.querySelector('#month');
    var calendar_header_year = document.querySelector('#year');
    var hopTo = null
    if(month_names.indexOf(calendar_header_month.innerHTML) == 0) {
        hopTo = -11;
        calendar_header_year.innerHTML = yearIndex.value;
        yearIndex.value -= 1
    }
    else hopTo = 1;

    monthIndex.value = month_names.indexOf(calendar_header_month.innerHTML) - hopTo;
    calendar_header_month.innerHTML = month_names[monthIndex.value];
    generateCalendar(monthIndex.value, yearIndex.value);
})


switchRTO.addEventListener('click', e => {
    var calendar_header_month = document.querySelector('.monthTO');
    var calendar_header_year = document.querySelector('.yearTO');

    var hopTo = null;
    if(month_names.indexOf(calendar_header_month.innerHTML) === month_names.length - 1) {
        hopTo = -11;
        yearIndex2.value += 1
        calendar_header_year.innerHTML = yearIndex2.value;
    }
    else hopTo = 1;
    
    monthIndex2.value = month_names.indexOf(calendar_header_month.innerHTML) + hopTo
    calendar_header_month.innerHTML = month_names[monthIndex2.value];
    generateCalendar2(monthIndex2.value, yearIndex2.value);
})

switchLTO.addEventListener('click', e => {
    var calendar_header_month = document.querySelector('.monthTO');
    var calendar_header_year = document.querySelector('.yearTO');
    var hopTo = null
    if(month_names.indexOf(calendar_header_month.innerHTML) == 0) {
        hopTo = -11;
        calendar_header_year.innerHTML = yearIndex2.value;
        yearIndex2.value -= 1
    }
    else hopTo = 1;

    monthIndex2.value = month_names.indexOf(calendar_header_month.innerHTML) - hopTo;
    calendar_header_month.innerHTML = month_names[monthIndex2.value];
    generateCalendar2(monthIndex2.value, yearIndex2.value);
})


function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0);
}

function getFebDays(year) {
    return isLeapYear(year) ? 29 : 28;
}

let calendar = document.getElementById('fromCal');

async function generateCalendar(month, year) {
    var inputValue = calendarFrom.value.split('-')
    var calendar_days = document.querySelector('.calendar-days');
    calendar_days.innerHTML = ''
    var calendar_header_month = document.querySelector('#month');
    var calendar_header_year = document.querySelector('#year');
    var days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currDate = new Date();
    lastNumber = 0;
    calendar_header_month.innerHTML = month_names[month];
    calendar_header_year.innerHTML = year;

    var first_day = new Date(year, month, 1);
    var getDayfirstDay = first_day.getDay();

    for (let e = 0; e < days_of_month[month] + getDayfirstDay; e++) {
        if(e < getDayfirstDay) {
            lastNumber = e+1
        }
    }

    for (var i = 0; i < days_of_month[month] + getDayfirstDay; i++) {
        var day = document.createElement('div');
        day.setAttribute("onclick","selectNewDate(this, 'from');");

        if(i < getDayfirstDay) {
            var index = month - 1;
            if(index === -1) index = 11;

            day.classList.add('last-date');

            if(days_of_month[index] === 28) {
                day.innerHTML = thirtyOneDaysReversed.slice(0, lastNumber).reverse()[i]
            }
            else if(days_of_month[index] === 29) {
                day.innerHTML = leapFebDaysReversed.slice(0, lastNumber).reverse()[i]

            }
            else if(days_of_month[index] === 31) {
                day.innerHTML = thirtyOneDaysReversed.slice(0, lastNumber).reverse()[i]
            }
            else if(days_of_month[index] === 30) {
                day.innerHTML = thirtyDaysReversed.slice(0, lastNumber).reverse()[i]
            }
        }
        
        if(i >= getDayfirstDay) {
            day.innerHTML = i - getDayfirstDay + 1;
            day.classList.add('day-date-div');
            if(i - getDayfirstDay + 1 == parseInt(inputValue[2]) && year == parseInt(inputValue[0]) && month === parseInt(inputValue[1])-1) {
                day.classList.add('curr-date');
                selectedDateFrom = day
            }
            if(i - getDayfirstDay + 1 > currDate.getDate() && year >= currDate.getFullYear() && month >= currDate.getMonth()) {
                day.classList.remove('day-date-div');
                day.classList.add('next-date');
            }
            if(year >= currDate.getFullYear() && month > currDate.getMonth() || year > currDate.getFullYear()) {
                day.classList.remove('day-date-div');
                day.classList.add('next-date');
            }
        }
        calendar_days.appendChild(day);

    }

    var afterContent = 0
    if((lastNumber + days_of_month[month]) <=35) {
        afterContent = 35 - days_of_month[month] - (lastNumber)
    } else {
        afterContent = 42 - days_of_month[month] - (lastNumber)
    }

    for (var i = 0; i < afterContent; i++) {
        var day = document.createElement('div');
        day.classList.add('next-date');
        day.innerHTML = thirtyDays[i]
        calendar_days.appendChild(day);
    }
}

var currDate = new Date()
var curr_month = {value: currDate.getMonth()}
var curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)


///////////////////////////////////////////// 

async function generateCalendar2(month, year) {
    var inputValue = calendarTo.value.split('-');
    var calendar_days = document.querySelector('#calendar-daysTO');
    calendar_days.innerHTML = ''
    var calendar_header_month = document.querySelector('.monthTO');
    var calendar_header_year = document.querySelector('.yearTO');
    var days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currDate = new Date();
    lastNumber2 = 0;
    calendar_header_month.innerHTML = month_names[month];
    calendar_header_year.innerHTML = year;

    var first_day = new Date(year, month, 1);
    var getDayfirstDay = first_day.getDay();

    for (let e = 0; e < days_of_month[month] + getDayfirstDay; e++) {
        if(e < getDayfirstDay) {
            lastNumber2 = e+1
        }
    }

    for (var i = 0; i < days_of_month[month] + getDayfirstDay; i++) {
        var day = document.createElement('div');
        day.setAttribute("onclick","selectNewDate2(this, 'to');");

        if(i < getDayfirstDay) {
            var index = month - 1;
            if(index === -1) index = 11;

            day.classList.add('last-dateTO');

            if(days_of_month[index] === 28) {
                day.innerHTML = thirtyOneDaysReversed.slice(0, lastNumber2).reverse()[i]
            }
            else if(days_of_month[index] === 29) {
                day.innerHTML = leapFebDaysReversed.slice(0, lastNumber2).reverse()[i]

            }
            else if(days_of_month[index] === 31) {
                day.innerHTML = thirtyOneDaysReversed.slice(0, lastNumber2).reverse()[i]
            }
            else if(days_of_month[index] === 30) {
                day.innerHTML = thirtyDaysReversed.slice(0, lastNumber2).reverse()[i]
            }
        }
        
        if(i >= getDayfirstDay) {
            day.innerHTML = i - getDayfirstDay + 1;
            day.classList.add('day-date-divTO');
            if(i - getDayfirstDay + 1 == parseInt(inputValue[2]) && year == parseInt(inputValue[0]) && month === parseInt(inputValue[1])-1) {
                day.classList.add('curr-dateTO');
                selectedDateFrom2 = day
            }
            if(i - getDayfirstDay + 1 > currDate.getDate() && year >= currDate.getFullYear() && month >= currDate.getMonth()) {
                day.classList.remove('day-date-div');
                day.classList.add('next-date');
            }
            if(year >= currDate.getFullYear() && month > currDate.getMonth() || year > currDate.getFullYear()) {
                day.classList.remove('day-date-div');
                day.classList.add('next-date');
            }
        }
        calendar_days.appendChild(day);

    }

    var afterContent = 0
    if((lastNumber2 + days_of_month[month]) <=35) {
        afterContent = 35 - days_of_month[month] - (lastNumber2)
    } else {
        afterContent = 42 - days_of_month[month] - (lastNumber2)
    }

    for (var i = 0; i < afterContent; i++) {
        var day = document.createElement('div');
        day.classList.add('next-dateTO');
        day.innerHTML = thirtyDays[i]
        calendar_days.appendChild(day);
    }
}

var currDate2 = new Date()
var curr_month2 = {value: currDate2.getMonth()}
var curr_year2 = {value: currDate2.getFullYear()}

generateCalendar2(curr_month2.value, curr_year2.value)

/////////////////////////////////////////////

async function showCalendar(e) {
    const doc = document.getElementById(e);
    doc.style.display = 'block';
}

function selectNewDate(e, status) {
    var queryBase = document.querySelectorAll('.day-date-div');
    var query = undefined;
    queryBase.forEach(data => {
        if(data.innerHTML == e.innerHTML) {
            query = data;
            return;
        } else return
    })

    selectedDateFrom.classList.remove('curr-date');
    query.classList.add('curr-date');

    yearIndex.value = parseInt(document.querySelector('#year').innerHTML);
    monthIndex.value = month_names.indexOf(document.querySelector('#month').innerHTML)+1;
    dayIndex.value = query.innerHTML

    if(status == "from") {
        calendarFrom.value = `${yearIndex.value}-${monthIndex.value}-${dayIndex.value}`
    } else {
        calendarTo.value = `${yearIndex.value}-${monthIndex.value}-${dayIndex.value}`
    }

    selectedDateFrom = query;
    runCharts();
}

calendarFrom.addEventListener('change', e => {
    var inputValue = calendarFrom.value.split('-')
    var days_of_month = [31, getFebDays(parseInt(inputValue[0])), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(inputValue[0] > 275760 || inputValue[0] < 1970) return
    if(inputValue[1] > 12 || inputValue[1] < 1) return
    if(inputValue[2] > days_of_month[parseInt(inputValue[1]) - 1]) return
    if(isNaN(inputValue[0]) || isNaN(inputValue[1]) || isNaN(inputValue[2])) return

    generateCalendar(inputValue[1]-1, inputValue[0])
    

    var queryBase = document.querySelectorAll('.day-date-div');
    var query = undefined;
    queryBase.forEach(data => {
        if(data.innerHTML == inputValue[2]) {
            query = data;
            return;
        } else return
    })

    selectedDateFrom.classList.remove('curr-date');
    query.classList.add('curr-date');

    selectedDateFrom = query;
    yearIndex.value = parseInt(inputValue[0])
    monthIndex.value = parseInt(inputValue[1])
    runCharts()

})


function selectNewDate2(e, status) {
    var queryBase = document.querySelectorAll('.day-date-divTO');
    var query = undefined;
    queryBase.forEach(data => {
        if(data.innerHTML == e.innerHTML) {
            query = data;
            return;
        } else return
    })

    selectedDateFrom2.classList.remove('curr-dateTO');
    query.classList.add('curr-dateTO');

    yearIndex2.value = parseInt(document.querySelector('.yearTO').innerHTML);
    monthIndex2.value = month_names.indexOf(document.querySelector('.monthTO').innerHTML)+1;
    dayIndex2.value = query.innerHTML

    if(status == "to") {
        calendarTo.value = `${yearIndex2.value}-${monthIndex2.value}-${dayIndex2.value}`
    }

    selectedDateFrom2 = query;
    runCharts()
}


calendarTo.addEventListener('change', e => {
    var inputValue = calendarTo.value.split('-')
    var days_of_month = [31, getFebDays(parseInt(inputValue[0])), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(inputValue[0] > 275760 || inputValue[0] < 1970) return
    if(inputValue[1] > 12 || inputValue[1] < 1) return
    if(inputValue[2] > days_of_month[parseInt(inputValue[1]) - 1]) return
    if(isNaN(inputValue[0]) || isNaN(inputValue[1]) || isNaN(inputValue[2])) return

    generateCalendar2(inputValue[1]-1, inputValue[0])
    

    var queryBase = document.querySelectorAll('.day-date-divTO');
    var query = undefined;
    queryBase.forEach(data => {
        if(data.innerHTML == inputValue[2]) {
            query = data;
            return;
        } else return
    })

    selectedDateFrom2.classList.remove('curr-dateTO');
    query.classList.add('curr-dateTO');

    selectedDateFrom2 = query;
    yearIndex2.value = parseInt(inputValue[0])
    monthIndex2.value = parseInt(inputValue[1])

    runCharts()
})


$(document).click(function(e) {
    if($(e.target).closest("#fromCal").length === 0 && $(e.target).closest('#calendariconFrom').length === 0) {
        $('#fromCal').hide();
    }

    if($(e.target).closest("#toCal").length === 0 && $(e.target).closest('#calendariconTo').length === 0) {
        $('#toCal').hide();
    }
});
