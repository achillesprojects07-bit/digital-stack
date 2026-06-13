const VERSION = 'V1.0';
const STORAGE_INPUTS = 'contentCompass.inputs.v1';
const STORAGE_CURRENT_PLAN = 'contentCompass.currentPlan.v1';
const STORAGE_ARCHIVE = 'contentCompass.archive.v1';

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

const FORM = $('#directorForm');
const OUTPUT = $('#outputPanel');
const PLAN_OUTPUT = $('#planOutput');
const TOAST = $('#toast');

const pillarRules = [
  { name: 'Sea & Stillness', terms: ['beach','sea','assos','shore','swim','sand','water','island','coast','sunset'] },
  { name: 'Food', terms: ['food','lunch','dinner','breakfast','coffee','cafe','café','bakery','taverna','restaurant','market','eat','meal','bread','pastry'] },
  { name: 'On the Road', terms: ['airport','drive','car','road','ferry','arrive','arrival','leave','leaving','travel','transit','train','plane'] },
  { name: 'Small Things', terms: ['door','window','curtain','light','shadow','chair','texture','balcony','notebook','journal','sketch'] },
  { name: 'Ordinary Greece', terms: ['halandri','athens','street','walk','greece','greek','home','neighborhood','errand','grocery'] },
  { name: 'The Woman', terms: ['age','56','makeup','beauty','work','strategy','journal','confidence','lola','grandmother'] }
];

const pillarCopy = {
  'The Woman': {
    direction: 'Today is about the woman in the frame: not proving anything, just moving through the day with taste, humor, and evidence.',
    hook: ['I am not reinventing myself.', 'Apparently, editing counts.', 'This is not a glow-up.', 'I brought myself this far.', 'Fifty-six has excellent timing.'],
    turn: 'There is a particular freedom in not needing the day to approve of you.',
    landing: 'Some chapters do not need fireworks. They need better lighting.'
  },
  'Ordinary Greece': {
    direction: 'Today is about ordinary Greece: coffee, streets, language, light, and the small confidence of noticing what most people rush past.',
    hook: ['Apparently, quiet is also content.', 'Ordinary Greece is doing enough.', 'No landmark. Better.', 'The street understood the assignment.', 'I came for Greece. Stayed for this.'],
    turn: 'I keep thinking the big story will introduce itself, then a street corner does it quietly.',
    landing: 'Not every day announces itself. Some days just sit beside you.'
  },
  'Sea & Stillness': {
    direction: 'Today is about sea and stillness: no apology, no productivity speech, just proof that rest can have a backbone.',
    hook: ['The sea is doing the work.', 'I have no dramatic update.', 'Rest, but make it firm.', 'No plan survived the sea.', 'Quiet arrived before I did.'],
    turn: 'The older I get, the less I confuse movement with proof.',
    landing: 'Some days are not for improving. Some days are for being near water.'
  },
  'Food': {
    direction: 'Today is about food without moral drama: coffee, bread, lunch, appetite, pleasure, and the Filipina instinct to remember life through meals.',
    hook: ['Growth, but with chips.', 'I ordered the evidence.', 'Food is also a diary.', 'No moral lesson. Just lunch.', 'The table had opinions.'],
    turn: 'I have never trusted a life that makes food too complicated.',
    landing: 'Some memories do not need captions. They need a table.'
  },
  'Small Things': {
    direction: 'Today is about small things: doors, curtains, hands, shadows, textures, the beauty that does not announce itself.',
    hook: ['The small things won again.', 'This is the whole point.', 'A door almost ruined me.', 'The light had a plan.', 'Nothing happened. I noticed.'],
    turn: 'There are days when the details are more honest than the itinerary.',
    landing: 'I am learning to respect anything that does not beg to be seen.'
  },
  'On the Road': {
    direction: 'Today is about being on the road: arrivals, departures, bags, windows, waiting, and the strange little dignity of transitions.',
    hook: ['Arrivals are never neutral.', 'I packed lightly. Emotionally, no.', 'The road had other plans.', 'Transitions need better PR.', 'Leaving is also content.'],
    turn: 'There is always one version of me leaving and another one pretending she packed correctly.',
    landing: 'The road does not explain itself. It just asks you to keep looking.'
  }
};

