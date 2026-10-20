const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parseHTML, DOMParser } = require('linkedom');
const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');

function boot(reduced = false) {
  const { window, document } = parseHTML(source('index.html'));
  window.HTMLElement.prototype.focus = function () {};
  const dialog = document.getElementById('reset-dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => { dialog.removeAttribute('open'); dialog.dispatchEvent(new window.Event('close')); };
  let now = 0, nextTimer = 1;
  const timers = new Map();
  class TestDate extends Date { static now() { return now; } }
  const clock = {
    advance(milliseconds) {
      const end = now + milliseconds;
      for (;;) {
        const next = [...timers.entries()].filter(([,timer]) => timer.at <= end).sort((a,b) => a[1].at-b[1].at)[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].callback();
      }
      now = end;
    },
  };
  const media = { matches: reduced, addEventListener() {} };
  const context = vm.createContext({ window, document, Date: TestDate, matchMedia: () => media, structuredClone,
    setTimeout: (callback, delay) => { const id = nextTimer++; timers.set(id, {callback, at: now + delay}); return id; },
    clearTimeout: id => timers.delete(id) });
  for (const file of ['reactions.js', 'scenes.js', 'app.js']) vm.runInContext(source(file), context, { filename: file });
  const choices = () => [...document.querySelectorAll('[data-choice]')];
  const choose = label => {
    const candidates = choices().filter(button => button.querySelector('.choice-label').textContent.startsWith(label));
    assert.equal(candidates.length, 1, `Choice ${label}: ${choices().map(b => b.textContent).join(' | ')}`);
    assert.ok(!candidates[0].hasAttribute('disabled'), `Choice ${label} is disabled`);
    candidates[0].click();
  };
  const click = id => document.getElementById(id).click();
  const title = () => document.getElementById('step-title').textContent;
  const summary = () => document.getElementById('summary').textContent;
  const routeC = () => { choose('Có tủa'); choose('Tủa không tan'); };
  const cations = () => { choose('SCN⁻'); choose('Không có đỏ máu'); click('cation-tab'); choose('Bắt đầu nhóm I'); };
  return { window, document, choose, choices, click, title, summary, routeC, cations, clock };
}

test('every configured step, operation, outcome and route has a valid visual', () => {
  const app = boot();
  const { steps } = app.window.IonLabData;
  let models = 0;
  for (const [id, step] of Object.entries(steps)) {
    assert.ok(step.operations.length, `${id}: no operations`);
    assert.ok(step.options.length, `${id}: no choices`);
    for (const model of [...step.operations.map(item => item.scene), ...step.options.map(item => item.scene)]) {
      models++;
      assert.ok(model.type && model.label);
      for (const mini of [true, false]) {
        const svg = app.window.IonLabScenes.render(model, mini);
        const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
        assert.equal(parsed.documentElement.tagName, 'svg');
        assert.ok(!/undefined|NaN/.test(svg), `${id}: invalid visual`);
        assert.ok(svg.includes('<title'));
      }
    }
    for (const option of step.options) {
      for (const state of [{ cations: [] }, { cations: ['Pb²⁺'] }]) {
        const next = typeof option.next === 'function' ? option.next(state) : option.next;
        assert.ok(steps[next] || ['tests', 'final'].includes(next), `${id} → ${next}`);
      }
    }
  }
  assert.equal(Object.keys(steps).length, 39);
  assert.ok(models > 140);
});

test('liquid depth is halved consistently across single, paired and colored tubes', () => {
  const app = boot();
  for (const type of ['clear','precipitate','color','compare-cloudy','halides','layers','dissolve','mercury','bismuth','gas','decant']) {
    const doc = new DOMParser().parseFromString(app.window.IonLabScenes.render({type, label:type, color:'#b32337'}), 'image/svg+xml');
    const liquids = [...doc.querySelectorAll('.liquid-base')];
    assert.ok(liquids.length, type);
    for (const liquid of liquids) assert.equal(Number(liquid.getAttribute('height')), 71 / 2, type);
    for (const colored of doc.querySelectorAll('.fluid-color,.bi-solution')) assert.equal(Number(colored.getAttribute('height')), 35.5, type);
  }
});

test('new precipitate is suspended through the entire liquid and shares its clipping boundary', () => {
  const app = boot();
  for (const type of ['precipitate','dissolve','transient','reform','bismuth','mercury']) {
    const doc = new DOMParser().parseFromString(app.window.IonLabScenes.render({type, label:type}), 'image/svg+xml');
    const liquid = doc.querySelector('.liquid-base');
    const top = Number(liquid.getAttribute('y'));
    const depth = Number(liquid.getAttribute('height'));
    const front = doc.querySelector('.ppt-front');
    assert.equal(Number(front.getAttribute('y')), top, type);
    assert.equal(Number(front.getAttribute('height')), depth, type);
    const suspension = doc.querySelector('.ppt-suspension');
    assert.ok(suspension, type);
    assert.equal(suspension.querySelectorAll('circle,ellipse').length, 0, `${type}: precipitate must not resemble gas bubbles`);
    const ys = [...suspension.querySelectorAll('.ppt-floc')].map(floc=>Number(floc.getAttribute('transform').match(/translate\([^ ]+ ([^)]+)\)/)[1]));
    assert.ok(Math.min(...ys) >= top && Math.min(...ys) < top + depth/4, type);
    assert.ok(Math.max(...ys) <= top + depth && Math.max(...ys) > top + depth*3/4, type);
    assert.ok(doc.querySelector('.ppt-phase').getAttribute('clip-path').includes('-liquid'), type);
  }
});

