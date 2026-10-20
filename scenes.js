/* Small vector scenes stay crisp on phones and can be paused without video assets. */
'use strict';
window.IonLabScenes = (() => {
  let sequence = 0;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const text = (x, y, content, cls = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(content)}</text>`;
  function render(model, mini = false) {
    const id = `scene-${++sequence}`;
    const type = model.type;
    const defs = [];
    let serial = 0;
    function tube(x = 240, y = 71, options = {}) {
      const clip = `${id}-tube-${++serial}`;
      const width = 49, bottom = y + 125;
      const liquidDepth = (125 - 54) / 2;
      const topLiquid = bottom - liquidDepth;
      const liquidClip = `${clip}-liquid`;
      defs.push(`<clipPath id="${clip}"><path d="M${x-22} ${y+3} H${x+22} V${bottom-23} Q${x+22} ${bottom} ${x} ${bottom} Q${x-22} ${bottom} ${x-22} ${bottom-23} Z"/></clipPath>`);
      defs.push(`<clipPath id="${liquidClip}"><rect x="${x-24}" y="${topLiquid}" width="${width}" height="${liquidDepth}"/></clipPath>`);
      const outline = `M${x-24} ${y} V${bottom-24} Q${x-24} ${bottom+2} ${x} ${bottom+2} Q${x+24} ${bottom+2} ${x+24} ${bottom-24} V${y}`;
      let contents = `<rect class="liquid-base" x="${x-24}" y="${topLiquid}" width="${width}" height="${liquidDepth}" fill="#f6fbf7"/>`;
      if (options.color) contents += `<rect class="${options.colorClass ?? 'fluid-color'}" x="${x-24}" y="${topLiquid}" width="${width}" height="${liquidDepth}" fill="${options.color}"/>`;
      if (options.layers) {
        const layerTop = bottom - liquidDepth * .48;
        contents += `<path class="organic-layer" d="M${x-25} ${layerTop} Q${x} ${layerTop+2} ${x+25} ${layerTop} V${bottom+2} H${x-25}Z" fill="${options.layerColor || '#dce8e3'}" fill-opacity=".8" stroke="#92b3a5" stroke-width="1"/>`;
      }
      if (options.cloud) contents += `<g class="cloud" clip-path="url(#${liquidClip})"><rect x="${x-24}" y="${topLiquid}" width="${width}" height="${liquidDepth}" fill="#edf0df" opacity="${options.cloud === 'light' ? '.2' : '.85'}"/><g fill="#9eaf9e">${Array.from({length:36}, (_, i) => `<circle cx="${x-19+(i*13%39)}" cy="${topLiquid+3+(i*7%(liquidDepth-6))}" r="${.7+(i%3)*.45}" opacity="${options.cloud === 'light' ? '.18' : '.6'}"/>`).join('')}</g></g>`;
      if (options.ppt) {
        const cls = options.pptClass || 'precipitate-phase';
        const fill = options.pptColor || '#f6f5e9';
        const grainColor = options.pptColor || '#fffef7';
        const grainOutline = options.pptColor || '#81917f';
        const pellet = `<path class="ppt-settled" d="M${x-23} ${bottom-6} Q${x-10} ${bottom-9} ${x} ${bottom-6} T${x+24} ${bottom-6} V${bottom+2} H${x-24}Z" fill="${fill}" stroke="${options.pptColor || '#a9b89d'}" stroke-width=".7"/>`;
        if (options.settled) contents += `<g class="settled-precipitate">${pellet}</g>`;
        else {
          const frontClip = `${clip}-ppt-front`;
          const duration = cls.includes('dissolving') ? 5 : cls.includes('reforming') ? 7 : cls.includes('transient') || cls.includes('bi-solid') ? 6 : cls.includes('slow-precipitate') ? 10 : 7;
          const frontMode = cls.includes('dissolving') ? 'ppt-front-dissolving' : cls.includes('reforming') ? 'ppt-front-reforming' : '';
          defs.push(`<clipPath id="${frontClip}"><rect class="ppt-front ${frontMode}" style="--ppt-duration:${duration}s" x="${x-24}" y="${topLiquid}" width="${width}" height="${liquidDepth}"/></clipPath>`);
          const grains = Array.from({length:56}, (_, i) => `<circle cx="${x-20+(i*17%41)}" cy="${topLiquid+2+(i*11%(liquidDepth-4))}" r="${1.05+(i%4)*.26}" fill="${grainColor}" stroke="${grainOutline}" stroke-width=".5" opacity="${.78+(i%4)*.07}"/>`).join('');
          const billows = Array.from({length:9}, (_, i) => `<ellipse cx="${x-12+(i*11%25)}" cy="${topLiquid+3+(i*9%(liquidDepth-5))}" rx="${11+i%3*3}" ry="${3+i%3}" fill="${fill}" stroke="${options.pptColor || '#b4bead'}" stroke-width=".5" opacity=".85"/>`).join('');
          contents += `<g class="ppt-phase ${cls}" style="--ppt-duration:${duration}s" clip-path="url(#${liquidClip})"><g clip-path="url(#${frontClip})"><g class="ppt-suspension"><rect x="${x-24}" y="${topLiquid}" width="${width}" height="${liquidDepth}" fill="${fill}" opacity=".96"/>${billows}<g class="ppt-grains">${grains}</g></g></g><g class="ppt-deposit">${pellet}</g></g>`;
        }
      }
      contents += `<ellipse class="liquid-surface" cx="${x}" cy="${topLiquid}" rx="24" ry="2.8" fill="none" stroke="#adc9bc" stroke-width=".8"/>`;
      if (options.gas) contents += `<g style="--bubble-rise:-${liquidDepth-7}px" clip-path="url(#${liquidClip})" fill="#fff" stroke="#79a5aa" stroke-width="1.3"><circle class="bubble" cx="${x-9}" cy="${bottom-8}" r="4"/><circle class="bubble b2" cx="${x+8}" cy="${bottom-7}" r="3"/><circle class="bubble b3" cx="${x}" cy="${bottom-4}" r="5"/></g>`;
      if (options.solids) contents += `<g fill="#8c9699">${[0,1,2,3].map(i => `<rect x="${x-15+i*8}" y="${bottom-10-i%2*5}" width="6" height="7" rx="1"/>`).join('')}</g>`;
      return `<g class="${options.shake ? 'shake-tube' : ''}"><path d="${outline}" fill="#fff9" stroke="#6f9a91" stroke-width="2"/><g clip-path="url(#${clip})">${contents}</g><path d="${outline}" fill="none" stroke="#6f9a91" stroke-width="2"/><rect x="${x-27}" y="${y-3}" width="54" height="6" rx="3" fill="#f5fbf7" stroke="#6f9a91" stroke-width="1.5"/><path d="M${x-15} ${y+12}V${bottom-29}" stroke="white" stroke-width="3" opacity=".9" stroke-linecap="round"/>${[0,1,2].map(i => `<path d="M${x+15} ${y+30+i*20}h7" stroke="#a5bfb3"/>`).join('')}</g>`;
    }
    const dropper = (reagent, x = 240) => `<g style="--drop-travel:108px"><rect x="${x-10}" y="-2" width="20" height="23" rx="8" fill="#296e6a"/><path d="M${x-5} 20V39L${x} 48L${x+5}39V20" fill="#e7f1e9" stroke="#7ba299" stroke-width="1.4"/><path class="drop" d="M${x} 47q-8 11 0 11q8 0 0-11" fill="#6ca9a2"/><path class="drop d2" d="M${x} 47q-6 9 0 9q6 0 0-9" fill="#6ca9a2"/>${reagent ? `<path d="M${x+17} 27H${x+52}" stroke="#94b3a7" stroke-dasharray="3 3"/>${text(x+62,31,reagent,'scene-label','start')}` : ''}</g>`;
    const heat = () => `<g><rect x="204" y="205" width="72" height="10" rx="4" fill="#d8e4dc" stroke="#99afa1"/><rect x="209" y="215" width="62" height="8" rx="3" fill="#6a8178"/>${[0,1,2].map(i => `<path class="heat-wave" d="M${225+i*15} 208q-8-8 0-16t0-15" stroke="#d78a4c" stroke-width="2" fill="none"/>`).join('')}</g>`;
    const paper = (pink = false) => `<g><rect x="207" y="62" width="66" height="10" rx="2" fill="#fffdf2" stroke="#b9b59e"/>${pink ? '<rect class="paper-pink" x="208" y="63" width="64" height="8" rx="2" fill="#e34b8d"/>' : ''}<path d="M279 66h32" stroke="#a2b4a6"/>${text(318,70,'Giấy thử','scene-label','start')}</g>`;
    const bench = `<ellipse cx="240" cy="215" rx="101" ry="8" fill="#729d7f12"/><path class="bench-line" d="M117 220H363"/>`;
    let body = bench;
    if (['compare-cloudy', 'compare-same', 'compare-setup', 'split', 'clear-or-dissolve', 'halides', 'slow-ppt', 'separate'].includes(type)) {
      const left = {}, right = {};
      let leftLabel = 'Ống đối chứng', rightLabel = '+ NH₄Cl';
      if (type === 'compare-cloudy') { left.cloud = 'light'; right.cloud = 'dense'; }
      if (type === 'compare-same') { left.cloud = right.cloud = 'light'; }
      if (type === 'split') { leftLabel = 'Ống 1'; rightLabel = 'Ống 2'; body += `<path d="M240 15v13m0 0l-62 24m62-24l62 24" stroke="#5d9583" fill="none" stroke-dasharray="4 4"/>`; }
      if (type === 'clear-or-dissolve') { leftLabel = 'Không có tủa'; rightLabel = 'Tủa tan'; right.ppt = true; right.pptClass = 'dissolving'; }
      if (type === 'slow-ppt') { leftLabel = 'Không tủa'; rightLabel = 'Tủa chậm'; right.ppt = true; right.pptClass = 'precipitate-phase slow-precipitate'; }
      if (type === 'halides') { left.layers = right.layers = true; left.layerColor = '#e4a045'; right.layerColor = '#8c58b4'; leftLabel = 'Br₂ · vàng cam'; rightLabel = 'I₂ · tím'; }
      if (type === 'separate') { leftLabel = 'Phần dung dịch'; rightLabel = 'Phần tủa'; right.ppt = true; right.settled = true; }
      body += tube(175,70,left) + tube(305,70,right) + text(175,213,leftLabel,'scene-label') + text(305,213,rightLabel,'scene-label');
      if (type === 'compare-setup') body += dropper('NH₄Cl',305);
      if (type === 'split') body += `<circle class="transfer-drop" cx="197" cy="39" r="3" fill="#80aaa1"/>`;
    } else if (type === 'centrifuge') {
      body = `<ellipse cx="240" cy="216" rx="91" ry="9" fill="#729d7f14"/><rect x="156" y="68" width="168" height="138" rx="28" fill="#e3eee5" stroke="#91aca0" stroke-width="2"/><circle cx="240" cy="122" r="59" fill="#f7faf5" stroke="#94b3a3" stroke-width="2"/><g class="centrifuge-rotor"><circle cx="240" cy="122" r="11" fill="#609284"/>${[0,60,120,180,240,300].map(angle => `<g transform="rotate(${angle} 240 122)"><path d="M240 106V78" stroke="#9ab5a5" stroke-width="5"/><rect x="234" y="75" width="12" height="29" rx="6" fill="#fafbf2" stroke="#5e8d7d"/><rect x="235" y="76" width="10" height="8" rx="3" fill="#becbb9"/></g>`).join('')}</g><rect x="210" y="187" width="60" height="11" rx="4" fill="#488c77"/>${text(240,35,'Ly tâm · tách rắn và lỏng')}`;
    } else if (type === 'decant') {
      body += `<g transform="translate(-52 -15) rotate(24 240 115)">${tube(240,71,{ppt:true,settled:true})}</g>${tube(305,85)}<path d="M239 95Q289 85 305 140" fill="none" stroke="#87b6a9" stroke-width="3" stroke-dasharray="5 6"/>${text(168,36,'Giữ lại tủa','scene-label')}${text(317,43,'Tách dung dịch','scene-label')}`;
    } else if (type === 'rack') {
      body += tube(165,65,{color:'#d78d50'}) + tube(240,55,{color:'#8759b4'}) + tube(315,65,{ppt:true});
      body += '<rect x="126" y="158" width="228" height="13" rx="5" fill="#a1bca7"/><path d="M136 171v42m208-42v42" stroke="#95b09d" stroke-width="9"/>';
    } else {
      const options = { initial: true };
      if (['precipitate','wash'].includes(type) || model.initialPpt) options.ppt = true;
      if (['dissolve','mercury'].includes(type)) { options.ppt = true; options.pptClass = 'dissolving'; if(type === 'mercury') options.pptColor = '#ea542c'; }
      if (type === 'reform') { options.ppt = true; options.pptClass = 'reforming'; }
      if (type === 'transient') { options.ppt = true; options.pptClass = 'transient'; }
      if (type === 'bismuth') { options.ppt = true; options.pptClass = 'bi-solid'; options.pptColor = '#343239'; options.color = '#e99a38'; options.colorClass = 'bi-solution'; }
      if (type === 'color' || type === 'tint') { options.color = model.color || '#9b6dbf'; if(type === 'tint') options.colorClass = ''; }
      if (type === 'gas') options.gas = true;
      if (type === 'solid-add') options.solids = true;
      if (type === 'layers' || model.layers) options.layers = true;
      if (type === 'shake') options.shake = true;
      body += tube(240,71,options);
      if (['add','wash','solid-add','sample'].includes(type)) body += dropper(type === 'sample' ? 'Dung dịch gốc' : model.reagent);
      if (type === 'wash') body += text(139,150,'Rửa phần tủa','scene-label');
      if (type === 'precipitate') body += `<path d="M269 182h43" stroke="#91ac9d" stroke-dasharray="3 3"/>${text(319,186,'Kết tủa','scene-label','start')}`;
      if (['heat','paper-pink','paper-clear'].includes(type)) body += heat();
      if (type === 'cotton' || model.cotton || ['smell','no-smell'].includes(type)) body += '<g fill="#fffdf6" stroke="#b4beb1"><ellipse cx="224" cy="63" rx="13" ry="9"/><ellipse cx="242" cy="61" rx="16" ry="12"/><ellipse cx="258" cy="64" rx="12" ry="8"/></g>';
      if (['paper-setup','paper-pink','paper-clear'].includes(type) || model.paper) body += paper(type === 'paper-pink');
      if (type === 'smell') body += `<g fill="none" stroke="#8c9f8e" stroke-width="1.5" stroke-dasharray="3 4">${[0,1,2].map(i => `<path class="smell-wave" d="M${220+i*21} 48q-12-14 0-27t0-15"/>`).join('')}</g>${text(338,115,'Ký hiệu mùi','scene-label')}`;
      if (type === 'no-smell') body += `${text(338,115,'Không mùi este','scene-label')}`;
      if (type === 'cool') body += `<path d="M180 134v61q0 13 15 13h90q15 0 15-13v-61" fill="#d3eaf05c" stroke="#8fb9bf" stroke-width="2"/><path d="M182 147h116" stroke="#a3c7cb"/>${[0,1,2].map(i => `<g class="cold-spark" transform="translate(${188+i*48} 174)" stroke="#82aeb9"><path d="M-6 0h12M0-7v14M-4-5l8 10M-4 5l8-10"/></g>`).join('')}${text(340,97,'Làm lạnh 5 phút','scene-label')}`;
      if (type === 'reform') body += `${text(240,25,'Có tủa → tan → có tủa lại','scene-label')}`;
      if (type === 'bismuth') body += text(240,25,'Tủa đen → dung dịch cam','scene-label');
      if (type === 'mercury') body += text(240,25,'Tủa đỏ cam → tan','scene-label');
      if (type === 'gas') body += `${text(309,90,'CO₂ ↑','scene-label')}`;
      if (type === 'unmatched') body += `<circle cx="321" cy="112" r="16" fill="#edf0e8" stroke="#b5bfae"/>${text(321,116,'?')}${text(321,148,'Không khớp','scene-label')}`;
      if (type === 'observe') body += `<path d="M292 125q21-24 42 0q-21 24-42 0" fill="#e2efe8" stroke="#90afa0"/><circle cx="313" cy="125" r="6" fill="#5d9383"/>`;
      if (model.reagent && !['add','wash','solid-add','gas','cool'].includes(type)) body += text(240,32,model.reagent,'scene-label');
    }
    const paired = ['compare-cloudy','compare-same','compare-setup','split','clear-or-dissolve','halides','slow-ppt','separate','decant','rack','centrifuge','cool'].includes(type);
    const fullHeight = ['sample','add','solid-add','wash','heat','cool','cotton','smell','no-smell','paper-setup','paper-pink','paper-clear','observe','bismuth','mercury','reform','centrifuge','split','rack'].includes(type);
    const miniBox = paired ? (fullHeight ? '130 -6 220 231' : '135 45 210 180') : (fullHeight ? '190 -6 100 225' : '190 48 100 165');
    const visibleBody = mini && !paired ? body.replace(/<text\b[\s\S]*?<\/text>/g, '') : body;
    return `<svg class="lab-svg ${paired ? 'paired-scene' : 'single-scene'}" viewBox="${mini ? miniBox : '100 -6 330 240'}" ${mini ? 'aria-hidden="true"' : `role="img" aria-labelledby="${id}-title"`} xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">${esc(model.label)}</title><defs>${defs.join('')}</defs>${visibleBody}</svg>`;
  }
  return { render, esc };
})();
