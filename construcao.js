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
    container.innerHTML = '';

    data.forEach(eixo => {
      const eixoCard = document.createElement('div');
      eixoCard.style.borderLeft = `6px solid ${eixoCores[eixo.id] || '#ccc'}`;
      eixoCard.style.background = '#fff';
      eixoCard.style.padding = '14px';
      eixoCard.style.margin = '18px 0';
      eixoCard.style.borderRadius = '8px';
      eixoCard.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';

      const eixoHeader = document.createElement('div');
      eixoHeader.innerHTML = `<h2>${eixo.nome}</h2><p>(${eixo.objetivos.length} objetivos, ${
        eixo.objetivos.reduce((sum, obj) => sum + obj.programas.length, 0)
      } programas)</p>`;

      const eixoContent = document.createElement('div');
      eixoContent.style.display = 'none';
      eixoContent.style.marginTop = '15px';

      const eixoBtn = document.createElement('button');
      eixoBtn.textContent = 'Ver Objetivos';
      eixoBtn.style.marginTop = '10px';
      eixoBtn.style.padding = '6px 12px';
      eixoBtn.style.border = 'none';
      eixoBtn.style.backgroundColor = eixoCores[eixo.id] || '#0043ce';
      eixoBtn.style.color = 'white';
      eixoBtn.style.borderRadius = '6px';
      eixoBtn.style.cursor = 'pointer';

      eixoBtn.onclick = () => {
        const isOpen = eixoContent.style.display === 'block';
        eixoContent.style.display = isOpen ? 'none' : 'block';
        eixoBtn.textContent = isOpen ? 'Ver Objetivos' : 'Ocultar Objetivos';
      };

      eixo.objetivos.forEach(obj => {
        const objCard = document.createElement('div');
        objCard.style.background = '#f3f4f6';
        objCard.style.border = '1px solid #ddd';
        objCard.style.margin = '20px 0';
        objCard.style.padding = '15px';
        objCard.style.borderRadius = '8px';

        const objHeader = document.createElement('div');
        objHeader.innerHTML = `<strong>${obj.nome}</strong> (${obj.programas.length} programas)`;

        const objContent = document.createElement('div');
        objContent.style.display = 'none';
        objContent.style.marginTop = '12px';

        const objBtn = document.createElement('button');
        objBtn.textContent = 'Ver Programas';
        objBtn.style.marginTop = '10px';
        objBtn.style.padding = '6px 12px';
        objBtn.style.border = '1px solid #bbb';
        objBtn.style.borderRadius = '5px';
        objBtn.style.backgroundColor = '#ffffff';
        objBtn.style.cursor = 'pointer';

        objBtn.onclick = () => {
          const isOpen = objContent.style.display === 'block';
          objContent.style.display = isOpen ? 'none' : 'block';
          objBtn.textContent = isOpen ? 'Ver Programas' : 'Ocultar Programas';
        };

        obj.programas.forEach(prog => {
          const progDiv = document.createElement('div');
          progDiv.style.background = '#ffffff';
          progDiv.style.margin = '10px 0';
          progDiv.style.padding = '10px';
          progDiv.style.borderRadius = '6px';
          progDiv.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';

          const odsIcons = prog.ods.map(ods =>
            `<img src="https://odsbrasil.gov.br/content/ods/${ods}.png" alt="ODS ${ods}" style="height:24px;margin-right:10px;vertical-align:middle;">`
          ).join('');

          progDiv.innerHTML = `
            <h4>${prog.nome}</h4>
            <p><strong>Justificativa:</strong> ${prog.justificativa}</p>
            <p><strong>Objetivo do Programa:</strong> ${prog.objetivo_programa}</p>
            <p><strong>ODS:</strong> ${odsIcons}</p>
          `;

          objContent.appendChild(progDiv);
        });

        objCard.appendChild(objHeader);
        objCard.appendChild(objBtn);
        objCard.appendChild(objContent);
        eixoContent.appendChild(objCard);
      });

      eixoCard.appendChild(eixoHeader);
      eixoCard.appendChild(eixoBtn);
      eixoCard.appendChild(eixoContent);
      container.appendChild(eixoCard);
    });

    // 🔍 BUSCA FUNCIONAL
    document.getElementById("busca").addEventListener("input", function () {
      const termo = this.value.toLowerCase();
      const cards = document.querySelectorAll("#estrutura-container > div");

      cards.forEach(eixoCard => {
        const eixoNome = eixoCard.querySelector("h2").innerText.toLowerCase();
        let eixoVisivel = eixoNome.includes(termo);
        let objetivoVisivelTotal = false;

        const objetivos = eixoCard.querySelectorAll("div[style*='background: #f3f4f6']");
        objetivos.forEach(objCard => {
          const objNome = objCard.querySelector("strong").innerText.toLowerCase();
          let objVisivel = objNome.includes(termo);
          let programaVisivelTotal = false;

          const programas = objCard.querySelectorAll("div[style*='background: #ffffff']");
          programas.forEach(prog => {
            const progText = prog.innerText.toLowerCase();
            const visivel = progText.includes(termo);
            prog.style.display = visivel ? "block" : "none";
            if (visivel) programaVisivelTotal = true;
          });

          objCard.style.display = (objVisivel || programaVisivelTotal) ? "block" : "none";
          if (objVisivel || programaVisivelTotal) eixoVisivel = true;
        });

        eixoCard.style.display = eixoVisivel ? "block" : "none";
      });
    });
  })
  .catch(error => {
    console.error("Erro ao carregar dados da construção:", error);
    document.getElementById('estrutura-container').innerHTML = "<p style='color:red;'>Erro ao carregar dados. Verifique o arquivo JSON.</p>";
  });