test('clear tubes have no suspension; separated precipitate remains settled', () => {
  const app = boot();
  const svg = type=>new DOMParser().parseFromString(app.window.IonLabScenes.render({type,label:type}), 'image/svg+xml');
  assert.equal(svg('clear').querySelectorAll('.ppt-suspension').length, 0);
  for (const type of ['decant','separate']) {
    assert.equal(svg(type).querySelectorAll('.settled-precipitate').length, 1);
    assert.equal(svg(type).querySelectorAll('.ppt-suspension').length, 0);
  }
  const bismuth=svg('bismuth');
  assert.equal(bismuth.querySelector('.bi-solution').getAttribute('fill'),'#e99a38');
  assert.ok([...bismuth.querySelectorAll('.ppt-grains .ppt-floc')].every(floc=>floc.getAttribute('fill')==='#343239'));
  assert.ok([...svg('mercury').querySelectorAll('.ppt-grains .ppt-floc')].every(floc=>floc.getAttribute('fill')==='#ea542c'));
  assert.equal(svg('gas').querySelectorAll('circle.bubble').length, 3);
});

test('insoluble and persistent outcomes show existing precipitate instead of creating it again', () => {
  const app=boot();
  const {steps}=app.window.IonLabData;
  const parse=model=>new DOMParser().parseFromString(app.window.IonLabScenes.render(model), 'image/svg+xml');
  let checked=0;
  for (const step of Object.values(steps)) {
    for (const choice of step.options) {
      if (!/không tan|Không tan|Tủa bền/.test(choice.label)) continue;
      checked++;
      const doc=parse(choice.scene);
      assert.ok(doc.querySelector('.persistent-precipitate'), choice.label);
      assert.ok(doc.querySelector('.ppt-front-existing'), choice.label);
      assert.equal(doc.querySelectorAll('.precipitate-phase,.reforming,.transient').length,0,choice.label);
    }
    for (const operation of step.operations.filter(operation=>operation.scene.initialPpt)) {
      assert.ok(parse(operation.scene).querySelector('.ppt-front-existing'),operation.text);
    }
  }
  assert.ok(checked>=8);
  assert.equal(parse(steps.start.options[1].scene).querySelectorAll('.ppt-front-existing').length,0);
  assert.ok(parse(steps['chloride-confirm'].options[0].scene).querySelector('.ppt-front-reforming'));
});

test('all instructions stay visible together in one frame without page counters', () => {
  const app = boot();
  const rows = () => [...app.document.querySelectorAll('.procedure-step')];
  assert.equal(rows().length, 2);
  assert.ok(rows()[0].textContent.includes('Lấy một phần dung dịch gốc'));
  assert.ok(rows()[1].textContent.includes('Thêm từng giọt AgNO₃'));
  assert.equal(app.document.querySelectorAll('.procedure-board').length, 1);
  assert.equal(app.document.querySelectorAll('.caption-step,[data-operation],[data-preview]').length, 0);
  assert.equal(app.document.getElementById('instructions').textContent, '');
  const content = app.document.getElementById('simulation').textContent;
  app.clock.advance(60000);
  assert.equal(app.document.getElementById('simulation').textContent, content);
  assert.equal(app.document.getElementById('history-count').textContent, '0');
  assert.ok(app.document.getElementById('cation-tab').disabled);
  app.choose('Có tủa');
  assert.equal(rows().length, 3);
  assert.ok(rows()[0].textContent.includes('Ly tâm'));
  assert.ok(rows()[1].textContent.includes('giữ lại phần tủa'));
  assert.ok(rows()[2].textContent.includes('HNO₃'));
});