const moodLines = {
  'Quiet': 'Keep the voice sparse. Let the visuals breathe.',
  'Witty': 'Add one dry line, then step away from the joke.',
  'Observant': 'Let the story come from details, not declarations.',
  'Elegant': 'Use cleaner framing, slower clips, and less text.',
  'Tired but showing up': 'Keep it honest, not dramatic. The day does not need hero music.',
  'Soft': 'Use warm details, hands, fabric, coffee, sea, light.',
  'Bold': 'Use a stronger hook and one direct face or walking shot.',
  'Restless': 'Use movement: walking, turning, leaving, arriving.',
  'Hungry': 'Let food be the structure. No guilt. No explanation.',
  'In transit': 'Use windows, bags, roads, signs, waiting, arrival.',
  'Slightly dramatic but pretending not to be': 'Let the drama be dry, small, and beautifully underplayed.'
};

const timeNotes = {
  Morning: 'Morning light: shoot near windows or shaded street edges. Avoid harsh overhead sun.',
  Midday: 'Midday light: shoot in shade, under awnings, or indoors near soft window light.',
  Afternoon: 'Afternoon light: watch for shadows, doorways, and warm side light.',
  'Golden hour': 'Golden hour: shoot everything. Walking shots, face, hands, road, sea, food, quiet ending.',
  Evening: 'Evening: prioritize warm lamps, tables, reflections, silhouettes, and ambient sound.',
  Night: 'Night: use signs, lamps, table light, and close details. Do not force wide dark shots.'
};

function showToast(message) {
  TOAST.textContent = message;
  TOAST.classList.add('show');
  setTimeout(() => TOAST.classList.remove('show'), 2200);
}

function getInputs() {
  return {
    location: $('#location').value.trim(),
    activity: $('#activity').value.trim(),
    mood: $('#mood').value,
    energy: $('#energy').value,
    timeOfDay: $('#timeOfDay').value,
    filmedOnce: $('#filmedOnce').value,
    pillar: $('#pillar').value
  };
}

function setInputs(data) {
  if (!data) return;
  $('#location').value = data.location || '';
  $('#activity').value = data.activity || '';
  $('#mood').value = data.mood || 'Quiet';
  $('#energy').value = data.energy || 'Medium';
  $('#timeOfDay').value = data.timeOfDay || 'Morning';
  $('#filmedOnce').value = data.filmedOnce || 'No';
  $('#pillar').value = data.pillar || 'auto';
}

function inferPillar(inputs) {
  if (inputs.pillar && inputs.pillar !== 'auto') return inputs.pillar;
  const text = `${inputs.location} ${inputs.activity} ${inputs.mood}`.toLowerCase();
  let best = { name: 'Ordinary Greece', score: 0 };
  for (const rule of pillarRules) {
    const score = rule.terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
    if (score > best.score) best = { name: rule.name, score };
  }
  return best.name;
}

