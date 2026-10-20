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
  const media = { matches: reduced, addEventListener() {} };
  const context = vm.createContext({ window, document, matchMedia: () => media, structuredClone, setTimeout: () => 1, clearTimeout() {} });
  for (const file of ['reactions.js', 'scenes.js', 'app.js']) vm.runInContext(source(file), context, { filename: file });
  const choices = () => [...document.querySelectorAll('[data-choice]')];
  const choose = label => {
    const candidates = choices().filter(button => button.textContent.startsWith(label));
    assert.equal(candidates.length, 1, `Choice ${label}: ${choices().map(b => b.textContent).join(' | ')}`);
    assert.ok(!candidates[0].hasAttribute('disabled'), `Choice ${label} is disabled`);
    candidates[0].click();
  };
  const click = id => document.getElementById(id).click();
  const title = () => document.getElementById('step-title').textContent;
  const summary = () => document.getElementById('summary').textContent;
  const routeC = () => { choose('Có tủa'); choose('Tủa không tan'); };
  const cations = () => { choose('SCN⁻'); choose('Không có đỏ máu'); click('cation-tab'); choose('Bắt đầu nhóm I'); };
  return { window, document, choose, choices, click, title, summary, routeC, cations };
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

test('preview, replay, operations and pause never record an observation', () => {
  const app = boot();
  app.document.querySelector('[data-preview="1"]').click();
  assert.ok(app.document.getElementById('simulation').textContent.includes('Chưa ghi nhận kết quả'));
  assert.equal(app.document.getElementById('history-count').textContent, '0');
  assert.ok(app.document.getElementById('cation-tab').disabled);
  app.click('replay-scene'); app.click('return-operation');
  app.document.querySelector('[data-operation="0"]').click();
  app.click('motion-toggle');
  assert.ok(app.document.body.classList.contains('paused'));
  assert.equal(app.document.getElementById('history-count').textContent, '0');
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
  app.choose('Br⁻'); assert.equal(app.document.querySelectorAll('[data-operation]').length, 2); app.choose('Không có màu');
  app.choose('Cl⁻'); app.choose('Có tủa'); assert.equal(app.document.querySelectorAll('[data-operation]').length, 5);
  app.choose('Tủa tan rồi xuất hiện lại'); assert.ok(app.summary().includes('Cl⁻'));
  app.choose('CH₃COO⁻'); assert.equal(app.document.querySelectorAll('[data-operation]').length, 4); app.choose('Không có mùi');
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
