const eixoCores = {
  "1": "#0043ce",
  "2": "#e11d48",
  "3": "#facc15",
  "4": "#22c55e",
  "5": "#9ca3af"
};

fetch('estrutura_ppa_2026_2029.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('estrutura-container');
    container.innerHTML = ''; // limpa se já tiver conteúdo

    data.forEach(eixo => {
      const eixoCard = document.createElement('div');
      eixoCard.style.borderLeft = `6px solid ${eixoCores[eixo.id] || '#ccc'}`;
      eixoCard.style.background = '#fff';
      eixoCard.style.padding = '15px';
      eixoCard.style.margin = '15px 0';
      eixoCard.style.borderRadius = '10px';
      eixoCard.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
      eixoCard.style.cursor = 'pointer';

      const eixoHeader = document.createElement('div');
      eixoHeader.innerHTML = `<strong>${eixo.nome}</strong> (${eixo.objetivos.length} objetivos, ${
        eixo.objetivos.reduce((sum, obj) => sum + obj.programas.length, 0)
      } programas)`;
      eixoHeader.style.fontSize = '18px';
      eixoHeader.style.marginBottom = '10px';

      const eixoContent = document.createElement('div');
      eixoContent.style.display = 'none';

      eixo.objetivos.forEach(obj => {
        const objCard = document.createElement('div');
        objCard.style.background = '#f9fafb';
        objCard.style.border = '1px solid #ddd';
        objCard.style.margin = '10px 0';
        objCard.style.padding = '10px 15px';
        objCard.style.borderRadius = '8px';

        const objHeader = document.createElement('div');
        objHeader.innerHTML = `<strong>${obj.nome}</strong> (${obj.programas.length} programas)`;
        objHeader.style.cursor = 'pointer';

        const objContent = document.createElement('div');
        objContent.style.display = 'none';
        objContent.style.marginTop = '10px';

        obj.programas.forEach(prog => {
          const progDiv = document.createElement('div');
          progDiv.style.background = '#ffffff';
          progDiv.style.margin = '10px 0';
          progDiv.style.padding = '10px';
          progDiv.style.borderRadius = '6px';
          progDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';

          const odsIcons = prog.ods.map(ods =>
            `<img src="https://odsbrasil.gov.br/images/ods/ods${ods}.png" alt="ODS ${ods}" style="height:24px;margin-right:4px;vertical-align:middle;">`
          ).join('');

          progDiv.innerHTML = `
            <h4>${prog.nome}</h4>
            <p><strong>Justificativa:</strong> ${prog.justificativa}</p>
            <p><strong>Objetivo do Programa:</strong> ${prog.objetivo_programa}</p>
            <p><strong>ODS:</strong> ${odsIcons}</p>
          `;

          objContent.appendChild(progDiv);
        });

        objHeader.onclick = () => {
          objContent.style.display = objContent.style.display === 'block' ? 'none' : 'block';
        };

        objCard.appendChild(objHeader);
        objCard.appendChild(objContent);
        eixoContent.appendChild(objCard);
      });

      eixoCard.onclick = () => {
        eixoContent.style.display = eixoContent.style.display === 'block' ? 'none' : 'block';
      };

      eixoCard.appendChild(eixoHeader);
      eixoCard.appendChild(eixoContent);
      container.appendChild(eixoCard);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar dados da construção:", error);
    document.getElementById('estrutura-container').innerHTML = "<p style='color:red;'>Erro ao carregar dados. Verifique o arquivo JSON.</p>";
  });
