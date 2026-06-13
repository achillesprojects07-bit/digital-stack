const VERSION = 'V1.4';
const STORAGE_INPUTS = 'contentCompass.inputs.v1.4';
const STORAGE_CURRENT_PLAN = 'contentCompass.currentPlan.v1.4';
const STORAGE_ARCHIVE = 'contentCompass.archive.v1.4';

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
    direction: 'Today is about presence: a woman moving through the day with depth, grace, memory, and quiet strength.',
    hook: ['I am listening to this chapter.', 'This age has its own light.', 'I have arrived differently.', 'I know myself more now.', 'I am here, fully.'],
    turn: 'There is a tenderness in arriving at this age with more memory than fear.',
    landing: 'Some chapters do not need to be explained. They only need to be lived with care.'
  },
  'Ordinary Greece': {
    direction: 'Today is about ordinary Greece: coffee, streets, language, light, and the quiet beauty of daily life.',
    hook: ['Greece is quiet today.', 'The ordinary became beautiful.', 'This street stayed with me.', 'I came for moments like this.', 'Nothing grand. Just Greece.'],
    turn: 'I keep looking for the large story, and then Greece gives me a small one that feels more honest.',
    landing: 'Some places do not ask to be admired. They simply stay with you.'
  },
  'Sea & Stillness': {
    direction: 'Today is about sea and stillness: the kind of quiet that softens the body and steadies the heart.',
    hook: ['The sea softened the day.', 'I needed this kind of quiet.', 'The water remembered for me.', 'Today asked me to slow down.', 'Stillness has its own voice.'],
    turn: 'There are days when the sea does not say much, but somehow I understand everything better.',
    landing: 'I am learning that rest can be a form of courage.'
  },
  'Food': {
    direction: 'Today is about food as memory: coffee, bread, meals, appetite, warmth, and the way a table can hold a whole day.',
    hook: ['This meal became a memory.', 'The table held the day.', 'Food remembers what we feel.', 'I tasted Greece slowly.', 'Some stories begin at the table.'],
    turn: 'I have always believed food remembers what we are too busy to say.',
    landing: 'Some memories are not written down. They are served warm, passed by hand, and carried home quietly.'
  },
  'Small Things': {
    direction: 'Today is about small things: doors, curtains, hands, shadows, textures, and the beauty that waits quietly.',
    hook: ['The small things stayed.', 'I noticed the quiet details.', 'This little corner mattered.', 'Light found its way in.', 'Nothing happened. I remembered.'],
    turn: 'There are days when a shadow, a cup, or a doorway tells the truth more gently than words.',
    landing: 'I want to keep noticing the things that do not ask for attention.'
  },
  'On the Road': {
    direction: 'Today is about movement: arrivals, departures, bags, windows, waiting, and the quiet emotion of being between places.',
    hook: ['The road changed the mood.', 'Arriving is also a feeling.', 'I carried the day with me.', 'The window held the story.', 'Between places, I noticed myself.'],
    turn: 'Every road has a way of bringing old thoughts with you and leaving a few behind.',
    landing: 'There is a quiet kind of becoming that happens between leaving and arriving.'
  }
};

