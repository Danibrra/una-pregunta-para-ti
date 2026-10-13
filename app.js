'use strict';
const DEFAULTS = Object.freeze({
  recipient: '',
  question: '¿Puedo ser tu novio?',
  heading: 'My love',
  signature: '',
  letter: `Quiero que sepas que lo que siento por ti es sincero. Desde que llegaste a mi vida, has despertado en mí sentimientos que no quiero seguir guardándome. Me gustas mucho, y no solamente por tu forma de ser o por lo bonito que eres, sino también por la manera en que me haces sentir cuando hablo contigo, cuando te veo o simplemente cuando pienso en ti.

La verdad, quiero estar contigo. Quiero tener la oportunidad de conocerte más, compartir momentos a tu lado, hacerte sonreír, apoyarte cuando las cosas no vayan bien y demostrarte con hechos que mis sentimientos son reales. No te prometo que todo será perfecto, pero sí que, si me das la oportunidad, voy a poner de mi parte para que podamos construir algo bonito juntos.

No quiero que pienses que te digo esto por un momento o por una simple ilusión. Te lo digo porque realmente me interesas y porque me gustaría que algún día podamos mirarnos y saber que tomamos la decisión de intentarlo. No sé qué pueda pasar en el futuro, pero sí sé que hoy quiero estar contigo, quiero elegirte y quiero descubrir si podemos llegar a ser algo más que dos personas que se gustan.

No espero que me respondas lo que quiero escuchar, solo quiero que sepas lo que hay en mi corazón. Me gustaría tener la oportunidad de demostrarte cuánto puedes llegar a significar para mí y, sobre todo, de hacerte sentir una persona querida, valorada y especial. Porque si hay algo que tengo claro, es que no quiero quedarme con las ganas de intentarlo contigo.`
});
const STORAGE_KEY = 'una-pregunta-para-ti:v1';
let config = {...DEFAULTS};
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved && typeof saved === 'object') {
    for (const key of Object.keys(DEFAULTS)) if (typeof saved[key] === 'string') config[key] = saved[key];
  }
} catch (_) { /* The page also works without browser storage. */ }
const stage = document.querySelector('#stage');
const paper = document.querySelector('#paper');
const restart = document.querySelector('#restart');
const editor = document.querySelector('#editor');
let currentScene = 'welcome';
let returnScene = 'welcome';
let petalsTimer;

