// Carrega JSON e monta tabela + gráficos
const state = {
  rows: [],
  table: null,
  chartTema: null,
  chartODS: null
};

function uniqueSorted(arr) {
  return [...new Set(arr.filter(Boolean))].sort((a,b) => a.localeCompare(b, 'pt-BR'));

}

function countBy(arr, key) {
  const map = new Map();
  for (const r of arr) {
    const k = (r[key] || '').trim();
    if (!k) continue;
    map.set(k, (map.get(k) || 0) + 1);
  }
  return map;
}

function updateCharts(rows) {
  // Tema
  const temaMap = countBy(rows, 'tema');
  const temaLabels = [...temaMap.keys()];
  const temaData = [...temaMap.values()];

  // ODS
  const odsMap = countBy(rows, 'ods');
  const odsLabels = [...odsMap.keys()];
  const odsData = [...odsMap.values()];

  // Chart Tema
  if (state.chartTema) state.chartTema.destroy();
  state.chartTema = new Chart(document.getElementById('chartTema'), {
    type: 'bar',
    data: { labels: temaLabels, datasets: [{ label: 'Indicadores', data: temaData }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Chart ODS
  if (state.chartODS) state.chartODS.destroy();
  state.chartODS = new Chart(document.getElementById('chartODS'), {
    type: 'doughnut',
    data: { labels: odsLabels, datasets: [{ label: 'Indicadores', data: odsData }] },
    options: { responsive: true }
  });
}

function applyFilters() {
  const tema = $('#f-tema').val();
  const ods = $('#f-ods').val();
  const subtema = $('#f-subtema').val();
  const busca = ($('#f-busca').val() || '').toLowerCase();

  const filtered = state.rows.filter(r => {
    if (tema && r.tema !== tema) return false;
    if (ods && r.ods !== ods) return false;
    if (subtema && r.subtema !== subtema) return false;
    if (busca) {
      const hay = `${r.tema} ${r.subtema} ${r.indicador} ${r.descricao} ${r.ods} ${r.fonte} ${r.eixo}`.toLowerCase();
      if (!hay.includes(busca)) return false;
    }
    return true;
  });

  // Atualiza tabela
  state.table.clear();
  state.table.rows.add(filtered.map(r => [r.id, r.tema, r.subtema, r.indicador, r.descricao, r.ods, r.fonte, r.eixo]));
  state.table.draw();

  // Atualiza gráficos
  updateCharts(filtered);
}

async function init() {
  const res = await fetch('../data/indicadores.json');
  const data = await res.json();
  state.rows = data;

  // Popular filtros
  const temas = uniqueSorted(state.rows.map(r => r.tema));
  const ods = uniqueSorted(state.rows.map(r => r.ods));
  const subtemas = uniqueSorted(state.rows.map(r => r.subtema));

  for (const t of temas) $('#f-tema').append(`<option value="${t}">${t}</option>`);
  for (const o of ods) $('#f-ods').append(`<option value="${o}">${o}</option>`);
  for (const s of subtemas) $('#f-subtema').append(`<option value="${s}">${s}</option>`);

  // Tabela
  state.table = new $.fn.dataTable.Api($('#t-indicadores').DataTable({
    data: state.rows.map(r => [r.id, r.tema, r.subtema, r.indicador, r.descricao, r.ods, r.fonte, r.eixo]),
    columns: [
      { title: 'ID' }, { title: 'Tema' }, { title: 'Subtema' },
      { title: 'Indicador' }, { title: 'Descrição' },
      { title: 'ODS' }, { title: 'Fonte' }, { title: 'Eixo' }
    ],
    pageLength: 10,
    order: [[1, 'asc']],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
    }
  }));

  // Eventos de filtro
  $('#f-tema, #f-ods, #f-subtema').on('change', applyFilters);
  $('#f-busca').on('input', applyFilters);

  // Charts iniciais
  updateCharts(state.rows);
}

document.addEventListener('DOMContentLoaded', init);
