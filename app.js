const VERSION = 'V2.2';
const STORAGE_INPUTS = 'contentCompass.inputs.v2.2';
const STORAGE_CURRENT_PLAN = 'contentCompass.currentPlan.v2.2';
const STORAGE_ARCHIVE = 'contentCompass.archive.v2.2';
const STORAGE_QUICK_MODE = 'contentCompass.quickMode.v2.2';
const OLD_KEYS = {
  inputs: 'contentCompass.inputs.v2.1',
  current: 'contentCompass.currentPlan.v2.1',
  archive: 'contentCompass.archive.v2.1',
  quick: 'contentCompass.quickMode.v2.1'
};
const SESSION_COUNTER_KEY = 'contentCompass.sessionCounter.v2.2';
const todaySeed = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
if (!sessionStorage.getItem(SESSION_COUNTER_KEY)) sessionStorage.setItem(SESSION_COUNTER_KEY, String(Date.now() % 997));

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
  { name: 'Ordinary Life', terms: ['street','walk','home','neighborhood','errand','grocery','cafe','café','city','market','mall','clinic','office','hotel','village','town','manila','la union','athens','greece','philippines'] },
  { name: 'The Woman', terms: ['age','56','makeup','beauty','work','strategy','journal','confidence','lola','grandmother'] }
];

const pillarCopy = {
  'The Woman': {
    direction: 'Today is about presence: a woman moving through the day with depth, grace, memory, and quiet strength.',
    hook: ['This age has its own light.', 'I know this version of me.', 'The mirror is softer now.', 'I am carrying many lives.', 'There is power in quiet.', 'I have earned this calm.', 'The day met me gently.', 'I am not rushing myself.', 'Some confidence arrives quietly.', 'My life has texture now.', 'I am here with history.', 'The woman stayed with herself.'],
    turn: ['I used to think confidence had to enter first. Now I know it can arrive quietly and still fill the room.', 'There is a tenderness in arriving at this age with more memory than fear.', 'Some days I do not need to explain who I am. I only need to move through the day honestly.', 'The older I get, the less I want to perform ease. I want to feel it.', 'There are years behind me, yes. But they are not weight. They are witness.', 'I am learning to let the frame hold the truth without dressing it up too much.'],
    landing: ['Some chapters do not need to be explained. They only need to be lived with care.', 'I want to remember the woman who was present for this small, ordinary day.', 'Maybe grace is simply staying soft without disappearing.', 'What remains is not the performance, but the feeling I carried home.']
  },
  'Ordinary Life': {
    direction: 'Today is about ordinary life: streets, coffee, errands, rooms, light, and the quiet beauty of a day that does not need to be grand.',
    hook: ['The ordinary held me today.', 'A small day stayed behind.', 'Nothing grand, only true.', 'This day had a pulse.', 'The street remembered me.', 'I came for this quiet.', 'The simple things spoke first.', 'Today did not need drama.', 'This place felt briefly familiar.', 'A little day became enough.', 'Life was soft here.', 'The day arrived slowly.'],
    turn: ['I keep looking for the large story, and then the day gives me a small one that feels more honest.', 'There are places that do not ask to be admired. They simply make room for you.', 'I am starting to trust ordinary days more. They do not try so hard to be remembered.', 'Some moments become tender only after you stop asking them to be useful.', 'A street, a chair, a cup, a little noise. Sometimes that is the whole blessing.', 'The day did not perform for me. It just opened a little and let me in.'],
    landing: ['Some places do not ask to be admired. They simply stay with you.', 'I want to keep the small proof that I was here and paying attention.', 'The day was not grand, but it gave me something gentle to carry.', 'Some memories begin as errands and end as warmth.']
  },
  'Sea & Stillness': {
    direction: 'Today is about sea and stillness: the kind of quiet that softens the body and steadies the heart.',
    hook: ['The sea softened the day.', 'I needed this quiet.', 'The water held the light.', 'Stillness found me here.', 'The sea did not hurry.', 'Today listened back.', 'The shore kept my silence.', 'I came to be still.', 'The light moved slowly.', 'Rest had a voice today.', 'The waves carried enough.', 'This quiet felt honest.'],
    turn: ['There are days when the sea does not say much, but somehow I understand everything better.', 'I do not need every quiet day to become a lesson. Some days only need to loosen the grip.', 'The water has a way of making ambition feel less urgent and presence feel more necessary.', 'I came here with many thoughts, and the sea answered by moving slowly.', 'Stillness is not empty. It is full of things I can only hear when I stop rushing.', 'The shore reminds me that I can arrive without announcing myself.'],
    landing: ['I am learning that rest can be a form of courage.', 'The quiet did not fix anything. It simply made room.', 'Some days are not meant to be solved. They are meant to be felt.', 'I carried the sound of the water home quietly.']
  },
  'Food': {
    direction: 'Today is about food as memory: coffee, bread, meals, appetite, warmth, and the way a table can hold a whole day.',
    hook: ['Food remembers what we feel.', 'The table held the day.', 'This meal became memory.', 'The bread carried warmth.', 'A meal can hold us.', 'Coffee kept the morning.', 'The plate told the story.', 'Some comfort arrives warm.', 'This tasted like remembering.', 'The table made room.', 'The day was served warm.', 'I remember this by taste.'],
    turn: ['I have always believed food remembers what we are too busy to say.', 'There is a kind of comfort that arrives without speech: a plate, a cup, a hand passing something warm.', 'Food has always been one of the ways I understand love, place, and memory.', 'A table can become a diary when you let the day sit down with you.', 'The meal is simple, but the feeling around it is not.', 'Some days are remembered not by what happened, but by what was shared.'],
    landing: ['Some memories are not written down. They are served warm, passed by hand, and carried home quietly.', 'I will remember this not as lunch, but as a feeling that stayed.', 'The table emptied, but something gentle remained.', 'A place can feed you in more ways than one.']
  },
  'Small Things': {
    direction: 'Today is about small things: doors, curtains, hands, shadows, textures, and the beauty that waits quietly.',
    hook: ['The small things stayed.', 'Light found its way in.', 'I noticed this quietly.', 'A corner held the feeling.', 'This detail stayed behind.', 'The shadow said enough.', 'Beauty waited in silence.', 'A small thing mattered.', 'The room had a memory.', 'I almost missed this.', 'The texture carried the day.', 'Nothing happened. I remembered.'],
    turn: ['There are days when a shadow, a cup, or a doorway tells the truth more gently than words.', 'I am learning that beauty does not always announce itself. Sometimes it waits in corners.', 'A small thing can hold a whole feeling when I stop moving too fast.', 'I trust the quiet details more than the obvious ones now.', 'There are objects that become memory because we looked at them long enough.', 'Sometimes the frame knows what the heart is trying to say.'],
    landing: ['I want to keep noticing the things that do not ask for attention.', 'The smallest frame carried the deepest memory today.', 'I left the place, but the detail came with me.', 'This is how a day stays: not loudly, but clearly.']
  },
  'On the Road': {
    direction: 'Today is about movement: arrivals, departures, bags, windows, waiting, and the quiet emotion of being between places.',
    hook: ['Arriving is also a feeling.', 'The road changed me slightly.', 'Between places, I listened.', 'The window held the story.', 'I carried the day with me.', 'Leaving has its own light.', 'The road made room.', 'Transit has a tenderness.', 'The bag knew first.', 'I was between versions.', 'Movement softened the thought.', 'The arrival began quietly.'],
    turn: ['Every road has a way of bringing old thoughts with you and leaving a few behind.', 'Between places, I hear myself differently.', 'There is a quiet emotion in waiting that only travel seems to understand.', 'The road does not ask for answers. It only asks you to keep moving.', 'Arrivals are never only about reaching a place. They are also about noticing who arrived.', 'Sometimes the most honest part of a day happens before you get there.'],
    landing: ['There is a quiet kind of becoming that happens between leaving and arriving.', 'I arrived with more than my bag. I arrived with the day still moving inside me.', 'The road ended, but the feeling kept going.', 'Some places begin before you reach them.']
  }
};

const moodLines = {
  'Poetic': 'Use imagery and feeling first. Keep the language clear, soulful, and unforced. Let one image carry more than one explanation.',
  'Quiet': 'Keep the voice sparse and soulful. Let silence and images carry part of the feeling. Leave room for breath between lines.',
  'Witty': 'Keep the wit gentle and human. No punchlines, no gimmicks, no forced cleverness. The humor should come from recognition, not performance.',
  'Observant': 'Let the story come from what you notice: light, food, hands, streets, sea, and small details. Write as if the day revealed itself slowly.',
  'Elegant': 'Use clean language, slower clips, and fewer words. Let the feeling stay refined. Avoid trend language and loud declarations.',
  'Tired but showing up': 'Keep it honest and tender. No drama, no heroic tone. Let the softness of continuing be enough.',
  'Soft': 'Use warmth: hands, fabric, coffee, sea, light, food, and memory. Keep the lines intimate but not private.',
  'Bold': 'Use a clear hook, but keep the soul intact. Strength should feel calm, not shouted. Let presence be the statement.',
  'Restless': 'Use movement: walking, turning, leaving, arriving, searching, noticing. Let the pacing carry the unsettled feeling without making it messy.',
  'Hungry': 'Let food be memory, not comedy. Warmth, appetite, table, sharing, and place should lead the story.',
  'In transit': 'Use windows, bags, roads, signs, waiting, arrival, and the emotion of transition. Let the between-place feeling become the point.',
  'Slightly dramatic but pretending not to be': 'Let the feeling be cinematic but restrained. Soulful, not sarcastic. Make the scene beautiful without making yourself a spectacle.'
};

const timeNotes = {
  Morning: 'Morning light: shoot near windows or shaded street edges. Avoid harsh overhead sun.',
  Midday: 'Midday light: shoot in shade, under awnings, or indoors near soft window light.',
  Afternoon: 'Afternoon light: watch for shadows, doorways, and warm side light.',
  'Golden hour': 'Golden hour: shoot everything. Walking shots, face, hands, road, sea, food, quiet ending.',
  Evening: 'Evening: prioritize warm lamps, tables, reflections, silhouettes, and ambient sound.',
  Night: 'Night: use signs, lamps, table light, and close details. Do not force wide dark shots.'
};