function pick(arr, seed) {
  const value = Array.from(seed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return arr[value % arr.length];
}

function cleanActivity(activity) {
  return activity.replace(/\s+/g, ' ').replace(/[.]+$/,'');
}

function buildScript(inputs, pillar) {
  const copy = pillarCopy[pillar];
  const seed = `${inputs.location}-${inputs.activity}-${inputs.mood}-${inputs.timeOfDay}`;
  const hook = pick(copy.hook, seed);
  const activity = cleanActivity(inputs.activity).toLowerCase();
  const location = inputs.location;
  const moodInstruction = moodLines[inputs.mood] || moodLines.Observant;
  const lines = [
    hook,
    '',
    `I am in ${location}, doing the very ambitious work of ${activity}.`,
    copy.turn,
    `There is ${sensoryPhrase(pillar, inputs)} here: enough light, enough texture, enough evidence that the day has a point without making a speech.`,
    wittyRelease(pillar, inputs),
    copy.landing
  ];
  return { hook, body: lines.join('\n'), moodInstruction };
}

function sensoryPhrase(pillar, inputs) {
  const bank = {
    'The Woman': ['a mirror, a street, and one woman not asking permission', 'coffee, fabric, skin, and a little nerve', 'a face, a walk, and a day that does not get to vote'],
    'Ordinary Greece': ['coffee, street light, low voices, and a chair that has seen things', 'balconies, cups, footsteps, and the soft noise of ordinary Greece', 'a small street, good light, and no need for a landmark'],
    'Sea & Stillness': ['sea, stone, towel, wind, and the discipline of not rushing', 'water, light, quiet, and absolutely no productivity announcement', 'a chair, a shoreline, and a woman minding her own peace'],
    'Food': ['a table, a plate, warm bread, and no moral committee', 'coffee, food, hands, and the kind of appetite that deserves respect', 'a meal doing more storytelling than I expected'],
    'Small Things': ['doors, shadows, curtains, hands, and the nerve of small things', 'a line of light, a table corner, and a texture that refused to be background', 'ordinary objects behaving like evidence'],
    'On the Road': ['bags, windows, roads, waiting, and the tiny theater of departure', 'a moving view, a half-packed thought, and one woman pretending to travel lightly', 'signs, seats, roads, and the strange honesty of being between places']
  };
  return pick(bank[pillar], `${inputs.location}-${inputs.activity}`);
}

function wittyRelease(pillar, inputs) {
  const bank = {
    'The Woman': ['Obviously, we can.', 'Editing. Not auditioning.', 'A small distinction. A useful one.'],
    'Ordinary Greece': ['Tourism was not consulted.', 'No brochure was harmed.', 'The itinerary is offended.'],
    'Sea & Stillness': ['The sea has seniority.', 'I will not be taking questions from my to-do list.', 'Rest, but with boundaries.'],
    'Food': ['Growth, but with chips.', 'No guilt was invited.', 'The fork has notes.'],
    'Small Things': ['The chair understood me.', 'The curtain was being dramatic first.', 'A shadow did the most.'],
    'On the Road': ['I packed lightly. Spiritually, unclear.', 'My bag is lying about its weight.', 'Departure has a personality.']
  };
  return pick(bank[pillar], `${inputs.mood}-${inputs.timeOfDay}`);
}

function buildScenes(inputs, pillar, script) {
  const location = inputs.location;
  const canFilm = inputs.filmedOnce === 'Yes';
  const genericSelf = canFilm
    ? `One 4-second shot someone takes of you walking into or through ${location}. Frame from behind or side, vertical, no posing.`
    : `Self-shot only: phone chest-height, slow walking clip, or a hand/coffee/notebook detail.`;
  const sceneBank = {
    'The Woman': [
      ['Hook visual', genericSelf, 'Cover photo: you from side or back, with negative space for text.'],
      ['Personal turn', 'Close detail: hand fixing sunglasses, bag, lipstick, notebook, or sleeve.', 'Photo: hands/detail, elegant but not staged.'],
      ['Sensory proof', `A slow pan of ${location}: light, table, doorway, mirror, or street.`, 'Photo: texture or doorway.'],
      ['Witty release', 'A tiny visual contradiction: good outfit with practical shoes, coffee beside notebook, wind interrupting glamour.', 'Photo: imperfect candid detail.'],
      ['Soft landing', 'Quiet ending: walking away, closing notebook, cup on table, or doorway after you pass.', 'Photo: final frame with space.']
    ],
    'Ordinary Greece': [
      ['Hook visual', `Exterior or first view of ${location}. Hold 3 seconds before moving.`, 'Cover photo: street/café with empty space for hook text.'],
      ['Personal turn', 'Coffee, table, receipt, chair, or your hand entering the frame.', 'Photo: overhead table shot.'],
      ['Sensory proof', 'Slow walking clip: balcony, pavement, bakery sign, quiet street, light on wall.', 'Photo: street detail.'],
      ['Witty release', 'Something ordinary but expressive: chair, napkin, cup, little sign, badly parked scooter.', 'Photo: dry-humor detail.'],
      ['Soft landing', 'Still ending: empty chair, cup after coffee, street after you leave, light on wall.', 'Photo: calm closing image.']
    ],
    'Sea & Stillness': [
      ['Hook visual', 'Wide sea shot before you enter the frame. Hold still for 4 seconds.', 'Cover photo: sea with negative space.'],
      ['Personal turn', genericSelf, 'Photo: silhouette facing water.'],
      ['Sensory proof', 'Close-ups: towel, feet on stone/sand, water, book, coffee, hair/fabric in wind.', 'Photo: texture detail.'],
      ['Witty release', 'A practical object near the sea: slippers, bag, snacks, chair, sunscreen, cup.', 'Photo: funny ordinary detail.'],
      ['Soft landing', 'Quiet ending: empty chair, water moving, curtain, door, or shoreline with no talking.', 'Photo: stillness frame.']
    ],
    'Food': [
      ['Hook visual', 'Table before food arrives or first plate landing on the table.', 'Cover photo: food/table with space for text.'],
      ['Personal turn', 'Hand reaching for coffee, bread, fork, menu, or plate.', 'Photo: hands and food detail.'],
      ['Sensory proof', '3 close-ups: steam, texture, sauce, bread tearing, cup, table setting.', 'Photo: overhead table shot.'],
      ['Witty release', 'The most honest food detail: crumbs, messy plate, extra sauce, chips, second coffee.', 'Photo: imperfect food proof.'],
      ['Soft landing', 'After-meal shot: empty plate, folded napkin, bill, table light, street outside.', 'Photo: final table image.']
    ],
    'Small Things': [
      ['Hook visual', `Find one small thing at ${location}: door, curtain, chair, wall, shadow, cup. Film it like it matters.`, 'Cover photo: detail with clean negative space.'],
      ['Personal turn', 'Your hand entering the frame: touching cup, notebook, railing, door, fabric.', 'Photo: hand/detail shot.'],
      ['Sensory proof', 'Make a 5-clip texture sequence: light, shadow, object, street, your movement.', 'Photo: strongest texture.'],
      ['Witty release', 'Choose one object that looks unintentionally dramatic. Hold the shot without explaining.', 'Photo: dry visual joke.'],
      ['Soft landing', 'End on stillness: the same detail after you leave the frame.', 'Photo: quiet ending image.']
    ],
    'On the Road': [
      ['Hook visual', 'Bag, window, road, sign, seat, or first view after arrival. Hold steady.', 'Cover photo: road/window/bag with text space.'],
      ['Personal turn', genericSelf, 'Photo: walking/bag/silhouette from behind.'],
      ['Sensory proof', 'Motion clips: road through window, hand on bag, shoes, signage, coffee stop.', 'Photo: transit detail.'],
      ['Witty release', 'A travel imperfection: messy bag, coffee balancing, wrong angle, tired shoes.', 'Photo: honest travel detail.'],
      ['Soft landing', 'Arrival ending: door opening, key, hallway, first view, or bag placed down.', 'Photo: arrival frame.']
    ]
  };
  return sceneBank[pillar].map((item, index) => ({
    number: index + 1,
    beat: item[0],
    video: item[1],
    photo: item[2]
  }));
}

function buildPhotoList(inputs, pillar) {
  const shared = [
    'One vertical cover photo with empty space for text overlay.',
    'One natural photo of you from behind, side, or hands only.',
    'One texture photo: wall, table, curtain, stone, menu, shadow, or street detail.',
    'One evidence photo: coffee, food, notebook, bag, shoes, receipt, or road.',
    'One quiet ending photo: empty chair, doorway, sea, table after meal, or street after leaving.'
  ];
  if (pillar === 'Food') shared.splice(1, 0, 'One overhead table photo before you touch the food.');
  if (pillar === 'Sea & Stillness') shared.splice(1, 0, 'One wide sea photo with no people in the frame.');
  return shared;
}

function buildCaption(inputs, pillar, hook) {
  const tagMap = {
    'The Woman': '#over50 #filipina #agingpowerfully #midlifewoman #editinglife',
    'Ordinary Greece': '#over50 #filipina #ordinarygreece #maturetraveler #greecediary',
    'Sea & Stillness': '#over50 #filipina #seastillness #maturetraveler #assosgreece',
    'Food': '#over50 #filipina #greekfood #foodwithoutguilt #greeceeats',
    'Small Things': '#over50 #filipina #smallthings #slowcontent #noticinglife',
    'On the Road': '#over50 #filipina #maturetraveler #ontheroad #greecearrival'
  };
  const captions = {
    'The Woman': 'Not reinventing. Editing.',
    'Ordinary Greece': 'Ordinary Greece. Very little happened. Perfect.',
    'Sea & Stillness': 'No transformation plan. Just sea.',
    'Food': 'No lesson. Just lunch with evidence.',
    'Small Things': 'Nothing happened. I noticed.',
    'On the Road': 'Leaving is also a mood.'
  };
  return `${captions[pillar]} ${tagMap[pillar]}`;
}

function buildEditBrief(inputs, pillar, script, scenes) {
  const duration = inputs.energy === 'Low' ? '35–50 seconds' : inputs.energy === 'High' ? '60–75 seconds' : '45–60 seconds';
  return [
    `Format: b-roll + voiceover. Duration: ${duration}.`,
    `Hook text overlay in first 1.5 seconds: “${script.hook}”`,
    `Clip order: ${scenes.map(s => `Scene ${s.number}`).join(' → ')}.`,
    'Clip length: 2–4 seconds each. Let one quiet shot breathe for 5 seconds near the end.',
    `Music: low-volume warm instrumental or soft Greek café/sea mood, 8–12% under voiceover. Avoid lyrics competing with the voice.`,
    'Text overlays: keep to 3 max — hook, witty release, soft landing.',
    `Thumbnail: use the cover photo with this text: “${script.hook}”`,
    `Light note: ${timeNotes[inputs.timeOfDay]}`
  ];
}

function generatePlan(inputs) {
  const pillar = inferPillar(inputs);
  const script = buildScript(inputs, pillar);
  const scenes = buildScenes(inputs, pillar, script);
  const photoList = buildPhotoList(inputs, pillar);
  const caption = buildCaption(inputs, pillar, script.hook);
  const editBrief = buildEditBrief(inputs, pillar, script, scenes);
  const now = new Date();
  return { id: `plan-${now.getTime()}`, createdAt: now.toISOString(), inputs, pillar, direction: pillarCopy[pillar].direction, script, scenes, photoList, caption, editBrief };
}

function renderPlan(plan) {
  PLAN_OUTPUT.innerHTML = `
    <article class="output-card highlight">
      <p class="kicker">Story direction</p>
      <p class="big-line">${escapeHtml(plan.direction)}</p>
      <div class="meta-grid">
        <div class="meta-pill"><span>Location</span><strong>${escapeHtml(plan.inputs.location)}</strong></div>
        <div class="meta-pill"><span>Mood</span><strong>${escapeHtml(plan.inputs.mood)}</strong></div>
        <div class="meta-pill"><span>Pillar</span><strong>${escapeHtml(plan.pillar)}</strong></div>
        <div class="meta-pill"><span>Energy</span><strong>${escapeHtml(plan.inputs.energy)}</strong></div>
      </div>
    </article>

    <article class="output-card">
      <p class="kicker">Hook</p>
      <p class="big-line">${escapeHtml(plan.script.hook)}</p>
    </article>

    <article class="output-card">
      <p class="kicker">Voiceover script</p>
      <div class="script-box">${escapeHtml(plan.script.body)}</div>
      <p><strong>Direction:</strong> ${escapeHtml(plan.script.moodInstruction)}</p>
    </article>

    <article class="output-card">
      <p class="kicker">Scene-by-scene shooting list</p>
      ${plan.scenes.map(scene => `
        <div class="scene">
          <div class="scene-num">${scene.number}</div>
          <div>
            <p class="scene-title">${escapeHtml(scene.beat)}</p>
            <p><strong>Video:</strong> ${escapeHtml(scene.video)}</p>
            <p><strong>Photo:</strong> ${escapeHtml(scene.photo)}</p>
          </div>
        </div>`).join('')}
    </article>

    <article class="output-card">
      <p class="kicker">Must-take photos</p>
      <div class="checklist">
        ${plan.photoList.map((item, index) => `
          <label class="check-item" data-check="photo-${index}">
            <input type="checkbox" />
            <span>${escapeHtml(item)}</span>
          </label>`).join('')}
      </div>
    </article>

    <article class="output-card">
      <p class="kicker">Caption + hashtags</p>
      <p>${escapeHtml(plan.caption)}</p>
    </article>

    <article class="output-card">
      <p class="kicker">CapCut editing brief</p>
      <div class="checklist">
        ${plan.editBrief.map((item, index) => `
          <label class="check-item" data-check="edit-${index}">
            <input type="checkbox" />
            <span>${escapeHtml(item)}</span>
          </label>`).join('')}
      </div>
    </article>
  `;
  OUTPUT.classList.remove('hidden');
  OUTPUT.scrollIntoView({ behavior: 'smooth', block: 'start' });
  localStorage.setItem(STORAGE_CURRENT_PLAN, JSON.stringify(plan));
  wireChecks();
}

function wireChecks() {
  $$('.check-item input').forEach(input => {
    input.addEventListener('change', e => {
      e.target.closest('.check-item').classList.toggle('done', e.target.checked);
    });
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function planToText(plan) {
  return `CONTENT COMPASS ${VERSION}\n\nLOCATION\n${plan.inputs.location}\n\nMOOD\n${plan.inputs.mood}\n\nPILLAR\n${plan.pillar}\n\nSTORY DIRECTION\n${plan.direction}\n\nHOOK\n${plan.script.hook}\n\nVOICEOVER SCRIPT\n${plan.script.body}\n\nSCENES\n${plan.scenes.map(s => `${s.number}. ${s.beat}\nVideo: ${s.video}\nPhoto: ${s.photo}`).join('\n\n')}\n\nPHOTO LIST\n${plan.photoList.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\nCAPTION\n${plan.caption}\n\nCAPCUT BRIEF\n${plan.editBrief.map((p,i)=>`${i+1}. ${p}`).join('\n')}`;
}

function savePlan(plan) {
  const archive = JSON.parse(localStorage.getItem(STORAGE_ARCHIVE) || '[]');
  archive.unshift(plan);
  localStorage.setItem(STORAGE_ARCHIVE, JSON.stringify(archive.slice(0, 30)));
  renderArchive();
}

function renderArchive() {
  const archive = JSON.parse(localStorage.getItem(STORAGE_ARCHIVE) || '[]');
  const list = $('#archiveList');
  if (!archive.length) {
    list.className = 'archive-list empty-state';
    list.textContent = 'No saved plans yet.';
    return;
  }
  list.className = 'archive-list';
  list.innerHTML = archive.map(plan => {
    const date = new Date(plan.createdAt).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
    return `<div class="archive-item">
      <div>
        <strong>${escapeHtml(plan.script.hook)}</strong>
        <p>${date} · ${escapeHtml(plan.inputs.location)} · ${escapeHtml(plan.pillar)}</p>
      </div>
      <button class="ghost-btn restore-plan" data-id="${plan.id}" type="button">Open</button>
    </div>`;
  }).join('');
  $$('.restore-plan').forEach(btn => btn.addEventListener('click', () => {
    const plan = archive.find(item => item.id === btn.dataset.id);
    if (plan) renderPlan(plan);
  }));
}

FORM.addEventListener('submit', event => {
  event.preventDefault();
  const inputs = getInputs();
  if (!inputs.location || !inputs.activity) {
    showToast('Add location and activity first.');
    return;
  }
  localStorage.setItem(STORAGE_INPUTS, JSON.stringify(inputs));
  renderPlan(generatePlan(inputs));
});

$('#saveInputsBtn').addEventListener('click', () => {
  localStorage.setItem(STORAGE_INPUTS, JSON.stringify(getInputs()));
  showToast('Inputs saved on this device.');
});

$('#savePlanBtn').addEventListener('click', () => {
  const plan = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  if (!plan) return showToast('Generate a plan first.');
  savePlan(plan);
  showToast('Plan saved to archive.');
});

$('#copyPlanBtn').addEventListener('click', async () => {
  const plan = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  if (!plan) return showToast('Generate a plan first.');
  try {
    await navigator.clipboard.writeText(planToText(plan));
    showToast('Copied full plan.');
  } catch (error) {
    showToast('Copy failed. Select and copy manually.');
  }
});

$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Reset today’s inputs and current output? Saved archive will stay.')) return;
  FORM.reset();
  OUTPUT.classList.add('hidden');
  PLAN_OUTPUT.innerHTML = '';
  localStorage.removeItem(STORAGE_INPUTS);
  localStorage.removeItem(STORAGE_CURRENT_PLAN);
  showToast('Today reset.');
});

$('#clearArchiveBtn').addEventListener('click', () => {
  if (!confirm('Clear all saved plans on this device?')) return;
  localStorage.removeItem(STORAGE_ARCHIVE);
  renderArchive();
  showToast('Archive cleared.');
});

$('#loadSampleBtn').addEventListener('click', () => {
  setInputs({
    location: 'Halandri café',
    activity: 'coffee, walking, watching the street, maybe one bakery stop',
    mood: 'Observant',
    energy: 'Medium',
    timeOfDay: 'Morning',
    filmedOnce: 'No',
    pillar: 'auto'
  });
  showToast('Sample loaded. Generate when ready.');
});

function init() {
  setInputs(JSON.parse(localStorage.getItem(STORAGE_INPUTS) || 'null'));
  const current = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  if (current) renderPlan(current);
  renderArchive();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

init();