test('replay and pause preserve every instruction and do not record an observation', () => {
  const app = boot(); app.choose('Có tủa');
  const journal = app.document.getElementById('history-count').textContent;
  const captions = () => [...app.document.querySelectorAll('.procedure-step p')].map(p => p.textContent);
  const before = captions();
  app.click('replay-scene'); assert.deepEqual(captions(), before);
  app.click('motion-toggle'); assert.ok(app.document.body.classList.contains('paused'));
  app.clock.advance(60000); assert.deepEqual(captions(), before);
  app.click('motion-toggle'); assert.ok(!app.document.body.classList.contains('paused'));
  assert.equal(app.document.getElementById('history-count').textContent, journal);
});

test('reduced motion uses the same complete, static procedure layout', () => {
  const app = boot(true); app.choose('Có tủa');
  assert.ok(app.document.body.classList.contains('still'));
  assert.equal(app.document.querySelectorAll('.procedure-step').length, 3);
  app.clock.advance(60000);
  assert.equal(app.document.querySelectorAll('.procedure-step').length, 3);
  assert.equal(app.document.getElementById('history-count').textContent, '1');
});

test('backgrounding pauses the illustrations without replacing the instructions', () => {
  const app = boot();
  const before = app.document.getElementById('simulation').innerHTML;
  Object.defineProperty(app.document, 'hidden', { value: true, configurable: true });
  app.document.dispatchEvent(new app.window.Event('visibilitychange'));
  assert.ok(app.document.body.classList.contains('page-hidden'));
  app.clock.advance(60000);
  assert.equal(app.document.getElementById('simulation').innerHTML, before);
  Object.defineProperty(app.document, 'hidden', { value: false, configurable: true });
  app.document.dispatchEvent(new app.window.Event('visibilitychange'));
  assert.ok(!app.document.body.classList.contains('page-hidden'));
});

test('reset dialog pauses illustrations and new sample restores its complete procedure', () => {
  const app = boot(); app.choose('Có tủa');
  app.click('reset-button'); assert.ok(app.document.body.classList.contains('dialog-open'));
  app.click('cancel-reset'); assert.ok(!app.document.body.classList.contains('dialog-open'));
  assert.equal(app.document.querySelectorAll('.procedure-step').length, 3);
  app.click('reset-button'); app.click('confirm-reset');
  assert.equal(app.document.querySelectorAll('.procedure-step').length, 2);
  assert.equal(app.document.getElementById('history-count').textContent, '0');
  assert.ok(!app.document.querySelector('.intro'));
});

test('oxalate keeps requested label; negative result and back restore state', () => {
  const app = boot(); app.routeC(); app.choose('C₂O₄²⁻');
  app.choose('Không có tủa hoặc tủa tan');
  assert.ok(app.title().includes('Chọn phép thử'));
  assert.ok(app.summary().includes('Chưa ghi nhận anion dương tính'));
  app.click('back-button'); assert.ok(app.title().includes('C₂O₄²⁻'));
  assert.ok(app.summary().includes('Chờ quan sát'));
});

test('nitrate is locked until nitrite negative and relocks if nitrite changes positive', () => {
  const app = boot(); app.choose('Không có tủa');
  const nitrate = () => app.choices().find(button => button.textContent.startsWith('NO₃⁻'));
  assert.ok(nitrate().disabled);
  app.choose('NO₂⁻'); app.choose('Không màu'); assert.ok(!nitrate().disabled);
  app.choose('NO₃⁻'); app.choose('Màu cam'); assert.ok(app.summary().includes('NO₃⁻'));
  app.choose('NO₂⁻'); app.choose('Màu cam');
  assert.ok(nitrate().disabled); assert.ok(!app.summary().includes('NO₃⁻')); assert.ok(app.summary().includes('NO₂⁻'));
});

test('carbonate detail is replaced and removed correctly when observations change', () => {
  const app = boot(); app.routeC();
  app.choose('CO₃²⁻'); app.choose('Có sủi bọt'); app.choose('Có tủa →');
  assert.ok(app.summary().includes('CO₃²⁻'));
  app.choose('CO₃²⁻'); app.choose('Có sủi bọt'); app.choose('Không tủa →');
  assert.ok(app.summary().includes('HCO₃⁻')); assert.ok(!app.summary().includes('CO₃²⁻'));
  app.choose('CO₃²⁻'); app.choose('Không sủi bọt');
  assert.ok(!app.summary().includes('HCO₃⁻'));
});