function node(tag, attributes = {}, text) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') el.className = value;
    else el.setAttribute(key, value);
  }
  if (text !== undefined) el.textContent = text;
  return el;
}
function makeButton(label, next, secondary = false) {
  const button = node('button', {class: 'red-button' + (secondary ? ' secondary' : ''), type: 'button'}, label);
  button.addEventListener('click', () => render(next));
  return button;
}
function makeCat(pair = false, mood = '') {
  const wrap = node('div', {class: 'cat-wrap'});
  wrap.append(node('img', {src: pair ? 'assets/cats.webp' : 'assets/kitten.webp', class: 'cat' + (pair ? ' couple' : ''), alt: pair ? 'Dos gatitos juntos' : 'Un gatito para ti', width: pair ? '220' : '160', height: '180'}));
  if (mood) wrap.append(node('span', {class: 'mood', 'aria-hidden': 'true'}, mood));
  return wrap;
}
function questionTitle() {
  const heading = node('h1', {tabindex: '-1'});
  if (config.question.trim() === DEFAULTS.question) {
    heading.append(node('span', {class: 'question-small'}, '¿Puedo ser tu'), node('span', {}, 'novio?'));
  } else heading.textContent = config.question;
  return heading;
}
function render(scene, focus = true) {
  currentScene = scene;
  clearTimeout(petalsTimer);
  document.querySelector('#petals').replaceChildren();
  paper.classList.toggle('is-letter', scene === 'letter');
  restart.hidden = scene === 'welcome';
  const content = node('section', {class: 'scene ' + scene});
  const actions = node('div', {class: 'actions'});
  if (scene === 'welcome') {
    content.append(makeCat(), node('h1', {tabindex: '-1'}, 'Hey!'));
    if (config.recipient) content.append(node('p', {class: 'recipient-line'}, config.recipient + ', esto es para ti.'));
    const intro = node('p');
    intro.append(document.createTextNode('Hice algo para ti,'), node('br'), document.createTextNode('¿quieres verlo?'));
    content.append(intro);
    actions.append(makeButton('Sí', 'question'), makeButton('No', 'angry', true));
  } else if (scene === 'angry') {
    returnScene = 'welcome';
    content.append(makeCat(false, '?!'), node('h1', {tabindex: '-1'}, '¡CÓMO TE ATREVES!'));
    content.append(node('p', {}, 'El gatito tenía una sorpresa…'));
    actions.append(makeButton('Volver', returnScene));
  } else if (scene === 'question') {
    content.classList.add('question-scene');
    content.append(node('span', {class: 'tiny-heart', 'aria-hidden': 'true'}, '♡'));
    if (config.recipient) content.append(node('p', {class: 'recipient-line'}, config.recipient + '…'));
    content.append(questionTitle());
    actions.append(makeButton('Sí', 'celebrate'), makeButton('No', 'rejected', true));
  } else if (scene === 'rejected') {
    returnScene = 'question';
    content.append(makeCat(false, '…'), node('h1', {tabindex: '-1'}, '¿Acabas de decir que NO?'));
    content.append(node('p', {}, 'Está bien, tú decides.'));
    actions.append(makeButton('Volver', returnScene));
  } else if (scene === 'celebrate') {
    content.append(makeCat(true));
    const title = node('h1', {tabindex: '-1'}, '¡Salud por nuestro AMOR! ');
    title.append(node('span', {class: 'heart-mark', 'aria-hidden': 'true'}, '♡'));
    content.append(title, node('p', {}, 'Espera, hay más :3'));
    actions.append(makeButton('Abrir carta', 'letter'));
    petalsTimer = setTimeout(celebrate, 200);
  } else if (scene === 'letter') {
    const letter = node('article', {class: 'letter'});
    letter.append(node('p', {class: 'letter-kicker'}, config.recipient ? 'PARA ' + config.recipient.toLocaleUpperCase('es') : 'UNAS PALABRAS PARA TI'));
    letter.append(node('h1', {tabindex: '-1'}, config.heading));
    for (const paragraph of config.letter.split(/\n\s*\n/).filter(p => p.trim())) letter.append(node('p', {}, paragraph.trim()));
    if (config.signature) letter.append(node('p', {class: 'signature'}, config.signature));
    letter.append(node('div', {class: 'letter-end', 'aria-hidden': 'true'}, '♡'));
    stage.replaceChildren(letter);
    afterRender(focus);
    return;
  }
  content.append(actions);
  stage.replaceChildren(content);
  afterRender(focus);
}
function afterRender(focus) {
  requestAnimationFrame(() => {
    drawFrame();
    if (focus) {
      stage.querySelector('h1')?.focus({preventScroll: true});
      if (window.scrollY > 150) window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  });
}
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const field = document.querySelector('#petals');
  for (let i = 0; i < 22; i++) {
    const heart = node('span', {class: 'petal'}, i % 3 ? '♡' : '♥');
    heart.style.left = (4 + Math.random() * 92) + '%';
    heart.style.setProperty('--delay', (Math.random() * 2) + 's');
    heart.style.setProperty('--duration', (4 + Math.random() * 3) + 's');
    heart.style.fontSize = (11 + Math.random() * 13) + 'px';
    field.append(heart);
  }
}
function drawFrame() {
  const width = paper.clientWidth, height = paper.clientHeight;
  const svg = document.querySelector('#ribbon-frame');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  function outline(offset, phase) {
    const inset = 13 + offset, amplitude = width < 600 ? 4 : 5;
    const perimeter = 2 * (width + height - 4 * inset);
    const points = [];
    const corner = 14;
    const sides = [
      [inset+corner,inset,width-inset-corner,inset,0,1],
      [width-inset,inset+corner,width-inset,height-inset-corner,-1,0],
      [width-inset-corner,height-inset,inset+corner,height-inset,0,-1],
      [inset,height-inset-corner,inset,inset+corner,1,0]
    ];
    let distance = 0;
    for (const [x1,y1,x2,y2,nx,ny] of sides) {
      const length = Math.hypot(x2-x1,y2-y1), count = Math.ceil(length / 3);
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const taper = Math.min(1, t*length/20, (1-t)*length/20);
        const wave = Math.sin((distance + t*length) / 15 + phase) * amplitude * taper;
        points.push([x1+(x2-x1)*t+nx*wave,y1+(y2-y1)*t+ny*wave]);
      }
      distance += length;
    }
    return 'M' + points.map(([x,y]) => x.toFixed(1)+','+y.toFixed(1)).join(' L') + ' Z';
  }
  document.querySelector('#frame-navy').setAttribute('d', outline(0, 0));
  document.querySelector('#frame-red').setAttribute('d', outline(6, .9));
}
new ResizeObserver(drawFrame).observe(paper);
restart.addEventListener('click', () => render('welcome'));
const fields = {recipient:'recipient', question:'question', heading:'letter-heading', letter:'letter-text', signature:'signature'};
function fillEditor(data) {
  for (const [key, id] of Object.entries(fields)) document.getElementById(id).value = data[key];
}
document.querySelector('#edit').addEventListener('click', () => {
  fillEditor(config);
  document.querySelector('#editor-status').textContent = '';
  editor.showModal();
});
document.querySelector('#close-editor').addEventListener('click', () => editor.close());
editor.addEventListener('click', event => {
  if (event.target !== editor) return;
  const rect = editor.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) editor.close();
});
document.querySelector('#restore').addEventListener('click', () => {
  fillEditor(DEFAULTS);
  document.querySelector('#editor-status').textContent = 'Texto original restaurado. Pulsa Guardar y ver para aplicarlo.';
});
document.querySelector('#editor-form').addEventListener('submit', event => {
  event.preventDefault();
  const next = {};
  for (const [key,id] of Object.entries(fields)) next[key] = document.getElementById(id).value.trim();
  if (!next.question || !next.heading || !next.letter) return;
  config = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch (_) {}
  editor.close();
  render('welcome');
});
render('welcome', false);
