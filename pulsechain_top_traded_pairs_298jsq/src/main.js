import data from './data.json';
    import { Chart } from 'chart.js/auto';
    import Web3 from 'web3';

    const pairsTableBody = document.getElementById('pairsTableBody');
    const filterInput = document.getElementById('filterInput');
    const newsList = document.getElementById('newsList');
    const volumeChartCanvas = document.getElementById('volumeChart');

    // PulseChain network details
    const pulsechainNetwork = {
      name: 'PulseChain',
      rpcUrl: 'https://rpc.pulsechain.com',
      chainId: 369,
      currencySymbol: 'PLS',
      blockExplorer: 'https://otter.pulsechain.com',
      publicNodeRpc: 'https://pulsechain-rpc.publicnode.com',
      g4mm4Rpc: 'https://rpc-pulsechain.g4mm4.io'
    };

    // Initialize Web3 (will not connect in this environment)
    const web3 = new Web3(pulsechainNetwork.rpcUrl);
    console.log('Web3 instance created:', web3);

    let currentData = [...data.pairs];

    function renderTable() {
      pairsTableBody.innerHTML = '';
      currentData.forEach(pair => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${pair.pair}</td>
          <td>$${pair.volume.toLocaleString()}</td>
          <td>$${pair.liquidity.toLocaleString()}</td>
          <td>$${pair.price.toLocaleString()}</td>
        `;
        pairsTableBody.appendChild(row);
      });
    }

    function renderNews() {
      newsList.innerHTML = '';
      data.news.forEach(newsItem => {
        const listItem = document.createElement('li');
        listItem.textContent = newsItem;
        newsList.appendChild(listItem);
      });
    }

    function filterPairs() {
      const filterText = filterInput.value.toLowerCase();
      currentData = data.pairs.filter(pair =>
        pair.pair.toLowerCase().includes(filterText)
      );
      renderTable();
    }

    function sortTable(column) {
        currentData.sort((a, b) => {
            if (typeof a[column] === 'number') {
                return b[column] - a[column];
            } else {
                return a[column].localeCompare(b[column]);
            }
        });
        renderTable();
    }

    function renderChart() {
      const labels = data.pairs.map(pair => pair.pair);
      const volumes = data.pairs.map(pair => pair.volume);

      new Chart(volumeChartCanvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Trading Volume (USD)',
            data: volumes,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    filterInput.addEventListener('input', filterPairs);

    document.querySelectorAll('th[data-sort]').forEach(header => {
      header.addEventListener('click', () => {
        const column = header.getAttribute('data-sort');
        sortTable(column);
      });
    });

    renderTable();
    renderNews();
    renderChart();
