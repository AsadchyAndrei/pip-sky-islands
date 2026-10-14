/* Pip's Sky Islands: "How Pip works" — the guide for parents and teachers.
   Used in the app (an overlay with "Show me" buttons that replay the tours) and by guide.html (a public page).
   No app globals are needed to render it. */
const HOWTO=[
{id:'parents',title:'For parents',items:[
  {q:'Getting started (5 minutes)',a:`<ol>
    <li><b>Sign in</b> with Google or an email. Only a grown-up signs in; kids never type an email.</li>
    <li>Choose <b>Parent</b>, then <b>add a player</b>: a first name or nickname, your state and your child's grade. The islands follow that grade's school standards.</li>
    <li>Your child takes a <b>quick 2-minute check</b>, so Pip picks puzzles that fit.</li>
    <li>Set a <b>4-digit PIN</b> for the Parents section, so kids can't change settings.</li></ol>`,tour:'map'},
  {q:'What your child sees: the map',a:`<ul>
    <li><b>Today's flight plan</b> (Pip's Pick): a few short rounds chosen for your child each day. Starting here every day is the easiest routine.</li>
    <li><b>Islands</b>: each island is one school topic. Tabs switch between Math and Words &amp; World (reading, writing, science, social studies). Stars show how well an island is done; the bar shows skills mastered.</li>
    <li><b>Challenges</b>: short daily games for extra coins.</li>
    <li><b>Stars and coins</b> buy outfits in the <b>Closet</b> and build your child's own <b>island home</b>. <b>Story</b> mode and the sticker <b>Album</b> add more to explore.</li>
    <li><b>Rewards</b>: seasonal events, a weekly challenge, your child's own goal and the family goal you set.</li></ul>`,tour:'map'},
  {q:'Parents: progress, settings, your account',a:`Tap <b>Parents</b> at the top (on phones it is in the ⚙ menu) and type your PIN. Three tabs:
    <ul><li><b>Progress</b>: this week's minutes, puzzles and accuracy, skills mastered and "almost there", what to practice next with an idea to <b>try at home</b>, the last 8 weeks, recent mistakes, a skills checklist and test practice. <b>Print this week's report</b> for the fridge.</li>
    <li><b>Settings</b>: players and PINs, the school program (state and grade), joining a teacher's class, topics from class, daily goal, a daily time limit, difficulty, Pip's voice, bigger text and a dyslexia-friendly font.</li>
    <li><b>Account &amp; data</b>: emails and notifications, backups (one a day, kept 30 days), downloading your data, moving progress, and deleting the account.</li></ul>`,tour:'parent'},
  {q:'Family goal and rewards',a:`In Parents → Progress, set a <b>7-day goal</b> (minutes played, puzzles right on the first try, or new skills mastered) and a <b>reward you choose</b>, like a park trip. Your child sees it on the map with a progress bar and a celebration when it's reached.`,tour:'parent'},
  {q:'Weekly email and notifications',a:`In Parents → Account &amp; data → <b>Emails and notifications</b>: a <b>weekly email</b> every Sunday evening (minutes, skills, what to practice, an idea for home), <b>reminders</b> when your child hasn't played for 3 days or a class task is due, and <b>notifications on this device</b> for new tasks and messages from the teacher. On iPhone and iPad, notifications work after you add Pip to the Home Screen.`},
  {q:'Several kids, several devices',a:`Add each child as a player (Parents → Settings → Players → Add player). Kids tap their name to start; you can give a child a player PIN. Sign in with the same account on any phone, tablet or computer: progress follows. The switcher at the top of Parents shows one child at a time.`},
  {q:"Joining a teacher's class",a:`If your child's teacher uses Pip, type the 6-letter <b>class code</b> in Parents → Settings → "Join a teacher's class". The teacher then sees a progress summary for your child (never your email or other children), can send tasks, and you see the teacher's tasks and messages in Parents. You can leave the class at any time.`},
  {q:'Install as an app, play offline',a:`Pip works in any browser. To install it: on Android or a computer, Parents → Settings → "Install the app"; on iPhone or iPad, Safari → Share → "Add to Home Screen". It keeps working without internet and saves when you're back online.`}]},
{id:'teachers',title:'For teachers',items:[
  {q:'Getting started',a:`<ol><li>Sign in and choose <b>Teacher</b>, with the name students see (like "Ms. Rivera").</li>
    <li>On the <b>teacher desk</b>, make a class: a name and a grade.</li>
    <li>Add students, or give families the <b>class code</b> to join from home. Both can be in one class.</li></ol>`,tour:'desk'},
  {q:'Students on classroom devices',a:`In a class → <b>Students</b>: type first names (or paste a column from a spreadsheet, or <b>import from Google Classroom</b>). Print <b>login cards</b>: each student signs in by tapping their name and two pictures, no email or password. Tap <b>Use this device for the class</b> on a Chromebook or iPad, and it shows only your class's names.`,tour:'class'},
  {q:'Families join from home',a:`Give families the class code (Students tab, or post it with <b>Share in Google Classroom</b>). They type it in Parents → Settings. Their child's progress then appears in your class, and they see your tasks and messages.`},
  {q:'Progress: who needs what',a:`The <b>Progress</b> tab: a weekly summary, <b>groups</b> (needs help, on track, ahead) with one-click tasks, a heatmap by island and skill (tap an island for its skills), "where the class needs help" with <b>Assign practice</b>, results <b>by standard</b>, a card per student, <b>printable family reports</b> for conferences, and CSV downloads for your gradebook.`,tour:'class'},
  {q:'Tasks, lessons and messages',a:`The <b>Tasks</b> tab: mark the topics you teach <b>in class right now</b> (Pip's Pick practices them first), send <b>tasks</b> with a due date to the class or chosen students, run <b>lesson mode</b> (10 to 30 minutes on 1 to 3 islands, with a live view), and write a short <b>message to families</b>. Families can get a notification for new tasks and messages.`},
  {q:'Co-teachers',a:`Class settings → <b>Co-teachers</b> → Invite: you get a code for a colleague, specialist or aide. They type it on their teacher desk under "Join a colleague's class". Co-teachers see progress and send tasks, lessons and messages; only you manage students, the code and the class.`},
  {q:'Weekly class email',a:`Turn on <b>Weekly class email</b> on the teacher desk: every Sunday evening, who played, minutes, accuracy, who needs help and how tasks are going.`},
  {q:'New school year',a:`Class settings → <b>New school year</b> moves the whole class to the next grade; last year's stars stay saved in each student's progress.`}]},
{id:'faq',title:'Questions',items:[
  {q:'Is it free?',a:'Yes. No ads, no in-app purchases. Coins and outfits are earned only by learning.'},
  {q:'Which grades and states?',a:'Grades 3 to 5 for California today, following the state standards for math, English language arts, science and social studies. More states and grades are planned.'},
  {q:'What data is saved?',a:`Your email, each child's first name or nickname, and game progress. No ads, no tracking, never sold or shared. You can download or delete everything at any time. See the <a href="privacy.html" target="_blank" rel="noopener">privacy notice</a>.`},
  {q:'Forgot the Parents PIN?',a:'Sign out (tap the player name, then sign out) and sign in again: Parents opens without the PIN for 10 minutes so you can set a new one.'},
  {q:'Questions or ideas?',a:'Write to <b>hello@pipskyislands.com</b>. We read every message.'}]}];
/* the guide as HTML: tabs and folding answers; "Show me" buttons only inside the app */
function guideHTML(sel,inApp){const S=HOWTO.find(s=>s.id===sel)||HOWTO[0];
  return `<div class="gdtabs" role="tablist">${HOWTO.map(s=>`<button type="button" role="tab" data-gd="${s.id}" aria-selected="${s.id===S.id}">${s.title}</button>`).join('')}</div>
    <div class="gdlist">${S.items.map((it,i)=>`<details class="gditem"${i===0?' open':''}><summary>${it.q}</summary><div class="gda">${it.a}${inApp&&it.tour?`<p><button type="button" class="go small alt" data-gtour="${it.tour}">Show me</button></p>`:''}</div></details>`).join('')}</div>`}
