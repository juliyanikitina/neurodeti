const modules = [...document.querySelectorAll('.curriculum details')];
const expandButton = document.querySelector('.expand-modules');
const printButton = document.querySelector('.print-program');

function updateExpandButton() {
  const allOpen = modules.every(module => module.open);
  expandButton.textContent = allOpen ? 'Свернуть все' : 'Раскрыть все';
  expandButton.setAttribute('aria-pressed', String(allOpen));
}

expandButton.hidden = false;
printButton.hidden = false;
expandButton.addEventListener('click', () => {
  const open = modules.some(module => !module.open);
  modules.forEach(module => { module.open = open; });
  updateExpandButton();
});
modules.forEach(module => module.addEventListener('toggle', updateExpandButton));
printButton.addEventListener('click', () => window.print());

let closedBeforePrint = [];
window.addEventListener('beforeprint', () => {
  closedBeforePrint = modules.filter(module => !module.open);
  closedBeforePrint.forEach(module => { module.open = true; });
});
window.addEventListener('afterprint', () => {
  closedBeforePrint.forEach(module => { module.open = false; });
  closedBeforePrint = [];
});
