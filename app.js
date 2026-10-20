'use strict';
(() => {
  const { steps, branches, testIds, incompatible, scene, op, option } = window.IonLabData;
  const { render: draw, esc } = window.IonLabScenes;
  const $ = id => document.getElementById(id);
  const freshState = () => ({ screen: 'start', branch: null, anions: {}, cations: [], journal: [] });
  let state = freshState();
  const history = [];
  let operation = 0, currentStep, toastTimer;
  let operationTimer = null, nextOperationAt = 0, operationRemaining = null, sequenceComplete = false;
  let dialogOpen = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let staticMode = reducedMotion.matches;
  const total = (value = state) => Object.values(value.anions).filter(result => result.positive).length + value.cations.length;
  const positiveAnions = (value = state) => Object.entries(value.anions).filter(([, result]) => result.positive);
  function notify(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('show');
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 4600);
  }
  function checkpoint() { history.push(structuredClone(state)); if(history.length > 120) history.shift(); }
  function go(screen) {
    if (screen === 'nitrate' && state.anions['NO₂⁻']?.positive !== false) { notify('Hãy xác định NO₂⁻ âm tính trước khi thử NO₃⁻.'); return; }
    checkpoint(); state.screen = screen; render();
  }
  function validate(candidate) {
    if (total(candidate) > 3) return 'Mẫu bài tập chỉ chứa tối đa 3 ion. Hãy kiểm tra lại lựa chọn.';
    if (positiveAnions(candidate).length > 2) return 'Mẫu bài tập chỉ chứa tối đa 2 anion.';
    for (const [ion, result] of positiveAnions(candidate)) {
      if (ion === 'CO₃²⁻ / HCO₃⁻' && result.detail !== 'CO₃²⁻') continue;
      const conflict = candidate.cations.find(cation => incompatible[ion]?.includes(cation));
      if (conflict) return `${conflict} tương kỵ với ${result.detail || ion} trong mô hình dung dịch của bài tập. Hãy kiểm tra lại.`;
    }
    return null;
  }
  function choose(index) {
    const choice = currentStep.options[index];
    if (!choice || choice.disabled) return;
    const candidate = structuredClone(state);
    const result = choice.dynamicZinc && state.cations.length ? { cation: 'Zn²⁺' } : choice.result;
    if (result?.anion) {
      if (result.anion === 'NO₃⁻' && state.anions['NO₂⁻']?.positive !== false) { notify('Phép thử NO₃⁻ chỉ mở khi NO₂⁻ âm tính.'); return; }
      candidate.anions[result.anion] = { positive: result.positive, ...(result.positive && result.detail ? { detail: result.detail } : {}) };
      // A changed nitrite result invalidates the downstream nitrate result.
      if (result.anion === 'NO₂⁻' && result.positive) delete candidate.anions['NO₃⁻'];
    }
    if (result?.cation && !candidate.cations.includes(result.cation)) candidate.cations.push(result.cation);
    const error = validate(candidate);
    if(error) { notify(error); return; }
    const next = typeof choice.next === 'function' ? choice.next(state) : choice.next;
    checkpoint();
    if(choice.branch) candidate.branch = choice.branch;
    if(choice.result || choice.dynamicZinc || choice.recordObservation !== false) {
      candidate.journal.push({ step: currentStep.title, observation: choice.label });
    }
    candidate.screen = result?.cation && total(candidate) >= 3 ? 'final' : next;
    state = candidate;
    render();
    if(result) notify(result.anion ? `${result.detail || result.anion}: ${result.positive ? 'dương tính' : 'âm tính'} — đã ghi vào sổ tay.` : `Đã ghi nhận ${result.cation}.`);
  }
  function testMenu() {
    const names = branches[state.branch] || branches.A;
    return {
      title: 'Chọn phép thử tiếp theo', phase: 'anion', crumb: `ANION / NHÁNH ${state.branch || 'A'}`,
      operations: [op('Các phép thử riêng', 'Dùng phần dung dịch gốc mới cho từng phép thử. Chọn ion bên dưới để xem các thao tác và mô phỏng hiện tượng.', 'rack')],
      choicesTitle: 'Bạn muốn kiểm tra ion nào?', menu: true,
      options: [...names.map(name => {
        const id = testIds[name];
        const result = state.anions[name];
        const locked = name === 'NO₃⁻' && state.anions['NO₂⁻']?.positive !== false;
        return option(name, scene('sample', `Chuẩn bị phép thử ${name}`, name), id, {
          disabled: locked, recordObservation: false,
          hint: locked ? (state.anions['NO₂⁻']?.positive ? 'Bỏ qua: NO₂⁻ dương tính' : 'Thử NO₂⁻ âm tính trước') : result ? (result.positive ? '✓ Đã ghi nhận dương tính' : '− Đã ghi nhận âm tính') : 'Chưa thực hiện',
        });
      }), option('Chuyển sang tìm cation', scene('rack', 'Tiếp tục các nhóm cation'), 'cation-start', { disabled: !Object.keys(state.anions).length, hint: 'Sau khi hoàn tất các phép thử anion cần thiết', recordObservation: false })],
      footnote: 'Nút NO₃⁻ được mở sau khi NO₂⁻ âm tính. Mẫu của bài tập chứa tối đa 2 anion và tối đa 3 ion tổng cộng.',
    };
  }
  function finalStep() {
    return { title: 'Kết quả của mẫu thử', phase: 'cation', crumb: 'SỔ TAY / TỔNG HỢP',
      operations: [op('Tổng hợp quan sát', 'Đối chiếu kết quả với nhật ký. Có thể quay lại bước trước để sửa lựa chọn hoặc tiếp tục các phép thử còn lại.', 'rack')],
      options: [option('Xem lại phép thử anion', scene('sample', 'Xem lại các phép thử anion'), state.branch ? 'tests' : 'start', { recordObservation: false }), option('Tiếp tục tìm cation', scene('rack', 'Tiếp tục sơ đồ cation'), 'cation-start', { recordObservation: false })], choicesTitle: 'Bạn muốn làm gì tiếp?',
      footnote: 'Kết quả theo các hiện tượng bạn đã chọn và sơ đồ mẫu giới hạn. Không tự xác định ion từ hình mô phỏng.',
    };
  }
  function updateSummary() {
    const found = positiveAnions();
    $('summary').innerHTML = `<div class="summary-group"><div class="summary-label"><span class="charge">−</span> Anion đã xác định</div>${found.length ? found.map(([ion, result]) => `<span class="result-chip">${esc(result.detail || ion)}</span>`).join('') : `<div class="empty-result">${Object.keys(state.anions).length ? 'Chưa ghi nhận anion dương tính' : 'Chờ quan sát đầu tiên…'}</div>`}</div><div class="summary-group"><div class="summary-label"><span class="charge plus">+</span> Cation đã xác định</div>${state.cations.length ? state.cations.map(ion => `<span class="result-chip cation">${esc(ion)}</span>`).join('') : '<div class="empty-result">Chưa ghi nhận cation</div>'}</div><div class="ion-meter"><span>Ion đã xác định</span><strong>${total()} / 3</strong></div><div class="meter-track"><div class="meter-fill" style="width:${total()/3*100}%"></div></div>`;
    $('history-count').textContent = state.journal.length;
    $('journal-list').innerHTML = state.journal.length ? [...state.journal].reverse().map(entry => `<li><strong>${esc(entry.step)}</strong>${esc(entry.observation)}</li>`).join('') : '<li class="empty-journal">Mỗi lựa chọn hiện tượng sẽ được ghi lại ở đây.</li>';
    const unlocked = Object.keys(state.anions).length > 0;
    $('cation-tab').disabled = !unlocked;
    $('cation-lock').textContent = unlocked ? '' : '⌑';
    $('anion-tab').classList.toggle('active', currentStep.phase === 'anion');
    $('cation-tab').classList.toggle('active', currentStep.phase === 'cation');
    $('anion-tab').setAttribute('aria-current', currentStep.phase === 'anion' ? 'step' : 'false');
    $('cation-tab').setAttribute('aria-current', currentStep.phase === 'cation' ? 'step' : 'false');
  }
  function renderSimulation() {
    const activeOp = currentStep.operations[operation];
    const showStage = !currentStep.menu && state.screen !== 'final';
    $('simulation').hidden = !showStage;
    if (!showStage) { $('simulation').innerHTML = ''; return; }
    // Reduced motion shows the full procedure once as a readable, static sequence.
    if (staticMode) {
      $('simulation').innerHTML = `<div class="simulation-top"><span class="live-label">THAO TÁC THỰC HÀNH</span></div><div class="static-procedure">${currentStep.operations.map((item, index) => `<div class="static-operation"><div>${draw(item.scene, true)}</div><p><strong>Bước ${index+1}</strong>${esc(item.text)}</p></div>`).join('')}</div>`;
      return;
    }
    const status = paused ? 'Đang tạm dừng' : sequenceComplete ? 'Đã xem hết thao tác' : 'Tự động thực hiện';
    $('simulation').innerHTML = `<div class="simulation-top"><span class="live-label"><i></i>${status}</span><button type="button" id="replay-scene" aria-label="Phát lại toàn bộ thao tác">↻ Phát lại</button></div><div class="stage-visual">${draw(activeOp.scene)}</div><div class="simulation-caption"><div class="caption-step">Bước ${operation+1}/${currentStep.operations.length}</div><p class="caption-text" aria-live="polite" aria-atomic="true">${esc(activeOp.text)}</p></div><div class="operation-progress" aria-hidden="true">${currentStep.operations.map((_,index)=>`<span class="${index <= operation ? 'reached' : ''}"></span>`).join('')}</div>`;
    $('replay-scene').addEventListener('click', startSequence);
  }
  function stopOperationTimer() {
    if (operationTimer !== null) clearTimeout(operationTimer);
    operationTimer = null;
  }
  function operationDuration() {
    // Leave enough time to read each caption; long instructions get a longer scene.
    return Math.min(11000, Math.max(5000, 2200 + currentStep.operations[operation].text.length * 52));
  }
  function scheduleOperation() {
    stopOperationTimer();
    if (paused || staticMode || document.hidden || dialogOpen || sequenceComplete || currentStep.menu || state.screen === 'final') return;
    const delay = operationRemaining ?? operationDuration();
    nextOperationAt = Date.now() + delay;
    operationTimer = setTimeout(() => {
      operationTimer = null; operationRemaining = null;
      if (operation < currentStep.operations.length - 1) operation++;
      else sequenceComplete = true;
      renderSimulation(); scheduleOperation();
    }, delay);
  }
  function suspendSequence() {
    if (operationTimer !== null) operationRemaining = Math.max(0, nextOperationAt - Date.now());
    stopOperationTimer();
  }
  function startSequence() {
    stopOperationTimer(); operation = 0; operationRemaining = null; sequenceComplete = false;
    renderSimulation(); scheduleOperation();
  }
  function render(focus = true) {
    currentStep = state.screen === 'tests' ? testMenu() : state.screen === 'final' ? finalStep() : steps[state.screen];
    if(!currentStep) throw new Error(`Unknown step: ${state.screen}`);
    stopOperationTimer(); operation = 0; operationRemaining = null; sequenceComplete = false;
    $('step-title').textContent = currentStep.title;
    $('breadcrumb').textContent = currentStep.crumb || `${currentStep.phase === 'anion' ? 'ANION' : 'CATION'} / PHÉP THỬ ĐỊNH TÍNH`;
    $('back-button').disabled = !history.length;
    $('back-button').style.visibility = history.length ? 'visible' : 'hidden';
    $('instructions').innerHTML = state.screen === 'final'
      ? `<div class="results-banner"><p><strong>Anion:</strong> ${positiveAnions().map(([ion,result])=>esc(result.detail||ion)).join(', ') || 'Chưa ghi nhận'}</p><p><strong>Cation:</strong> ${state.cations.map(esc).join(', ') || 'Chưa ghi nhận'}</p><small>${total()}/3 ion đã xác định · ${state.journal.length} quan sát trong nhật ký.</small></div>`
      : currentStep.menu ? `<p>${esc(currentStep.operations[0].text)}</p>` : '';
    $('instructions').hidden = !$('instructions').textContent.trim();
    $('choices-title').textContent = currentStep.choicesTitle || 'Bạn thấy hiện tượng nào?';
    $('step-footnote').textContent = currentStep.footnote || '';
    $('step-notes').hidden = !currentStep.footnote;
    $('step-notes').removeAttribute('open');
    const paired = currentStep.options.some(choice => ['compare-cloudy','compare-same','clear-or-dissolve','halides','slow-ppt'].includes(choice.scene.type));
    $('choices').className = `choices ${currentStep.menu ? 'test-grid' : currentStep.options.length === 3 ? 'three' : ''} ${paired ? 'paired-options' : ''}`;
    $('choices').innerHTML = currentStep.options.map((choice, index) => `<button type="button" data-choice="${index}" class="observation-card ${currentStep.menu ? 'test-card' : ''}" aria-label="${esc(choice.label)}${choice.hint ? ' — '+esc(choice.hint) : ''}" ${choice.disabled ? 'disabled' : ''}>${currentStep.menu ? '' : `<span class="phenomenon-image">${draw(choice.scene,true)}</span>`}<span class="choice-copy"><span class="choice-label">${esc(choice.label)}</span>${choice.hint ? `<small>${esc(choice.hint)}</small>` : ''}</span><span class="choice-arrow" aria-hidden="true">${choice.disabled ? '⌑' : '→'}</span></button>`).join('');
    document.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.choice))));
    updateSummary(); renderSimulation(); scheduleOperation();
    if(focus) {
      $('step-title').focus({ preventScroll: true });
      $('workspace').scrollIntoView?.({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }
  function updateMotion() {
    document.body.classList.toggle('paused', paused);
    document.body.classList.toggle('still', staticMode);
    $('motion-toggle').setAttribute('aria-pressed', String(paused));
    $('motion-toggle').textContent = paused ? '▷ Bật hoạt ảnh' : 'Ⅱ Tạm dừng hoạt ảnh';
    renderSimulation();
  }
  $('motion-toggle').addEventListener('click', () => { suspendSequence(); paused = !paused; staticMode = false; updateMotion(); scheduleOperation(); });
  reducedMotion.addEventListener('change', event => { suspendSequence(); paused = staticMode = event.matches; updateMotion(); scheduleOperation(); });
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-hidden', document.hidden);
    if (document.hidden) suspendSequence(); else scheduleOperation();
  });
  $('back-button').addEventListener('click', () => { if(history.length) { state = history.pop(); render(); notify('Đã trở lại bước trước; kết quả và nhật ký cũng được khôi phục.'); } });
  $('anion-tab').addEventListener('click', () => go(state.branch ? 'tests' : 'start'));
  $('cation-tab').addEventListener('click', () => { if(Object.keys(state.anions).length) go('cation-start'); });
  $('reset-button').addEventListener('click', () => { suspendSequence(); dialogOpen = true; $('reset-dialog').showModal(); });
  $('reset-dialog').addEventListener('close', () => { dialogOpen = false; scheduleOperation(); });
  $('cancel-reset').addEventListener('click', () => $('reset-dialog').close());
  $('confirm-reset').addEventListener('click', () => { state = freshState(); history.length = 0; dialogOpen = false; $('reset-dialog').close(); render(); notify('Đã chuẩn bị mẫu mới.'); });
  render(false); updateMotion();
})();