function normalizeTargetLength(value) {
  const raw = Number(value || 45);
  if (!Number.isFinite(raw)) return 45;
  return Math.max(15, Math.min(90, Math.round(raw)));
}

function timingProfile(target) {
  if (target <= 20) return { shots: 5, dur: '1–2 sec', words: 28, edit: 'very tight: one thought, one place, no extra clips' };
  if (target <= 30) return { shots: 6, dur: '2–3 sec', words: 45, edit: 'quick story: one clear feeling, no long intro' };
  if (target <= 45) return { shots: 8, dur: '3–4 sec', words: 70, edit: 'standard short story: enough room for emotion and place' };
  if (target <= 60) return { shots: 10, dur: '3–5 sec', words: 95, edit: 'deeper story: keep pacing gentle but not slow' };
  if (target <= 75) return { shots: 12, dur: '4–5 sec', words: 120, edit: 'slow soulful story: allow pauses and texture' };
  return { shots: 14, dur: '4–6 sec', words: 150, edit: 'full voiceover: use only if the story truly needs space' };
}

function captureProfile(balance) {
  const map = {
    'video-only': { label: '100% video', videoRatio: 1, photoRatio: 0, videoScale: 1, photoCount: 0, timeline: 'video' },
    'mostly-video': { label: 'Mostly video · 80/20', videoRatio: 0.8, photoRatio: 0.2, videoScale: 0.85, photoCount: 2, timeline: 'mixed' },
    'balanced': { label: 'Balanced · 50/50', videoRatio: 0.5, photoRatio: 0.5, videoScale: 0.65, photoCount: 5, timeline: 'mixed' },
    'mostly-photo': { label: 'Mostly photos · 30/70', videoRatio: 0.3, photoRatio: 0.7, videoScale: 0.4, photoCount: 7, timeline: 'mixed' },
    'photo-only': { label: '100% photos', videoRatio: 0, photoRatio: 1, videoScale: 0, photoCount: 8, timeline: 'photo' }
  };
  return map[balance] || map['mostly-video'];
}

function captureLabel(balance) {
  return captureProfile(balance).label;
}

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
    videoLength: normalizeTargetLength($('#videoLength').value),
    captureBalance: $('#captureBalance') ? $('#captureBalance').value : 'mostly-video',
    filmedOnce: $('#filmedOnce').value,
    audienceFocus: $('#audienceFocus').value,
    pillar: $('#pillar').value,
    angle: $('#angle').value,
    avoid: $('#avoid').value.trim()
  };
}

function setInputs(data) {
  if (!data) return;
  $('#location').value = data.location || '';
  $('#activity').value = data.activity || '';
  $('#mood').value = data.mood || 'Quiet';
  $('#energy').value = data.energy || 'Medium';
  $('#timeOfDay').value = data.timeOfDay || 'Morning';
  $('#videoLength').value = String(normalizeTargetLength(data.videoLength || 45));
  if ($('#captureBalance')) $('#captureBalance').value = data.captureBalance || 'mostly-video';
  $('#filmedOnce').value = data.filmedOnce || 'No';
  $('#audienceFocus').value = data.audienceFocus || 'filipina45';
  $('#pillar').value = data.pillar || 'auto';
  $('#angle').value = data.angle || 'auto';
  $('#avoid').value = data.avoid || '';
}

function inferPillar(inputs) {
  if (inputs.pillar && inputs.pillar !== 'auto') return inputs.pillar;
  const text = `${inputs.location} ${inputs.activity} ${inputs.mood}`.toLowerCase();
  let best = { name: 'Ordinary Life', score: 0 };
  for (const rule of pillarRules) {
    const score = rule.terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
    if (score > best.score) best = { name: rule.name, score };
  }
  return best.name;
}

