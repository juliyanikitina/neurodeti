const $ = selector => document.querySelector(selector);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const motion = $('#motion');
function setMotion(value) {
  paused = value;
  document.body.classList.toggle('no-motion', paused);
  document.dispatchEvent(new CustomEvent('motionchange', {detail: paused}));
  motion?.setAttribute('aria-pressed', String(paused));
  if (motion) motion.textContent = paused ? 'Включить движение' : 'Остановить движение';
}
setMotion(paused);
motion?.addEventListener('click', () => setMotion(!paused));
reduced.addEventListener('change', e => setMotion(e.matches));
$('.menu-toggle')?.addEventListener('click', e => {
  const open = e.currentTarget.getAttribute('aria-expanded') !== 'true';
  e.currentTarget.setAttribute('aria-expanded', String(open)); $('#nav').classList.toggle('open', open);
});
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => {
  $('#nav').classList.remove('open'); $('.menu-toggle').setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', e => {if(e.key==='Escape') {$('#nav')?.classList.remove('open');$('.menu-toggle')?.setAttribute('aria-expanded','false');}});
$('.accessibility-toggle')?.addEventListener('click', e => {
  const enabled = document.body.classList.toggle('large-text');
  e.currentTarget.textContent = enabled ? 'Обычный размер текста' : 'Увеличить текст';
  e.currentTarget.setAttribute('aria-pressed', String(enabled));
});
$('#world')?.addEventListener('pointermove', e => {
  if(paused || e.pointerType==='touch') return;
  const r=e.currentTarget.getBoundingClientRect();
  $('.world-image').style.transform = `scale(1.055) translate(${(e.clientX-r.left-r.width/2)*-.012}px,${(e.clientY-r.top-r.height/2)*-.012}px)`;
});
$('#world')?.addEventListener('pointerleave', () => { $('.world-image').style.transform=''; });
const projects = {
  film: {type:'Творческая мастерская',title:'Герой, которого<br>придумали вы',desc:'От рисунка или фотографии — к персонажу, сценарию и короткому мультфильму с собственным голосом и настроением.',steps:['Придумать героя и его историю','Создать изображения и оживить сцены','Добавить голос, музыку и собрать ролик']},
  site: {type:'Цифровая мастерская',title:'Ваше увлечение.<br>Ваш собственный сайт.',desc:'Космос, динозавры, любимые книги или семейное путешествие. Создаём страницу, которая расскажет о том, что вам интересно.',steps:['Продумать содержание и структуру','Поручить AI-агенту собрать первую версию','Проверить кнопки, текст и вид на телефоне']},
  app: {type:'Лаборатория полезных идей',title:'Маленькая идея.<br>Полезное приложение.',desc:'Семейный планер, викторина или коллекция прочитанных книг. Пробуем превратить знакомую задачу в работающий цифровой инструмент.',steps:['Описать задачу и действия пользователя','Создать прототип с агентом-разработчиком','Протестировать всей семьёй и улучшить']}
};
const filmMarkup = $('#project-art')?.innerHTML;
const art = {
  film:filmMarkup,
  site:'<div class="site-demo"><div class="demo-bar"><i></i><i></i><i></i></div><div class="demo-planet"></div><div class="demo-heading">Моя космическая<br>энциклопедия</div><div class="demo-lines"></div><div class="demo-lines short"></div><span class="demo-button">Исследовать космос</span></div><div class="project-sticker">От идеи до своей страницы</div>',
  app:'<div class="app-demo"><p>СЕМЕЙНЫЙ ПЛАНЕР</p><h4>Наши планы<br>на выходные</h4><div class="app-task"><b>✓</b>Придумать историю</div><div class="app-task"><b>✓</b>Нарисовать героя</div><div class="app-task"><b>+</b>Собрать мультфильм</div><span class="demo-button">Добавить идею</span></div><div class="project-sticker">Создано для нашей семьи</div>'
};
const tabs = [...document.querySelectorAll('[data-project]')];
function selectProject(tab) {
  const key=tab.dataset.project, p=projects[key];
  tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});
  $('#project-type').textContent=p.type;$('#project-title').innerHTML=p.title;$('#project-desc').textContent=p.desc;
  $('#project-steps').replaceChildren(...p.steps.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
  $('#project-art').innerHTML=art[key];$('#project-panel').setAttribute('aria-labelledby',tab.id);
}
tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>selectProject(tab));
  tab.addEventListener('keydown',e=>{
    let index;
    if(e.key==='ArrowRight') index=(i+1)%tabs.length;
    if(e.key==='ArrowLeft') index=(i+tabs.length-1)%tabs.length;
    if(e.key==='Home') index=0;if(e.key==='End') index=tabs.length-1;
    if(index!==undefined){e.preventDefault();tabs[index].focus();selectProject(tabs[index]);}
  });
});
const agents = {
  writer:['Сценарист','Помогает превратить «хочу мультик про космос» в понятную историю: герои, события, диалоги и план сцен.','«Помоги придумать историю о девочке, которая учит робота дружить. Предложи три разных финала».'],
  artist:['Художник','Помогает найти образ героя, подобрать цвет и свет, подготовить запросы для иллюстраций и раскадровки.','«У нас история про дружбу. Предложи три образа доброго робота и объясни, какие детали сделают его узнаваемым».'],
  coder:['Разработчик','Помогает превратить описание в страницы и работающие функции. Учимся уточнять задачу и проверять каждое изменение.','«Собери сайт о нашем мультфильме: главная страница, карточки героев и кнопка просмотра. Сначала предложи план».'],
  tester:['Проверяющий','Ищет несоответствия заданию и помогает составить план проверки. Его выводы тоже проверяет человек.','«Предложи, как проверить наш сайт на телефоне. Посмотри, все ли кнопки понятны и читается ли текст».']
};
document.querySelectorAll('[data-agent]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-agent]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  const [title,text,prompt]=agents[button.dataset.agent];$('#agent-title').textContent=title;$('#agent-text').textContent=text;$('#agent-prompt').textContent=prompt;
}));
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.section-heading,.family-photo,.family-story,.approach .split,.contact,.program-invite').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
  document.querySelectorAll('.lab-card').forEach((card, index) => {
    card.classList.add('reveal');
    card.style.setProperty('--entrance-delay', `${(index % 3) * 75}ms`);
    io.observe(card);
  });
}

