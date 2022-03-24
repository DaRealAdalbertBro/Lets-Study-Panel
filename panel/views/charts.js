const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function runCharts() {
    var dwm = document.querySelector('#dropbtn');
    var to = document.querySelector('#calendarTo');
    var from = document.querySelector('#calendarFrom');
    var isSuccessLoad = false;
    var serverData = new Array;
    await $.ajax({
        type: "POST",
        url: "./views/panel/data/getData",
        data: {dwm: dwm.innerText, to: to.value, from: from.value},
        cache: false,
        success: function(data) {
            isSuccessLoad = true;
            if(data == "No Results") {
                serverData = "No Results";
            } else serverData = JSON.parse(data);
        },
        error: function(xhr, status, error) {
            console.error(xhr);
            isSuccessLoad = false;
        }
    })

    if(isSuccessLoad == true) {

        var dateMembers = new Array;
        var totalMembers = new Array;
        var newMembers = new Array;

        var dateActivity = new Array;
        var msgActivity = new Array;
        var voiceActivity = new Array;

        var dateModeration = new Array;
        var kicksModeration = new Array;
        var bansModeration = new Array;
        var warnsModeration = new Array;
        var mutesModeration = new Array;

        if(serverData == "No Results") {
            const ctx1 = document.getElementById('memberCount');
            const ctx2 = document.getElementById('messageCount');
            const ctx3 = document.getElementById('moderationCount');
            ctx1.style.display = "none";
            ctx2.style.display = "none";
            ctx3.style.display = "none";

            const ctx11 = document.getElementById('noresults');
            const ctx22 = document.getElementById('noresults2');
            const ctx33 = document.getElementById('noresults3');
            ctx11.style.display = "flex";
            ctx22.style.display = "flex";
            ctx33.style.display = "flex";
        } else {
            if(serverData[0] !== 0) {
                serverData[0].forEach(set => {
                    totalMembers.push(set.total);
                    newMembers.push(set.sumtotal);
                    var newDate = months[parseInt(set.date.split('-')[1])-1] + " " + set.date.split('-')[2];
                    dateMembers.push(newDate);
                });
            }

            if(serverData[1] !== 0) {
                serverData[1].forEach(set => {
                    msgActivity.push(set.sumnumber);
                    voiceActivity.push(set.sumvoice);
                    var newDate = months[parseInt(set.date.split('-')[1])-1] + " " + set.date.split('-')[2];
                    dateActivity.push(newDate);
                });
            }

            if(serverData[2] !== 0) {
                serverData[2].forEach(set => {
                    kicksModeration.push(set.sumkicks);
                    bansModeration.push(set.sumbans);
                    warnsModeration.push(set.sumwarns);
                    mutesModeration.push(set.summutes);
                    var newDate = months[parseInt(set.date.split('-')[1])-1] + " " + set.date.split('-')[2];
                    dateModeration.push(newDate);
                });
            }

            var dateLabels = dateMembers;
            var dateLabels2 = dateActivity;
            var dateLabels3 = dateModeration;

            if(window.innerWidth <= 1080) {
                windowSizeChart = 4;
            } else windowSizeChart = dateLabels.length
            if(window.innerWidth <= 1080) {
                windowSizeChart2 = 4;
            } else windowSizeChart2 = dateLabels2.length
            if(window.innerWidth <= 1080) {
                windowSizeChart3 = 4;
            } else windowSizeChart3 = dateLabels3.length
        
            if(memberChart !== undefined) memberChart.destroy();
            if(activityChart !== undefined) activityChart.destroy();
            if(moderationChart !== undefined) moderationChart.destroy();
        
            if(serverData[0] == 0) {
                const ctx1 = document.getElementById('noresults');
                ctx1.innerText = "No Results";
                ctx1.style.display = "flex";
            } else {
                const ctx11 = document.getElementById('noresults');
                const ctx1 = document.getElementById('memberCount');
                ctx11.style.display = "none";
                ctx1.style.display = "block";
                memberChart = new Chart(ctx1, {
                    data: {
                        datasets: [
                            {
                                type: 'line',
                                label: " Total Members",
                                data: totalMembers,
                                backgroundColor: [
                                    'rgba(54, 85, 179, 0.3)',
                                ],
                                borderColor: [
                                    'rgba(259, 259, 259, 0.8)',
                                ],
                                borderWidth: 1,
                                fill: true,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(249, 249, 249, 1)',
                                pointHoverBorderColor: 'rgba(249, 249, 249, 0.4)',
                            }, {
                                type: 'bar',
                                label: " New Users",
                                data: newMembers,
                                backgroundColor: [
                                    'rgba(255, 155, 90, 0.8)'
                                ],
                                borderColor: [
                                    'rgba(255, 154, 54, 0)'
                                ],
                                borderWidth: 1,
                            }
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        scales: {
                            x: {
                                grid: {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0)'
                                },
                                
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    autoSkip: true,
                                },
                                labels: dateLabels.slice(0, windowSizeChart)
                            },
                            
                            y: {
                                grid: {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.05)',
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: '200',
                                    autoSkip: true,
                                    maxTicksLimit: 5
                                },
                            }
                        },
                        plugins: {
                            responsive: true,
                            legend: {
                                display: true,
                                align: 'center',
                                position: 'bottom',
                                labels: {
                                    color: "rgba(249, 249, 249, 0.5)",
                                    padding: 40,
                                },
                            },
                            tooltip: {
                                intersect: false,
                                usePointStyle: true,
                                titleColor: "rgba(249, 249, 249, 1)",
                                backgroundColor: '#18191c',
                                titleSpacing: 0,
                                padding: 14,
                                color: "rgba(249, 249, 249, 0.5)",
                                bodySpacing: 6,
                                displayColors: true,
                                callbacks: {
                                    labelPointStyle: function(context) {
                                        return {
                                            pointStyle: 'dot',
                                            rotation: 0,
                                        };
                                    },
                                    labelTextColor: function(context) {
                                        return 'rgba(249, 249, 249, 0.7)';
                                    },
                                }
                            }
                        }
                    }
                });

            }

            if(serverData[1] == 0) {
                const ctx2 = document.getElementById('noresults2');
                ctx2.innerText = "No Results";
                ctx2.style.display = "flex";
            } else {
                const ctx2 = document.getElementById('messageCount');
                const ctx22 = document.getElementById('noresults2');
                ctx2.style.display = "block";
                ctx22.style.display = "none";
                activityChart = new Chart(ctx2, {
                    data: {
                        datasets: [
                            {
                                type: 'line',
                                label: " Messages",
                                data: msgActivity,
                                backgroundColor: [
                                    'rgba(45, 142, 232, 0.8)',
                                ],
                                borderColor: [
                                    'rgba(45, 142, 232, 0.7)',
                                ],
                                borderWidth: 1,
                                fill: false,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(45, 142, 232, 1)',
                                pointHoverBorderColor: 'rgba(45, 142, 232, 0.4)',
                                animation: {
                                    duration: 1000
                                },
                            }, {
                                type: 'line',
                                label: " Voice Activity",
                                data: voiceActivity,
                                backgroundColor: [
                                    'rgba(255, 155, 90, 0.8)',
                                ],
                                borderColor: [
                                    'rgba(255, 155, 90, 0.7)',
                                ],
                                borderWidth: 1,
                                fill: false,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(255, 155, 90, 1)',
                                pointHoverBorderColor: 'rgba(255, 155, 90, 0.4)',
                                animation: {
                                    duration: 1000
                                },
                            }
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        scales: {
                            x: {
                                grid: {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0)'
                                },
                                
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    autoSkip: true,
                                },
                                labels: dateLabels2.slice(0, windowSizeChart2)
                            },
                            
                            y: {
                                grid: {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.05)',
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: '200',
                                    autoSkip: true,
                                    maxTicksLimit: 5
                                },
                            }
                        },
                        plugins: {
                            responsive: true,
                            legend: {
                                display: true,
                                align: 'center',
                                position: 'bottom',
                                labels: {
                                    color: "rgba(249, 249, 249, 0.5)",
                                    padding: 40,
                                },
                            },
                            tooltip: {
                                intersect: false,
                                usePointStyle: true,
                                titleColor: "rgba(249, 249, 249, 1)",
                                backgroundColor: '#18191c',
                                titleSpacing: 0,
                                padding: 14,
                                color: "rgba(249, 249, 249, 0.5)",
                                bodySpacing: 6,
                                displayColors: true,
                                callbacks: {
                                    labelPointStyle: function(context) {
                                        return {
                                            pointStyle: 'dot',
                                            rotation: 0,
                                        };
                                    },
                                    labelTextColor: function(context) {
                                        return 'rgba(249, 249, 249, 0.7)';
                                    },
                                }
                            }
                        }
                    }
                });
            }
            
            if(serverData[2] == 0) {
                const ctx3 = document.getElementById('noresults3');
                ctx3.innerHTML = "No Results";
                ctx3.style.display = "flex";
            } else {
                const ctx33 = document.getElementById('noresults3');
                const ctx3 = document.getElementById('moderationCount');
                ctx3.style.display = "block";
                ctx33.style.display = "none";
                moderationChart = new Chart(ctx3, {
                    data: {
                        datasets: [
                            {
                                type: 'line',
                                label: " Warns",
                                data: warnsModeration,
                                backgroundColor: [
                                    'rgba(7, 181, 33, 0.8)',
                                ],
                                borderColor: [
                                    'rgba(7, 181, 33, 0.7)',
                                ],
                                borderWidth: 1,
                                fill: false,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(7, 181, 33, 1)',
                                pointHoverBorderColor: 'rgba(7, 181, 33, 0.4)',
                                animation: {
                                    duration: 1000
                                },
                            },
                            {
                                type: 'line',
                                label: " Mutes",
                                data: mutesModeration,
                                backgroundColor: [
                                    'rgba(207, 43, 52, 0.8)',
                                ],
                                borderColor: [
                                    'rgba(207, 43, 52, 0.7)',
                                ],
                                borderWidth: 1,
                                fill: false,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(207, 43, 52, 1)',
                                pointHoverBorderColor: 'rgba(207, 43, 52, 0.4)',
                                animation: {
                                    duration: 1000
                                },
                            },
                            {
                                type: 'line',
                                label: " Bans",
                                data: bansModeration,
                                backgroundColor: [
                                    'rgba(45, 142, 232, 0.8)',
                                ],
                                borderColor: [
                                    'rgba(45, 142, 232, 0.7)',
                                ],
                                borderWidth: 1,
                                fill: false,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(45, 142, 232, 1)',
                                pointHoverBorderColor: 'rgba(45, 142, 232, 0.4)',
                                animation: {
                                    duration: 1000
                                },
                            }, {
                                type: 'line',
                                label: " Kicks",
                                data: kicksModeration,
                                backgroundColor: [
                                    'rgba(255, 155, 90, 0.8)',
                                ],
                                borderColor: [
                                    'rgba(255, 155, 90, 0.7)',
                                ],
                                borderWidth: 1,
                                fill: false,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: 'rgba(255, 155, 90, 1)',
                                pointHoverBorderColor: 'rgba(255, 155, 90, 0.4)',
                                animation: {
                                    duration: 1000
                                },
                            }
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        scales: {
                            x: {
                                grid: {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0)'
                                },
                                
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    autoSkip: true,
                                },
                                labels: dateLabels3.slice(0, windowSizeChart3)
                            },
                            
                            y: {
                                grid: {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.05)',
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: '200',
                                    autoSkip: true,
                                    maxTicksLimit: 5
                                },
                            }
                        },
                        plugins: {
                            responsive: true,
                            legend: {
                                display: true,
                                align: 'center',
                                position: 'bottom',
                                labels: {
                                    color: "rgba(249, 249, 249, 0.5)",
                                    padding: 40,
                                },
                            },
                            tooltip: {
                                intersect: false,
                                usePointStyle: true,
                                titleColor: "rgba(249, 249, 249, 1)",
                                backgroundColor: '#18191c',
                                titleSpacing: 0,
                                padding: 14,
                                color: "rgba(249, 249, 249, 0.5)",
                                bodySpacing: 6,
                                displayColors: true,
                                callbacks: {
                                    labelPointStyle: function(context) {
                                        return {
                                            pointStyle: 'dot',
                                            rotation: 0,
                                        };
                                    },
                                    labelTextColor: function(context) {
                                        return 'rgba(249, 249, 249, 0.7)';
                                    },
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}

runCharts()