function pick(arr, seed, offset = 0) {
  const sessionCounter = sessionStorage.getItem(SESSION_COUNTER_KEY) || '0';
  const mixedSeed = `${seed}-${todaySeed()}-${sessionCounter}`;
  const value = Array.from(mixedSeed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return arr[(value + offset) % arr.length];
}

function cleanActivity(activity) {
  return activity.replace(/\s+/g, ' ').replace(/[.]+$/,'');
}

const angleLines = {
  'auto': 'Let the place and mood decide the emotional center.',
  'soulful': 'Lead with feeling, silence, and sensory memory. Keep it warm, never clever for its own sake.',
  'memory': 'Frame the day as something the body will remember later.',
  'quiet-power': 'Let confidence appear through calm presence, not declaration.',
  'details': 'Use one small object, light, texture, or gesture as the emotional doorway.',
  'simple-day': 'Treat the ordinary day as worthy without making it dramatic.'
};

const adjustmentLabels = {
  'stronger-hook': 'Stronger hook',
  'clearer-story': 'Clearer story',
  'more-visual': 'More visual',
  'less-talky': 'Less talky',
  'soulful-not-dramatic': 'More soulful, not dramatic',
  'women45': 'More relatable to women 45+',
  'more-elegant': 'More elegant',
  'no-face': 'No face today'
};

const adjustmentDirectives = {
  'stronger-hook': 'Make the first line more immediate and scroll-stopping, but still soulful.',
  'clearer-story': 'Make the story easier to understand: one location, one feeling, one reason it matters.',
  'more-visual': 'Reduce abstract language and make the scenes stronger and more filmable.',
  'less-talky': 'Use fewer words. Let the images do more emotional work.',
  'soulful-not-dramatic': 'Add soul, warmth, and depth without sounding heavy or theatrical.',
  'women45': 'Make the emotional truth more relatable to women 45+ without using cliché midlife language.',
  'more-elegant': 'Make the language refined, restrained, and graceful.',
  'no-face': 'Do not require face shots. Use hands, back view, silhouette, objects, walking, and reflected presence.'
};

function getAdjustmentLabels(adjustments = []) {
  return adjustments.map(key => adjustmentLabels[key] || key);
}

function revisionInstruction(adjustments = [], notes = '') {
  const parts = adjustments.map(key => adjustmentDirectives[key]).filter(Boolean);
  if (notes) parts.push(`User note: ${notes}`);
  return parts.length ? parts.join(' ') : '';
}


function avoidNote(inputs) {
  if (!inputs.avoid) return '';
  return ` Avoid: ${inputs.avoid}.`;
}

function buildScript(inputs, pillar, variant = 0, toneMode = 'balanced', adjustments = [], revisionNotes = '') {
  const copy = pillarCopy[pillar];
  const seed = `${inputs.location}-${inputs.activity}-${inputs.mood}-${inputs.timeOfDay}-${inputs.angle || 'auto'}`;
  const strongHooks = [
    'This moment stayed with me.',
    'I almost missed this.',
    'This is the part I remember.',
    'The day softened here.',
    'Something quiet happened here.'
  ];
  const hook = adjustments.includes('stronger-hook') ? pick(strongHooks, seed, variant) : pick(copy.hook, seed, variant);
  const activity = cleanActivity(inputs.activity).toLowerCase();
  const location = inputs.location;
  const adjustText = revisionInstruction(adjustments, revisionNotes);
  const moodInstruction = `${moodLines[inputs.mood] || moodLines.Observant} ${angleLines[inputs.angle || 'auto'] || angleLines.auto}${avoidNote(inputs)} ${adjustText}`.trim();
  const sensory = sensoryPhrase(pillar, inputs, variant);
  const reflection = reflectionLine(pillar, inputs, variant, toneMode);

  const openers = [
    `Today I am in ${location}.`,
    `${location} feels different today.`,
    `I did not come here looking for a big story.`
  ];
  const activityLines = [
    `The day is simple: ${activity}.`,
    `There is no grand plan, only ${activity}.`,
    `I am letting the day move through ${activity}.`
  ];

  const lines = [
    hook,
    '',
    pick(openers, seed, variant),
    pick(activityLines, seed, variant + 1),
    pick(copy.turn, seed, variant + 2),
    `What I want to remember is ${sensory}.`,
    reflection,
    pick(copy.landing, seed, variant + 3)
  ];
  return { hook, body: lines.join('\n'), moodInstruction, variant, toneMode };
}

function sensoryPhrase(pillar, inputs, variant = 0) {
  const bank = {
    'The Woman': ['the way the light falls on my face, the quiet in my body, and the woman I have carried all these years', 'my hands, my pace, my reflection, and the softness of being here now', 'a small glimpse of myself in this place, older, clearer, and more awake'],
    'Ordinary Life': ['the coffee, the street, the low voices, the room, and the ordinary rhythm of the place', 'a small street, a table, the morning light, and the sound of the day around me', 'the simple things: coffee, shade, movement, a doorway, and the feeling of being briefly at home somewhere'],
    'Sea & Stillness': ['the sea, the wind, the stones, the towel, and the quiet that comes after rushing', 'the water, the light, the sound of waves, and the way the day loosens its grip', 'a chair near the water, my feet on the ground, and the kind of silence that feels kind'],
    'Food': ['the table, the bread, the plate, the warmth, and the way a meal can hold a memory', 'coffee, food, hands, conversation, and the comfort of being fed by a place', 'the first bite, the shared table, the small rituals, and the feeling of being welcomed by taste'],
    'Small Things': ['a doorway, a shadow, a cup, a curtain, a hand, and the quiet beauty that waits in corners', 'one line of light, one texture, one object, and the small grace of paying attention', 'the details I almost missed: stone, fabric, table, glass, shadow, and air'],
    'On the Road': ['the window, the bag, the road, the waiting, and the feeling of carrying one place into another', 'a moving view, a half-finished thought, and the small silence before arriving', 'the signs, the seats, the road, the coffee stop, and the strange tenderness of transition']
  };
  return pick(bank[pillar], `${inputs.location}-${inputs.activity}`, variant);
}

function reflectionLine(pillar, inputs, variant = 0, toneMode = 'balanced') {
  const bank = {
    'The Woman': ['I am not trying to turn this into a lesson. I only want to meet myself honestly in the frame.', 'There is power in being seen without performing for the gaze.', 'Maybe this is what confidence becomes when it no longer needs to be loud.'],
    'Ordinary Life': ['The beauty is not asking for attention, which makes me want to pay attention even more.', 'Maybe ordinary days are the ones that tell the truth most clearly.', 'This is the kind of day I want to remember: unannounced, generous, and real.'],
    'Sea & Stillness': ['The sea does not hurry me, and for once I am trying not to hurry myself.', 'I do not need the day to become useful. I need it to become felt.', 'There is a kind of peace that arrives only when I stop negotiating with the moment.'],
    'Food': ['A table can become a diary when you let the day sit down with you.', 'Food has always been one of the ways I understand love, place, and memory.', 'The meal is simple, but the feeling around it is not.'],
    'Small Things': ['A small thing can hold a whole feeling when I stop moving too fast.', 'I am beginning to trust the quiet details more than the obvious ones.', 'Sometimes the smallest frame carries the deepest memory.'],
    'On the Road': ['Movement always changes the shape of a thought.', 'Between places, I hear myself differently.', 'The road has a way of making even silence feel full.']
  };
  return pick(bank[pillar], `${inputs.mood}-${inputs.timeOfDay}-${toneMode}`, variant);
}

function buildScenes(inputs, pillar, script) {
  const location = inputs.location;
  const noFace = Boolean(inputs.noFace);
  const canFilm = inputs.filmedOnce === 'Yes' && !noFace;
  const genericSelf = noFace
    ? `No face: film hands, walking feet, back view, silhouette, reflection without clear face, or a meaningful object at ${location}.`
    : canFilm
      ? `One 4-second shot someone takes of you walking into or through ${location}. Frame from behind or side, vertical, no posing.`
      : `Self-shot only: phone chest-height, slow walking clip, or a hand/coffee/notebook detail.`;
  const sceneBank = {
    'The Woman': [
      ['Hook visual', genericSelf, 'Cover photo: you from side or back, with negative space for text.'],
      ['Personal turn', 'Close detail: hand fixing sunglasses, bag, lipstick, notebook, or sleeve.', 'Photo: hands/detail, elegant but not staged.'],
      ['Sensory proof', `A slow pan of ${location}: light, table, doorway, mirror, or street.`, 'Photo: texture or doorway.'],
      ['Emotional detail', 'A quiet contrast: dressed with care, carrying a practical bag, coffee beside notebook, wind moving fabric or hair.', 'Photo: honest candid detail.'],
      ['Soft landing', 'Quiet ending: walking away, closing notebook, cup on table, or doorway after you pass.', 'Photo: final frame with space.']
    ],
    'Ordinary Life': [
      ['Hook visual', `Exterior, room, street, or first view of ${location}. Hold 3 seconds before moving.`, 'Cover photo: place/street/room/table with empty space for hook text.'],
      ['Personal turn', 'Coffee, table, receipt, chair, or your hand entering the frame.', 'Photo: overhead table shot.'],
      ['Sensory proof', 'Slow walking or looking clip: doorway, pavement, window, counter, quiet street, hallway, or light on wall.', 'Photo: street detail.'],
      ['Emotional detail', 'Something ordinary but full of life: chair, napkin, cup, sign, window, bag, counter, or a table after someone leaves.', 'Photo: ordinary detail with feeling.'],
      ['Soft landing', 'Still ending: empty chair, cup after coffee, hallway, table after you leave, street, or light on wall.', 'Photo: calm closing image.']
    ],
    'Sea & Stillness': [
      ['Hook visual', 'Wide sea shot before you enter the frame. Hold still for 4 seconds.', 'Cover photo: sea with negative space.'],
      ['Personal turn', genericSelf, 'Photo: silhouette facing water.'],
      ['Sensory proof', 'Close-ups: towel, feet on stone/sand, water, book, coffee, hair/fabric in wind.', 'Photo: texture detail.'],
      ['Emotional detail', 'A practical object near the sea: slippers, bag, book, towel, chair, sunscreen, cup — the human part of the scene.', 'Photo: ordinary beach detail.'],
      ['Soft landing', 'Quiet ending: empty chair, water moving, curtain, door, or shoreline with no talking.', 'Photo: stillness frame.']
    ],
    'Food': [
      ['Hook visual', 'Table before food arrives or first plate landing on the table.', 'Cover photo: food/table with space for text.'],
      ['Personal turn', 'Hand reaching for coffee, bread, fork, menu, or plate.', 'Photo: hands and food detail.'],
      ['Sensory proof', '3 close-ups: steam, texture, sauce, bread tearing, cup, table setting.', 'Photo: overhead table shot.'],
      ['Emotional detail', 'The lived-in food detail: torn bread, sauce, steam, used napkin, second coffee, the table after eating.', 'Photo: warm after-meal detail.'],
      ['Soft landing', 'After-meal shot: empty plate, folded napkin, bill, table light, street outside.', 'Photo: final table image.']
    ],
    'Small Things': [
      ['Hook visual', `Find one small thing at ${location}: door, curtain, chair, wall, shadow, cup. Film it like it matters.`, 'Cover photo: detail with clean negative space.'],
      ['Personal turn', 'Your hand entering the frame: touching cup, notebook, railing, door, fabric.', 'Photo: hand/detail shot.'],
      ['Sensory proof', 'Make a 5-clip texture sequence: light, shadow, object, street, your movement.', 'Photo: strongest texture.'],
      ['Emotional detail', 'Choose one object that carries feeling — a curtain, chair, cup, shadow, doorway, or folded fabric. Hold the shot without explaining.', 'Photo: quiet visual memory.'],
      ['Soft landing', 'End on stillness: the same detail after you leave the frame.', 'Photo: quiet ending image.']
    ],
    'On the Road': [
      ['Hook visual', 'Bag, window, road, sign, seat, or first view after arrival. Hold steady.', 'Cover photo: road/window/bag with text space.'],
      ['Personal turn', genericSelf, 'Photo: walking/bag/silhouette from behind.'],
      ['Sensory proof', 'Motion clips: road through window, hand on bag, shoes, signage, coffee stop.', 'Photo: transit detail.'],
      ['Emotional detail', 'A travel detail: bag, shoes, coffee, ticket, window, hand on handle, the small signs of movement.', 'Photo: honest travel detail.'],
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

function uniqueList(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


function buildVideoChecklist(inputs, pillar, scenes = []) {
  const profile = timingProfile(normalizeTargetLength(inputs.videoLength));
  const capture = captureProfile(inputs.captureBalance);
  if (capture.videoRatio === 0) return [];

  const shotCount = Math.max(3, Math.round(profile.shots * capture.videoScale));
  const baseDur = profile.dur;
  const chosen = [];
  const push = (job, shot, why, duration = baseDur) => chosen.push({ job, shot, why, duration });

  push('Hook / first frame', scenes[0]?.video || `First view of ${inputs.location}. Hold steady.`, 'Shows the audience where the feeling begins.');
  if (inputs.noFace) {
    push('Human presence without face', 'Hands, back view, walking feet, silhouette, reflection without clear face, bag, notebook, cup, or fabric moving naturally.', 'Keeps you present while respecting a no-face day.');
  } else if (inputs.filmedOnce === 'Yes') {
    push('Human presence', `Ask for one clean vertical shot of you entering, walking, sitting, or looking toward the scene at ${inputs.location}. No posing.`, 'The target audience needs to see the woman at the center, not only the place.');
  } else {
    push('Human presence', 'Self-shot: hand, walking feet, side reflection, bag, notebook, sunglasses, or coffee held naturally.', 'Adds intimacy without needing someone else to film you.');
  }
  push('Place context', `A wider clip of ${inputs.location}: street, sea, café, table, road, doorway, or room.`, 'Gives the story a clear setting.');
  push('Sensory detail', 'One close-up only: light, food, cup, hand, fabric, stone, water, menu, curtain, or shadow.', 'Makes the video feel lived-in and soulful.');
  push('Movement', 'A slow walking clip, hand reaching, cup lifted, door opening, plate arriving, road moving, or curtain shifting.', 'Prevents the video from feeling like a photo slideshow.');
  push('Emotional object', scenes[3]?.video || 'Film one object that carries the feeling of the day: chair, plate, notebook, towel, bag, cup, door, or window.', 'Turns the day into a story, not a random montage.');
  push('Quiet pause', 'Hold one calm shot without movement: sea, street, table, empty chair, wall light, or window.', 'Lets the voiceover breathe.');
  push('Soft ending', scenes[4]?.video || 'End with leaving, closing notebook, empty plate, fading street, sea, or light on a wall.', 'Gives the audience an emotional landing.');

  if (pillar === 'Food') push('Food proof', 'One clear clip of the food being served, touched, broken, poured, or shared — not five similar plate shots.', 'Food must feel warm and human, not like a menu review.');
  if (pillar === 'Sea & Stillness') push('Breathing room', 'One wide sea/sky/water clip with no talking and no fast movement.', 'This pillar needs space and stillness.');
  if (pillar === 'On the Road') push('Transition proof', 'Window, bag, shoes, sign, key, or first view after arrival.', 'Makes the movement understandable.');
  if (pillar === 'The Woman' && !inputs.noFace) push('Face or silhouette', 'One natural glimpse of your face, side profile, mirror, or silhouette.', 'The audience connects to your presence.');
  if (inputs.noFace) push('No-face presence', 'One beautiful no-face proof of you: hands, back view, shadow, reflection, shoes walking, or your object in the scene.', 'Presence does not always require showing your face.');
  if (pillar === 'Small Things') push('Pattern detail', 'Create a tiny sequence: object → light → hand → stillness.', 'Small things need visual rhythm.');
  if (pillar === 'Ordinary Life') push('Local rhythm', 'One ordinary local detail: chair, window, counter, pavement, sign, hallway, voices, receipt, table, or coffee cup.', 'Keeps the place real, not staged.');

  return chosen.slice(0, shotCount).map((item, index) => ({ ...item, number: index + 1 }));
}

function phoneHeightForShot(kind, pillar) {
  const key = `${pillar}:${kind}`.toLowerCase();
  if (key.includes('food') || key.includes('close') || key.includes('detail')) return 'just above table or object level';
  if (key.includes('wide') || key.includes('place')) return 'chest to eye height';
  if (key.includes('movement') || key.includes('walk')) return 'waist to chest height';
  if (key.includes('reaction') || key.includes('presence')) return 'chest height, slightly angled';
  return 'chest height, steady with two hands';
}

function angleForShot(kind, pillar) {
  const k = `${pillar}:${kind}`.toLowerCase();
  if (k.includes('food')) return '45° angle for plates; top shot only if the table is beautiful';
  if (k.includes('wide') || k.includes('place')) return 'straight vertical frame, slight diagonal if the background is busy';
  if (k.includes('close') || k.includes('detail')) return 'close but not cramped; leave breathing space';
  if (k.includes('movement')) return 'locked phone or slow follow; no fast pan';
  if (k.includes('reaction') || k.includes('presence')) return 'side, back, mirror, shadow, hands, or natural face glance';
  return 'simple vertical frame with one clear subject';
}

function textureForShot(kind, pillar) {
  const banks = {
    'Food': 'bread, steam, sauce, plate edge, glass, napkin, table grain, hand, warm light',
    'Sea & Stillness': 'water, sand, stone, towel, wind, curtain, skin, shadow, horizon',
    'On the Road': 'window, bag, shoes, signs, road lines, seat fabric, ticket, doorway',
    'Small Things': 'light, shadow, wall, curtain, chair, paper, jewelry, fabric, doorway',
    'The Woman': 'hands, jewelry, fabric, mirror, notebook, makeup, bag, skin-friendly light',
    'Ordinary Life': 'street, cup, receipt, pavement, chair, counter, window, market, doorway'
  };
  return banks[pillar] || banks['Ordinary Life'];
}

function mistakeForShot(kind, pillar) {
  const k = `${pillar}:${kind}`.toLowerCase();
  if (k.includes('wide') || k.includes('place')) return 'Do not sweep the whole place with a fast pan.';
  if (k.includes('close') || k.includes('detail') || k.includes('food')) return 'Do not shoot ten versions of the same plate or object.';
  if (k.includes('movement')) return 'Do not keep recording after the action is finished.';
  if (k.includes('reaction') || k.includes('presence')) return 'Do not force a pose; natural presence is stronger.';
  return 'Do not record without one clear subject.';
}

function learnWhyForShot(kind, pillar) {
  const k = `${pillar}:${kind}`.toLowerCase();
  if (k.includes('wide') || k.includes('place') || k.includes('hook')) return 'A wide first frame lets viewers enter the place before they enter the feeling.';
  if (k.includes('human') || k.includes('presence') || k.includes('reaction')) return 'Human presence gives the video warmth. It does not always need to be your full face.';
  if (k.includes('detail') || k.includes('close') || k.includes('food')) return 'Close details create intimacy. They make food, light, and objects feel remembered, not just shown.';
  if (k.includes('movement')) return 'Movement keeps a short video alive without needing more words.';
  if (k.includes('ending') || k.includes('pause')) return 'A quiet ending gives the audience somewhere to land.';
  return 'A clear shot has one subject and one purpose. That is what makes editing easier.';
}

function buildShootCoach(inputs, pillar, videoChecklist = [], photoList = []) {
  const target = normalizeTargetLength(inputs.videoLength);
  const capture = captureProfile(inputs.captureBalance);
  const hasVideo = capture.videoRatio > 0;
  const profile = timingProfile(target);
  const videoShotCount = hasVideo ? (videoChecklist.length || profile.shots) : 0;
  const headline = hasVideo
    ? `Shoot only ${videoShotCount} video clips for this ${target}-second plan, then stop.`
    : `Shoot photos only today. Build one clear visual sequence instead of many duplicates.`;
  const discipline = hasVideo
    ? `Each clip needs one job: place, human presence, close-up, movement, feeling, or ending. If a clip cannot be named, skip it.`
    : `Take fewer, stronger photos: cover, place, human presence, detail, texture, ending. If two photos say the same thing, keep one.`;
  const fiveShotReminder = target <= 20
    ? 'For 15–20 seconds, use 3–5 shots only. One feeling. No extra scene.'
    : target <= 30
      ? 'For 30 seconds, the 5-shot system is the sweet spot.'
      : 'For longer videos, repeat the 5-shot system only when the story moves to a new scene.';
  const source = hasVideo ? videoChecklist : photoList.map((p, i) => ({ number: i + 1, job: `Photo ${i + 1}`, shot: p, duration: 'still photo' }));
  const cards = source.map((item, index) => {
    const job = item.job || `Shot ${index + 1}`;
    return {
      number: item.number || index + 1,
      job,
      what: item.shot || item,
      seconds: item.duration || profile.dur,
      lens: index === 0 && pillar !== 'Food' ? '1x; use 0.5x only if you need more place context' : '1x; move closer instead of zooming',
      phoneHeight: phoneHeightForShot(job, pillar),
      angle: angleForShot(job, pillar),
      texture: textureForShot(job, pillar),
      avoid: mistakeForShot(job, pillar),
      learn: learnWhyForShot(job, pillar)
    };
  });
  return { headline, discipline, fiveShotReminder, cards };
}

function buildTargetFit(inputs, pillar, script, adjustments = []) {
  const focusMap = {
    filipina45: 'Filipino women 45–65 who respond to soul, confidence, food, place, memory, and a woman who is not trying too hard.',
    daughters: 'Daughters who may send the video to their mothers because it feels tender, dignified, and familiar.',
    'midlife-global': 'Women in midlife globally who want depth without motivational clichés.',
    'travel-soul': 'Mature travelers who want place, feeling, food, light, and personal meaning instead of tourist checklists.'
  };
  const checks = [
    'Clear first 1.5 seconds: the hook must appear as text immediately, especially for 15–30 second videos.',
    'The woman is the center: the place supports the story but does not replace you.',
    'At least one human presence shot: face, silhouette, hands, walking, or reflection.',
    'At least one sensory detail: food, light, sea, fabric, stone, coffee, street, or sound.',
    'No redundant footage: do not repeat the same table, coffee, door, or sea angle unless the emotion changes.',
    'No lecture: the ending should leave a feeling, not teach a lesson.',
    'Filipina warmth remains present: food, family memory, grace, humor, or lived experience without oversharing.'
  ];
  if (adjustments.includes('more-visual')) checks.push('Director revision: visuals carry the story before the caption does.');
  if (adjustments.includes('less-talky')) checks.push('Director revision: fewer words, more breathing room.');
  if (adjustments.includes('no-face')) checks.push('Director revision: no-face presence is handled through hands, silhouette, movement, and objects.');
  return {
    score: 90,
    audience: focusMap[inputs.audienceFocus] || focusMap.filipina45,
    reason: `This plan is built for ${pillar.toLowerCase()} with a soulful midlife point of view, a clear human presence, and non-redundant scenes.`,
    checks
  };
}

function buildPhotoList(inputs, pillar, scenes = []) {
  const capture = captureProfile(inputs.captureBalance);
  if (capture.photoRatio === 0) return [];
  const base = [
    'Cover photo: vertical frame with clean negative space for text overlay.',
    'Place photo: one image that clearly shows where the story happens, not just a close-up.',
    'Human detail: hand, walking feet, side profile, notebook, bag, or silhouette — one only.',
    'Texture photo: light, wall, table, stone, curtain, menu, shadow, or street detail.',
    'Ending photo: quiet final frame after the moment has passed — empty chair, table, doorway, sea, or street.',
    'Memory photo: the one image you would want to find again five years from now.',
    'Transition photo: bag, door, receipt, shoes, road, hallway, or first view after arrival.',
    'Breathing-space photo: one simple frame with no clutter and no need to explain.'
  ];
  const additions = {
    'Food': ['Food memory photo: one plate or table image after the first bite, not a perfect menu shot.'],
    'Sea & Stillness': ['Wide sea photo: one quiet frame with no people, used for breathing room.'],
    'On the Road': ['Transition photo: bag, window, road sign, seat, or first view after arrival.'],
    'The Woman': ['Presence photo: one natural image of you from side/back, not posed too perfectly.'],
    'Small Things': ['Object photo: one small detail that can carry the whole mood of the day.'],
    'Ordinary Life': ['Everyday-life photo: window, café chair, street sign, counter, hallway, table, or pavement light.']
  };
  const list = uniqueList([base[0], ...(additions[pillar] || []), ...base.slice(1)]);
  return list.slice(0, capture.photoCount);
}

function buildCaption(inputs, pillar, hook) {
  const tagMap = {
    'The Woman': '#over50 #filipina #agingpowerfully #midlifewoman #editinglife',
    'Ordinary Life': '#over50 #filipina #ordinarylife #soulfulcontent #dailyrituals',
    'Sea & Stillness': '#over50 #filipina #seastillness #slowcontent #soulfultravel',
    'Food': '#over50 #filipina #foodmemory #soulfulcontent #tablemoments',
    'Small Things': '#over50 #filipina #smallthings #slowcontent #noticinglife',
    'On the Road': '#over50 #filipina #maturetraveler #ontheroad #betweenplaces'
  };
  const captions = {
    'The Woman': 'This chapter has its own light.',
    'Ordinary Life': 'A quiet piece of the day stayed with me.',
    'Sea & Stillness': 'The sea softened the day.',
    'Food': 'A meal, a place, a memory.',
    'Small Things': 'The small things stayed.',
    'On the Road': 'Between places, I noticed myself.'
  };
  return `${captions[pillar]} ${tagMap[pillar]}`;
}

function buildEditBrief(inputs, pillar, script, scenes, videoChecklist = [], photoList = [], adjustments = []) {
  const target = normalizeTargetLength(inputs.videoLength);
  const profile = timingProfile(target);
  const capture = captureProfile(inputs.captureBalance);
  const clipCount = videoChecklist.length || photoList?.length || profile.shots;
  const voiceWords = profile.words;
  if (capture.timeline === 'photo') {
    return [
      `Create a photo-first post or photo-video montage. Use the photo sequence shown in the edit timeline.`,
      `If making a Reel/TikTok from photos, set each photo to around ${Math.max(2, Math.round(target / Math.max(1, clipCount)))} seconds and add gentle motion/zoom only.`,
      `Use the hook text on Photo 1 only: “${script.hook}”.`,
      'Use soft crossfades only. No flashy transitions.',
      `Record the voiceover only if you want it; keep it around ${voiceWords} words or less.`,
      'Use music low and warm. Let the photos feel like memory, not a slideshow template.',
      'Remove duplicate photos. If two photos show the same table, door, view, or angle, keep the one with stronger feeling.',
      `Thumbnail/cover: use the cleanest cover photo and this short text: “${script.hook}”`
    ];
  }
  return [
    `Create a ${target}-second vertical project. Import the clips in the exact sequence shown in the edit timeline below.`,
    `Trim to ${clipCount} strong shots. Most clips should be around ${profile.dur}; cut sooner if the frame stops saying something.`,
    `Place the hook text on Shot 1 only: “${script.hook}”. Keep it readable for the first 1.5 seconds.`,
    'Use soft cuts for emotional continuity. Use a gentle crossfade only when the feeling moves from place to memory or from movement to stillness.',
    `Record the voiceover after arranging the clips. Keep it around ${voiceWords} words or less and match each line to the shot shown in the timeline.`,
    'Keep music very low under the voice, around 8–12%. Let natural sound breathe between lines when possible.',
    'Use only 1–3 text overlays: hook, one short memory line, and optional final line. Do not caption every sentence.',
    'Remove duplicate clips. If two clips show the same table, coffee, door, sea, or street angle, keep the one with better light or stronger feeling.',
    ...(adjustments.includes('more-visual') ? ['Revision note: let the visuals carry more of the story before adding more words.'] : []),
    ...(adjustments.includes('less-talky') ? ['Revision note: leave one quiet pause before the final line.'] : []),
    ...(adjustments.includes('no-face') ? ['Revision note: use hands, back view, reflection, shadow, or objects instead of face footage.'] : []),
    `Thumbnail: use the cleanest cover photo and this short text: “${script.hook}”`,
    `Light note: ${timeNotes[inputs.timeOfDay]}`
  ];
}

function splitScriptLines(script) {
  return (script.body || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function distributeLines(lines, count) {
  if (!count) return [];
  const usable = lines.length ? lines : ['Let the visuals carry this moment.'];
  return Array.from({ length: count }, (_, index) => {
    if (index === 0) return usable[0] || '';
    const mapped = usable[Math.min(index, usable.length - 1)] || '';
    return mapped;
  });
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds * 10) / 10);
  return `${safe.toFixed(safe % 1 === 0 ? 0 : 1)}s`;
}

function editTransitionFor(index, total, pillar) {
  if (index === 0) return 'Start clean. No intro animation.';
  if (index === total - 1) return 'Soft fade out or hold to black for the last beat.';
  if (pillar === 'Food') return index % 2 ? 'Soft cut on hand/food movement.' : 'Gentle 0.3s crossfade if the frame feels warm.';
  if (pillar === 'Sea & Stillness') return 'Gentle 0.4s crossfade; keep it slow.';
  if (pillar === 'On the Road') return index % 2 ? 'Cut on movement.' : 'Quick dissolve from motion to arrival.';
  if (pillar === 'Small Things') return 'Soft cut; match similar shapes, light, or texture.';
  return 'Soft cut. Avoid flashy transitions.';
}

function editEffectFor(index, pillar, mood) {
  const base = 'Natural color, slightly warm, no heavy filter.';
  if (pillar === 'Food') return index === 0 ? 'Warm food tone; keep highlights soft.' : 'Slight warmth and gentle contrast.';
  if (pillar === 'Sea & Stillness') return 'Lower contrast, soft highlights, let blues/air stay natural.';
  if (pillar === 'The Woman') return 'Soft skin-friendly light; avoid over-sharpening.';
  if (mood === 'Elegant') return 'Clean, refined grade; avoid trendy effects.';
  if (mood === 'Quiet' || mood === 'Soft') return 'Soft exposure; keep the frame calm.';
  return base;
}

function editSoundEffectFor(index, total, pillar) {
  if (index === 0) return 'Optional natural ambience under hook: street, room tone, waves, café hum, or soft plate sound.';
  if (index === total - 1) return 'Let natural sound breathe for the ending; no loud sting.';
  const map = {
    'Food': ['soft cup/plate sound', 'fork touch', 'bread tear', 'café ambience'],
    'Sea & Stillness': ['wave sound', 'soft wind', 'cloth movement', 'quiet room tone'],
    'On the Road': ['car/road hum', 'bag zip', 'footsteps', 'door/arrival sound'],
    'Small Things': ['soft tap', 'fabric rustle', 'page turn', 'ambient room tone'],
    'Ordinary Life': ['street ambience', 'coffee cup sound', 'footsteps', 'door sound'],
    'The Woman': ['soft footsteps', 'fabric movement', 'bag detail', 'room tone']
  };
  const list = map[pillar] || map['Ordinary Life'];
  return `Optional: ${list[index % list.length]}. Keep it very low.`;
}

function buildSongSuggestions(inputs, pillar) {
  const mood = inputs.mood;
  const banks = {
    'Food': ['warm acoustic instrumental', 'soft café jazz instrumental', 'Mediterranean acoustic guitar no lyrics'],
    'Sea & Stillness': ['soft piano ambient', 'cinematic ocean ambient', 'minimal acoustic instrumental'],
    'On the Road': ['gentle road trip instrumental', 'soft cinematic travel beat', 'ambient piano with light pulse'],
    'Small Things': ['minimal piano texture', 'soft lo-fi instrumental no lyrics', 'warm ambient guitar'],
    'The Woman': ['elegant piano instrumental', 'soulful acoustic instrumental', 'cinematic soft strings no lyrics'],
    'Ordinary Life': ['warm daily vlog instrumental', 'soft acoustic morning', 'quiet café ambience instrumental']
  };
  const base = banks[pillar] || banks['Ordinary Life'];
  const extra = mood === 'Elegant' ? 'Choose the cleanest, least trendy version.' : mood === 'Quiet' ? 'Choose the most spacious version.' : 'Choose one that does not compete with the voice.';
  return {
    searchTerms: base,
    direction: `${extra} Keep music at 8–12% under voiceover, or 5–8% if the natural sound is beautiful.`
  };
}

function buildEditTimeline(inputs, pillar, script, videoChecklist = [], photoList = []) {
  const target = normalizeTargetLength(inputs.videoLength);
  const capture = captureProfile(inputs.captureBalance);
  const sourceItems = capture.timeline === 'photo'
    ? photoList.map((shot, index) => ({ job: `Photo ${index + 1}`, shot, why: 'Photo-first story frame.' }))
    : (videoChecklist.length ? videoChecklist : photoList.map((shot, index) => ({ job: `Photo insert ${index + 1}`, shot, why: 'Still photo used as visual support.' })));
  const shots = sourceItems.length ? sourceItems : [{ job: 'Opening frame', shot: `First visual of ${inputs.location}`, why: 'Establishes the moment.' }];
  const lines = distributeLines(splitScriptLines(script), shots.length);
  const rawDur = target / shots.length;
  let cursor = 0;
  return shots.map((shot, index) => {
    const duration = index === shots.length - 1 ? Math.max(1, target - cursor) : Math.max(1, Math.round(rawDur));
    const start = cursor;
    const end = Math.min(target, cursor + duration);
    cursor = end;
    const photoInsert = capture.timeline === 'video'
      ? 'No photo insert needed for video-only balance.'
      : (photoList[index % Math.max(1, photoList.length)] || 'Optional photo insert only if the video clip is weak.');
    return {
      number: index + 1,
      time: `${formatTime(start)}–${formatTime(end)}`,
      duration: `${Math.max(1, Math.round(end - start))}s`,
      media: capture.timeline === 'photo' ? 'Photo frame' : (index === shots.length - 1 ? 'Video or photo ending' : 'Video clip'),
      place: shot.shot,
      scriptLine: lines[index],
      textOverlay: index === 0 ? script.hook : (index === shots.length - 1 ? 'Optional final line, very short.' : 'None, unless this line needs emphasis.'),
      transition: editTransitionFor(index, shots.length, pillar),
      effect: editEffectFor(index, pillar, inputs.mood),
      sound: editSoundEffectFor(index, shots.length, pillar),
      photoInsert
    };
  });
}


function buildIphoneSetup(inputs) {
  const hasVideo = inputs.captureBalance !== 'photo-only';
  const hasPhotos = inputs.captureBalance !== 'video-only';
  const length = Number(inputs.videoLength || 45);
  const quickModeLine = hasVideo
    ? `Shoot vertical. Use Video mode, 4K, 30 fps, mostly 1x lens. For a ${length}-second video, stop each clip when its job is done.`
    : 'Shoot vertical photos. Use Photo mode first. Use Portrait only for people, hands, flowers, coffee, or objects with clean background separation.';
  const before = [
    'Clean the iPhone lens.',
    'Hold the phone vertical.',
    'Turn Grid on in Camera settings.',
    'Use 1x lens as your default.',
    'Tap the subject to focus before shooting.',
    'Hold still for one second before and after each clip.'
  ];
  const video = hasVideo ? [
    'Mode: Video, vertical orientation.',
    'Quality: 4K at 30 fps for clean TikTok/Reels footage.',
    'Lens: 1x for most lifestyle, food, walking, and hands shots.',
    'Use 0.5x only for wide rooms, streets, beaches, architecture, or table-wide establishing shots.',
    'Use 2x only for elegant portraits or details when you cannot move closer.',
    'Avoid Cinematic mode for daily shooting; use it only for one special portrait or quiet face moment.',
    'Avoid fast panning. A steady frame looks more expensive.',
    'For food/table shots, tap and hold to lock focus/exposure if the brightness keeps jumping.'
  ] : [];
  const photo = hasPhotos ? [
    'Mode: Photo for most shots; Portrait only when you want soft background blur.',
    'Take a cover photo with empty space at the top for text.',
    'For food: take only three useful versions — wide table, 45-degree plate, close detail.',
    'For yourself: back view, side profile, hand, reflection, or seated moment all count as presence.',
    'Use 2x for a more elegant portrait/detail look when the light is good.',
    'Do not take ten versions of the same plate unless the angle or light changes.'
  ] : [];
  const mini = [
    'Subject clear?',
    'Light okay?',
    'Phone steady?',
    'One job for this shot?',
    'Stop after the clip.'
  ];
  return { quickModeLine, before, video, photo, mini };
}

function generatePlan(rawInputs, options = {}) {
  if (!options.preserveSession) {
    const currentCounter = Number(sessionStorage.getItem(SESSION_COUNTER_KEY) || '0');
    sessionStorage.setItem(SESSION_COUNTER_KEY, String(currentCounter + 1));
  }
  const adjustments = options.adjustments || [];
  const revisionNotes = options.revisionNotes || '';
  const inputs = adjustments.includes('no-face') ? { ...rawInputs, noFace: true, filmedOnce: 'No' } : { ...rawInputs, noFace: false };
  const pillar = inferPillar(inputs);
  const variant = options.variant ?? 0;
  const toneMode = options.toneMode || (adjustments.includes('soulful-not-dramatic') ? 'soulful' : 'balanced');
  const script = buildScript(inputs, pillar, variant, toneMode, adjustments, revisionNotes);
  const scenes = buildScenes(inputs, pillar, script);
  const videoChecklist = buildVideoChecklist(inputs, pillar, scenes);
  const photoList = buildPhotoList(inputs, pillar, scenes);
  const caption = buildCaption(inputs, pillar, script.hook);
  const targetFit = buildTargetFit(inputs, pillar, script, adjustments);
  const shootCoach = buildShootCoach(inputs, pillar, videoChecklist, photoList);
  const iphoneSetup = buildIphoneSetup(inputs);
  const editBrief = buildEditBrief(inputs, pillar, script, scenes, videoChecklist, photoList, adjustments);
  const editTimeline = buildEditTimeline(inputs, pillar, script, videoChecklist, photoList);
  const songSuggestions = buildSongSuggestions(inputs, pillar);
  const now = new Date();
  const revisionNumber = options.revisionNumber || 1;
  return { id: `plan-${now.getTime()}`, createdAt: now.toISOString(), parentId: options.parentId || null, revisionNumber, inputs, pillar, direction: pillarCopy[pillar].direction, script, scenes, iphoneSetup, shootCoach, videoChecklist, photoList, caption, targetFit, editBrief, editTimeline, songSuggestions, variant, toneMode, adjustments, revisionNotes };
}

function renderPlan(plan) {
  const adjustmentText = plan.adjustments?.length ? ` · ${escapeHtml(getAdjustmentLabels(plan.adjustments).join(', '))}` : '';
  PLAN_OUTPUT.innerHTML = `
    <div class="light-banner">☀ ${escapeHtml(timeNotes[plan.inputs.timeOfDay] || 'Use the best light available. Keep the frame clean and readable.')}</div>
    <article class="output-card call-sheet-head">
      <p class="kicker">Call sheet</p>
      <div class="call-title-row">
        <div>
          <h3>Today’s content plan</h3>
          <p class="call-summary">${escapeHtml(plan.direction)}</p>
        </div>
        <span class="revision-badge">Revision ${escapeHtml(plan.revisionNumber || 1)}${adjustmentText}</span>
      </div>
      <div class="meta-grid compact-meta">
        <div class="meta-pill"><span>Location</span><strong>${escapeHtml(plan.inputs.location)}</strong></div>
        <div class="meta-pill"><span>Mood</span><strong>${escapeHtml(plan.inputs.mood)}</strong></div>
        <div class="meta-pill"><span>Pillar</span><strong>${escapeHtml(plan.pillar)}</strong></div>
        <div class="meta-pill"><span>Length</span><strong>${escapeHtml(plan.inputs.videoLength || 45)} sec</strong></div>
        <div class="meta-pill"><span>Balance</span><strong>${escapeHtml(captureLabel(plan.inputs.captureBalance))}</strong></div>
        <div class="meta-pill"><span>Energy</span><strong>${escapeHtml(plan.inputs.energy)}</strong></div>
      </div>
      <p class="helper-text"><strong>Shot rule:</strong> one place shot, one human detail, one texture, one story object, one quiet ending. No repeated coffee/table/door shots unless they serve different moments.</p>
    </article>

    <article class="output-card hook-card">
      <p class="kicker">1 · Hook</p>
      <p class="big-line">${escapeHtml(plan.script.hook)}</p>
      <p class="helper-text">Use this as your first text overlay in the first 1.5 seconds.</p>
    </article>

    <article class="output-card">
      <p class="kicker">2 · Voiceover script</p>
      <div class="script-box">${escapeHtml(plan.script.body)}</div>
      <p><strong>Read direction:</strong> ${escapeHtml(plan.script.moodInstruction)}</p>
    </article>

    <details class="output-card collapsible-card iphone-setup-card">
      <summary>
        <span><strong>3 · Check before shooting</strong> · iPhone 16 Pro Max setup</span>
        <span class="summary-hint">Open only if needed</span>
      </summary>
      <p class="helper-text strong-help">${escapeHtml(plan.iphoneSetup?.quickModeLine || 'Use your iPhone vertically, keep the frame steady, and shoot only what the story needs.')}</p>
      <div class="mini-setup-grid">
        <div class="setup-box">
          <h4>Fast check</h4>
          <div class="checklist compact-list">
            ${(plan.iphoneSetup?.before || []).map((item, index) => `
              <label class="check-item" data-check="setup-before-${index}"><input type="checkbox" /><span>${escapeHtml(item)}</span></label>`).join('')}
          </div>
        </div>
        ${(plan.iphoneSetup?.video || []).length ? `<div class="setup-box"><h4>Video settings</h4><ul>${plan.iphoneSetup.video.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''}
        ${(plan.iphoneSetup?.photo || []).length ? `<div class="setup-box"><h4>Photo settings</h4><ul>${plan.iphoneSetup.photo.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''}
      </div>
      <div class="coach-reminder compact-reminder"><strong>Before every shot:</strong> ${(plan.iphoneSetup?.mini || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
    </details>

    <article class="output-card shoot-coach-card">
      <p class="kicker">4 · iPhone Shoot Coach</p>
      <h3>${escapeHtml(plan.shootCoach?.headline || 'Shoot only the clips you need, then stop.')}</h3>
      <p class="helper-text strong-help">${escapeHtml(plan.shootCoach?.discipline || 'Every shot needs one clear job.')}</p>
      <div class="coach-reminder">${escapeHtml(plan.shootCoach?.fiveShotReminder || 'The 5-shot system adapts to your final video length.')}</div>
      <div class="coach-grid">
        ${(plan.shootCoach?.cards || []).map((item, index) => `
          <details class="coach-card" ${index < 2 ? 'open' : ''}>
            <summary><span>${escapeHtml(item.number)}. ${escapeHtml(item.job)}</span><strong>${escapeHtml(item.seconds)}</strong></summary>
            <p><strong>What:</strong> ${escapeHtml(item.what)}</p>
            <p><strong>Phone:</strong> vertical · ${escapeHtml(item.lens)}</p>
            <p><strong>Height:</strong> ${escapeHtml(item.phoneHeight)}</p>
            <p><strong>Angle:</strong> ${escapeHtml(item.angle)}</p>
            <p><strong>Look for texture:</strong> ${escapeHtml(item.texture)}</p>
            <p class="avoid-line"><strong>Avoid:</strong> ${escapeHtml(item.avoid)}</p>
            <p class="learn-line"><strong>Why this works:</strong> ${escapeHtml(item.learn)}</p>
          </details>`).join('')}
      </div>
    </article>

    ${(plan.videoChecklist || []).length ? `
    <article class="output-card shoot-card">
      <p class="kicker">5 · Video checklist</p>
      <p class="helper-text">Shoot these in order. Each clip has a different job so the video does not become repetitive.</p>
      <div class="checklist">
        ${(plan.videoChecklist || []).map((item, index) => `
          <label class="check-item rich-check" data-check="video-${index}">
            <input type="checkbox" />
            <span><strong>${escapeHtml(item.number)}. ${escapeHtml(item.job)} · ${escapeHtml(item.duration)}</strong><br>${escapeHtml(item.shot)}<br><em>${escapeHtml(item.why)}</em></span>
          </label>`).join('')}
      </div>
    </article>` : ''}

    ${(plan.photoList || []).length ? `
    <article class="output-card">
      <p class="kicker">${(plan.videoChecklist || []).length ? '6' : '5'} · Photos to take</p>
      <p class="helper-text">These support covers, Stories, carousels, and memory archive.</p>
      <div class="checklist">
        ${(plan.photoList || []).map((item, index) => `
          <label class="check-item" data-check="photo-${index}">
            <input type="checkbox" />
            <span>${escapeHtml(item)}</span>
          </label>`).join('')}
      </div>
    </article>` : ''}

    <article class="output-card edit-card timeline-card">
      <p class="kicker">7 · Shot-by-shot edit timeline</p>
      <p class="helper-text">Place the selected videos or photos sequentially in this order. Each row shows the matching script line, duration, transition, effect, sound, and optional insert.</p>
      <div class="timeline-list">
        ${(plan.editTimeline || []).map((item, index) => `
          <label class="timeline-item" data-check="timeline-${index}">
            <input type="checkbox" />
            <span class="timeline-num">${escapeHtml(item.number)}</span>
            <span class="timeline-body">
              <strong>${escapeHtml(item.time)} · ${escapeHtml(item.media)} · ${escapeHtml(item.duration)}</strong>
              <em>Clip/photo:</em> ${escapeHtml(item.place)}
              <em>Script line:</em> “${escapeHtml(item.scriptLine)}”
              <em>Text overlay:</em> ${escapeHtml(item.textOverlay)}
              <em>Transition:</em> ${escapeHtml(item.transition)}
              <em>Effect/color:</em> ${escapeHtml(item.effect)}
              <em>Sound effect:</em> ${escapeHtml(item.sound)}
              <em>Optional photo insert:</em> ${escapeHtml(item.photoInsert)}
            </span>
          </label>`).join('')}
      </div>
    </article>

    <article class="output-card edit-card">
      <p class="kicker">8 · Simple edit notes</p>
      <p class="helper-text">Use this after the timeline is arranged.</p>
      <div class="numbered-guide">
        ${plan.editBrief.map((item, index) => `
          <label class="check-item" data-check="edit-${index}">
            <input type="checkbox" />
            <span><strong>${index + 1}.</strong> ${escapeHtml(item)}</span>
          </label>`).join('')}
      </div>
      <div class="song-box">
        <p><strong>Song direction:</strong> ${escapeHtml(plan.songSuggestions?.direction || 'Keep music soft under the voice.')}</p>
        <p><strong>Search in CapCut/TikTok music:</strong> ${(plan.songSuggestions?.searchTerms || []).map(term => `<span class="song-chip">${escapeHtml(term)}</span>`).join('')}</p>
      </div>
    </article>

    <article class="output-card">
      <p class="kicker">9 · Caption + hashtags</p>
      <p>${escapeHtml(plan.caption)}</p>
    </article>

    <details class="output-card collapsible-card">
      <summary>
        <span><strong>Audience Fit: Strong</strong> · ${escapeHtml(plan.targetFit?.score || 90)}% appeal target</span>
        <span class="summary-hint">View checklist</span>
      </summary>
      <p><strong>Audience:</strong> ${escapeHtml(plan.targetFit?.audience || 'Filipino women 45–65')}</p>
      <p>${escapeHtml(plan.targetFit?.reason || '')}</p>
      <div class="checklist compact-list">
        ${(plan.targetFit?.checks || []).map((item, index) => `
          <label class="check-item" data-check="fit-${index}">
            <input type="checkbox" checked />
            <span>${escapeHtml(item)}</span>
          </label>`).join('')}
      </div>
    </details>

    <details class="output-card collapsible-card scene-map">
      <summary>
        <span><strong>Scene map</strong> · how the story becomes visuals</span>
        <span class="summary-hint">Open</span>
      </summary>
      ${plan.scenes.map(scene => `
        <div class="scene">
          <div class="scene-num">${scene.number}</div>
          <div>
            <p class="scene-title">${escapeHtml(scene.beat)}</p>
            <p><strong>Video:</strong> ${escapeHtml(scene.video)}</p>
            <p><strong>Photo:</strong> ${escapeHtml(scene.photo)}</p>
          </div>
        </div>`).join('')}
    </details>

    <article class="output-card revision-tools">
      <p class="kicker">Not feeling this plan?</p>
      <h3>Improve this plan</h3>
      <p class="revision-note">Choose what feels wrong after reading the plan. These are content-director fixes, not random tone buttons.</p>
      <div class="adjustment-grid" id="adjustmentGrid">
        <button class="adjustment-chip" type="button" data-adjust="stronger-hook">Stronger hook</button>
        <button class="adjustment-chip" type="button" data-adjust="clearer-story">Clearer story</button>
        <button class="adjustment-chip" type="button" data-adjust="more-visual">More visual</button>
        <button class="adjustment-chip" type="button" data-adjust="less-talky">Less talky</button>
        <button class="adjustment-chip" type="button" data-adjust="soulful-not-dramatic">More soulful, not dramatic</button>
        <button class="adjustment-chip" type="button" data-adjust="women45">More relatable to women 45+</button>
        <button class="adjustment-chip" type="button" data-adjust="more-elegant">More elegant</button>
        <button class="adjustment-chip" type="button" data-adjust="no-face">No face today</button>
      </div>
      <div class="revision-box">
        <label>
          Your notes for improvement
          <textarea id="revisionNotes" rows="3" placeholder="e.g., less emotional, stronger food memory, no age today, make it 15-sec friendly, use this line..."></textarea>
        </label>
        <button class="primary-btn" id="revisePlanBtn" type="button">Revise plan</button>
      </div>
    </article>
  `;
  OUTPUT.classList.remove('hidden');
  OUTPUT.scrollIntoView({ behavior: 'smooth', block: 'start' });
  localStorage.setItem(STORAGE_CURRENT_PLAN, JSON.stringify(plan));
  wireChecks();
  wireRevisionControls(plan);
}

function wireChecks() {
  $$('.check-item input').forEach(input => {
    input.addEventListener('change', e => {
      e.target.closest('.check-item').classList.toggle('done', e.target.checked);
    });
  });
  $$('.timeline-item input').forEach(input => {
    input.addEventListener('change', e => {
      e.target.closest('.timeline-item').classList.toggle('done', e.target.checked);
    });
  });
}


function wireRevisionControls(plan) {
  const selected = new Set(plan.adjustments || []);
  $$('.adjustment-chip').forEach(btn => {
    if (selected.has(btn.dataset.adjust)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });
  const reviseBtn = $('#revisePlanBtn');
  if (!reviseBtn) return;
  reviseBtn.addEventListener('click', () => {
    const current = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null') || plan;
    const adjustments = $$('.adjustment-chip.active').map(btn => btn.dataset.adjust);
    const revisionNotes = $('#revisionNotes')?.value.trim() || '';
    if (!adjustments.length && !revisionNotes) {
      showToast('Choose at least one fix or add a note.');
      return;
    }
    const cleanInputs = { ...current.inputs };
    delete cleanInputs.noFace;
    const revised = generatePlan(cleanInputs, {
      variant: ((current.variant || 0) + 1) % 5,
      toneMode: adjustments.includes('soulful-not-dramatic') ? 'soulful' : current.toneMode,
      adjustments,
      revisionNotes,
      parentId: current.parentId || current.id,
      revisionNumber: (current.revisionNumber || 1) + 1
    });
    renderPlan(revised);
    showToast(`Revised plan created: version ${revised.revisionNumber}.`);
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function planToText(plan) {
  const setup = plan.iphoneSetup || { before: [], video: [], photo: [], mini: [] };
  return `CONTENT COMPASS ${VERSION}\n\nLOCATION\n${plan.inputs.location}\n\nMOOD\n${plan.inputs.mood}\n\nPILLAR\n${plan.pillar}\n\nSTORY DIRECTION\n${plan.direction}\n\nHOOK\n${plan.script.hook}\n\nVOICEOVER SCRIPT\n${plan.script.body}\n\nIPHONE SETUP\n${setup.quickModeLine || ''}\n\nFast check:\n${(setup.before || []).map((p,i)=>`${i+1}. ${p}`).join('\\n')}\n\nVideo settings:\n${(setup.video || []).map((p,i)=>`${i+1}. ${p}`).join('\\n')}\n\nPhoto settings:\n${(setup.photo || []).map((p,i)=>`${i+1}. ${p}`).join('\\n')}\n\nBefore every shot:\n${(setup.mini || []).join(' · ')}\n\nIPHONE SHOOT COACH\n${(plan.shootCoach?.cards || []).map(s => `${s.number}. ${s.job} (${s.seconds})\nWhat: ${s.what}\nPhone: vertical · ${s.lens}\nHeight: ${s.phoneHeight}\nAngle: ${s.angle}\nTexture: ${s.texture}\nAvoid: ${s.avoid}`).join('\\n\\n')}\n\nVIDEO CHECKLIST\n${(plan.videoChecklist || []).map(s => `${s.number}. ${s.job} (${s.duration})\n${s.shot}\nWhy: ${s.why}`).join('\\n\\n')}\n\nSHOT-BY-SHOT EDIT TIMELINE\n${(plan.editTimeline || []).map(s => `${s.number}. ${s.time} · ${s.media} · ${s.duration}\nClip/photo: ${s.place}\nScript line: “${s.scriptLine}”\nText overlay: ${s.textOverlay}\nTransition: ${s.transition}\nEffect/color: ${s.effect}\nSound: ${s.sound}\nOptional photo insert: ${s.photoInsert}`).join('\\n\\n')}\n\nPHOTO LIST\n${plan.photoList.map((p,i)=>`${i+1}. ${p}`).join('\\n')}\n\nSONG SUGGESTIONS\n${(plan.songSuggestions?.searchTerms || []).join(' / ')}\n${plan.songSuggestions?.direction || ''}\n\nCAPTION\n${plan.caption}\n\nSIMPLE EDIT NOTES\n${plan.editBrief.map((p,i)=>`${i+1}. ${p}`).join('\\n')}`;
}

function savePlan(plan) {
  const archive = JSON.parse(localStorage.getItem(STORAGE_ARCHIVE) || '[]');
  archive.unshift(plan);
  localStorage.setItem(STORAGE_ARCHIVE, JSON.stringify(archive.slice(0, 90)));
  if (archive.length >= 75) showToast('Archive is getting full. Export soon.');
  renderArchive();
}

function renderArchive() {
  const archive = JSON.parse(localStorage.getItem(STORAGE_ARCHIVE) || '[]');
  const list = $('#archiveList');
  const warning = $('#archiveWarning');
  if (warning) warning.classList.toggle('hidden', archive.length < 75);
  const fromValue = $('#archiveFrom')?.value;
  const toValue = $('#archiveTo')?.value;
  const fromDate = fromValue ? new Date(`${fromValue}T00:00:00`) : null;
  const toDate = toValue ? new Date(`${toValue}T23:59:59`) : null;
  const filtered = archive.filter(plan => {
    const date = new Date(plan.createdAt);
    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;
    return true;
  });
  if (!archive.length) {
    list.className = 'archive-list empty-state';
    list.textContent = 'No saved plans yet.';
    return;
  }
  if (!filtered.length) {
    list.className = 'archive-list empty-state';
    list.textContent = 'No saved plans match this date filter.';
    return;
  }
  list.className = 'archive-list';
  list.innerHTML = filtered.map(plan => {
    const date = new Date(plan.createdAt).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
    return `<div class="archive-item">
      <div>
        <strong>${escapeHtml(plan.script.hook)}</strong>
        <p>${date} · ${escapeHtml(plan.inputs.location)} · ${escapeHtml(plan.pillar)} · ${escapeHtml(plan.inputs.mood)}</p>
      </div>
      <button class="ghost-btn restore-plan" data-id="${plan.id}" type="button">Open</button>
    </div>`;
  }).join('');
  $$('.restore-plan').forEach(btn => btn.addEventListener('click', () => {
    const plan = archive.find(item => item.id === btn.dataset.id);
    if (plan) renderPlan(plan);
  }));
}


const presets = {
  'lu-morning': { location: 'La Union beach, Philippines', activity: 'morning walk along the water, coffee, quiet sitting, journaling, sea light', mood: 'Quiet', timeOfDay: 'Morning', pillar: 'Sea & Stillness', angle: 'soulful' },
  'lu-golden': { location: 'La Union beach, Philippines', activity: 'beach walk, golden hour light, sea, slow afternoon', mood: 'Poetic', timeOfDay: 'Golden hour', pillar: 'Sea & Stillness', angle: 'soulful' },
  'manila-day': { location: 'Manila, Philippines', activity: 'errands, café, city streets, driving, ordinary city life', mood: 'Observant', timeOfDay: 'Afternoon', pillar: 'Ordinary Life', angle: 'simple-day' },
  'clinic-day': { location: 'SUMMIT Clinic, Tektite, Ortigas, Manila', activity: 'work day at the clinic, patients, team, quiet moments between sessions', mood: 'Quiet', timeOfDay: 'Morning', pillar: 'The Woman', angle: 'quiet-power' },
  'coffee-walk': { location: 'Local neighborhood, Manila or La Union', activity: 'morning coffee, walk, market, small errands, watching street life', mood: 'Observant', timeOfDay: 'Morning', pillar: 'Small Things', angle: 'details' },
  'transit': { location: 'Airport / in transit / long drive', activity: 'waiting, driving, arriving, window watching, between places', mood: 'In transit', timeOfDay: 'Morning', pillar: 'On the Road', angle: 'memory' }
};

function applyQuickMode(isQuick) {
  document.body.classList.toggle('quick-mode', isQuick);
  $('#quickModeBtn')?.classList.toggle('active', isQuick);
  $('#fullModeBtn')?.classList.toggle('active', !isQuick);
  localStorage.setItem(STORAGE_QUICK_MODE, isQuick ? 'quick' : 'full');
}

function migrateStorage() {
  const pairs = [[OLD_KEYS.inputs, STORAGE_INPUTS], [OLD_KEYS.current, STORAGE_CURRENT_PLAN], [OLD_KEYS.archive, STORAGE_ARCHIVE], [OLD_KEYS.quick, STORAGE_QUICK_MODE]];
  pairs.forEach(([oldKey, newKey]) => {
    if (!localStorage.getItem(newKey) && localStorage.getItem(oldKey)) {
      localStorage.setItem(newKey, localStorage.getItem(oldKey));
    }
  });
}

function validateVideoLengthLater() {
  const input = $('#videoLength');
  const feedback = $('#videoLengthFeedback');
  if (!input || !feedback) return;
  const value = Number(input.value);
  const valid = Number.isFinite(value) && value >= 15 && value <= 90;
  feedback.className = `field-feedback ${valid ? 'valid' : 'invalid'}`;
  feedback.textContent = valid ? '✓ Valid length' : 'Enter a number between 15 and 90 seconds.';
  clearTimeout(input._fixTimer);
  if (!valid) {
    input._fixTimer = setTimeout(() => {
      const raw = Number(input.value || 45);
      input.value = String(Math.max(15, Math.min(90, Number.isFinite(raw) ? Math.round(raw) : 45)));
      validateVideoLengthLater();
    }, 1500);
  }
}

function renderShootOverlay(plan) {
  const overlay = $('#shootOverlay');
  if (!overlay) return;
  const lightTip = timeNotes[plan.inputs.timeOfDay] || 'Use the cleanest available light.';
  overlay.innerHTML = `
    <div class="shoot-topbar">
      <div><p class="kicker">Field mode</p><h2>${escapeHtml(plan.script.hook)}</h2></div>
      <button class="ghost-btn shoot-close" type="button">× Close</button>
    </div>
    <div class="shoot-light">☀ ${escapeHtml(lightTip)}</div>
    <div class="shoot-rule"><strong>${escapeHtml(plan.iphoneSetup?.quickModeLine || 'Use your iPhone vertically. Keep it steady.')} </strong><br>${escapeHtml((plan.iphoneSetup?.mini || []).join(' · '))}</div>
    <div class="shoot-rule"><strong>${escapeHtml(plan.shootCoach?.headline || 'Shoot only what you need, then stop.')}</strong><br>${escapeHtml(plan.shootCoach?.discipline || 'Every shot needs one job.')}</div>
    ${(plan.shootCoach?.cards || []).length ? `<h3>iPhone shooting cards</h3><div class="shoot-list">${plan.shootCoach.cards.map((item, index) => `<label class="shoot-line coach-line"><input type="checkbox"><span><strong>${escapeHtml(item.number)}. ${escapeHtml(item.job)} · ${escapeHtml(item.seconds)}</strong><br><b>What:</b> ${escapeHtml(item.what)}<br><b>Phone:</b> vertical · ${escapeHtml(item.lens)}<br><b>Height:</b> ${escapeHtml(item.phoneHeight)}<br><b>Angle:</b> ${escapeHtml(item.angle)}<br><b>Texture:</b> ${escapeHtml(item.texture)}<br><em>Avoid: ${escapeHtml(item.avoid)}</em><br><em>Script cue: ${escapeHtml(plan.editTimeline?.[index]?.scriptLine || plan.script.hook)}</em></span></label>`).join('')}</div>` : ''}
    ${(plan.photoList || []).length ? `<h3>Photos</h3><div class="shoot-list">${plan.photoList.map((item, index) => `<label class="shoot-line"><input type="checkbox"><span>${escapeHtml(index + 1)}. ${escapeHtml(item)}</span></label>`).join('')}</div>` : ''}
  `;
  overlay.classList.remove('hidden');
  overlay.scrollIntoView({ behavior: 'smooth', block: 'start' });
  overlay.querySelector('.shoot-close')?.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', e => e.target.closest('label').classList.toggle('done', e.target.checked)));
}

function exportArchive() {
  const archive = JSON.parse(localStorage.getItem(STORAGE_ARCHIVE) || '[]');
  if (!archive.length) return showToast('No saved plans to export.');
  const divider = '\n\n----------------------------------------\n\n';
  const text = archive.map(plan => `DATE\n${new Date(plan.createdAt).toLocaleString()}\n\nLOCATION\n${plan.inputs.location}\n\nPILLAR\n${plan.pillar}\n\nHOOK\n${plan.script.hook}\n\nSCRIPT\n${plan.script.body}\n\nCAPTION\n${plan.caption}`).join(divider);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `content-compass-archive-${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Archive exported.');
}

async function shareCurrentPlan() {
  const plan = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  if (!plan) return showToast('Generate a plan first.');
  const text = planToText(plan);
  const title = `Content Compass — ${plan.inputs.location} — ${new Date(plan.createdAt).toLocaleDateString()}`;
  if (navigator.share) {
    try { await navigator.share({ title, text }); showToast('Shared.'); return; } catch (error) { if (error.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(text); showToast('Copied — paste into your Notes app.'); } catch (error) { showToast('Share unavailable. Copy manually.'); }
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

$('#sharePlanBtn')?.addEventListener('click', shareCurrentPlan);
$('#shootOnlyBtn')?.addEventListener('click', () => {
  const plan = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  if (!plan) return showToast('Generate a plan first.');
  renderShootOverlay(plan);
});
$('#exportArchiveBtn')?.addEventListener('click', exportArchive);
$('#quickModeBtn')?.addEventListener('click', () => applyQuickMode(true));
$('#fullModeBtn')?.addEventListener('click', () => applyQuickMode(false));
$('#videoLength')?.addEventListener('input', validateVideoLengthLater);
$$('.preset-pill').forEach(btn => btn.addEventListener('click', () => {
  const preset = presets[btn.dataset.preset];
  if (!preset) return;
  setInputs({ ...getInputs(), ...preset });
  $('#presetStatus').textContent = `Preset loaded: ${btn.textContent.trim()}. Check and generate.`;
  showToast('Preset loaded — check and generate.');
}));

$('#tryAgainBtn').addEventListener('click', () => {
  const current = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  const inputs = current?.inputs || getInputs();
  if (!inputs.location || !inputs.activity) return showToast('Add location and activity first.');
  const nextVariant = ((current?.variant || 0) + 1) % 5;
  renderPlan(generatePlan(inputs, { variant: nextVariant, toneMode: current?.toneMode || 'balanced' }));
  showToast('Generated another version.');
});

$('#filterArchiveBtn').addEventListener('click', renderArchive);
$('#clearArchiveFilterBtn').addEventListener('click', () => {
  $('#archiveFrom').value = '';
  $('#archiveTo').value = '';
  renderArchive();
  showToast('Date filter cleared.');
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
  const count = JSON.parse(localStorage.getItem(STORAGE_ARCHIVE) || '[]').length;
  if (!confirm(`This will permanently delete all ${count} saved plans on this device. Export first if you want to keep them.`)) return;
  localStorage.removeItem(STORAGE_ARCHIVE);
  renderArchive();
  showToast('Archive cleared.');
});

$('#loadSampleBtn').addEventListener('click', () => {
  setInputs({
    location: 'Neighborhood café',
    activity: 'coffee, walking, watching the street, one small errand',
    mood: 'Observant',
    energy: 'Medium',
    timeOfDay: 'Morning',
    videoLength: 45,
    captureBalance: 'mostly-video',
    filmedOnce: 'No',
    audienceFocus: 'filipina45',
    pillar: 'auto',
    angle: 'soulful',
    avoid: 'no jokes, no private people'
  });
  showToast('Sample loaded. Generate when ready.');
});

function init() {
  migrateStorage();
  applyQuickMode(localStorage.getItem(STORAGE_QUICK_MODE) !== 'full');
  setInputs(JSON.parse(localStorage.getItem(STORAGE_INPUTS) || 'null'));
  const current = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  if (current) renderPlan(current);
  renderArchive();
  validateVideoLengthLater();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

init();