const moodLines = {
  'Poetic': 'Use imagery and feeling first. Write with soul, restraint, and clarity.',
  'Quiet': 'Keep the voice sparse and soulful. Let silence and images carry part of the feeling.',
  'Witty': 'Keep the wit gentle and human. No punchlines, no gimmicks, no forced cleverness.',
  'Observant': 'Let the story come from what you notice: light, food, hands, streets, sea, and small details.',
  'Elegant': 'Use clean language, slower clips, and fewer words. Let the feeling stay refined.',
  'Tired but showing up': 'Keep it honest and tender. No drama, no heroic tone.',
  'Soft': 'Use warmth: hands, fabric, coffee, sea, light, food, and memory.',
  'Bold': 'Use a clear hook, but keep the soul intact. Strength without shouting.',
  'Restless': 'Use movement: walking, turning, leaving, arriving, searching, noticing.',
  'Hungry': 'Let food be memory, not comedy. Warmth, appetite, table, sharing, and place.',
  'In transit': 'Use windows, bags, roads, signs, waiting, arrival, and the emotion of transition.',
  'Slightly dramatic but pretending not to be': 'Let the feeling be cinematic but restrained. Soulful, not sarcastic.'
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
  $('#filmedOnce').value = data.filmedOnce || 'No';
  $('#audienceFocus').value = data.audienceFocus || 'filipina45';
  $('#pillar').value = data.pillar || 'auto';
  $('#angle').value = data.angle || 'auto';
  $('#avoid').value = data.avoid || '';
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

function pick(arr, seed, offset = 0) {
  const value = Array.from(seed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
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

function avoidNote(inputs) {
  if (!inputs.avoid) return '';
  return ` Avoid: ${inputs.avoid}.`;
}

function buildScript(inputs, pillar, variant = 0, toneMode = 'balanced') {
  const copy = pillarCopy[pillar];
  const seed = `${inputs.location}-${inputs.activity}-${inputs.mood}-${inputs.timeOfDay}-${inputs.angle || 'auto'}`;
  const hook = pick(copy.hook, seed, variant);
  const activity = cleanActivity(inputs.activity).toLowerCase();
  const location = inputs.location;
  const moodInstruction = `${moodLines[inputs.mood] || moodLines.Observant} ${angleLines[inputs.angle || 'auto'] || angleLines.auto}${avoidNote(inputs)}`;
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
    copy.turn,
    `What I want to remember is ${sensory}.`,
    reflection,
    copy.landing
  ];
  return { hook, body: lines.join('\n'), moodInstruction, variant, toneMode };
}

function sensoryPhrase(pillar, inputs, variant = 0) {
  const bank = {
    'The Woman': ['the way the light falls on my face, the quiet in my body, and the woman I have carried all these years', 'my hands, my pace, my reflection, and the softness of being here now', 'a small glimpse of myself in this place, older, clearer, and more awake'],
    'Ordinary Greece': ['the coffee, the street, the low voices, the balconies, and the ordinary rhythm of Greece', 'a small street, a table, the morning light, and the sound of a language I am slowly learning', 'the simple things: coffee, stone, shade, movement, and the feeling of being briefly at home somewhere new'],
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
    'Ordinary Greece': ['The beauty is not asking for attention, which makes me want to pay attention even more.', 'Maybe ordinary days are the ones that tell the truth most clearly.', 'This is the kind of Greece I want to remember: unannounced, generous, and real.'],
    'Sea & Stillness': ['The sea does not hurry me, and for once I am trying not to hurry myself.', 'I do not need the day to become useful. I need it to become felt.', 'There is a kind of peace that arrives only when I stop negotiating with the moment.'],
    'Food': ['A table can become a diary when you let the day sit down with you.', 'Food has always been one of the ways I understand love, place, and memory.', 'The meal is simple, but the feeling around it is not.'],
    'Small Things': ['A small thing can hold a whole feeling when I stop moving too fast.', 'I am beginning to trust the quiet details more than the obvious ones.', 'Sometimes the smallest frame carries the deepest memory.'],
    'On the Road': ['Movement always changes the shape of a thought.', 'Between places, I hear myself differently.', 'The road has a way of making even silence feel full.']
  };
  return pick(bank[pillar], `${inputs.mood}-${inputs.timeOfDay}-${toneMode}`, variant);
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
      ['Emotional detail', 'A quiet contrast: dressed with care, carrying a practical bag, coffee beside notebook, wind moving fabric or hair.', 'Photo: honest candid detail.'],
      ['Soft landing', 'Quiet ending: walking away, closing notebook, cup on table, or doorway after you pass.', 'Photo: final frame with space.']
    ],
    'Ordinary Greece': [
      ['Hook visual', `Exterior or first view of ${location}. Hold 3 seconds before moving.`, 'Cover photo: street/café with empty space for hook text.'],
      ['Personal turn', 'Coffee, table, receipt, chair, or your hand entering the frame.', 'Photo: overhead table shot.'],
      ['Sensory proof', 'Slow walking clip: balcony, pavement, bakery sign, quiet street, light on wall.', 'Photo: street detail.'],
      ['Emotional detail', 'Something ordinary but full of life: chair, napkin, cup, sign, scooter, balcony, or a table after someone leaves.', 'Photo: ordinary detail with feeling.'],
      ['Soft landing', 'Still ending: empty chair, cup after coffee, street after you leave, light on wall.', 'Photo: calm closing image.']
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
  const target = normalizeTargetLength(inputs.videoLength);
  const profile = timingProfile(target);
  const shotCount = profile.shots;
  const baseDur = profile.dur;
  const chosen = [];
  const push = (job, shot, why, duration = baseDur) => chosen.push({ job, shot, why, duration });

  push('Hook / first frame', scenes[0]?.video || `First view of ${inputs.location}. Hold steady.`, 'Shows the audience where the feeling begins.');
  if (inputs.filmedOnce === 'Yes') {
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
  if (pillar === 'The Woman') push('Face or silhouette', 'One natural glimpse of your face, side profile, mirror, or silhouette.', 'The audience connects to your presence.');
  if (pillar === 'Small Things') push('Pattern detail', 'Create a tiny sequence: object → light → hand → stillness.', 'Small things need visual rhythm.');
  if (pillar === 'Ordinary Greece') push('Local rhythm', 'One ordinary local detail: chair, balcony, bakery window, scooter, pavement, street sign, voices, or coffee counter.', 'Keeps Greece real, not touristy.');

  return chosen.slice(0, shotCount).map((item, index) => ({ ...item, number: index + 1 }));
}

function buildTargetFit(inputs, pillar, script) {
  const focusMap = {
    filipina45: 'Filipino women 45–65 who respond to soul, confidence, food, place, memory, and a woman who is not trying too hard.',
    daughters: 'Daughters who may send the video to their mothers because it feels tender, dignified, and familiar.',
    'midlife-global': 'Women in midlife globally who want depth without motivational clichés.',
    'travel-soul': 'Mature travelers who want place, feeling, food, light, and personal meaning instead of tourist checklists.'
  };
  const checks = [
    'Clear first 1.5 seconds: the hook must appear as text immediately, especially for 15–30 second videos.',
    'The woman is the center: Greece supports the story but does not replace you.',
    'At least one human presence shot: face, silhouette, hands, walking, or reflection.',
    'At least one sensory detail: food, light, sea, fabric, stone, coffee, street, or sound.',
    'No redundant footage: do not repeat the same table, coffee, door, or sea angle unless the emotion changes.',
    'No lecture: the ending should leave a feeling, not teach a lesson.',
    'Filipina warmth remains present: food, family memory, grace, humor, or lived experience without oversharing.'
  ];
  return {
    score: 90,
    audience: focusMap[inputs.audienceFocus] || focusMap.filipina45,
    reason: `This plan is built for ${pillar.toLowerCase()} with a soulful midlife point of view, a clear human presence, and non-redundant scenes.`,
    checks
  };
}

function buildPhotoList(inputs, pillar, scenes = []) {
  const base = [
    'Cover photo: vertical frame with clean negative space for text overlay.',
    'Place photo: one image that clearly shows where the story happens, not just a close-up.',
    'Human detail: hand, walking feet, side profile, notebook, bag, or silhouette — one only.',
    'Texture photo: light, wall, table, stone, curtain, menu, shadow, or street detail.',
    'Ending photo: quiet final frame after the moment has passed — empty chair, table, doorway, sea, or street.'
  ];
  const additions = {
    'Food': ['Food memory photo: one plate or table image after the first bite, not a perfect menu shot.'],
    'Sea & Stillness': ['Wide sea photo: one quiet frame with no people, used for breathing room.'],
    'On the Road': ['Transition photo: bag, window, road sign, seat, or first view after arrival.'],
    'The Woman': ['Presence photo: one natural image of you from side/back, not posed too perfectly.'],
    'Small Things': ['Object photo: one small detail that can carry the whole mood of the day.'],
    'Ordinary Greece': ['Everyday Greece photo: balcony, café chair, street sign, bakery window, or pavement light.']
  };
  const list = uniqueList([base[0], ...(additions[pillar] || []), ...base.slice(1)]);
  return list.slice(0, 6);
}

function buildCaption(inputs, pillar, hook) {
  const tagMap = {
    'The Woman': '#over50 #filipina #agingpowerfully #midlifewoman #editinglife',
    'Ordinary Greece': '#over50 #filipina #ordinarygreece #maturetraveler #greecediary',
    'Sea & Stillness': '#over50 #filipina #seastillness #maturetraveler #assosgreece',
    'Food': '#over50 #filipina #greekfood #foodmemory #greeceeats',
    'Small Things': '#over50 #filipina #smallthings #slowcontent #noticinglife',
    'On the Road': '#over50 #filipina #maturetraveler #ontheroad #greecearrival'
  };
  const captions = {
    'The Woman': 'This chapter has its own light.',
    'Ordinary Greece': 'A quiet piece of Greece stayed with me.',
    'Sea & Stillness': 'The sea softened the day.',
    'Food': 'A meal, a place, a memory.',
    'Small Things': 'The small things stayed.',
    'On the Road': 'Between places, I noticed myself.'
  };
  return `${captions[pillar]} ${tagMap[pillar]}`;
}

function buildEditBrief(inputs, pillar, script, scenes, videoChecklist = []) {
  const target = normalizeTargetLength(inputs.videoLength);
  const profile = timingProfile(target);
  const clipCount = videoChecklist.length || profile.shots;
  const voiceWords = profile.words;
  const lowRange = Math.max(15, target - 3);
  const highRange = Math.min(95, target + 3);
  return [
    `Target length: ${target} seconds. Keep the final edit around ${lowRange}–${highRange} seconds.`,
    `Use about ${clipCount} video clips. Clip timing: ${profile.dur}. For a ${target}-second video, keep it ${profile.edit}.`,
    `First 1.5 seconds: show the strongest visual and place this hook as text: “${script.hook}”`,
    'Edit order: 1) hook visual, 2) human presence, 3) place context, 4) sensory detail, 5) movement, 6) emotional object, 7) quiet pause, 8) soft ending.',
    `Voiceover: read slowly. For ${target} seconds, keep the spoken script around ${voiceWords} words or less. For 15–20 second videos, use one short thought only.`,
    'Text overlays: maximum 3 only — hook, one emotional line, final soft landing. Do not cover the whole video with text.',
    'Sound: soft instrumental or natural ambient sound. Keep music low at 8–12% under the voice. Avoid songs with loud lyrics.',
    'Cutting rule: if two clips show the same thing, keep only the one with more feeling, movement, or light.',
    `Thumbnail: use the clearest cover photo with negative space and this short text: “${script.hook}”`,
    `Light note: ${timeNotes[inputs.timeOfDay]}`
  ];
}

function generatePlan(inputs, options = {}) {
  const pillar = inferPillar(inputs);
  const variant = options.variant ?? 0;
  const toneMode = options.toneMode || 'balanced';
  const script = buildScript(inputs, pillar, variant, toneMode);
  const scenes = buildScenes(inputs, pillar, script);
  const videoChecklist = buildVideoChecklist(inputs, pillar, scenes);
  const photoList = buildPhotoList(inputs, pillar, scenes);
  const caption = buildCaption(inputs, pillar, script.hook);
  const targetFit = buildTargetFit(inputs, pillar, script);
  const editBrief = buildEditBrief(inputs, pillar, script, scenes, videoChecklist);
  const now = new Date();
  return { id: `plan-${now.getTime()}`, createdAt: now.toISOString(), inputs, pillar, direction: pillarCopy[pillar].direction, script, scenes, videoChecklist, photoList, caption, targetFit, editBrief, variant, toneMode };
}

function renderPlan(plan) {
  PLAN_OUTPUT.innerHTML = `
    <article class="output-card plan-rules">
      <p class="kicker">Plan controls</p>
      <p><strong>Not feeling this version?</strong> Use “Try another version” or change the story angle above and generate again. The scenes follow the script, so every video and photo has a job.</p>
      <p><strong>Shot rule:</strong> one place shot, one human detail, one texture, one story object, one quiet ending. No repeated coffee/table/door shots unless they serve different moments.</p>
    </article>

    <article class="output-card highlight">
      <p class="kicker">Story direction</p>
      <p class="big-line">${escapeHtml(plan.direction)}</p>
      <div class="meta-grid">
        <div class="meta-pill"><span>Location</span><strong>${escapeHtml(plan.inputs.location)}</strong></div>
        <div class="meta-pill"><span>Mood</span><strong>${escapeHtml(plan.inputs.mood)}</strong></div>
        <div class="meta-pill"><span>Pillar</span><strong>${escapeHtml(plan.pillar)}</strong></div>
        <div class="meta-pill"><span>Length</span><strong>${escapeHtml(plan.inputs.videoLength || 45)} sec</strong></div>
        <div class="meta-pill"><span>Energy</span><strong>${escapeHtml(plan.inputs.energy)}</strong></div>
      </div>
    </article>

    <article class="output-card target-fit">
      <p class="kicker">Target-market fit check</p>
      <p class="fit-score">${escapeHtml(plan.targetFit?.score || 90)}% appeal target</p>
      <p><strong>Audience:</strong> ${escapeHtml(plan.targetFit?.audience || 'Filipino women 45–65')}</p>
      <p>${escapeHtml(plan.targetFit?.reason || '')}</p>
      <div class="checklist compact-list">
        ${(plan.targetFit?.checks || []).map((item, index) => `
          <label class="check-item" data-check="fit-${index}">
            <input type="checkbox" checked />
            <span>${escapeHtml(item)}</span>
          </label>`).join('')}
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
      <p class="kicker">Scene logic</p>
      ${plan.scenes.map(scene => `
        <div class="scene">
          <div class="scene-num">${scene.number}</div>
          <div>
            <p class="scene-title">${escapeHtml(scene.beat)}</p>
            <p><strong>Story purpose:</strong> ${escapeHtml(scene.video)}</p>
            <p><strong>Photo support:</strong> ${escapeHtml(scene.photo)}</p>
          </div>
        </div>`).join('')}
    </article>

    <article class="output-card">
      <p class="kicker">Must-shoot video checklist</p>
      <p class="helper-text">Shoot these in order. Each clip has a different job, so the video does not become repetitive.</p>
      <div class="checklist">
        ${(plan.videoChecklist || []).map((item, index) => `
          <label class="check-item rich-check" data-check="video-${index}">
            <input type="checkbox" />
            <span><strong>${escapeHtml(item.number)}. ${escapeHtml(item.job)} · ${escapeHtml(item.duration)}</strong><br>${escapeHtml(item.shot)}<br><em>${escapeHtml(item.why)}</em></span>
          </label>`).join('')}
      </div>
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

$('#tryAgainBtn').addEventListener('click', () => {
  const current = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  const inputs = current?.inputs || getInputs();
  if (!inputs.location || !inputs.activity) return showToast('Add location and activity first.');
  const nextVariant = ((current?.variant || 0) + 1) % 5;
  renderPlan(generatePlan(inputs, { variant: nextVariant, toneMode: current?.toneMode || 'balanced' }));
  showToast('Generated another version.');
});

$('#softerBtn').addEventListener('click', () => {
  const current = JSON.parse(localStorage.getItem(STORAGE_CURRENT_PLAN) || 'null');
  const inputs = current?.inputs || getInputs();
  if (!inputs.location || !inputs.activity) return showToast('Add location and activity first.');
  renderPlan(generatePlan(inputs, { variant: ((current?.variant || 0) + 1) % 5, toneMode: 'soulful' }));
  showToast('Made it more soulful.');
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
    videoLength: 45,
    filmedOnce: 'No',
    audienceFocus: 'filipina45',
    pillar: 'auto',
    angle: 'soulful',
    avoid: 'no jokes, no private people'
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
