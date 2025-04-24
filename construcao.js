const eixoCores = {
  "1": "#0043ce",
  "2": "#e11d48",
  "3": "#facc15",
  "4": "#22c55e",
  "5": "#9ca3af"
};

fetch('estrutura_ppa_2026_2029.json')
  .then(response => {
    if (!response.ok) throw new Error('Erro ao carregar JSON');
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('estrutura-container');

    data.forEach(eixo => {
      const eixoCard = document.createElement('div');
      eixoCard.className = 'eixo-card';
      eixoCard.style.borderLeft = '6px solid ' + (eixoCores[eixo.id] || '#ccc');
      eixoCard.innerHTML = `<strong>${eixo.nome}</strong> (${eixo.objetivos.length} objetivos, ${
        eixo.objetivos.reduce((sum, obj) => sum + obj.programas.length, 0)
      } programas)`;

      const eixoContent = document.createElement('div');
      eixoContent.className = 'eixo-content';

      eixo.objetivos.forEach(obj => {
        const objCard = document.createElement('div');
        objCard.className = 'objetivo-card';
        objCard.innerHTML = `<strong>${obj.nome}</strong> (${obj.programas.length} programas)`;

        const objContent = document.createElement('div');
        objContent.className = 'objetivo-content';

        obj.programas.forEach(prog => {
          const progDiv = document.createElement('div');
          progDiv.className = 'programa-card';

          const odsIcons = prog.ods.map(ods =>
            `<img src="https://odsbrasil.gov.br/images/ods/ods${ods}.png" alt="ODS ${ods}" class="ods-icon">`).join('');

          progDiv.innerHTML = `
            <h4>${prog.nome}</h4>
            <p><strong>Justificativa:</strong> ${prog.justificativa}</p>
            <p><strong>Objetivo do Programa:</strong> ${prog.objetivo_programa}</p>
            <div class="ods-icons"><strong>ODS:</strong> ${odsIcons}</div>
          `;

          objContent.appendChild(progDiv);
        });

        objCard.appendChild(objContent);
        objCard.onclick = () => {
          objContent.style.display = objContent.style.display === 'block' ? 'none' : 'block';
        };

        eixoContent.appendChild(objCard);
      });

      eixoCard.onclick = () => {
        eixoContent.style.display = eixoContent.style.display === 'block' ? 'none' : 'block';
      };

      container.appendChild(eixoCard);
      container.appendChild(eixoContent);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar dados da construção:", error);
    document.getElementById('estrutura-container').innerHTML = "<p style='color:red;'>Erro ao carregar dados. Verifique o arquivo JSON.</p>";
  });
