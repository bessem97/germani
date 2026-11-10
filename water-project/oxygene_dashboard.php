<?php
// Simple dashboard that loads JSON from oxygene.php and displays it as a table
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard Oxygène</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;margin:20px}
    table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #ddd;padding:8px;text-align:left}
    th{background:#f2f2f2}
  </style>
</head>
<body>
  <h1>Mesures Oxygène - ligne1</h1>
  <p>Source: <code>oxygene.php</code> (JSON)</p>
  <button id="refresh">Actualiser</button>
  <table id="data-table">
    <thead>
      <tr>
        <th>Date / Heure</th>
        <th>DO (mg/L)</th>
        <th>Température (°C)</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script>
    async function loadData(){
      const resp = await fetch('oxygene.php');
      if(!resp.ok){
        alert('Erreur: impossible de charger les données');
        return;
      }
      const rows = await resp.json();
      const tbody = document.querySelector('#data-table tbody');
      tbody.innerHTML = '';
      rows.forEach(r => {
        const tr = document.createElement('tr');
        const d1 = document.createElement('td'); d1.textContent = r.date_heure;
        const d2 = document.createElement('td'); d2.textContent = r.do_mgl;
        const d3 = document.createElement('td'); d3.textContent = r.temperature;
        tr.appendChild(d1); tr.appendChild(d2); tr.appendChild(d3);
        tbody.appendChild(tr);
      });
    }

    document.getElementById('refresh').addEventListener('click', loadData);
    // Auto-load on open
    loadData();
    // Optional: auto-refresh every 30s
    // setInterval(loadData, 30000);
  </script>
</body>
</html>
