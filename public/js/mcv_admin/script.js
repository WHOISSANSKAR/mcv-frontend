document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("Table");
  const tbody = table.querySelector("tbody");
  const allRows = Array.from(tbody.querySelectorAll("tr"));
  const pagination = document.getElementById("pagination");
  const searchInputs = document.querySelectorAll(".search-input");

  let currentPage = 1;
  const rowsPerPage = 7;
  let filteredRows = [...allRows];

  function renderTable() {
    tbody.innerHTML = "";
    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    filteredRows.slice(start, end).forEach(row => tbody.appendChild(row));
    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = "";
    let pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
      let btn = document.createElement("button");
      btn.innerText = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(btn);
    }
  }

  // Sorting
  table.querySelectorAll("thead th").forEach((th, index) => {
    th.addEventListener("click", () => {
      let sorted = [...filteredRows].sort((a, b) => {
        let valA = a.children[index].innerText.toLowerCase();
        let valB = b.children[index].innerText.toLowerCase();
        return valA.localeCompare(valB, "en", { numeric: true });
      });
      if (th.classList.contains("asc")) {
        sorted.reverse();
        th.classList.remove("asc");
        th.classList.add("desc");
      } else {
        th.classList.remove("desc");
        th.classList.add("asc");
      }
      filteredRows = sorted;
      currentPage = 1;
      renderTable();
    });
  });

  // 🔹 Inline search filtering
  searchInputs.forEach(input => {
    input.addEventListener("input", () => {
      let filters = {};
      searchInputs.forEach(inp => {
        if (inp.value.trim() !== "") {
          filters[inp.dataset.col] = inp.value.toLowerCase();
        }
      });

      filteredRows = allRows.filter(row => {
        return Object.keys(filters).every(colIndex => {
          return row.children[colIndex].innerText.toLowerCase().includes(filters[colIndex]);
        });
      });

      currentPage = 1;
      renderTable();
    });
  });

  renderTable();
});



// ---------------- ESG Risk Level Distribution ----------------
const riskColors = ['#254326ff', '#507427ff', '#258130ff', '#20b622ff', '#2e9833ff'];
const riskData = [188, 183, 79, 50, 16];
const riskLabels = ['Low', 'Medium', 'Negligible', 'High', 'Severe'];

const ctx1 = document.getElementById('riskLevelChart').getContext('2d');
new Chart(ctx1, {
  type: 'doughnut',
  data: {
    labels: riskLabels,
    datasets: [{
      data: riskData,
      backgroundColor: riskColors
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }, 
      datalabels: {
        color: '#ffffffff',
        formatter: (value) => value 
      }
    }
  },
  plugins: [ChartDataLabels]
});

// ---------------- Custom Legend for ESG Risk ----------------
const riskLegend = document.getElementById('riskLegend');


const riskHeading = document.createElement('div');
riskHeading.style.fontWeight = 'bold';
riskHeading.style.color = '#000';
riskHeading.textContent = 'ESG Risk Level';
riskLegend.appendChild(riskHeading);


riskLabels.forEach((label, i) => {
  const item = document.createElement('span');
  item.innerHTML = `<i style="
    background:${riskColors[i]};
    display:inline-block;
    width:14px;
    height:14px;
    margin-right:8px;
    border-radius:3px;
  "></i> ${label}`;
  riskLegend.appendChild(item);
});



// ---------------- Controversy Pie ----------------
const controversyColors = ['#203521ff', '#387d2fff', '#42a547ff', '#7ebb3dff', '#388E3C', '#090909ff'];
const controversyLabels = ['Severe', 'High', 'Significant', 'Moderate', 'Low', 'None'];
const controversyData = [36.75, 24.83, 16.52, 10.92, 6.34, 4.64];

const ctx2 = document.getElementById('controversyChart').getContext('2d');
new Chart(ctx2, {
  type: 'pie',
  data: {
    labels: controversyLabels,
    datasets: [{
      data: controversyData,
      backgroundColor: controversyColors
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }, 
      datalabels: {
        color: '#fff',
        formatter: (value) => value.toFixed(1)
      }
    }
  },
  plugins: [ChartDataLabels]
});


const controversyLegend = document.getElementById('controversyLegend');


const heading = document.createElement('div');
heading.style.fontWeight = 'bold';
heading.style.color = '#000';
heading.textContent = 'Controversy Level';
controversyLegend.appendChild(heading);


controversyLabels.forEach((label, i) => {
  const item = document.createElement('span');
  item.innerHTML = `<i style="background:${controversyColors[i]}"></i> ${label}`;
  controversyLegend.appendChild(item);
});


// ---------------- Employee Count Line ----------------
const ctx3 = document.getElementById('employeeChart').getContext('2d');
new Chart(ctx3, {
  type: 'line',
  data: {
    labels: ['0-10k', '10k-50k', '50k-100k', '100k-200k', '200k-500k'],
    datasets: [{
      label: 'Avg Risk Score',
      data: [400, 350, 280, 250, 200],
      borderColor: '#359A15',
      backgroundColor: 'rgba(53,154,21,0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        align: 'top',
        color: '#000',
        formatter: (value) => value
      }
    }
  },
  plugins: [ChartDataLabels]
});


// ---------------- Sector Bar ----------------
const ctx4 = document.getElementById('sectorChart').getContext('2d');
new Chart(ctx4, {
  type: 'bar',
  data: {
    labels: ['Energy', 'Basic Materials', 'Utilities', 'Industrials', 'Tech'],
    datasets: [{
      label: 'Avg ESG Score',
      data: [32.34, 26.72, 26.71, 25.45, 19.23],
      backgroundColor: '#359A15'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        formatter: (value) => value.toFixed(2)
      }
    }
  },
  plugins: [ChartDataLabels]
});


// ---------------- Industry Horizontal Bar ----------------
const ctx5 = document.getElementById('industryChart').getContext('2d');
new Chart(ctx5, {
  type: 'bar',
  data: {
    labels: ['Oil & Gas', 'Banks', 'Insurance', 'Telecom', 'Retail'],
    datasets: [{
      label: 'Avg ESG Score',
      data: [36, 35, 33, 32, 30],
      backgroundColor: '#4CAF50'
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'right',
        formatter: (value) => value
      }
    }
  },
  plugins: [ChartDataLabels]
});