const tutorSubject=$('#tutor-subject'),tutorLevel=$('#tutor-level'),tutorMethod=$('#tutor-method');
function tutorInstruction(){
  const subject=tutorSubject.value;
  const level={ 'Начинаю с основ':'Я начинаю с основ.', 'Есть базовые знания':'У меня уже есть базовые знания.', 'Хочу закрепить тему':'Я хочу закрепить тему.' }[tutorLevel.value];
  const method={ 'Давать подсказки по шагам':'Давай подсказки по шагам.', 'Объяснять на примерах':'Объясняй на понятных примерах и проверяй, могу ли я применить правило.', 'Задавать вопросы для самопроверки':'Задавай вопросы для самопроверки по одному, жди моего ответа и обсуждай его.' }[tutorMethod.value];
  const topic=subject==='Другой предмет'?'по выбранному предмету — сначала уточни его у меня':`по предмету «${subject}»`;
  return `Ты мой учебный помощник ${topic}. ${level} Сначала уточни тему и проверь, что я уже понимаю. ${method} Помоги мне самому прийти к решению. Если я ошибусь, объясни причину и предложи похожую задачу. Проверяй ход рассуждений, признавай неопределённость и не выдумывай факты.`;
}
[tutorSubject,tutorLevel,tutorMethod].filter(Boolean).forEach(select=>select.addEventListener('change',()=>{
  $('#tutor-prompt').textContent=tutorInstruction();$('#copy-status').textContent='';
}));
$('#copy-tutor')?.addEventListener('click',async()=>{
  try {await navigator.clipboard.writeText($('#tutor-prompt').textContent);$('#copy-status').textContent='Инструкция скопирована';}
  catch {$('#copy-status').textContent='Выделите и скопируйте текст инструкции вручную.';}
});