test('third anion is rejected without navigation; existing positives can be selected again', () => {
  const app = boot(); app.routeC();
  app.choose('SCN⁻'); app.choose('Đỏ máu');
  app.choose('C₂O₄²⁻'); app.choose('Tủa bền');
  app.choose('C₂O₄²⁻'); app.choose('Tủa bền'); assert.ok(app.title().includes('Chọn phép thử'));
  app.choose('SO₄²⁻'); app.choose('Có tủa'); app.choose('Không tan');
  assert.ok(app.title().includes('Kiểm tra độ bền'));
  assert.ok(app.document.getElementById('toast').textContent.includes('2 anion'));
});

test('incompatible cation is rejected and leaves current step intact', () => {
  const app = boot(); app.routeC(); app.choose('SO₄²⁻'); app.choose('Có tủa'); app.choose('Không tan');
  app.click('cation-tab'); app.choose('Bắt đầu nhóm I'); app.choose('Không tủa'); app.choose('Có kết tủa ngay');
  assert.ok(app.title().includes('Nhóm II-0')); assert.ok(!app.summary().includes('Ba²⁺'));
  assert.ok(app.document.getElementById('toast').textContent.includes('tương kỵ'));
});

test('three-ion limit completes sample and prevents a fourth ion', () => {
  const app = boot(); app.choose('Không có tủa'); app.choose('CH₃COO⁻'); app.choose('Có mùi este');
  app.click('cation-tab'); app.choose('Bắt đầu nhóm I'); app.choose('Có tủa'); app.choose('Tủa tan →');
  app.choose('Có tủa →'); assert.equal(app.title(), 'Kết quả của mẫu thử');
  app.choose('Tiếp tục tìm cation'); app.choose('Bắt đầu nhóm I'); app.choose('Có tủa'); app.choose('Tủa không tan');
  assert.ok(app.title().includes('Thử độ tan')); assert.ok(!app.summary().includes('Ag⁺'));
});

test('halides, chloride multi-stage operations, and negative tests remain navigable', () => {
  const app = boot(); app.routeC();
  app.choose('Br⁻'); assert.equal(app.document.querySelectorAll('.procedure-step').length, 2); app.choose('Không có màu');
  app.choose('Cl⁻'); app.choose('Có tủa'); assert.equal(app.document.querySelectorAll('.procedure-step').length, 5);
  app.choose('Tủa tan rồi xuất hiện lại'); assert.ok(app.summary().includes('Cl⁻'));
  app.choose('CH₃COO⁻'); assert.equal(app.document.querySelectorAll('.procedure-step').length, 4); app.choose('Không có mùi');
});

test('all cation subgroups and both comparison branches are reachable', () => {
  const routes = [
    ['Không tủa','Không tủa hoặc','Không tủa →','Tủa xuất hiện','Ống có NH₄Cl','Giấy chuyển hồng'],
    ['Không tủa','Không tủa hoặc','Không tủa →','Tủa xuất hiện','Hai ống','Giấy không đổi'],
    ['Không tủa','Có kết tủa ngay','Tủa xuất hiện','Ống có NH₄Cl'],
    ['Không tủa','Không tủa hoặc','Có tủa','Không màu đen','Tủa xuất hiện','Hai ống'],
    ['Không tủa','Không tủa hoặc','Không tủa →','Tủa bền','Xét lại nhóm III','Hai ống','Không xuất hiện màu','Xét nhóm IV/V','Tủa đỏ cam','Giấy chuyển hồng'],
    ['Có tủa','Tủa tan →','Không tủa','Không tủa →','Tủa xuất hiện','Ống có NH₄Cl','Xét nhóm IV/V','Tủa đen'],
  ];
  for (const route of routes) {
    const app = boot(); app.routeC(); app.cations();
    route.forEach(app.choose); assert.equal(app.title(), 'Kết quả của mẫu thử');
  }
});

test('reduced motion defaults to a still, legible final state and can be enabled explicitly', () => {
  const app = boot(true);
  assert.ok(app.document.body.classList.contains('still'));
  assert.equal(app.document.getElementById('motion-toggle').textContent, '▷ Bật hoạt ảnh');
  app.click('motion-toggle'); assert.ok(!app.document.body.classList.contains('still'));
});
