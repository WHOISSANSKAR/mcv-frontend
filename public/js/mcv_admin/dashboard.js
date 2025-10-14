document.addEventListener("DOMContentLoaded", function () {
    // ===== PIE CHART =====
    const ctxEl = document.getElementById("pieChart");
    if (ctxEl) {
        const ctx = ctxEl.getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Correct", "Incorrect", "Unidentified"],
                datasets: [{
                    data: [64, 20, 16],
                    backgroundColor: ["#5e7ca8", "#778dc0", "#8e99fb"],
                    borderWidth: 1,
                    borderColor: "#fff"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        align: "center",
                        labels: {
                            color: "#ffffff",
                            boxWidth: 14,
                            padding: 18,
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    // ===== FULLCALENDAR =====
    const calendarEl = document.getElementById("calendar");
    const today = new Date().toISOString().split("T")[0];

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            selectable: true,
            height: "auto",
            contentHeight: "auto",
            expandRows: true,
            dayMaxEventRows: true,
            headerToolbar: {
                left: "title",
                center: "",
                right: "prev,next"
            },
            events: [
                {
                    start: today,
                    display: "background",
                    backgroundColor: "#808080"
                }
            ]
        });

        calendar.render();
    }
});
