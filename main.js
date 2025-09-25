document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");
  const totalScoreDisplay = document.getElementById("total-score-display");
  const clarity = document.getElementById("claridad-score");
  const concision = document.getElementById("concision-score");
  const formalidad = document.getElementById("formalidad-score");
  const total = document.getElementById("total-score");
  const recommendations = document.getElementById("recommendations");
  const saveBtn = document.getElementById("save-btn");
  const resetBtn = document.getElementById("reset-btn");

  const max = 40;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateProgress);
  });

  function updateProgress() {
    let clarityScore = 0, concisionScore = 0, formalidadScore = 0, totalScore = 0, checked = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) {
        let score = parseInt(cb.dataset.score);
        totalScore += score;
        if (cb.id.startsWith("c")) clarityScore += score;
        if (cb.id.startsWith("cc")) concisionScore += score;
        if (cb.id.startsWith("f")) formalidadScore += score;
        checked++;
      }
    });
    const percent = Math.round((checked / checkboxes.length) * 100);
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent + "%";
    progressPercentage.textContent = percent + "%";
    clarity.textContent = clarityScore;
    concision.textContent = concisionScore;
    formalidad.textContent = formalidadScore;
    total.textContent = totalScore;
    totalScoreDisplay.textContent = totalScore;

    if (percent < 30) progressBar.style.background = "linear-gradient(90deg,var(--danger),#b91c1c)";
    else if (percent < 70) progressBar.style.background = "linear-gradient(90deg,var(--warning),#d97706)";
    else progressBar.style.background = "linear-gradient(90deg,var(--success),#15803d)";

    updateRecommendations(clarityScore, concisionScore, formalidadScore, totalScore);
    saveProgress();
  }

  function updateRecommendations(c, cc, f, t) {
    let html = "";
    if (t === 0) { html = "<p>Complete la lista para ver recomendaciones.</p>"; }
    else {
      html += `<p><strong>Claridad:</strong> ${c} puntos</p>`;
      html += `<p><strong>Concisión:</strong> ${cc} puntos</p>`;
      html += `<p><strong>Formalidad:</strong> ${f} puntos</p>`;
      html += `<p><strong>Total:</strong> ${t} puntos</p>`;
      if (c < 5) html += "<p>🔎 Mejore la claridad del lenguaje.</p>";
      if (cc < 5) html += "<p>✂️ Reduzca redundancias para mayor concisión.</p>";
      if (f < 5) html += "<p>⚖️ Ajuste el tono a un marco más formal y jurídico.</p>";
      if (t >= 20) html += "<p>✅ Buen nivel de cumplimiento.</p>";
      else html += "<p>⚠️ Existen áreas críticas de mejora.</p>";
    }
    recommendations.innerHTML = html;
  }

  function saveProgress() {
    const data = {};
    checkboxes.forEach(cb => data[cb.id] = cb.checked);
    localStorage.setItem("nicoleFentonChecklist", JSON.stringify(data));
  }

  function loadProgress() {
    const data = JSON.parse(localStorage.getItem("nicoleFentonChecklist"));
    if (data) {
      checkboxes.forEach(cb => { if (data[cb.id]) cb.checked = true; });
    }
    updateProgress();
  }

  resetBtn.addEventListener("click", () => {
    if (confirm("¿Reiniciar lista?")) {
      checkboxes.forEach(cb => cb.checked = false);
      updateProgress();
    }
  });

  saveBtn.addEventListener("click", () => {
    saveProgress();
    saveBtn.textContent = "✅ Guardado";
    setTimeout(() => saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar', 1200);
  });

  loadProgress();
});