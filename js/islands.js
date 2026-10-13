/* Pip's Sky Islands: History, grammar, writing, test practice, Clock Cove, the island list, seasonal events. Loaded in order by index.html; all files share one global scope. */
/* ================= islands ================= */
/* ================= Gold Rush Gulch: California history (CA HSS grade 4) ================= */
LANDMARKS.mission=`<rect x="58" y="26" width="44" height="40" fill="#f6e1b8" stroke="#8c5a2c" stroke-width="2"/><path d="M58 26 Q80 6 102 26Z" fill="#f6e1b8" stroke="#8c5a2c" stroke-width="2"/><rect x="74" y="16" width="12" height="12" rx="6" fill="#8c5a2c"/><path d="M76 24 q4 -8 8 0z" fill="#ffc23d"/><rect x="72" y="46" width="16" height="20" rx="8" fill="#a0683a"/><path d="M58 26 h44" stroke="#c9473a" stroke-width="4"/><circle cx="118" cy="58" r="6" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/><circle cx="128" cy="62" r="4" fill="#ffc23d" stroke="#e09a14" stroke-width="1.5"/>`;
const CAHIST=[
  /* first peoples */
  ['Before explorers from Europe came, about how many Native people lived in California?','About 300,000',['About 3,000','About 30 million','Nobody lived there'],'California had many tribes speaking about 100 languages.','Experts think about <b>300,000</b> Native people lived in California, in many different tribes.'],
  ['Which Native people lived around San Francisco Bay and Monterey Bay, including where Mountain View is today?','The Ohlone',['The Mojave','The Yurok','The Navajo'],'Their name is still used for many places in the Bay Area.','The <b>Ohlone</b> lived around San Francisco Bay and Monterey Bay, including our area.'],
  ['What was one of the most important foods for many California tribes?','Acorns',['Rice','Potatoes','Wheat bread'],'It falls from oak trees.','Many tribes gathered <b>acorns</b> from oak trees and made them into mush or bread.'],
  ['Raw acorns taste bitter. How did Native Californians make them good to eat?','Ground them and rinsed the meal with water',['Froze them in snow','Ate them raw','Fed them to horses first'],'Water can wash something away.','They <b>ground acorns into meal and rinsed it with water</b> many times to wash away the bitter taste.'],
  ['The Chumash lived on the coast near Santa Barbara. What did they build to travel to the Channel Islands?','Plank canoes called tomols',['Steamships','Hot air balloons','Wooden bridges'],'They traveled across the ocean.','The Chumash built strong <b>plank canoes called tomols</b> to paddle to the Channel Islands.'],
  ['The Ohlone made boats out of which plant?','Tule reeds',['Bamboo','Cactus','Pine needles'],'It is a tall plant that grows in marshes.','The Ohlone tied bundles of <b>tule reeds</b> together to make boats. They also used tule for houses and mats.'],
  ['Which California people are famous for weaving beautiful baskets, some so tight they could hold water?','The Pomo',['The Aztec','The Inuit','The Maya'],'They lived north of San Francisco Bay.','The <b>Pomo</b> are famous for their beautiful, tightly woven baskets.'],
  ['The Yurok and Hupa lived near rivers in the northwest of California. What fish was very important to them?','Salmon',['Tuna','Goldfish','Sharks'],'This fish swims up rivers every year.','The Yurok and Hupa caught <b>salmon</b> that swam up the Klamath and Trinity Rivers.'],
  ['The Mojave people lived in the desert. Which river did they live along and farm beside?','The Colorado River',['The Mississippi River','The Nile','The American River'],'It forms part of California\'s border with Arizona.','The Mojave lived along the <b>Colorado River</b> and farmed the land after it flooded.'],
  ['Many California tribes traded using what as money?','Shell beads',['Paper dollars','Gold coins','Credit cards'],'They came from the beach.','Many tribes used <b>beads made from shells</b>, like clamshell disks, as money for trading.'],
  /* explorers */
  ['In 1542, who was the first European explorer to sail along the California coast?','Juan Rodríguez Cabrillo',['Christopher Columbus','Francis Drake','Lewis and Clark'],'He sailed for Spain and landed at San Diego Bay.','<b>Juan Rodríguez Cabrillo</b> sailed for Spain and reached San Diego Bay in 1542.'],
  ['Cabrillo explored the California coast for which country?','Spain',['England','France','China'],'This country later built the missions.','Cabrillo sailed for <b>Spain</b>.'],
  ['In 1579, which English explorer landed on the California coast and claimed the land for England?','Francis Drake',['Juan Cabrillo','Junípero Serra','John Sutter'],'He sailed all the way around the world.','<b>Francis Drake</b> landed in 1579 during his trip around the world.'],
  ['In 1602, Sebastián Vizcaíno explored the coast and named a famous bay. Which one?','Monterey Bay',['Hudson Bay','Chesapeake Bay','Tampa Bay'],'It is south of Santa Cruz.','Vizcaíno named <b>Monterey Bay</b> in 1602.'],
  /* missions */
  ['Who founded the first California mission in 1769?','Father Junípero Serra',['John Sutter','James Marshall','Leland Stanford'],'He was a Spanish priest.','<b>Father Junípero Serra</b> founded the first mission in 1769.'],
  ['What was the first California mission?','Mission San Diego de Alcalá',['Mission Santa Clara','Mission San Francisco','Mission Sonoma'],'It is in the city farthest south.','The first mission was <b>Mission San Diego de Alcalá</b>, founded in 1769.'],
  ['Who led the Spanish soldiers on the 1769 land trip to California with Father Serra?','Gaspar de Portolá',['Hernán Cortés','John Frémont','Kit Carson'],'His name is on many roads and parks.','<b>Gaspar de Portolá</b> led the 1769 land expedition.'],
  ['What was the road that connected the California missions called?','El Camino Real',['Route 66','The Oregon Trail','Main Street'],'It means "The Royal Road" in Spanish.','The missions were linked by <b>El Camino Real</b>, "The Royal Road". El Camino Real still runs through Mountain View!'],
  ['About how far apart were most California missions?','About one day\'s walk or ride',['About one hour\'s walk','About one month\'s walk','They were all on one street'],'Travelers wanted a place to sleep each night.','Most missions were about <b>one day\'s travel</b> apart, around 30 miles.'],
  ['Why did Spain build missions in California?','To spread its religion and claim the land',['To find dinosaurs','To build airports','To start a gold rush'],'Spain wanted to control California.','Spain built missions <b>to spread Christianity and to claim and control the land</b>.'],
  ['In Spanish California, what was a presidio?','A fort for soldiers',['A church','A farm for horses','A boat'],'Soldiers lived there to protect the land.','A <b>presidio</b> was a fort where soldiers lived.'],
  ['In Spanish California, what was a pueblo?','A town',['A fort','A boat','A gold mine'],'Settlers lived there and grew food.','A <b>pueblo</b> was a town. San Jose and Los Angeles began as pueblos.'],
  ['What were most mission walls made of?','Adobe bricks',['Steel','Glass','Plastic'],'They were made of mud, straw and water, dried in the sun.','Mission walls were made of <b>adobe</b>: sun-dried bricks of mud and straw.'],
  ['Which mission is closest to Mountain View?','Mission Santa Clara de Asís',['Mission San Diego de Alcalá','Mission Santa Barbara','Mission San Luis Rey'],'It is on the campus of a university in Santa Clara.','<b>Mission Santa Clara de Asís</b>, founded in 1777, is just a few miles away.'],
  ['What caused many Native Californians at the missions to get sick and die?','Diseases brought from Europe',['Eating too many acorns','Cold weather','Earthquakes'],'Their bodies had never met these germs before.','<b>Diseases from Europe</b>, like measles and smallpox, killed many Native people. Life at the missions was very hard for them.'],
  /* Mexican California */
  ['In 1821, California stopped being ruled by Spain. Which country ruled it next?','Mexico',['England','Russia','The United States'],'This country won its independence from Spain in 1821.','After 1821, California was part of <b>Mexico</b>.'],
  ['During the Mexican era, what were ranchos?','Huge cattle ranches',['Big cities','Gold mines','Railroad stations'],'Think of cows and cowboys.','<b>Ranchos</b> were huge ranches where cattle were raised.'],
  ['On the ranchos, cattle hides were traded so often they got a nickname. What was it?','California bank notes',['Golden tickets','Pony money','Cow coins'],'They were used almost like money.','Hides were called <b>"California bank notes"</b> because they were traded like money.'],
  ['What were the skilled cowboys who worked on the ranchos called?','Vaqueros',['Padres','Forty-niners','Pioneers'],'It comes from the Spanish word for cow, vaca.','The cowboys were called <b>vaqueros</b>.'],
  ['In 1846, settlers in Sonoma rebelled against Mexico and raised a flag. What was on it?','A grizzly bear and a star',['An eagle and a snake','A gold nugget','A palm tree'],'It is still on California\'s state flag.','The <b>Bear Flag</b> had a grizzly bear and a star. It became the state flag.'],
  ['After the Mexican-American War ended in 1848, California became part of which country?','The United States',['Mexico','Spain','Canada'],'California joined as a state two years later.','In 1848, California became part of <b>the United States</b>.'],
  /* Gold Rush */
  ['Who found gold at Sutter\'s Mill in January 1848?','James Marshall',['John Sutter','Levi Strauss','Junípero Serra'],'He was building a sawmill for John Sutter.','<b>James Marshall</b> spotted gold while building Sutter\'s sawmill.'],
  ['Sutter\'s Mill, where gold was found, was on which river?','The American River',['The Colorado River','The Klamath River','The Los Angeles River'],'Its name sounds like the country.','Gold was found on the <b>American River</b>, near Coloma.'],
  ['What were the gold seekers who rushed to California in 1849 called?','Forty-niners',['Pilgrims','Cowboys','Astronauts'],'Look at the year!','They came in 1849, so they were called <b>forty-niners</b>.'],
  ['What was the simplest way to find gold in a stream?','Panning: swirling sand and water in a pan',['Using a metal detector','Digging with a bulldozer','Buying it at a store'],'Gold is heavy, so it sinks.','Miners swirled sand and water in a pan. Heavy gold sank to the bottom. This was called <b>panning</b>.'],
  ['Chinese immigrants gave California a special name during the Gold Rush. What was it?','Gold Mountain',['Silver City','Sunny Island','Dragon Valley'],'In Chinese it is Gam Saan.','They called California <b>"Gold Mountain"</b>.'],
  ['In 1850, California made some miners from other countries pay a special tax. What was it called?','The Foreign Miners\' Tax',['The Gold Tax','The Horse Tax','The Bridge Toll'],'It was for miners who were not U.S. citizens.','The <b>Foreign Miners\' Tax</b> unfairly charged miners from other countries.'],
  ['During the Gold Rush, who often made the most money?','Shopkeepers who sold supplies to miners',['Every single miner','Nobody at all','The horses'],'Miners needed food, tools and clothes.','Many <b>shopkeepers and merchants</b> got rich selling tools, food and clothes to miners.'],
  ['Which famous kind of clothing got its start selling to miners in California?','Blue jeans',['Tuxedos','Sneakers','Raincoats'],'Levi Strauss sold strong work pants.','Levi Strauss sold tough pants that became <b>blue jeans</b>.'],
  ['During the Gold Rush, San Francisco quickly changed from a small village into what?','A busy city',['An empty desert','A frozen lake','A forest'],'Tens of thousands of people arrived by ship.','San Francisco grew into <b>a busy city</b> almost overnight.'],
  /* statehood */
  ['When California became a state in 1850, was slavery allowed?','No, it was a free state',['Yes','Only on ranchos','Only in the mountains'],'California\'s first constitution banned slavery.','California joined the U.S. in 1850 as a <b>free state</b>.'],
  ['Which city was California\'s first state capital?','San Jose',['Los Angeles','San Diego','Fresno'],'It is close to Mountain View!','The first state capital was <b>San Jose</b>. Sacramento became the capital in 1854.'],
  /* connecting California */
  ['How did the Pony Express carry mail across the country in 1860?','Riders on fast horses taking turns',['On trains','By airplane','By email'],'Each rider passed the mail bag to the next one.','<b>Riders on fast horses</b> passed the mail along in relays, about 10 days from Missouri to Sacramento.'],
  ['Why did the Pony Express stop after about a year and a half?','The telegraph could send messages much faster',['The horses got tired','People stopped writing letters','It was too cheap'],'Messages traveled through wires.','In 1861 the <b>telegraph</b> line was finished. It sent messages in minutes.'],
  ['In 1869, a railroad was finished that crossed the whole country. What was it called?','The Transcontinental Railroad',['The Royal Road','The Silk Road','The Underground Railroad'],'"Trans" means across, and "continental" means the continent.','The <b>Transcontinental Railroad</b> joined the East and the West in 1869.'],
  ['Who did much of the hard, dangerous work building the railroad east from Sacramento through the Sierra Nevada?','Chinese immigrant workers',['Robots','Gold miners from Mars','Nobody: it built itself'],'Thousands came from China to work.','Thousands of <b>Chinese immigrant workers</b> built the Central Pacific Railroad through the mountains.'],
  ['Where were the two parts of the Transcontinental Railroad joined with a golden spike?','Promontory Summit, Utah',['San Francisco','New York City','Sutter\'s Mill'],'It was in a state east of Nevada.','The golden spike was driven at <b>Promontory Summit, Utah</b>, on May 10, 1869.'],
  ['Which railroad leader started a famous university near Mountain View?','Leland Stanford',['James Marshall','John Sutter','Francis Drake'],'The university has his family\'s name.','<b>Leland Stanford</b> and his wife Jane started Stanford University.'],
  ['How did the Transcontinental Railroad change travel to California?','The trip took about a week instead of months',['Nobody could travel anymore','Trips took longer','Only horses could travel'],'Trains are faster than wagons.','Crossing the country took <b>about a week instead of many months</b>.'],
  /* modern California */
  ['In what year did a huge earthquake and fire destroy much of San Francisco?','1906',['1849','1776','2006'],'It was early in the 1900s.','The great San Francisco earthquake and fire happened in <b>1906</b>.'],
  ['Many immigrants from Asia first arrived at an immigration station on which island in San Francisco Bay?','Angel Island',['Alcatraz','Hawaii','Catalina'],'It is the biggest island in the bay.','From 1910 to 1940, many immigrants came through <b>Angel Island</b>.'],
  ['In the 1930s, many families from Oklahoma and nearby states moved to California because of dust storms. What was that time called?','The Dust Bowl',['The Gold Rush','The Ice Age','The Space Race'],'Their farms dried up and blew away.','Many families escaped the <b>Dust Bowl</b> and came to work on California farms.'],
  ['Why did Los Angeles build a long aqueduct in 1913?','To bring water to the city',['To carry gold','To move cars','To catch fish'],'Southern California is very dry.','The aqueduct <b>brings water</b> from far away to the dry city.'],
  ['Which two leaders worked together to help California farm workers get fair pay in the 1960s?','César Chávez and Dolores Huerta',['Lewis and Clark','Leland and Jane Stanford','James Marshall and John Sutter'],'They started a union for farm workers.','<b>César Chávez and Dolores Huerta</b> organized farm workers for fair pay and safe work.'],
  ['The area around Mountain View is called Silicon Valley. Why?','Many computer and technology companies started here',['Silicon is a kind of fruit grown here','It has the most sand beaches','It is made of glass'],'Computer chips are made from silicon.','Computer chips are made from <b>silicon</b>, and many tech companies started here.'],
  ['Which California city became famous for making movies?','Los Angeles (Hollywood)',['Sacramento','Fresno','Eureka'],'Think of the big white sign on the hill.','<b>Hollywood</b>, in Los Angeles, became the center of the movie business.'],
  ['Which U.S. state has the most people?','California',['Texas','Alaska','Rhode Island'],'You live there!','<b>California</b> has more people than any other state.']
];
CAHIST.push(
 ['The Kumeyaay people lived in the far south of California. Near which present-day city?','San Diego',['Sacramento','Eureka','Fresno'],'It is at the very bottom of California, by Mexico.','The <b>Kumeyaay</b> lived around present-day <b>San Diego</b> and into Mexico.'],
 ['Many tribes in the Central Valley and foothills, like the Miwok, built homes covered with what?','Bark, brush or tule mats',['Glass','Bricks from Spain','Metal sheets'],'They used materials from nature around them.','Homes were made from <b>bark, brush and tule</b>, things that grew nearby.'],
 ['Why did California tribes speak so many different languages?','They lived in many different places, often separated by mountains, deserts and rivers',['They came from Europe','They were all one tribe','They did not talk to each other at all'],'Think about California\'s geography.','California\'s land is very varied, so many groups lived apart and developed <b>about 100 languages</b>.'],
 ['Native Californians used fire on purpose to burn small areas of land. Why?','To help plants grow back and make hunting and gathering easier',['To scare explorers away','To make the land a desert','For fun'],'Controlled burns are still used today.','Small, careful fires <b>cleared brush and helped useful plants grow</b>.'],
 ['What is a "sweat lodge" used for by many California tribes?','Cleaning the body and for ceremonies',['Storing acorns','Keeping horses','Building canoes'],'It is a small, hot, steamy building.','A sweat lodge was used to <b>clean the body and for spiritual ceremonies</b>.'],
 ['Juan Bautista de Anza led settlers on a long trip to California in 1775–1776. Where did the trip end?','San Francisco',['San Diego','Los Angeles','Monterey'],'They started a presidio and mission at the bay in the north.','Anza\'s settlers founded the presidio and mission at <b>San Francisco</b> in 1776.'],
 ['Spain was worried that which other countries might take California?','Russia and England',['China and Japan','Brazil and Peru','Canada and Australia'],'Russians came down from Alaska, and English ships sailed the coast.','Spain worried about <b>Russia</b> (from Alaska) and <b>England</b>.'],
 ['Russian fur traders built a fort on the California coast in 1812. What was it called?','Fort Ross',['Fort Sutter','Fort Bragg','Fort Mission'],'Its name comes from an old word for Russia.','<b>Fort Ross</b> was a Russian trading post north of San Francisco.'],
 ['How many missions did Spain build in California in all?','21',['5','12','50'],'They stretch from San Diego to Sonoma.','There are <b>21</b> California missions.'],
 ['Which was the last mission built in California, in 1823?','Mission San Francisco Solano in Sonoma',['Mission San Diego','Mission Santa Barbara','Mission San Jose'],'It is the farthest north.','The last mission was in <b>Sonoma</b> (1823).'],
 ['What crops and animals did the missions raise?','Wheat, corn, grapes, cattle and sheep',['Only fish','Only rice','Only cotton'],'The missions had to feed many people.','Missions raised <b>wheat, corn, grapes, cattle and sheep</b>.'],
 ['Which pueblo, founded in 1781, later grew into California\'s largest city?','Los Angeles',['Sonoma','San Jose','Monterey'],'Its name means "the angels".','The pueblo of <b>Los Angeles</b> was founded in 1781.'],
 ['What was the capital of Spanish and Mexican California?','Monterey',['Sacramento','San Diego','Los Angeles'],'It is on a famous bay that Vizcaíno named.','<b>Monterey</b> was the capital before statehood.'],
 ['After 1834, Mexico closed the missions and gave much of their land away. What is this called?','Secularization',['The Gold Rush','Statehood','The Bear Flag Revolt'],'The missions stopped being run by the church.','<b>Secularization</b> took the land from the missions.'],
 ['Who were the "Californios"?','Spanish-speaking people born in California during the Spanish and Mexican eras',['Gold miners from China','Railroad workers','Russian traders'],'They were the families of the ranchos.','<b>Californios</b> were Spanish-speaking Californians, many living on ranchos.'],
 ['What was a "diseño"?','A hand-drawn map that showed the land of a rancho',['A kind of food','A song','A boat'],'It comes from the Spanish word for "design".','A <b>diseño</b> was a map of a rancho\'s land.'],
 ['John Sutter built a fort and settlement in the Central Valley. It later grew into which city?','Sacramento',['Fresno','Stockton','Oakland'],'It is California\'s capital today.','<b>Sutter\'s Fort</b> grew into <b>Sacramento</b>.'],
 ['Many American settlers came to California in covered wagons on which trail?','The California Trail',['El Camino Real','The Silk Road','The Pacific Coast Highway'],'It split off from the Oregon Trail.','Settlers came on the <b>California Trail</b>.'],
 ['In 1846–1847, the Donner Party got trapped by snow while crossing which mountains?','The Sierra Nevada',['The Rocky Mountains','The Coast Ranges','The Appalachians'],'A lake and a pass there are named for them.','They were trapped in the <b>Sierra Nevada</b> in winter.'],
 ['The Bear Flag Republic lasted only a short time. About how long?','About 25 days',['About 25 years','About 100 years','About 1 hour'],'The U.S. Army arrived soon after.','The Bear Flag Republic lasted <b>about 25 days</b> in 1846.'],
 ['Which treaty ended the Mexican-American War in 1848 and gave California to the United States?','The Treaty of Guadalupe Hidalgo',['The Treaty of Paris','The Louisiana Purchase','The Bill of Rights'],'It is named after a town in Mexico.','The <b>Treaty of Guadalupe Hidalgo</b> (1848).'],
 ['About how many people came to California during the Gold Rush?','About 300,000',['About 300','About 3,000','About 30 million'],'It was one of the biggest rushes of people in history.','About <b>300,000</b> people came looking for gold.'],
 ['How did many gold seekers travel to California from the East Coast?','By ship around South America or across Panama, or by wagon across the country',['By airplane','By train in 1849','By car'],'There were no trains across the country yet in 1849.','They came by <b>ship</b> (around Cape Horn or across Panama) or by <b>wagon</b>.'],
 ['What was a "boomtown"?','A town that grew very fast, often near gold mines',['A town with a lot of fireworks','A town with no people','A town built by Spain'],'Some boomtowns later became ghost towns.','A <b>boomtown</b> grew quickly when gold was found nearby.'],
 ['What is a "ghost town"?','A town that people left when the gold ran out',['A town full of ghosts','A new city','A Native village'],'Bodie in eastern California is a famous one.','When the gold ran out, people left, leaving <b>ghost towns</b> like Bodie.'],
 ['What did miners use a "rocker" or "sluice" for?','To wash dirt and catch heavy gold faster than panning',['To cook food','To build houses','To carry water to cities'],'They were bigger than a pan.','Rockers and sluices <b>washed more dirt and caught the heavy gold</b>.'],
 ['How did the Gold Rush affect Native Californians?','Many lost their land and lives as miners took over',['They all became rich','Nothing changed for them','They moved to Mexico'],'It was a terrible time for Native people.','The Gold Rush was devastating: many Native Californians <b>lost their land and their lives</b>.'],
 ['Which African American businesswoman became wealthy in Gold Rush San Francisco and fought for civil rights?','Mary Ellen Pleasant',['Harriet Tubman','Clara Barton','Susan B. Anthony'],'She helped many people gain freedom.','<b>Mary Ellen Pleasant</b> became a successful businesswoman and civil rights leader.'],
 ['California\'s first constitution was written in 1849 at which city?','Monterey',['San Diego','Sacramento','Los Angeles'],'It was the old capital.','The 1849 constitutional convention met in <b>Monterey</b>.'],
 ['California became the 31st state on September 9 of which year?','1850',['1776','1848','1869'],'It was just two years after gold was found.','California became a state in <b>1850</b>.'],
 ['Sacramento became California\'s permanent capital in which year?','1854',['1769','1850','1906'],'After San Jose, Vallejo and Benicia.','The capital moved to <b>Sacramento in 1854</b>.'],
 ['Who were the "Big Four"?','Four businessmen who built the Central Pacific Railroad',['Four gold miners','Four Spanish priests','Four Native chiefs'],'Leland Stanford was one of them.','Stanford, Huntington, Hopkins and Crocker: the <b>Big Four</b> railroad builders.'],
 ['What did the railroad bring to California farmers?','A fast way to ship crops to the rest of the country',['Free land in Mexico','Gold','Rain'],'Trains could carry oranges east quickly.','Trains let farmers <b>ship crops fast</b> to faraway markets.'],
 ['Which fruit became so popular that Southern California farms advertised it with colorful crate labels?','Oranges',['Apples','Bananas','Coconuts'],'Think of sunny Southern California groves.','<b>Orange</b> crate labels were famous advertisements.'],
 ['Why is irrigation so important in California\'s Central Valley?','Summers are dry, so farms need water brought to them',['It rains every day','Plants don\'t need water','It keeps the soil cold'],'Irrigation means bringing water to crops.','The valley gets little summer rain, so <b>irrigation</b> brings water from rivers and canals.'],
 ['Which large project built in the 1930s and 1940s brings water from Northern California to the Central Valley?','The Central Valley Project',['The Golden Gate Bridge','The Transcontinental Railroad','El Camino Real'],'It is a system of dams and canals.','The <b>Central Valley Project</b> moves water to farms with dams and canals.'],
 ['What was "Chinatown" in San Francisco?','A neighborhood where many Chinese immigrants lived and worked',['A Spanish mission','A gold mine','A Russian fort'],'It is one of the oldest in North America.','<b>Chinatown</b> was home to many Chinese immigrants, who faced unfair laws.'],
 ['The Chinese Exclusion Act of 1882 did what?','Stopped most Chinese immigrants from coming to the United States',['Gave land to Chinese families','Built the railroad','Made California a state'],'It was an unfair law that lasted until 1943.','It <b>banned most Chinese immigration</b>, an unfair law.'],
 ['In 1937, which famous bridge opened in San Francisco?','The Golden Gate Bridge',['The Brooklyn Bridge','The London Bridge','The Bay Bridge in 1700'],'It is bright orange.','The <b>Golden Gate Bridge</b> opened in 1937.'],
 ['During World War II, many California factories built what?','Ships and airplanes',['Gold pans','Covered wagons','Missions'],'The war needed lots of equipment.','California factories built <b>ships and airplanes</b>.'],
 ['During World War II, what unfair thing happened to many Japanese Americans in California?','They were forced to leave their homes and live in camps, like Manzanar',['They were made generals','They were given free land','They moved to Hawaii by choice'],'It was later recognized as a great wrong.','Japanese Americans were <b>forced into camps</b> like Manzanar.'],
 ['Which tall mountain in California is the highest in the lower 48 states?','Mount Whitney',['Mount Shasta','Mount Diablo','Mount Rushmore'],'It is in the Sierra Nevada.','<b>Mount Whitney</b> is 14,505 feet tall.'],
 ['Which California national park is famous for Half Dome and El Capitan?','Yosemite',['Death Valley','Joshua Tree','Redwood'],'John Muir loved it.','<b>Yosemite</b> has Half Dome and El Capitan.'],
 ['Who was John Muir?','A naturalist who helped protect Yosemite and start the Sierra Club',['A gold miner','A Spanish explorer','A railroad builder'],'He loved the mountains.','<b>John Muir</b> worked to protect wild places like Yosemite.'],
 ['What was the purpose of the Panama Canal (finished in 1914) for California?','Ships could travel between the Atlantic and Pacific much faster',['It brought gold','It carried water to Los Angeles','It replaced the railroad'],'Before, ships had to sail around South America.','Ships no longer had to go <b>around South America</b>, so trade with California grew.'],
 ['What did the 1906 earthquake teach California about building?','Buildings need to be built stronger to survive earthquakes',['Never build cities','Earthquakes never happen twice','Only build with glass'],'Rules for building changed.','Cities began making <b>stronger building rules</b>.'],
 ['Which people farmed and fished along the Klamath River and are still a large tribe today?','The Yurok',['The Mojave','The Chumash','The Kumeyaay'],'They also lived near salmon rivers.','The <b>Yurok</b> live along the Klamath River.'],
 ['What is the California state motto, from the Gold Rush?','"Eureka!" (I have found it!)',['"Go west!"','"In God we trust"','"Hello, sunshine!"'],'It is a Greek word.','<b>"Eureka!"</b> means "I have found it!"'],
 ['What does the star on the California state flag stand for?','The California Republic (Bear Flag Revolt)',['A gold nugget','The North Star','A mission bell'],'The flag comes from 1846.','The star comes from the 1846 <b>Bear Flag</b>.'],
 ['Which is a big part of California\'s economy today?','Farming, technology, movies and tourism',['Only gold mining','Only fur trading','Only cattle hides'],'Think about Silicon Valley, Hollywood and the Central Valley.','Today: <b>farming, technology, entertainment and tourism</b>.']
);
function genHistory(t){const f=CAHIST[t%CAHIST.length];return {prompt:f[0],...strChoices(f[1],f[2]),hint:f[3],explain:f[4]}}
/* ================= Grammar Grove: sentences, punctuation, figurative language, roots (CA CCSS ELA L.4) ================= */
LANDMARKS.test=`<rect x="58" y="14" width="44" height="52" rx="5" fill="#fff" stroke="#1f3557" stroke-width="2.5"/><rect x="70" y="9" width="20" height="10" rx="3" fill="#7b6cf0" stroke="#1f3557" stroke-width="2"/><path d="M65 30 l4 4 7-8 M65 44 l4 4 7-8" fill="none" stroke="#38b98a" stroke-width="3" stroke-linecap="round"/><path d="M80 31 h15 M80 45 h15 M66 57 h28" stroke="#9fb6cc" stroke-width="3" stroke-linecap="round"/>`;
LANDMARKS.ear=`<path d="M80 66 V44" stroke="#8c5a2c" stroke-width="6" stroke-linecap="round"/><rect x="62" y="22" width="18" height="22" rx="4" fill="#5bb6e8" stroke="#1f3557" stroke-width="2"/><path d="M80 24 L96 12 V54 L80 42Z" fill="#ffd56b" stroke="#1f3557" stroke-width="2" stroke-linejoin="round"/><path d="M103 24 q7 9 0 18 M110 17 q13 16 0 32" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`;
LANDMARKS.grammar=`<path d="M80 66 V40" stroke="#8c5a2c" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="30" r="20" fill="#38b98a"/><circle cx="64" cy="38" r="12" fill="#2e9e5b"/><circle cx="96" cy="38" r="12" fill="#2e9e5b"/><text x="70" y="34" ${FONT} font-size="14" fill="#fff">A</text><text x="84" y="28" ${FONT} font-size="14" fill="#ffd56b">,</text><text x="88" y="40" ${FONT} font-size="13" fill="#fff">?</text><text x="62" y="44" ${FONT} font-size="13" fill="#ffd56b">!</text>`;
/* each entry: [question, right answer, [3 wrong answers], hint, explanation]; long:true shows answers one per line */
const GRAM=[
  {name:'Complete sentences',long:true,items:[
    ['Which is a <b>complete sentence</b>?','The fox flew over the hill.',['Over the hill.','Flying over the hill all day.','The fox over the hill.'],'A sentence needs a subject (who) and a verb (what they did).','<b>"The fox flew over the hill."</b> has a subject (the fox) and a verb (flew). The others are missing one.'],
    ['Which is a <b>complete sentence</b>?','My sister likes to read.',['Likes to read.','My sister and her book.','Because my sister likes to read.'],'Does it have a who AND a does what? Does it sound finished?','<b>"My sister likes to read."</b> tells who and what, and it is a complete thought.'],
    ['Which group of words is a <b>fragment</b> (not a complete sentence)?','After the bell rang.',['The bell rang.','We ran outside.','The bell rang, and we ran outside.'],'A fragment leaves you waiting for more.','<b>"After the bell rang."</b> leaves you asking "then what?" It is a fragment.'],
    ['Which is a <b>run-on sentence</b>?','I like pizza my brother likes tacos.',['I like pizza. My brother likes tacos.','I like pizza, but my brother likes tacos.','I like pizza, and my brother likes tacos.'],'A run-on squishes two sentences together with nothing between them.','<b>"I like pizza my brother likes tacos."</b> is two sentences jammed together. It needs a period, or a comma and a joining word.'],
    ['How can you fix this run-on? <i>"It was raining we stayed inside."</i>','It was raining, so we stayed inside.',['It was raining we, stayed inside.','It was raining so, we stayed inside.','It was. Raining we stayed inside.'],'Use a comma plus a joining word like "so", "and" or "but".','<b>"It was raining, so we stayed inside."</b> joins two sentences with a comma and "so".'],
    ['Which is a <b>complete sentence</b>?','Pip packed snacks for the trip.',['Packed snacks for the trip.','Snacks for the trip.','When Pip packed snacks.'],'Look for who did it and what they did.','<b>"Pip packed snacks for the trip."</b> has a subject (Pip) and a verb (packed).'],
    ['Which is a <b>fragment</b>?','The tall girl with the red backpack.',['The tall girl smiled.','She has a red backpack.','The girl with the red backpack smiled.'],'Is there an action word (verb)?','<b>"The tall girl with the red backpack."</b> has no verb, so it is a fragment.'],
    ['Which is a <b>run-on sentence</b>?','The dog barked the cat ran away.',['The dog barked. The cat ran away.','The dog barked, and the cat ran away.','When the dog barked, the cat ran away.'],'Two complete ideas need to be separated or joined correctly.','<b>"The dog barked the cat ran away."</b> runs two sentences together.']
  ]},
  {name:'Capital letters',long:true,items:[
    ['Which sentence uses <b>capital letters</b> correctly?','We visited San Francisco in July.',['we visited San Francisco in July.','We visited san francisco in July.','We visited San Francisco in july.'],'Capitalize the first word, names of places, and months.','<b>"We visited San Francisco in July."</b> The first word, the city, and the month all start with capitals.'],
    ['Which sentence uses <b>capital letters</b> correctly?','My friend Maya lives on Elm Street.',['My friend maya lives on Elm Street.','My Friend Maya lives on Elm Street.','My friend Maya lives on elm street.'],'Names of people and streets are proper nouns.','<b>"My friend Maya lives on Elm Street."</b> Maya and Elm Street are names, so they get capitals. "friend" is not a name.'],
    ['Which sentence uses <b>capital letters</b> correctly?','On Monday, Dr. Lee checked my teeth.',['On monday, Dr. Lee checked my teeth.','On Monday, dr. lee checked my teeth.','on Monday, Dr. Lee checked my teeth.'],'Days of the week and titles with names get capitals.','<b>"On Monday, Dr. Lee checked my teeth."</b> Monday, Dr. and Lee all need capitals.'],
    ['Which word should <b>NOT</b> start with a capital letter in a sentence (unless it is the first word)?','summer',['Tuesday','California','Thanksgiving'],'Seasons are not names of special days or places.','Seasons like <b>summer</b> are not capitalized. Days, holidays and places are.'],
    ['Which sentence uses <b>capital letters</b> correctly?','Our class read <i>Charlotte\'s Web</i> together.',['Our class read <i>charlotte\'s web</i> together.','Our Class read <i>Charlotte\'s Web</i> together.','our class read <i>Charlotte\'s Web</i> together.'],'Book titles get capital letters for the important words.','<b>Book titles</b> like <i>Charlotte\'s Web</i> need capitals. "class" is a common noun.'],
    ['Which sentence uses <b>capital letters</b> correctly?','Mom and I went to the Pacific Ocean.',['Mom and i went to the Pacific Ocean.','mom and I went to the pacific ocean.','Mom and I went to the pacific Ocean.'],'"I" is always a capital. So is the name of an ocean.','<b>"Mom and I went to the Pacific Ocean."</b> "I" is always capital, and Pacific Ocean is a name.']
  ]},
  {name:'Commas',long:true,items:[
    ['Which sentence uses <b>commas</b> correctly?','We need eggs, milk, and bread.',['We need eggs milk, and bread.','We need, eggs milk and bread.','We, need eggs, milk and bread.'],'Use commas to separate things in a list.','<b>"We need eggs, milk, and bread."</b> Commas separate the items in the list.'],
    ['Which sentence uses a <b>comma</b> correctly?','I wanted to play, but it was too dark.',['I wanted, to play but it was too dark.','I wanted to play but, it was too dark.','I, wanted to play but it was too dark.'],'Put a comma before "but", "and" or "so" when it joins two sentences.','<b>"I wanted to play, but it was too dark."</b> The comma goes before "but".'],
    ['Where does the comma go in a date?','July 4, 1776',['July, 4 1776','July 4 1776,','Ju,ly 4 1776'],'The comma goes between the day and the year.','Write <b>July 4, 1776</b>, with the comma between the day and the year.'],
    ['Where does the comma go in a city and state?','Mountain View, California',['Mountain, View California','Mountain View California,',',Mountain View California'],'The comma goes between the city and the state.','Write <b>Mountain View, California</b>, with a comma between city and state.'],
    ['Which sentence uses a <b>comma</b> correctly?','Yes, I finished my homework.',['Yes I, finished my homework.','Yes I finished, my homework.','Yes I finished my, homework.'],'Put a comma after "yes" or "no" at the start of a sentence.','<b>"Yes, I finished my homework."</b> A comma follows "Yes".'],
    ['Which sentence uses a <b>comma</b> correctly?','Sam, please close the door.',['Sam please, close the door.','Sam please close, the door.','Sam please close the, door.'],'When you talk to someone by name, set the name off with a comma.','<b>"Sam, please close the door."</b> The comma comes after the name of the person you are talking to.']
  ]},
  {name:'Quotation marks',long:true,items:[
    ['Which sentence uses <b>quotation marks</b> correctly?','"Let\'s go to the park," said Ana.',['"Let\'s go to the park, said Ana."','Let\'s go to the park," said Ana.','"Let\'s go" to the park, said Ana.'],'Quotation marks go around the exact words someone says.','<b>"Let\'s go to the park," said Ana.</b> Only Ana\'s spoken words are inside the marks.'],
    ['Which sentence uses <b>quotation marks</b> correctly?','Dad asked, "Where are my keys?"',['Dad asked, "Where are my keys"?','Dad asked, Where are my "keys?"','"Dad asked, Where are my keys?"'],'The question mark belongs to the words Dad said.','<b>Dad asked, "Where are my keys?"</b> The question mark goes inside because it is part of what he said.'],
    ['Which sentence uses <b>quotation marks</b> correctly?','"I can do it!" shouted Leo.',['"I can do it! shouted Leo."','I can do it! "shouted Leo."','"I can" do it! shouted Leo.'],'Put the marks around only the words Leo shouted.','<b>"I can do it!" shouted Leo.</b> The marks hug only the spoken words.'],
    ['Which sentence needs quotation marks?','My teacher said, Line up quietly.',['My teacher asked us to line up.','We lined up quietly.','The line was quiet.'],'Look for someone\'s exact words.','<b>My teacher said, "Line up quietly."</b> These are the teacher\'s exact words, so they need quotation marks.'],
    ['Which sentence uses <b>quotation marks</b> correctly?','Mia said, "This is my favorite song."',['Mia said, "This is my favorite song".','Mia said "This is my favorite song."','Mia said, This is "my favorite song."'],'A comma comes before the quote, and the period goes inside the marks.','<b>Mia said, "This is my favorite song."</b> Comma before the quote, period inside.']
  ]},
  {name:'Who, which, whose',long:false,items:[
    ['Choose the word: <i>"The girl ___ won the race is my cousin."</i>','who',['which','whose','where'],'Use "who" for people.','Use <b>who</b> for a person: "The girl <b>who</b> won the race."'],
    ['Choose the word: <i>"The book, ___ has a red cover, is mine."</i>','which',['who','whose','when'],'Use "which" for things.','Use <b>which</b> for things: "The book, <b>which</b> has a red cover."'],
    ['Choose the word: <i>"That is the boy ___ dog barks all night."</i>','whose',['who','which','where'],'This word shows that something belongs to someone.','<b>Whose</b> shows the dog belongs to the boy.'],
    ['Choose the word: <i>"This is the park ___ we had our picnic."</i>','where',['who','whose','when'],'This word tells about a place.','Use <b>where</b> for a place: "the park <b>where</b> we had our picnic."'],
    ['Choose the word: <i>"I remember the day ___ we got our puppy."</i>','when',['where','who','whose'],'This word tells about a time.','Use <b>when</b> for a time: "the day <b>when</b> we got our puppy."'],
    ['Choose the word: <i>"My aunt, ___ lives in Texas, sent me a card."</i>','who',['which','whose','where'],'Is it a person or a thing?','My aunt is a person, so use <b>who</b>.'],
    ['Choose the word: <i>"The pizza ___ we ordered was cold."</i>','that',['who','whose','where'],'Use "that" or "which" for things.','Use <b>that</b> for a thing: "The pizza <b>that</b> we ordered."']
  ]},
  {name:'Verbs: -ing tenses and can/may/must',long:false,items:[
    ['Choose the verb: <i>"Right now, Pip ___ over the ocean."</i>','is flying',['was flying','will be flying','flew'],'"Right now" means it is happening at this moment.','<b>is flying</b> tells about something happening right now.'],
    ['Choose the verb: <i>"Yesterday at noon, we ___ lunch."</i>','were eating',['are eating','will be eating','eat'],'"Yesterday" means the past.','<b>were eating</b> tells about something that was going on in the past.'],
    ['Choose the verb: <i>"Tomorrow at 3:00, I ___ soccer."</i>','will be playing',['was playing','were playing','played'],'"Tomorrow" means the future.','<b>will be playing</b> tells about something going on in the future.'],
    ['Choose the verb: <i>"Last night, the baby ___ while we watched a movie."</i>','was sleeping',['is sleeping','will be sleeping','sleeps'],'"Last night" is the past.','<b>was sleeping</b> tells what was going on in the past.'],
    ['Which word shows that you <b>have to</b> do something? <i>"You ___ wear a helmet when you ride a bike."</i>','must',['may','might','could'],'This word means it is a rule.','<b>Must</b> means you have to. It is a rule.'],
    ['Which word asks for <b>permission</b>? <i>"___ I please have some water?"</i>','May',['Must','Will','Did'],'This polite word asks if something is allowed.','<b>May</b> asks for permission politely.'],
    ['Which word shows someone is <b>able</b> to do something? <i>"My sister ___ swim across the pool."</i>','can',['may','must','shall'],'This word means "is able to".','<b>Can</b> means someone is able to do it.'],
    ['Which word shows something is <b>possible, but not sure</b>? <i>"Look at the clouds. It ___ rain later."</i>','might',['must','can','did'],'Nobody is sure yet.','<b>Might</b> means it is possible, but not certain.']
  ]},
  {name:'Similes and metaphors',long:false,items:[
    ['<i>"Her smile was as bright as the sun."</i> What kind of comparison is this?','A simile',['A metaphor','A question','A fact'],'Does it use "like" or "as"?','It compares using <b>"as"</b>, so it is a <b>simile</b>.'],
    ['<i>"The classroom was a zoo."</i> What kind of comparison is this?','A metaphor',['A simile','A question','A command'],'Does it use "like" or "as"?','It says the classroom <b>was</b> a zoo without "like" or "as", so it is a <b>metaphor</b>.'],
    ['<i>"He ran like the wind."</i> What does this mean?','He ran very fast',['He ran slowly','He was blown over','He ran in the rain'],'How fast is the wind?','"Like the wind" is a simile meaning <b>very fast</b>.'],
    ['<i>"My little brother is a busy bee."</i> What does this mean?','He is always doing things',['He can fly','He likes honey','He is a real insect'],'Bees work all day.','This metaphor means he is <b>always busy doing things</b>.'],
    ['Which sentence is a <b>simile</b>?','The snow was like a white blanket.',['The snow was a white blanket.','The snow was cold.','We played in the snow.'],'Look for "like" or "as".','<b>"The snow was like a white blanket."</b> uses "like", so it is a simile.'],
    ['Which sentence is a <b>metaphor</b>?','Time is a thief.',['Time goes as fast as a thief.','Time is like a thief.','I lost track of time.'],'A metaphor says one thing IS another, without "like" or "as".','<b>"Time is a thief."</b> says time IS a thief. That is a metaphor.'],
    ['<i>"The baby was as quiet as a mouse."</i> What does this mean?','The baby was very quiet',['The baby was very loud','The baby looked like a mouse','The baby ate cheese'],'Mice are tiny and quiet.','It means the baby was <b>very quiet</b>.']
  ]},
  {name:'Idioms and sayings',long:false,items:[
    ['What does <i>"It\'s raining cats and dogs"</i> mean?','It is raining very hard',['Pets are falling from the sky','It is a little sunny','The animals are wet'],'It is an idiom: the words don\'t mean exactly what they say.','It means <b>it is raining very hard</b>.'],
    ['What does <i>"That test was a piece of cake"</i> mean?','The test was easy',['The test was about baking','There was cake at the test','The test was sweet'],'Eating cake is easy and fun.','It means the test was <b>easy</b>.'],
    ['What does <i>"Break a leg!"</i> mean?','Good luck!',['Please get hurt','Run fast','Be careful on the stairs'],'People say it before a play or show.','<b>"Break a leg!"</b> means <b>good luck</b>.'],
    ['What does <i>"I\'m all ears"</i> mean?','I am listening carefully',['I have big ears','I can\'t hear you','My ears hurt'],'What do ears do?','It means <b>I am listening carefully</b>.'],
    ['What does <i>"Hit the books"</i> mean?','Study hard',['Throw your books','Hit someone with a book','Put books on the shelf'],'Think about homework.','It means <b>study hard</b>.'],
    ['What does <i>"Don\'t judge a book by its cover"</i> mean?','Don\'t decide about something just by how it looks',['Never read books','Covers are the best part','Only buy new books'],'It is about more than books.','It means <b>don\'t decide about someone or something just by how it looks</b>.'],
    ['What does <i>"The early bird catches the worm"</i> mean?','People who start early often succeed',['Birds eat worms in the morning','Never wake up early','Worms are slow'],'It is a saying about being early.','It means <b>people who get started early often get what they want</b>.'],
    ['What does <i>"Practice makes perfect"</i> mean?','If you keep practicing, you get better',['You only need to practice once','Practice is boring','Nobody is perfect'],'Think about learning to ride a bike.','It means <b>doing something again and again helps you get better</b>.'],
    ['What does <i>"It\'s a small world"</i> usually mean?','It is surprising to meet someone you know far away',['The Earth is tiny','Our town is small','Maps are small'],'People say it when they run into a friend somewhere unexpected.','People say it when they <b>meet someone they know in a surprising place</b>.']
  ]},
  {name:'Greek and Latin roots',long:false,items:[
    ['The root <b>tele</b> means "far". What is a <b>telescope</b> for?','Seeing things that are far away',['Hearing music','Writing letters','Measuring heat'],'Tele = far, scope = look.','A <b>telescope</b> helps you <b>see things far away</b>.'],
    ['The root <b>graph</b> means "write" or "draw". Which word means "a person\'s written name"?','autograph',['telephone','microscope','thermometer'],'Auto = self, graph = write.','An <b>autograph</b> is a name you write yourself.'],
    ['The root <b>phon</b> means "sound". Which word has to do with sound?','microphone',['photograph','geology','transport'],'Phon = sound.','A <b>microphone</b> picks up <b>sound</b>.'],
    ['The root <b>port</b> means "carry". What does <b>portable</b> mean?','Easy to carry',['Very heavy','Made of paper','Very old'],'Port = carry, able = can be.','<b>Portable</b> means <b>able to be carried</b>.'],
    ['The root <b>bio</b> means "life". What is <b>biology</b> the study of?','Living things',['Rocks','Stars','Numbers'],'Bio = life, ology = study of.','<b>Biology</b> is the study of <b>living things</b>.'],
    ['The root <b>geo</b> means "earth". What is <b>geography</b> about?','The Earth and its places',['Animals only','Music','Computers'],'Geo = earth, graph = write or draw.','<b>Geography</b> describes <b>the Earth and its places</b>.'],
    ['The root <b>therm</b> means "heat". What does a <b>thermometer</b> measure?','How hot or cold something is',['How long something is','How heavy something is','How loud something is'],'Therm = heat, meter = measure.','A <b>thermometer</b> measures <b>heat (temperature)</b>.'],
    ['The root <b>micro</b> means "very small". What does a <b>microscope</b> help you see?','Very tiny things',['Very far things','Things in the dark','Sounds'],'Micro = small, scope = look.','A <b>microscope</b> helps you see <b>very tiny things</b>.'],
    ['The root <b>aud</b> means "hear". Which word means "the people who listen to a show"?','audience',['visitor','author','autograph'],'Aud = hear.','The <b>audience</b> is the people who <b>hear</b> and watch a show.'],
    ['The root <b>vis</b> means "see". Which word means "able to be seen"?','visible',['audible','portable','edible'],'Vis = see.','<b>Visible</b> means <b>able to be seen</b>.'],
    ['The root <b>photo</b> means "light". Which word comes from it?','photograph',['telephone','biology','transport'],'Cameras use light to make pictures.','A <b>photograph</b> is a picture made with <b>light</b>.'],
    ['The root <b>scrib</b> or <b>script</b> means "write". Who is a <b>scribe</b>?','A person who writes things down',['A person who sings','A person who builds houses','A person who cooks'],'Scrib = write.','A <b>scribe</b> is a person who <b>writes</b> things down.']
  ]}
];
const GRAMF=GRAM.flatMap(g=>g.items.map(f=>({f,long:g.long,cat:g.name})));
/* ---------- Grammar Grove, generated: fix the sentence, run-ons, adjective order, prepositional phrases, confused words, where/when/why (L.4.1-2) ---------- */
const GX={
  who:['Maya','Leo','Sofia','Ethan','Grandma Rosa','Mr. Chen','Aunt Lily','Coach Diaz'],
  place:['Sacramento','San Diego','Lake Tahoe','Los Angeles','Fresno','Yosemite','Monterey','Oakland'],
  day:['Saturday','Monday','Friday','Sunday','Tuesday'],
  month:['July','October','March','December','May'],
  verb:['visited','drove to','took a train to','flew to','went camping near'],
  list:[['apples','grapes','cheese'],['pencils','paper','glue'],['a tent','a map','a flashlight'],['hats','scarves','mittens'],['shells','rocks','feathers']],
  pair:[['The rain stopped','we went outside'],['Pip was hungry','he ate a big sandwich'],['The bell rang','the kids lined up'],['My sister likes soccer','I like swimming'],['The puppy barked','the mail carrier waved'],['It was cold','we wore our coats'],['The movie ended','everyone clapped']],
  conj:{0:'so',1:'so',2:'and',3:'but',4:'and',5:'so',6:'and'},
};
const ADJ_ORDER=[['opinion',['beautiful','funny','tasty','lovely','silly','nice']],['size',['big','tiny','huge','small','little','tall']],['age',['old','new','young','ancient']],['shape',['round','square','flat','long']],['color',['red','blue','green','yellow','purple','brown']],['origin',['Mexican','Italian','Japanese','French']],['material',['wooden','wool','metal','glass','paper','cotton']]];
const ADJ_NOUN=['box','hat','kite','bowl','bag','boat','blanket','vase'];
const PREP=[['The cat slept','under the old porch','.'],['Pip flew his balloon','over the tall mountains','.'],['We ate lunch','beside the quiet river','.'],['A squirrel ran','up the oak tree','.'],['Mia found her shoes','behind the green door','.'],['The class walked','across the busy street','.'],['My dog hid','inside the cardboard box','.'],['The ducks swam','toward the little island','.'],['Leo put the book','on the top shelf','.'],['The kite floated','above the sandy beach','.']];
const CONF=[
  ['Pip has ___ balloons.','two',['to','too'],'"Two" is the number 2.'],['We walked ___ the park.','to',['two','too'],'"To" shows where you go.'],['That box is ___ heavy to lift.','too',['to','two'],'"Too" means "very" or "also".'],['Can I come ___?','too',['to','two'],'"Too" here means "also".'],
  ['The kids put on ___ coats.','their',['there','they\'re'],'"Their" means it belongs to them.'],['Look over ___!','there',['their','they\'re'],'"There" tells a place.'],['___ going to the beach today.','They\'re',['Their','There'],'"They\'re" is short for "they are".'],
  ['The dog wagged ___ tail.','its',['it\'s','its\''],'"Its" (no apostrophe) means belonging to it.'],['___ raining again!','It\'s',['Its','Its\''],'"It\'s" is short for "it is".'],
  ['Is this ___ backpack?','your',['you\'re','yore'],'"Your" means it belongs to you.'],['___ my best friend.','You\'re',['Your','Yore'],'"You\'re" is short for "you are".'],
  ['Pip ___ the race yesterday.','won',['one','own'],'"Won" is the past of "win". "One" is the number.'],['I ate ___ cookie.','one',['won','own'],'"One" is the number 1.'],
  ['Can you ___ the bell?','hear',['here','hair'],'You hear with your ears.'],['Put the box ___.','here',['hear','hair'],'"Here" is a place.'],
  ['The wind ___ the leaves away.','blew',['blue','blow'],'"Blew" is the past of "blow". "Blue" is a color.'],['We ___ the answer.','knew',['new','know'],'"Knew" is the past of "know". "New" means not old.'],
];
const REL=[['I remember the day ___ we moved here.','when'],['This is the park ___ we play soccer.','where'],['Tell me the reason ___ you are late.','why'],['Summer is the season ___ we swim the most.','when'],['That is the store ___ Mom buys bread.','where'],['Nobody knows the reason ___ the cat hides.','why'],['Morning is the time ___ birds sing loudest.','when'],['This is the town ___ my grandpa grew up.','where']];
const lowerFirst=s=>/^I\b/.test(s)?s:s[0].toLowerCase()+s.slice(1),upFirst=s=>s[0].toUpperCase()+s.slice(1);
function gramX(k){
  if(k>=6)return dragGram(k);
  if(k===0){const w=pick(GX.who),p=pick(GX.place),d=pick(GX.day),v=pick(GX.verb),L=pick(GX.list);const ok=`On ${d}, ${w} ${v} ${p} with ${L[0]}, ${L[1]}, and ${L[2]}.`;
    const errs=shuffle([[`On ${lowerFirst(d)}, ${w} ${v} ${p} with ${L[0]}, ${L[1]}, and ${L[2]}.`,`Days of the week start with a capital letter: <b>${d}</b>.`],
      [`On ${d}, ${w} ${v} ${lowerFirst(p)} with ${L[0]}, ${L[1]}, and ${L[2]}.`,`Names of places start with a capital letter: <b>${p}</b>.`],
      [`On ${d} ${w} ${v} ${p} with ${L[0]}, ${L[1]}, and ${L[2]}.`,`Put a comma after an opening phrase: <b>On ${d},</b>`],
      [`On ${d}, ${w} ${v} ${p} with ${L[0]} ${L[1]} and ${L[2]}.`,`Use commas to separate things in a list: <b>${L[0]}, ${L[1]}, and ${L[2]}</b>.`],
      [`on ${d}, ${w} ${v} ${p} with ${L[0]}, ${L[1]}, and ${L[2]}.`,`Every sentence starts with a capital letter.`]]).slice(0,3);
    return {prompt:`Which sentence is written <b>correctly</b>?`,...strChoices(ok,errs.map(e=>e[0])),long:true,render:esc,hint:`Check capital letters (names, places, days) and commas (after an opening phrase, in a list).`,
      explain:`<b>${esc(ok)}</b><br>What the other sentences got wrong: ${errs.map(e=>e[1]).join(' ')}`}}
  if(k===1){const i=R(0,GX.pair.length-1),[a,b]=GX.pair[i],c=GX.conj[i],ok=`${a}, ${c} ${lowerFirst(b)}.`;
    return {prompt:`This is a <b>run-on sentence</b>:<br><i>"${a} ${lowerFirst(b)}."</i><br>Which is the best way to fix it?`,...strChoices(ok,[`${a}, ${lowerFirst(b)}.`,`${a} ${c}, ${lowerFirst(b)}.`,`${a}. ${lowerFirst(b)}.`]),long:true,render:esc,
      hint:`Join two complete ideas with a comma <b>and</b> a joining word (and, but, so). A comma alone is not enough.`,
      explain:`<b>${esc(ok)}</b> A comma plus "${c}" joins the two ideas. (You could also make two sentences: "${a}. ${upFirst(b)}.")`}}
  if(k===2){const cats=shuffle(ADJ_ORDER.map((c,i)=>i)).slice(0,3).sort((x,y)=>x-y),words=cats.map(i=>pick(ADJ_ORDER[i][1])),n=pick(ADJ_NOUN),art=/^[aeiou]/i.test(words[0])?'an':'a';
    const mk=w=>{const a=/^[aeiou]/i.test(w[0])?'an':'a';return `${a} ${w.join(' ')} ${n}`},ok=mk(words);
    const perms=[[1,0,2],[2,1,0],[0,2,1],[2,0,1],[1,2,0]].map(p=>mk(p.map(i=>words[i])));
    return {prompt:`Which sounds <b>right</b>?`,...strChoices(ok,shuffle(perms)),long:true,hint:`Adjective order: how it looks to you (opinion) → size → age → shape → color → where it is from → what it is made of.`,
      explain:`<b>${ok}</b>: ${cats.map((i,j)=>`${words[j]} (${ADJ_ORDER[i][0]})`).join(', ')}. Opinion, size, age, shape, color, origin, material.`}}
  if(k===3){const [s,pp,end]=pick(PREP),sw=s.split(' '),cut=sw.length>2?sw.slice(-2).join(' '):sw.join(' '),ppw=pp.split(' ');
    return {prompt:`Which words are the <b>prepositional phrase</b>?<br><i>"${s} ${pp}${end}"</i>`,...strChoices(pp,[s,cut,ppw.slice(1).join(' '),ppw.slice(0,2).join(' ')]),long:true,
      hint:`A prepositional phrase starts with a word like under, over, beside, on, behind, across and ends with a noun.`,
      explain:`<b>${pp}</b> starts with the preposition <b>${ppw[0]}</b> and tells where.`}}
  if(k===4){const [s,a,w,why]=pick(CONF);return {prompt:`Which word fits?<br><i>"${s.replace('___','<u>&nbsp;?&nbsp;</u>')}"</i>`,...strChoices(a,w),render:esc,hint:`Say the sentence with each word. Which one has the right meaning?`,explain:`<b>${esc(a)}</b>. ${esc(why)}`}}
  const [s,a]=pick(REL);return {prompt:`Which word fits?<br><i>"${s.replace('___','<u>&nbsp;?&nbsp;</u>')}"</i>`,...strChoices(a,['where','when','why'].filter(x=>x!==a)),
    hint:`<b>when</b> = a time, <b>where</b> = a place, <b>why</b> = a reason.`,explain:`The sentence talks about ${{when:'a time',where:'a place',why:'a reason'}[a]}, so use <b>${a}</b>.`};
}
function genGrammar(t){if(t>=GRAMF.length)return gramX((t-GRAMF.length)%8);const x=GRAMF[t%GRAMF.length],f=x.f;return {prompt:f[0],...strChoices(f[1],f[2]),hint:f[3],explain:f[4],long:x.long,render:c=>c}}
/* ---------- Story Studio: 4th grade writing (sentences, paragraphs, transitions, opinions) ---------- */
const WR={
  build:['The brave kitten climbed the tall tree.','My little brother loves green apples.','We planted bright flowers in the garden.','After lunch, the class read a funny story.','Pip flew his red balloon over the ocean.','Our team won the soccer game on Saturday.','The hungry bear found a jar of honey.','Grandma baked warm cookies for everyone.'],
  topic:[['Some bees collect nectar. Other bees guard the hive. The queen lays all the eggs.','Every bee in a hive has a special job.',['Bees are yellow and black.','I once saw a bee.','Honey tastes sweet on toast.']],
    ['You can swim in the lake. You can hike on the trails. At night, you can see a million stars.','There are many fun things to do at the camp.',['Lakes are full of water.','Stars are very far away.','I need new hiking shoes.']],
    ['Wash your hands before you cook. Read the whole recipe first. Ask a grown-up to help with the stove.','Cooking is safer when you follow a few rules.',['Pizza is my favorite food.','Stoves get very hot.','My kitchen is blue.']],
    ['Dolphins whistle to talk to each other. They swim in groups called pods. They even play games with seaweed.','Dolphins are smart and friendly animals.',['The ocean is salty.','Seaweed is green.','Some fish are tiny.']],
    ['Leaves turn red and orange. The air gets cool. Pumpkins appear at the market.','Fall brings many changes.',['Pumpkins can be very heavy.','Red is my favorite color.','Summer is hot.']],
    ['The library has books about every topic. It has computers you can use. Story time happens every Tuesday.','The library is a great place to visit.',['Tuesday comes after Monday.','Computers need electricity.','Some books are very old.']]],
  trans:[['First, we mixed the flour and eggs. ___, we poured the batter into a pan.','Next',['Because','But','Although']],
    ['We packed our bags. ___, we drove to the beach.','Then',['Because','Instead','For example']],
    ['I wanted to play outside. ___, it started to rain.','However',['Finally','First','For example']],
    ['There are many ways to save water. ___, you can turn off the tap while brushing.','For example',['However','Finally','In the end']],
    ['We cleaned up the whole park. ___, it looked beautiful again.','In the end',['For example','First','However']],
    ['The ants found crumbs. ___ they carried them back to the nest.','Then',['However','For example','Although']]],
  combine:[['It was raining.','We stayed inside.','It was raining, so we stayed inside.',['It was raining, but we stayed inside.','It was raining or we stayed inside.','It was raining because we stayed inside.']],
    ['Maya likes to paint.','Her brother likes to sing.','Maya likes to paint, and her brother likes to sing.',['Maya likes to paint, so her brother likes to sing.','Maya likes to paint because her brother likes to sing.','Maya likes to paint or her brother likes to sing.']],
    ['I studied hard.','I did well on the test.','I studied hard, so I did well on the test.',['I studied hard, but I did well on the test.','I studied hard or I did well on the test.','I did well on the test, but I studied hard.']],
    ['The puppy was tired.','It still wanted to play.','The puppy was tired, but it still wanted to play.',['The puppy was tired, so it still wanted to play.','The puppy was tired or it still wanted to play.','The puppy was tired because it still wanted to play.']],
    ['We were hungry.','We ate a big lunch.','We were hungry, so we ate a big lunch.',['We were hungry, but we ate a big lunch.','We were hungry or we ate a big lunch.','We ate a big lunch, but we were hungry.']],
    ['Leo can ride a bike.','He cannot ride a skateboard yet.','Leo can ride a bike, but he cannot ride a skateboard yet.',['Leo can ride a bike, so he cannot ride a skateboard yet.','Leo can ride a bike because he cannot ride a skateboard yet.','Leo can ride a bike or he cannot ride a skateboard yet.']]],
  detail:[['Recess is the best part of the school day.','Kids get to run, play and talk with friends.',['Math class starts at nine.','The school has a red roof.','Lunch is in the cafeteria.']],
    ['Cats make good pets.','They are clean and can stay home alone for a few hours.',['Some cats are orange.','Lions are big cats.','My aunt has a car.']],
    ['Exercise keeps your body healthy.','It makes your heart and muscles strong.',['Shoes come in many sizes.','Soccer balls are round.','My friend is tall.']],
    ['Our town needs a new park.','The old park is broken, and kids have nowhere to play.',['Parks have trees.','Our town has a bakery.','I like the color green.']],
    ['Reading every day helps you learn.','Each book teaches new words and new ideas.',['Some books are heavy.','The library opens at ten.','My book has a blue cover.']]],
  concl:[['Penguins slide on their bellies. They dive deep for fish. They huddle together to stay warm.','Penguins have clever ways to live in the cold.',['Fish live in the ocean.','My sister likes the color black.','Ice is frozen water.']],
    ['First, gather paper and crayons. Next, draw a picture. Then, fold the paper in half.','Now you have a homemade card to give a friend!',['Crayons come in a box.','Paper is made from trees.','Folding is hard.']],
    ['Our class collected cans. We sorted them by size. We took them to the food bank.','Our project helped families who needed food.',['Cans are made of metal.','The food bank is downtown.','Sorting is boring.']],
    ['Volcanoes can erupt with hot lava. Lava cools into new rock. Some islands were made this way.','Volcanoes can change the shape of the land.',['Rocks can be smooth.','Hot things can burn you.','Islands have beaches.']]],
  opinion:[['Students should have longer recess.','Playing outside helps kids focus better in class.',['Recess is at 10 o\'clock.','Some kids like tag.','The playground is big.']],
    ['Everyone should learn to swim.','Swimming keeps people safe near water.',['Pools can be indoors.','Some swimsuits are blue.','The ocean is salty.']],
    ['Our school should plant a garden.','A garden would teach us how food grows.',['Carrots are orange.','Our school has 400 students.','Gardens need dirt.']],
    ['Kids should help with chores at home.','Chores teach kids to be responsible.',['Dishes are in the kitchen.','My room is upstairs.','Brooms are made of straw.']]],
  steps:[['Get a cup','Add hot water','Put in a tea bag','Wait and then drink'],['Put on your socks','Put on your shoes','Tie the laces','Go outside'],['Take out the bread','Spread the peanut butter','Put the slices together','Eat your sandwich'],['Dig a small hole','Drop in a seed','Cover it with soil','Water it every day'],['Open the book','Read the story','Close the book','Tell a friend about it']]
};
/* ===== Story Studio: revising and research (CAASPP writing and research claims) ===== */
const WR_BELONG=[
 ['Sea otters are clever tool users.','They float on their backs and use rocks to crack open clams.','Some otters keep a favorite rock in a pocket of loose skin under their arm.','My cousin has a pet hamster named Biscuit.','Scientists have watched otters use the same rock for days.'],
 ['Our school garden is a great place to learn.','Students measure how fast the bean plants grow.','We learn which bugs help plants and which ones hurt them.','The cafeteria serves pizza on Fridays.','In spring, we pick lettuce for a class salad.'],
 ['Riding a bike to school has many benefits.','It is good exercise for your heart and legs.','It saves gas and keeps the air cleaner.','My favorite color for a bike is blue.','You also get to school feeling awake and ready.'],
 ['The desert tortoise is well suited to dry places.','It digs burrows to escape the hot sun.','It can store water in its body for months.','Penguins live in very cold places.','It gets much of its water from the plants it eats.'],
 ['Lighthouses helped keep sailors safe.','Their bright lights warned ships about rocks.','On foggy nights, many lighthouses used loud horns.','Lighthouse keepers lived nearby to keep the light burning.','Some people collect seashells on the beach.'],
];
const WR_WORD=[['The dog was <u>big</u>.','enormous',['nice','fine','okay'],'Choose the word that paints the clearest picture of size.'],
 ['The soup tasted <u>good</u>.','delicious',['fine','alright','normal'],'Which word tells exactly HOW good?'],
 ['Mia <u>went</u> across the finish line.','sprinted',['moved','got','did'],'Which verb shows exactly how she moved?'],
 ['The storm was <u>bad</u>.','fierce',['nice','okay','fine'],'Which word shows how strong the storm was?'],
 ['The puppy <u>said</u> something when we left.','whimpered',['told','talked','answered'],'Puppies don\'t talk. Which word fits a sad little sound?'],
 ['The old house was <u>scary</u> at night.','eerie',['fun','pretty','bright'],'Which word keeps the meaning but is more exact?'],
 ['The mountain was <u>very tall</u>.','towering',['short','long','wide'],'One strong word can replace "very tall".'],
 ['Leo <u>looked at</u> the strange bug for a long time.','studied',['saw','ran','ate'],'Which verb shows he looked carefully and for a long time?']];
const RESEARCH_Q=[['How long do blue whales live?','an encyclopedia article about blue whales',['a cookbook','a dictionary entry for "whale"','a map of the ocean']],
 ['What is the weather going to be tomorrow?','a weather forecast website',['a book about clouds from 1980','a poem about rain','a history of weather']],
 ['What does the word "migrate" mean?','a dictionary',['an atlas','a newspaper sports page','a recipe book']],
 ['Which states border California?','an atlas or map of the United States',['a dictionary','a biography of a president','a science magazine about stars']],
 ['How did people travel during the Gold Rush?','a history book about the Gold Rush',['a book about modern cars','a weather report','a fairy tale']],
 ['How do bees make honey?','a science article about honeybees',['a song about flowers','a phone book','a math textbook']]];
const RELIABLE=[['Your class is writing a report about the Golden Gate Bridge. Which source is most <b>reliable</b>?','the official Golden Gate Bridge website',['a classmate\'s guess','a comment on a video','a made-up story about a bridge']],
 ['You want facts about the planet Mars. Which source is most <b>reliable</b>?','a NASA website for students',['an advertisement for a space toy','a cartoon about aliens','a friend who heard something once']],
 ['You need to know how many people live in Sacramento. Which source is most <b>reliable</b>?','a government census website',['a social media post','a fiction book set in Sacramento','your neighbor\'s guess']]];
const NOTES=[{topic:'Why bats are helpful',claim:'Bats help farmers.',good:'One bat can eat about 1,000 insects that harm crops in an hour.',bad:['Bats are the only mammals that can fly.','Some bats sleep upside down in caves.','Bats live on every continent except Antarctica.']},
 {topic:'Why we should plant trees',claim:'Trees help keep cities cool.',good:'Shade from trees can make a street up to 10 degrees cooler.',bad:['The tallest tree in the world is a redwood.','Some trees lose their leaves in fall.','Apples grow on trees.']},
 {topic:'The Pony Express',claim:'Riding for the Pony Express was difficult.',good:'Riders rode day and night through snowstorms and heat.',bad:['The Pony Express started in 1860.','The mail bag was called a mochila.','Stations had fresh horses.']},
 {topic:'Recycling',claim:'Recycling saves trees.',good:'Recycling one ton of paper saves about 17 trees.',bad:['Paper is made in factories.','Many families have blue bins.','Plastic comes in many colors.']}];
function genWriteX(t){
  if(t===8){const P=pick(WR_BELONG),odd=P[3],sents=[P[0],...shuffle(P.slice(1).filter(x=>x!==odd)),odd];const order=[sents[0],...shuffle(sents.slice(1))];
    return {prompt:`<div class="passage"><p>${order.join(' ')}</p></div>Which sentence does <b>NOT</b> belong in this paragraph?`,...strChoices(odd,shuffle(order.filter(x=>x!==odd&&x!==order[0]))),long:true,render:c=>c,
      hint:`The first sentence tells the main idea. Which sentence is about something else?`,explain:`The paragraph is about: "${order[0]}" <b>"${odd}"</b> is about something else, so it should be taken out.`}}
  if(t===9){const [s,a,w,h]=pick(WR_WORD);return {prompt:`A student wants to use a more <b>precise</b> word. Which word should replace the underlined word?<br><i>"${s}"</i>`,...strChoices(a,w),hint:h,explain:`<b>${a}</b> is more exact and paints a clearer picture.`}}
  if(t===10){const [q,a,w]=pick(RESEARCH_Q);return {prompt:`A student wants to find out: <b>"${q}"</b> Which source would be <b>most helpful</b>?`,...strChoices(a,w),long:true,render:c=>c,hint:`Think about what each source is for.`,explain:`<b>${a}</b> has the information that answers this question.`}}
  if(t===11){const N=pick(NOTES);return {prompt:`A student is writing about <b>${N.topic}</b>. The student wants to support this point: <b>"${N.claim}"</b> Which note supports it <b>best</b>?`,...strChoices(N.good,N.bad),long:true,render:c=>c,
    hint:`Find the fact that proves the point, not just any true fact about the topic.`,explain:`<b>"${N.good}"</b> shows why the point is true. The other notes are true but don't support this point.`}}
  const [q,a,w]=pick(RELIABLE);return {prompt:q,...strChoices(a,w),long:true,render:c=>c,hint:`A reliable source is written by experts or an official group, and it is based on facts.`,explain:`<b>${a}</b> is written by people who really know the facts.`};
}
/* ===== Test Practice: 12 questions like the spring CAASPP test, no hints, one try, a report by test area ===== */
const TEST_SECTIONS={
  math:{name:'Math',parts:[['Numbers and operations',['place','addsub','mult','div'],3],['Fractions and decimals',['frac','dec'],3],['Measurement, data and geometry',['measure','area','angle','shape','graph','time','money'],3],['Reasoning and problem solving',['riddle'],3]]},
  ela:{name:'English',parts:[['Reading',['reading'],5],['Listening',['listen'],3],['Writing and research',['write'],2],['Language and vocabulary',['grammar','words'],2]]}};
const TEST_LEVELS=[[.85,'Standard exceeded'],[.7,'Standard met'],[.5,'Standard nearly met'],[0,'Not met yet']];
function testQs(sec){const isl=id=>byId(id),qs=[];
  if(sec==='math'){for(const [claim,ids,n] of TEST_SECTIONS.math.parts){
      if(claim.startsWith('Reasoning')){const r=isl('riddle');[pick([6,8]),pick([7,9]),10+R(0,11)].forEach(t=>{const q=makeQ(r,t,R(1,2e9));q.claim=claim;qs.push(q)});
        if(coin()){const q=coin()?makeQ(isl('frac'),15,R(1,2e9)):makeQ(isl('mult'),7,R(1,2e9));q.claim=claim;qs[qs.length-1]=q}continue}
      for(let k=0;k<n;k++){const I=isl(pick(ids));const q=makeQ(I,R(0,I.types-1),R(1,2e9));q.claim=claim;qs.push(q)}}}
  else{const rd=isl('reading'),pi=dealTypes('test_long',LONGP.length,1)[0],off=PASSAGES.length*3+LQ.findIndex(x=>x[0]===pi);
    LONGP[pi].q.forEach((_,qi)=>{const q=makeQ(rd,off+qi,R(1,2e9));q.claim='Reading';qs.push(q)});
    const li=isl('listen'),ci=dealTypes('test_listen',LISTEN.length,1)[0],lo=LISTEN_Q.findIndex(x=>x[0]===ci);LISTEN[ci].q.forEach((_,qi)=>{const q=makeQ(li,lo+qi,R(1,2e9));q.claim='Listening';qs.push(q)});
    const w=isl('write');shuffle([8,9,10,11,12,2,4]).slice(0,2).forEach(t=>{const q=makeQ(w,t,R(1,2e9));q.claim='Writing and research';qs.push(q)});
    [isl('grammar'),isl('words')].forEach(I=>{const q=makeQ(I,R(0,I.types-1),R(1,2e9));q.claim='Language and vocabulary';qs.push(q)})}
  qs.forEach(q=>q.from=null);return qs}
function openTest(isl){const L=(G.tests||[]);
  overlay(`<div class="eyebrow">Test Practice</div><h2>Practice like the real test</h2><p>12 questions in the same style as the spring test. <b>No hints and one try</b>, just like the real thing. At the end you get a report.</p>
    <div class="deskkinds">${Object.entries(TEST_SECTIONS).map(([k,T])=>`<button type="button" class="deskkind" data-sec="${k}" style="--dc:${k==='math'?'#2f9fe0':'#e2558f'}"><b>${T.name}</b><small>${T.parts.map(p=>p[0]).join(' · ')}</small></button>`).join('')}</div>
    ${L.length?`<p class="note">Last time: ${esc(TEST_SECTIONS[L[0].sec].name)} ${L[0].s} of ${L[0].n}.</p>`:''}<div class="actrow"><button type="button" class="go alt" id="tsClose">Not now</button></div>`,()=>{
    $('#tsClose').onclick=closeOverlay;$('#ocard').querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>{closeOverlay();const qs=testQs(b.dataset.sec);beginRound(isl,'test',qs);S.sec=b.dataset.sec;say($('#say'),`Test practice! Read carefully and take your time${nm()}. No hints this time. You've got this!`)})})}
function finishTest(){const dots=[...document.querySelectorAll('#dots .dot')],by={};let s=0;
  S.qs.forEach((q,i)=>{const ok=dots[i]&&dots[i].classList.contains('gold'),c=q.claim||'Other';by[c]=by[c]||[0,0];by[c][1]++;if(ok){by[c][0]++;s++}});
  const n=S.qs.length,p=s/n,lvl=TEST_LEVELS.find(l=>p>=l[0])[1];G.tests=G.tests||[];G.tests.unshift({ts:Date.now(),sec:S.sec||'math',s,n,by,lvl});if(G.tests.length>30)G.tests.length=30;
  const weak=Object.entries(by).filter(([,v])=>v[1]&&v[0]/v[1]<.67).map(([k])=>k);
  const st=p>=.85?3:p>=.7?2:p>=.4?1:0;
  done(st,`${s} of ${n} right. Practice level: <b>${lvl}</b>.<br>${Object.entries(by).map(([k,v])=>`${k}: <b>${v[0]}/${v[1]}</b>`).join(' · ')}${weak.length?`<br>Practice more: <b>${weak.join(', ')}</b>.`:'<br>Strong in every area!'}`,{sticker:st/3})}
function testParentHTML(){const L=G.tests||[],nm=esc(G.name||'your child');
  const rows=L.slice(0,6).map(x=>`<li><div><b>${esc(TEST_SECTIONS[x.sec]?TEST_SECTIONS[x.sec].name:x.sec)}: ${x.s} of ${x.n}</b> <small>${new Date(x.ts).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${esc(x.lvl)}</small></div><p>${Object.entries(x.by).map(([k,v])=>`${esc(k)} ${v[0]}/${v[1]}`).join(' · ')}</p></li>`).join('');
  return `<div class="pcard wide"><h4>Test Practice</h4><p class="note">12-question practice sets in the style of the spring CAASPP test (Math, English). No hints, one try. The "practice level" is only a rough guide: the real test has more questions and is scored differently.</p>${L.length?`<ul class="dklist">${rows}</ul>`:`<p>${nm} has not taken a practice test yet. It is in the Challenges row on the map.</p>`}</div>`}
function genWrite(t){
  if(t>=13)return genLang(t);
  if(t>=8)return genWriteX(t);
  if(t===0){const s=pick(WR.build),w=s.replace(/\.$/,' .').split(' ').filter(Boolean),items=[...new Set(w)].length===w.length?w:w;return {kind:'order',items,prompt:`Tap the words in order to build a <b>complete sentence</b>. Start with the capital letter. End with the period.`,hint:`The word with a capital letter goes first. Who or what is the sentence about? What did it do?`,explain:`The sentence is: <b>${s}</b>`}}
  if(t===1){const [p,a,w]=pick(WR.topic);return {prompt:`<div class="passage"><p>___ ${p}</p></div>Which <b>topic sentence</b> should start this paragraph?`,...strChoices(a,w),long:true,render:c=>c,hint:`A topic sentence tells the big idea that ALL the other sentences explain.`,explain:`<b>${a}</b> The other sentences all tell about it.`}}
  if(t===2){const [s,a,w]=pick(WR.trans);return {prompt:`Which word or phrase fits best?<br><i>"${s.replace('___','<u>&nbsp;?&nbsp;</u>')}"</i>`,...strChoices(a,w),long:true,render:c=>c,hint:`Transition words show order (first, next, then), a change (however), an example (for example) or an ending (in the end).`,explain:`"${s.replace('___','<b>'+a+'</b>')}"`}}
  if(t===3){const [a,b,ok,w]=pick(WR.combine);return {prompt:`Combine the two sentences in the <b>best</b> way.<br><i>"${a}" "${b}"</i>`,...strChoices(ok,w),long:true,render:c=>c,hint:`<b>so</b> shows a result. <b>but</b> shows a surprise or difference. <b>and</b> adds more.`,explain:`<b>${ok}</b> The joining word matches how the two ideas connect.`}}
  if(t===4){const [top,a,w]=pick(WR.detail);return {prompt:`Topic sentence: <b>"${top}"</b><br>Which detail <b>supports</b> it best?`,...strChoices(a,w),long:true,render:c=>c,hint:`A supporting detail explains WHY or HOW the topic sentence is true.`,explain:`<b>${a}</b> It explains the topic sentence.`}}
  if(t===5){const [p,a,w]=pick(WR.concl);return {prompt:`<div class="passage"><p>${p} ___</p></div>Which sentence is the best <b>ending</b> for this paragraph?`,...strChoices(a,w),long:true,render:c=>c,hint:`A good ending sums up the big idea. It does not start a new topic.`,explain:`<b>${a}</b> It wraps up the whole paragraph.`}}
  if(t===6){const [op,a,w]=pick(WR.opinion);return {prompt:`Opinion: <b>"${op}"</b><br>Which is the best <b>reason</b> for this opinion?`,...strChoices(a,w),long:true,render:c=>c,hint:`A reason answers "WHY do you think so?"`,explain:`<b>${a}</b> It tells why the writer has this opinion.`}}
  const st=pick(WR.steps);return {kind:'order',items:st,prompt:`Put the steps of this how-to paragraph in order.`,hint:`What has to happen first? What can only happen at the very end?`,explain:`${st.map((x,i)=>`${['First','Next','Then','Finally'][i]}, ${x.toLowerCase()}.`).join(' ')}`}
}
/* ---------- Clock Cove grows up: clocks + calendars + 4th grade elapsed time and time units ---------- */
const t12=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mm=m%60;return `${(h+11)%12+1}:${String(mm).padStart(2,'0')} ${h<12?'AM':'PM'}`};
const dur=m=>`${Math.floor(m/60)?`${Math.floor(m/60)} hour${Math.floor(m/60)>1?'s':''}`:''}${Math.floor(m/60)&&m%60?' ':''}${m%60?`${m%60} minutes`:''}`;
function genTimeTower(t){
  if(t<5)return genTime(t);
  if(t===5)return genWeek(2);
  if(t===6)return genWeek(4);
  if(t===7)return genSeason(3);
  if(t===8){const s=R(28,40)*15+R(0,2)*5,d=R(Dv(4,5,6),Dv(9,14,22))*5,e=s+d;
    return {prompt:`The movie starts at <b>${t12(s)}</b> and ends at <b>${t12(e)}</b>. How long is the movie?`,...strChoices(dur(d),[dur(d+60),dur(Math.abs(d-15))||'5 minutes',dur(d+10),dur(d-5)||'10 minutes']),
      hint:`Count up from ${t12(s)}: jump to the next hour first, then add the rest.`,explain:`From ${t12(s)} to ${t12(e)} is <b>${dur(d)}</b>.`}}
  if(t===9){const e=R(30,44)*15,d=R(Dv(3,5,6),Dv(8,12,18))*5,s=e-d;
    return {prompt:`Soccer practice lasts <b>${dur(d)}</b> and ends at <b>${t12(e)}</b>. When did it <b>start</b>?`,...strChoices(t12(s),[t12(e+d),t12(s+60),t12(s-15),t12(s+10)]),
      hint:`Count <b>back</b> from ${t12(e)}. Take away the hours first, then the minutes.`,explain:`${t12(e)} minus ${dur(d)} is <b>${t12(s)}</b>.`}}
  if(t===10){const k=pick([['hours','minutes',60],['minutes','seconds',60],['days','hours',24],['weeks','days',7]]),n=R(2,Dv(4,6,9)),half=DIFF>1&&k[2]%2===0&&coin(),ans=n*k[2]+(half?k[2]/2:0);
    return {prompt:`How many <b>${k[1]}</b> are in <b>${n}${half?' ½':''} ${k[0]}</b>?`,...numChoices(ans,[n*k[2],ans+k[2],n+k[2],ans*2]),hint:`1 ${k[0].slice(0,-1)} = ${k[2]} ${k[1]}. Multiply${half?', then add half of '+k[2]:''}.`,explain:`${n} × ${k[2]} = ${n*k[2]}${half?` and half of ${k[2]} is ${k[2]/2}, so ${ans}`:''}. That's <b>${ans} ${k[1]}</b>.`}}
  const a=R(8,11)*60+R(0,3)*15,b=R(1,2)*60+R(1,3)*15,c=R(1,4)*15;
  return {prompt:`Pip leaves home at <b>${t12(a)}</b>. He flies for <b>${dur(b)}</b>, then rests for <b>${dur(c)}</b>. What time is it now?`,...strChoices(t12(a+b+c),[t12(a+b),t12(a+b+c+60),t12(a+c),t12(a+b+c-15)]),
    hint:`Add the times one at a time: first the flight, then the rest.`,explain:`${t12(a)} + ${dur(b)} = ${t12(a+b)}. Then + ${dur(c)} = <b>${t12(a+b+c)}</b>.`}
}
/* The islands come from the content pack for the child's state and grade (content/packs, built into js/content.js).
   The pack says which islands, in what order, with which skills; GEN says how each island makes its questions. */
const GEN={
  place:{gen:genPlace,types:8},addsub:{gen:genAddSub,types:7},mult:{gen:genMult,types:9},div:{gen:genDiv,types:5},frac:{gen:genFrac,types:16},
  dec:{gen:genDec,types:8},area:{gen:genArea,types:4},angle:{gen:genAngle,types:7},shape:{gen:genShape,types:8},money:{gen:genMoney,types:5},
  measure:{gen:genMeasure,types:8},pattern:{gen:genPattern,types:11},graph:{gen:genGraph,types:6},time:{gen:genTimeTower,types:12},
  week:{gen:genWeek,types:5},season:{gen:genSeason,types:6},riddle:{gen:genRiddle,types:22,round:riddleRound},words:{gen:genWords,types:8},
  reading:{gen:genReading,types:PASSAGES.length*3+LQ.length+TSTRUCT.length,round:readingRound,noDiff:true},
  listen:{gen:genListen,types:LISTEN_Q.length,round:listenRound,noDiff:true},geo:{gen:genGeo,types:8},history:{gen:genHistory,types:CAHIST.length},
  write:{gen:genWrite,types:16},grammar:{gen:genGrammar,types:GRAMF.length+32},science:{gen:genScience,types:SCIENCE.length+66}
};
const PACK_DEFAULT='ca-4';
const PACK=(()=>{let id='';try{id=localStorage.getItem('pip-pack')||''}catch(e){}return CONTENT.packs[id]||CONTENT.packs[PACK_DEFAULT]})();
const ISLANDS=PACK.islands.map(r=>Object.assign({},r,GEN[r.id]||{}));
const STAR_ISLANDS=ISLANDS.filter(i=>i.id!=='daily'&&i.id!=='review'&&i.id!=='ptest'&&!i.retired);
const MAX=STAR_ISLANDS.length*3,BOSS_NEED=20;
const MIXABLE=ISLANDS.filter(i=>i.gen&&!i.retired);
const byId=id=>ISLANDS.find(i=>i.id===id);
function makeQ(isl,t,seed,d){
  const keepR=rand,keepD=DIFF;rand=seeded(seed);DIFF=d||diffFor(isl);let q;
  try{q=isl.gen(t)}finally{q&&(q.meta={i:isl.id,t,s:seed,d:DIFF});rand=keepR;DIFF=keepD}
  if(q&&!q.kind&&q.calc==null){const c=(CALC[isl.id]||{})[t];if(c)q.calc=c}
  return q;
}
/* calculation types whose answers are fractions, decimals, money or remainders: typed on the keypad too ('strict' = the answer must be in the asked form) */
const CALC={frac:{3:1,4:1,5:1,6:'mixed',7:1,10:1},dec:{0:'decimal',4:1},money:{2:1,3:1,4:1},div:{1:1}};
function mixedQ(pool){const i=pick(pool||MIXABLE);const q=makeQ(i,R(0,i.types-1),R(1,2e9));q.from=i.name;return q}

const CHAPTERS=[
  {name:'The Torn Map',islands:['place','mult','div','frac','area'],boss:'grumble',
    intro:['Oh no! The Grumble Cloud blew right through my balloon and tore my treasure map into FOUR pieces!','The first piece is hidden near the Math Islands. Earn <b>2 stars</b> on each of these 5 islands, and the Grumble Cloud will have to show up.','Then we beat it and win the piece back. Ready, partner?'],
    outro:'We did it! The first map piece! Look, a dotted line points toward... a giant clock?'},
  {name:'Clockwork Skies',islands:['time','measure','money'],boss:'twister',
    intro:['The Tick-Tock Twister grabbed the second piece! It spins time all around and mixes up the calendar.','Master clocks, calendars, measuring and money, and it won\'t be able to trick us!'],
    outro:'Piece number two! The map shows mountains made of shapes... and a very foggy sky.'},
  {name:'Shape Storm',islands:['angle','shape','dec','pattern','graph'],boss:'phantom',
    intro:['The Fog Phantom hides inside the Shape Storm. It makes angles blurry and scrambles patterns!','Clear the fog island by island. Then we\'ll catch that sneaky Phantom.'],
    outro:'Three pieces! Only one left. I can almost see the big X!'},
  {name:'Wonder Winds',islands:['riddle','words','geo','science'],boss:'king',
    intro:['The Storm King has the very last piece. He\'s the biggest storm in the whole sky!','Riddles, words, maps and science will light our way. This is the final adventure!'],
    outro:'THE TREASURE MAP IS COMPLETE! X marks the spot... and the treasure is a mountain of coins and a golden sticker. The best treasure of all? A friend like YOU!'},
  /* ---- Book 2: The Starlight Compass. Chapters need the green bar (8 of 10 right lately), and a new one opens every 2 days ---- */
  {name:'The Compass Needle',book:2,islands:['addsub','mult','div'],boss:'hail',
    intro:['Look what was hiding under the treasure: an old <b>Starlight Compass</b>! Legends say it points to the most wonderful place in the sky.','But it\'s broken into four parts, and the Hailstone Hopper just bounced away with the needle!','Earn <b>2 stars</b> on each island. Then the Hopper can\'t hide!'],
    outro:'We got the needle! It wiggles... and points east. Something sparkly is over there!'},
  {name:'Fraction Fjord',book:2,islands:['frac','dec','measure'],boss:'dust',
    intro:['The Dust Devil spins pieces of everything into a big mess: pizza slices, decimal points, rulers!','Fractions and decimals are friends. Show the Dust Devil you know how parts make a whole!'],
    outro:'The east part of the compass is ours! Now it glows... toward a giant floating library?'},
  {name:'Library in the Clouds',book:2,islands:['reading','grammar','words'],boss:'gloom',
    intro:['The Night Gloom turned off all the lights in the Cloud Library. Nobody can read in the dark!','Read carefully, fix the sentences and find the right words. Every right answer is a little light!'],
    outro:'The library shines again! The south part clicks into the compass. One part to go!'},
  {name:'The Golden State',book:2,islands:['history','geo','science'],boss:'queen',
    intro:['The Thunder Queen rules the sky above California. She has the last part of the compass.','Remember the missions, the Gold Rush, maps and science. Our home state will help us win!'],
    outro:'THE STARLIGHT COMPASS IS WHOLE! It points to... right here. The most wonderful place in the sky is wherever we fly together, partner!'},
  /* ---- Book 3: The Rainbow Bridge. Same rules as Book 2: 2 stars on each island, one chapter every 2 days ---- */
  {name:'The Silent Story',book:3,islands:['write','reading','grammar'],boss:'mumble',
    intro:['The compass glowed one more time and showed us something new: a <b>Rainbow Bridge</b> between all the sky islands! But its colors are gone.','The Mumble Mist stole the red color. It mixes up words until nobody can tell a story!','Build sentences, write strong paragraphs and earn <b>2 stars</b> on each island. Then we can chase the Mist away!'],
    outro:'RED is back on the bridge! The story pages flutter... toward an island of shapes and angles.'},
  {name:'The Shaking Shapes',book:3,islands:['area','angle','shape'],boss:'quake',
    intro:['The Shape Quake is shaking the bridge! Every corner wobbles and every fence falls down.','Measure angles, find areas and name the shapes. Strong math makes a strong bridge!'],
    outro:'YELLOW shines on the bridge! Now the wind smells like coins and rulers...'},
  {name:'The Tangled Market',book:3,islands:['money','measure','graph'],boss:'tangle',
    intro:['The Tangle Wind blew through the Sky Market. Prices, rulers and charts are all mixed up!','Count the change, measure carefully and read the graphs. Untangle it all, partner!'],
    outro:'GREEN glows on the bridge! Only one color left. The sky is getting dark...'},
  {name:'The Last Light',book:3,islands:['time','pattern','place','riddle'],boss:'eclipse',
    intro:['The Eclipse Dragon swallowed the last color and the sun! It wants the sky to stay dark forever.','Clocks, patterns, big numbers and riddles. Everything we learned together will light the way!'],
    outro:'THE RAINBOW BRIDGE IS COMPLETE! The sun is back, and every island is connected. Thank you for being the best sky partner ever!'}
];
const BOOKS={1:{title:"Pip's Lost Map",start:0,unit:'map piece',won:'Piece found!'},2:{title:'The Starlight Compass',start:4,unit:'compass part',won:'Compass part found!'},3:{title:'The Rainbow Bridge',start:8,unit:'bridge color',won:'Color restored!'}};
const bookOf=i=>(CHAPTERS[Math.min(i,CHAPTERS.length-1)]||{}).book||1;
function bookArt(b,n,fresh){return b===3?bridgeSVG3(n,fresh):b===2?compassSVG2(n,fresh):mapSVG(Math.min(n,4),fresh)}
function bridgeSVG3(n,fresh){const cols=['#ff6b57','#ffc23d','#38b98a','#2f9fe0'],cx=158,cy=170;let o='';
  for(let k=0;k<4;k++){const r=128-k*20,got=k<n,d=`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`;
    o+=got?`<path class="${fresh&&k===n-1?'fresh':''}" d="${d}" fill="none" stroke="${cols[k]}" stroke-width="17" stroke-linecap="round"/>`:`<path d="${d}" fill="none" stroke="#dfe6ee" stroke-width="15" stroke-dasharray="7 6" stroke-linecap="round"/>`}
  const cloud=(x,y)=>`<g fill="#fff"><circle cx="${x-16}" cy="${y}" r="14"/><circle cx="${x}" cy="${y-8}" r="18"/><circle cx="${x+16}" cy="${y}" r="14"/><rect x="${x-30}" y="${y}" width="60" height="14" rx="7"/></g>`;
  return `<svg class="storymap" viewBox="0 0 316 216" role="img" aria-label="Rainbow Bridge with ${n} of 4 colors"><rect width="316" height="216" rx="18" fill="${n>=4?'#bfe8ff':'#c9d6e6'}"/>${n>=4?'<circle cx="270" cy="40" r="20" fill="#ffd56b"/>':''}${o}${cloud(36,176)}${cloud(280,176)}</svg>`}

/* stickers */
const STICKER_SETS=[['sky','Sky Friends','#dff3ff'],['space','Space Trip','#2c3266'],['yum','Yummy Treats','#fff1e0'],['gold','Treasure Chest','#fff5d6']];
const STK=[
  ['cloud','Fluffy Cloud','sky','common',`<g fill="#fff" stroke="#9cc5e8" stroke-width="2"><circle cx="-8" cy="2" r="9"/><circle cx="4" cy="-3" r="11"/><circle cx="13" cy="4" r="7"/></g><rect x="-14" y="2" width="30" height="9" rx="4" fill="#fff"/>`],
  ['rainbow','Rainbow','sky','common',['#e2558f','#ffc23d','#38b98a','#2f9fe0'].map((c,i)=>`<path d="M${-18+i*4} 10 A${18-i*4} ${18-i*4} 0 0 1 ${18-i*4} 10" fill="none" stroke="${c}" stroke-width="4"/>`).join('')],
  ['kite','Kite','sky','common',`<path d="M0 -18 L12 -2 L0 14 L-12 -2Z" fill="#ff6b57" stroke="#1f3557" stroke-width="2"/><path d="M0 -18 V14 M-12 -2 H12" stroke="#1f3557" stroke-width="1.5"/><path d="M0 14 q4 4 0 8 q-4 4 0 8" fill="none" stroke="#1f3557" stroke-width="1.5"/>`],
  ['balloon','Mini Balloon','sky','rare',`<ellipse cx="0" cy="-6" rx="12" ry="13" fill="#ff6b57"/><ellipse cx="0" cy="-6" rx="5" ry="13" fill="#ffc23d"/><path d="M-6 6 L-4 13 M6 6 L4 13" stroke="#7a5236" stroke-width="1.5"/><rect x="-5" y="12" width="10" height="7" rx="2" fill="#b5773f"/>`],
  ['sun','Sunny','sky','rare',`<circle r="9" fill="#ffc23d"/>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="0" y1="-12" x2="0" y2="-18" stroke="#ff9f43" stroke-width="3" stroke-linecap="round" transform="rotate(${a})"/>`).join('')}`],
  ['bolt','Lightning','sky','gold',`<path d="M4 -20 L-10 2 L0 2 L-4 20 L12 -4 L2 -4Z" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/>`],
  ['moon','Moon','space','common',`<circle r="14" fill="#ffd56b"/><circle cx="7" cy="-5" r="12" fill="#2c3266"/>`],
  ['planet','Ringed Planet','space','common',`<circle r="11" fill="#ff9f43"/><ellipse rx="19" ry="5" fill="none" stroke="#ffd56b" stroke-width="3" transform="rotate(-20)"/>`],
  ['star','Shooting Star','space','common',`<path d="M4 -14 l3.6 7.3 8 1.1-5.8 5.6 1.4 8-7.2-3.8-7.2 3.8 1.4-8-5.8-5.6 8-1.1z" fill="#ffc23d"/><path d="M-6 6 L-18 16 M-4 10 L-14 19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
  ['rocket','Rocket','space','rare',`<path d="M0 -20 C10 -10 10 4 6 10 H-6 C-10 4 -10 -10 0 -20Z" fill="#fff" stroke="#1f3557" stroke-width="2"/><circle cy="-6" r="4" fill="#2f9fe0" stroke="#1f3557" stroke-width="1.5"/><path d="M-6 4 L-12 12 L-6 10Z M6 4 L12 12 L6 10Z" fill="#ff6b57"/><path d="M-3 11 L0 19 L3 11Z" fill="#ffc23d"/>`],
  ['ufo','Friendly UFO','space','rare',`<ellipse cy="-4" rx="8" ry="8" fill="#9be0bd" stroke="#1f3557" stroke-width="1.5"/><ellipse cy="3" rx="18" ry="6" fill="#c7b6ff" stroke="#1f3557" stroke-width="1.5"/><circle cx="-9" cy="3" r="1.6" fill="#ffc23d"/><circle cy="4" r="1.6" fill="#ffc23d"/><circle cx="9" cy="3" r="1.6" fill="#ffc23d"/>`],
  ['comet','Golden Comet','space','gold',`<circle cx="8" cy="-8" r="7" fill="#ffc23d"/><path d="M3 -3 L-18 18 M6 0 L-12 18 M0 -6 L-18 10" stroke="#ffd56b" stroke-width="3" stroke-linecap="round"/>`],
  ['apple','Apple','yum','common',`<circle cx="-5" cy="3" r="10" fill="#ff6b57"/><circle cx="5" cy="3" r="10" fill="#ff6b57"/><path d="M0 -7 Q2 -14 6 -15" stroke="#8c5a2c" stroke-width="2" fill="none"/><ellipse cx="5" cy="-12" rx="5" ry="2.5" fill="#38b98a" transform="rotate(-25 5 -12)"/>`],
  ['cookie','Cookie','yum','common',`<circle r="15" fill="#e0a35a" stroke="#b4683a" stroke-width="2"/>${[[-5,-5],[5,-2],[-2,6],[7,7],[-8,4]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#5b3324"/>`).join('')}`],
  ['icecream','Ice Cream','yum','common',`<path d="M-9 0 L0 20 L9 0Z" fill="#e0a35a" stroke="#b4683a" stroke-width="1.5"/><circle cy="-6" r="10" fill="#ffb3c7"/><circle cy="-14" r="3" fill="#ff6b57"/>`],
  ['pizza','Pizza Slice','yum','rare',`<path d="M0 18 L-14 -12 Q0 -18 14 -12Z" fill="#ffd56b" stroke="#e0a35a" stroke-width="3"/><circle cx="-3" cy="-6" r="3" fill="#ff6b57"/><circle cx="4" cy="2" r="3" fill="#ff6b57"/><circle cx="-1" cy="9" r="2.5" fill="#ff6b57"/>`],
  ['donut','Donut','yum','rare',`<circle r="15" fill="#e0a35a"/><circle r="12" fill="#ff9fb7"/><circle r="5" fill="#fff1e0"/>${[[-8,-5,'#2f9fe0'],[6,-8,'#ffc23d'],[8,5,'#38b98a'],[-6,7,'#fff']].map(([x,y,c])=>`<rect x="${x}" y="${y}" width="4" height="1.6" rx=".8" fill="${c}"/>`).join('')}`],
  ['cupcake','Golden Cupcake','yum','gold',`<path d="M-11 0 L-8 16 H8 L11 0Z" fill="#ffc23d" stroke="#e09a14" stroke-width="1.5"/><circle cx="-6" cy="-3" r="7" fill="#fff"/><circle cx="6" cy="-3" r="7" fill="#fff"/><circle cy="-9" r="7" fill="#fff"/><circle cy="-17" r="3.5" fill="#ff6b57"/>`],
  ['coinS','Lucky Coin','gold','common',`<circle r="14" fill="#ffc23d" stroke="#e09a14" stroke-width="2.5"/><text y="6" ${FONT} font-size="16" text-anchor="middle" fill="#a86b00">$</text>`],
  ['shell','Sea Shell','gold','common',`<path d="M-14 8 Q0 -22 14 8Z" fill="#ffb3c7" stroke="#e2558f" stroke-width="2"/><path d="M0 8 L0 -12 M-7 8 L-4 -8 M7 8 L4 -8" stroke="#e2558f" stroke-width="1.5"/><rect x="-5" y="8" width="10" height="5" rx="2" fill="#e2558f"/>`],
  ['key','Old Key','gold','common',`<circle cx="-8" cy="0" r="7" fill="none" stroke="#e09a14" stroke-width="4"/><path d="M-1 0 H16 M10 0 V6 M15 0 V5" stroke="#e09a14" stroke-width="4" stroke-linecap="round"/>`],
  ['gem','Big Gem','gold','rare',`<path d="M-14 -4 L-7 -13 H7 L14 -4 L0 15Z" fill="#7fd0f5" stroke="#1f6fa8" stroke-width="2"/><path d="M-14 -4 H14 M-7 -13 L-3 -4 L0 15 L3 -4 L7 -13" stroke="#1f6fa8" stroke-width="1.2" fill="none"/>`],
  ['anchor','Anchor','gold','rare',`<circle cy="-13" r="4" fill="none" stroke="#1f3557" stroke-width="3"/><path d="M0 -9 V14 M-8 -3 H8 M-13 4 Q-12 15 0 15 Q12 15 13 4" fill="none" stroke="#1f3557" stroke-width="3" stroke-linecap="round"/>`],
  ['crownS','Golden Crown','gold','gold',`<path d="M-15 10 L-15 -8 L-7 0 L0 -14 L7 0 L15 -8 L15 10Z" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/><circle cy="3" r="3" fill="#e2558f"/>`]
].map(([id,name,set,rar,art])=>({id,name,set,rar,art}));
function stickerSVG(s,owned=true){
  const bg=STICKER_SETS.find(x=>x[0]===s.set)[2],ring={common:'#ffffff',rare:'#2f9fe0',gold:'#ffc23d'}[s.rar];
  /* a sticker not found yet shows as a faded preview, so there is something to look forward to */
  if(!owned)return `<svg viewBox="-30 -30 60 60" class="stkmiss" aria-label="Sticker not found yet"><circle r="27" fill="${bg}" stroke="${ring}" stroke-width="4"/>${s.art}</svg>`;
  return `<svg viewBox="-30 -30 60 60" class="${s.rar==='gold'?'shine':''}" aria-label="${esc(s.name)} sticker"><circle r="27" fill="${bg}" stroke="${ring}" stroke-width="${s.rar==='common'?4:5}"/>${s.rar!=='common'?`<circle r="27" fill="none" stroke="#1f3557" stroke-width="1" opacity=".25"/>`:''}${s.art}</svg>`;
}

/* ================= seasonal events ================= */
const EVENTS=[
  {id:'halloween',name:'Pumpkin Patch Party',island:'Pumpkin Patch',s:[10,1],e:[11,2],color:'#ff8c1a',hat:'witch',basket:'pumpkin',pet:'ghost',set:'ev_hall',
    th:{items:'candies',box:'bags',food:'pumpkin pie',buy1:'a witch costume',buy2:'a glow stick',act:'Trick-or-treating',crit:'bats'},
    intro:'Happy Halloween! The Pumpkin Patch is open for a short time only. Collect candy points for spooky prizes!'},
  {id:'thanks',name:'Harvest Festival',island:'Harvest Hill',s:[11,3],e:[11,30],color:'#d9784a',hat:'leafcrown',basket:'pie',pet:'turkey',set:'ev_thanks',
    th:{items:'cranberries',box:'bowls',food:'apple pie',buy1:'a pie',buy2:'a bag of corn',act:'The family dinner',crit:'turkeys'},
    intro:'It\'s harvest time! Help the farmers at Harvest Hill and collect acorn points for cozy prizes!'},
  {id:'winter',name:'Winter Wonderland',island:'Snowflake Summit',s:[12,1],e:[1,15],color:'#5fb6e6',hat:'beanie',basket:'sleigh',pet:'snowman',set:'ev_winter',
    th:{items:'snowballs',box:'buckets',food:'gingerbread cake',buy1:'a pair of mittens',buy2:'a cup of cocoa',act:'Sledding',crit:'snowflakes'},
    intro:'Brrr! Snowflake Summit is covered in snow. Collect snowflake points for frosty prizes!'},
  {id:'spring',name:'Spring Blossom Fest',island:'Blossom Bay',s:[3,20],e:[4,30],color:'#e2558f',hat:'butterfly',basket:'tulip',pet:'duckling',set:'ev_spring',
    th:{items:'eggs',box:'baskets',food:'carrot cake',buy1:'a flower pot',buy2:'a pack of seeds',act:'The garden party',crit:'butterflies'},
    intro:'Flowers are blooming at Blossom Bay! Collect petal points for springy prizes!'},
  {id:'summer',name:'Summer Splash',island:'Splash Lagoon',s:[6,15],e:[8,31],color:'#2f9fe0',hat:'shades',basket:'floaty',pet:'crab',set:'ev_summer',
    th:{items:'seashells',box:'pails',food:'watermelon',buy1:'a beach ball',buy2:'an ice pop',act:'Swimming',crit:'starfish'},
    intro:'Summer Splash is here! Dive into Splash Lagoon and collect shell points for sunny prizes!'}
];
const EV_MILES=[[20,'coins',100],[50,'pet'],[90,'gold',150]];
Object.assign(HATS,{
  witch:{name:'Witch Hat',price:220,ev:'halloween',svg:`<path d="M47 104 L62 72 Q66 70 66 77 L73 104Z" fill="#3b3f4a"/><path d="M40 107 Q60 112 80 107 L80 103 Q60 108 40 103Z" fill="#2c2f38"/><path d="M48 101 Q60 104 72 101 L71.5 97 Q60 100 48.5 97Z" fill="#ff9f43"/><rect x="57" y="97" width="6" height="5" fill="none" stroke="#ffc23d" stroke-width="1.5"/>`},
  leafcrown:{name:'Autumn Leaf Crown',price:220,ev:'thanks',svg:[[44,106,'#ff6b57',-40],[51,101,'#ffc23d',-20],[60,99,'#d9502e',0],[69,101,'#ff9f43',20],[76,106,'#ffc23d',40]].map(([x,y,c,r])=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="6.5" fill="${c}" transform="rotate(${r} ${x} ${y})"/><path d="M${x} ${y+5} L${x} ${y-4}" stroke="#8c5a2c" stroke-width=".8" transform="rotate(${r} ${x} ${y})"/>`).join('')},
  beanie:{name:'Winter Beanie',price:220,ev:'winter',svg:`<path d="M44 107 Q44 89 60 89 Q76 89 76 107Z" fill="#2f9fe0"/><path d="M50 92 V106 M60 89 V106 M70 92 V106" stroke="#1f6fa8" stroke-width="1.5"/><rect x="42" y="102" width="36" height="7" rx="3.5" fill="#fff"/><circle cx="60" cy="87" r="5.5" fill="#fff"/>`},
  butterfly:{name:'Butterfly Headband',price:220,ev:'spring',svg:`<path d="M42 112 Q60 90 78 112" stroke="#e2558f" stroke-width="3" fill="none"/><g transform="translate(67 96)"><ellipse cx="-4.5" cy="-2" rx="5" ry="4" fill="#ffc23d"/><ellipse cx="4.5" cy="-2" rx="5" ry="4" fill="#c7b6ff"/><ellipse cx="-3.5" cy="3" rx="3.5" ry="3" fill="#ff9fb7"/><ellipse cx="3.5" cy="3" rx="3.5" ry="3" fill="#7fd0f5"/><rect x="-.8" y="-5" width="1.6" height="10" rx=".8" fill="#1f3557"/></g>`},
  shades:{name:'Cool Shades',price:220,ev:'summer',svg:`<rect x="45.5" y="111" width="12.5" height="9" rx="3" fill="#1f3557"/><rect x="62" y="111" width="12.5" height="9" rx="3" fill="#1f3557"/><path d="M58 114 h4 M45.5 113 l-4 -2 M74.5 113 l4 -2" stroke="#1f3557" stroke-width="2"/><path d="M48 113.5 h4 M64.5 113.5 h4" stroke="#7fd0f5" stroke-width="1.5"/>`}
});
Object.assign(BASKETS,{
  pumpkin:{name:'Jack-o\'-Lantern',price:280,ev:'halloween',svg:`<path d="M36 145 Q36 128 50 129 Q55 126 60 129 Q65 126 70 129 Q84 128 84 145 Q84 162 70 161 Q65 164 60 161 Q55 164 50 161 Q36 162 36 145Z" fill="#ff8c1a" stroke="#e06f00" stroke-width="1.5"/><path d="M50 130 Q46 145 50 160 M70 130 Q74 145 70 160" stroke="#e06f00" stroke-width="1.5" fill="none"/><path d="M47 143 l4 -5 l4 5z M65 143 l4 -5 l4 5z" fill="#3b2a1f"/><path d="M49 149 q11 8 22 0 l-3 4 l-3 -2 l-5 3 l-5 -3 l-3 2z" fill="#3b2a1f"/><rect x="35" y="127" width="50" height="6" rx="3" fill="#2b8a62"/>`},
  pie:{name:'Pie Dish',price:280,ev:'thanks',svg:`<path d="M36 132 H84 L79 158 Q60 163 41 158Z" fill="#c98a4b"/><path d="M40 140 L80 140 M41 148 L79 148 M48 133 L46 158 M60 133 V160 M72 133 L74 158" stroke="#e0a35a" stroke-width="3"/><rect x="35" y="127" width="50" height="7" rx="3.5" fill="#e0a35a"/>${[39,47,55,63,71,79].map(x=>`<circle cx="${x}" cy="130" r="3" fill="#e0a35a"/>`).join('')}`},
  sleigh:{name:'Snow Sleigh',price:280,ev:'winter',svg:`<path d="M44 154 V160 M76 154 V160" stroke="#ffc23d" stroke-width="3"/><path d="M34 160 H84 Q92 160 92 152" stroke="#ffc23d" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M36 130 H82 Q87 131 85 140 L81 154 H40 Q36 154 36 146Z" fill="#e2553f"/><path d="M44 142 q8 -6 16 0 t16 0" stroke="#ffc23d" stroke-width="2" fill="none"/><rect x="35" y="127" width="50" height="6" rx="3" fill="#fff"/>`},
  tulip:{name:'Tulip Basket',price:280,ev:'spring',svg:`<path d="M36 130 Q38 160 60 161 Q82 160 84 130 L72 138 L60 129 L48 138Z" fill="#ff9fb7" stroke="#e2558f" stroke-width="1.5"/><path d="M60 140 V160 M48 145 Q54 152 60 160 M72 145 Q66 152 60 160" stroke="#e2558f" stroke-width="1.2" fill="none"/><rect x="35" y="127" width="50" height="5" rx="2.5" fill="#38b98a"/>`},
  floaty:{name:'Pool Floaty',price:280,ev:'summer',svg:`<path d="M30 158 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0" stroke="#5fc3f0" stroke-width="3" fill="none"/><ellipse cx="60" cy="146" rx="26" ry="14" fill="#ff6b57"/><path d="M41 137 L45 146 M79 137 L75 146 M48 158 L52 150 M72 158 L68 150" stroke="#fff" stroke-width="6"/><ellipse cx="60" cy="144" rx="13" ry="6" fill="#7fd0f5"/><rect x="35" y="127" width="50" height="6" rx="3" fill="#ffc23d"/>`}
});
Object.assign(PETS,{
  ghost:{name:'Boo the Ghost',price:0,ev:'halloween',reward:true,svg:`<path d="M-9 0 L-9 -14 Q-9 -27 0 -27 Q9 -27 9 -14 L9 0 L6 -3 L3 0 L0 -3 L-3 0 L-6 -3Z" fill="#fff" stroke="#9aa6b6" stroke-width="1.1"/><ellipse cx="-3" cy="-17" rx="1.6" ry="2.2" fill="#1f3557"/><ellipse cx="3" cy="-17" rx="1.6" ry="2.2" fill="#1f3557"/><ellipse cx="0" cy="-11.5" rx="1.8" ry="1.4" fill="#ff9fb7"/>`},
  turkey:{name:'Gobble the Turkey',price:0,ev:'thanks',reward:true,svg:`${[['#ff6b57',-50],['#ffc23d',-25],['#ff9f43',0],['#ffc23d',25],['#ff6b57',50]].map(([c,r])=>`<ellipse cx="0" cy="-20" rx="3.5" ry="8" fill="${c}" transform="rotate(${r} 0 -10)"/>`).join('')}<ellipse cx="0" cy="-8" rx="7.5" ry="7.5" fill="#8c5a2c" stroke="#1f3557" stroke-width="1.1"/><circle cx="0" cy="-17" r="4.5" fill="#a0683a" stroke="#1f3557" stroke-width="1.1"/><circle cx="-1.6" cy="-18" r=".9" fill="#1f3557"/><circle cx="1.6" cy="-18" r=".9" fill="#1f3557"/><path d="M-1.5 -16 L1.5 -16 L0 -13.5Z" fill="#ffc23d"/><ellipse cx="1.5" cy="-13" rx="1" ry="2" fill="#ff3b30"/>`},
  snowman:{name:'Flurry the Snowman',price:0,ev:'winter',reward:true,svg:`<circle cx="0" cy="-7" r="8" fill="#fff" stroke="#9aa6b6" stroke-width="1.1"/><circle cx="0" cy="-19" r="6" fill="#fff" stroke="#9aa6b6" stroke-width="1.1"/><rect x="-5" y="-27" width="10" height="3" rx="1" fill="#1f3557"/><rect x="-3.5" y="-32" width="7" height="6" rx="1" fill="#1f3557"/><circle cx="-2" cy="-20" r=".9" fill="#1f3557"/><circle cx="2" cy="-20" r=".9" fill="#1f3557"/><path d="M0 -18 L5 -17 L0 -16.5Z" fill="#ff9f43"/><path d="M-6 -13 h12" stroke="#ff6b57" stroke-width="2.5"/>`},
  duckling:{name:'Puddle the Duckling',price:0,ev:'spring',reward:true,svg:`<ellipse cx="0" cy="-7" rx="9" ry="7" fill="#ffd56b" stroke="#1f3557" stroke-width="1.1"/><ellipse cx="2" cy="-8" rx="4.5" ry="3" fill="#ffc23d"/><circle cx="-4" cy="-17" r="5.5" fill="#ffd56b" stroke="#1f3557" stroke-width="1.1"/><circle cx="-5.5" cy="-18" r="1" fill="#1f3557"/><path d="M-9.5 -16 L-14 -15 L-9.5 -13.5Z" fill="#ff9f43"/>`},
  crab:{name:'Pinchy the Crab',price:0,ev:'summer',reward:true,svg:`<path d="M-7 -3 l-5 4 M-6 -1 l-4 5 M7 -3 l5 4 M6 -1 l4 5" stroke="#d9502e" stroke-width="1.6"/><ellipse cx="0" cy="-7" rx="9" ry="6" fill="#ff6b57" stroke="#1f3557" stroke-width="1.1"/><circle cx="-12" cy="-14" r="3.5" fill="#ff6b57" stroke="#1f3557" stroke-width="1"/><circle cx="12" cy="-14" r="3.5" fill="#ff6b57" stroke="#1f3557" stroke-width="1"/><path d="M-3 -12 V-16 M3 -12 V-16" stroke="#1f3557" stroke-width="1.2"/><circle cx="-3" cy="-17" r="1.6" fill="#fff" stroke="#1f3557" stroke-width=".8"/><circle cx="3" cy="-17" r="1.6" fill="#fff" stroke="#1f3557" stroke-width=".8"/><path d="M-2 -5 q2 2 4 0" stroke="#1f3557" stroke-width=".8" fill="none"/>`}
});
STICKER_SETS.push(['ev_hall','Halloween','#3b2a5a','halloween'],['ev_thanks','Harvest','#fff1e0','thanks'],['ev_winter','Winter','#dff3ff','winter'],['ev_spring','Spring','#ecfbe8','spring'],['ev_summer','Summer','#e6f7ff','summer']);
STK.push(...[
  ['pumpkinS','Pumpkin','ev_hall','common',`<ellipse cx="-6" cy="3" rx="8" ry="11" fill="#ff8c1a"/><ellipse cx="6" cy="3" rx="8" ry="11" fill="#ff8c1a"/><ellipse cx="0" cy="3" rx="7" ry="12" fill="#ffa040"/><rect x="-1.5" y="-12" width="3" height="5" rx="1" fill="#2b8a62"/>`],
  ['ghostS','Friendly Ghost','ev_hall','common',`<path d="M-11 15 L-11 -2 Q-11 -17 0 -17 Q11 -17 11 -2 L11 15 L7 11 L3 15 L-1 11 L-5 15 L-8 11Z" fill="#fff"/><circle cx="-4" cy="-3" r="2" fill="#1f3557"/><circle cx="4" cy="-3" r="2" fill="#1f3557"/><ellipse cx="0" cy="4" rx="2.5" ry="3" fill="#1f3557"/>`],
  ['batS','Little Bat','ev_hall','rare',`<path d="M0 -2 Q-8 -14 -20 -6 Q-14 -4 -14 2 Q-9 -2 -5 4 Q-2 0 0 4 Q2 0 5 4 Q9 -2 14 2 Q14 -4 20 -6 Q8 -14 0 -2Z" fill="#6b5bd6"/><circle cx="0" cy="-2" r="6" fill="#6b5bd6"/><circle cx="-2" cy="-3" r="1.3" fill="#ffc23d"/><circle cx="2" cy="-3" r="1.3" fill="#ffc23d"/>`],
  ['candyS','Golden Candy','ev_hall','gold',`<path d="M-9 0 L-18 -7 L-18 7Z M9 0 L18 -7 L18 7Z" fill="#ffc23d"/><ellipse rx="10" ry="8" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/><path d="M-5 -6 L5 6 M-1 -8 L8 2 M-8 -2 L1 8" stroke="#ff6b57" stroke-width="2"/>`],
  ['leafS','Maple Leaf','ev_thanks','common',`<path d="M0 -17 L4 -8 L12 -11 L9 -2 L17 0 L8 5 L10 12 L2 9 L0 17 L-2 9 L-10 12 L-8 5 L-17 0 L-9 -2 L-12 -11 L-4 -8Z" fill="#ff6b57"/><path d="M0 -10 V17" stroke="#b83a2a" stroke-width="1.5"/>`],
  ['acornS','Acorn','ev_thanks','common',`<ellipse cx="0" cy="5" rx="9" ry="11" fill="#c98a4b"/><path d="M-12 -3 Q0 -14 12 -3 Q0 1 -12 -3Z" fill="#8c5a2c"/><rect x="-1.5" y="-14" width="3" height="5" rx="1" fill="#5b3324"/>`],
  ['pieS','Apple Pie','ev_thanks','rare',`<path d="M-17 2 H17 L13 12 H-13Z" fill="#c98a4b"/><path d="M-17 2 Q0 -14 17 2Z" fill="#e0a35a"/><path d="M-8 -3 L-4 2 M0 -6 L2 0 M8 -3 L5 2" stroke="#c98a4b" stroke-width="2"/>`],
  ['cornS','Golden Corn','ev_thanks','gold',`<ellipse cx="0" cy="-2" rx="7" ry="14" fill="#ffc23d"/>${[-8,-3,2,7].map(y=>`<path d="M-6 ${y} H6" stroke="#e09a14" stroke-width="1"/>`).join('')}<path d="M-2 14 Q-14 6 -10 -8 Q-6 6 0 10Z M2 14 Q14 6 10 -8 Q6 6 0 10Z" fill="#38b98a"/>`],
  ['flakeS','Snowflake','ev_winter','common',`${[0,60,120].map(r=>`<g transform="rotate(${r})"><path d="M0 -17 V17 M-5 -12 L0 -8 L5 -12 M-5 12 L0 8 L5 12" stroke="#2f9fe0" stroke-width="2.5" stroke-linecap="round" fill="none"/></g>`).join('')}`],
  ['mittenS','Mitten','ev_winter','common',`<path d="M-8 14 V-4 Q-8 -14 2 -14 Q10 -14 10 -4 V14Z" fill="#e2553f"/><ellipse cx="-11" cy="-2" rx="4" ry="6" fill="#e2553f"/><rect x="-9" y="10" width="20" height="6" rx="2" fill="#fff"/>`],
  ['cocoaS','Hot Cocoa','ev_winter','rare',`<path d="M-11 -6 H9 V10 Q9 15 4 15 H-6 Q-11 15 -11 10Z" fill="#fff" stroke="#9aa6b6" stroke-width="1.5"/><path d="M9 -2 q7 0 6 6 q-1 5 -6 4" stroke="#9aa6b6" stroke-width="2.5" fill="none"/><ellipse cx="-1" cy="-6" rx="10" ry="2.5" fill="#8c5a2c"/><circle cx="-4" cy="-9" r="2.5" fill="#fff"/><circle cx="1" cy="-10" r="2.5" fill="#fff"/>`],
  ['snowmanS','Golden Snowman','ev_winter','gold',`<circle cx="0" cy="8" r="9" fill="#fff" stroke="#ffc23d" stroke-width="2"/><circle cx="0" cy="-7" r="7" fill="#fff" stroke="#ffc23d" stroke-width="2"/><path d="M0 -6 L7 -5 L0 -4Z" fill="#ff9f43"/><circle cx="-2.5" cy="-9" r="1" fill="#1f3557"/><circle cx="2.5" cy="-9" r="1" fill="#1f3557"/><rect x="-6" y="-17" width="12" height="3" fill="#1f3557"/>`],
  ['tulipS','Tulip','ev_spring','common',`<path d="M0 18 V0" stroke="#38b98a" stroke-width="3"/><path d="M-9 -12 L-9 0 Q0 8 9 0 L9 -12 L4 -6 L0 -14 L-4 -6Z" fill="#e2558f"/><ellipse cx="6" cy="10" rx="6" ry="2.5" fill="#38b98a" transform="rotate(-30 6 10)"/>`],
  ['ladyS','Ladybug','ev_spring','common',`<circle cx="0" cy="-10" r="5" fill="#1f3557"/><ellipse cx="0" cy="2" rx="12" ry="13" fill="#ff3b30"/><path d="M0 -10 V15" stroke="#1f3557" stroke-width="2"/>${[[-6,-2],[6,-2],[-5,8],[5,8]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#1f3557"/>`).join('')}`],
  ['flyS','Butterfly','ev_spring','rare',`<ellipse cx="-8" cy="-6" rx="9" ry="8" fill="#c7b6ff"/><ellipse cx="8" cy="-6" rx="9" ry="8" fill="#ffc23d"/><ellipse cx="-6" cy="8" rx="6" ry="6" fill="#7fd0f5"/><ellipse cx="6" cy="8" rx="6" ry="6" fill="#ff9fb7"/><rect x="-1.5" y="-12" width="3" height="24" rx="1.5" fill="#1f3557"/>`],
  ['eggS','Golden Egg','ev_spring','gold',`<ellipse cx="0" cy="2" rx="12" ry="16" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/><path d="M-11 -2 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l2 2" stroke="#fff" stroke-width="2" fill="none"/><path d="M-11 8 h22" stroke="#e2558f" stroke-width="2.5"/>`],
  ['melonS','Watermelon','ev_summer','common',`<path d="M-17 -4 A17 17 0 0 0 17 -4Z" fill="#38b98a"/><path d="M-14 -4 A14 14 0 0 0 14 -4Z" fill="#ff6b8f"/>${[-7,0,7].map(x=>`<ellipse cx="${x}" cy="2" rx="1.2" ry="2" fill="#1f3557"/>`).join('')}`],
  ['starS','Starfish','ev_summer','common',`<path d="M0 -17 L5 -5 L17 -4 L8 4 L11 16 L0 9 L-11 16 L-8 4 L-17 -4 L-5 -5Z" fill="#ff9f43" stroke="#e06f00" stroke-width="1.5" stroke-linejoin="round"/><circle cx="-2" cy="-2" r="1" fill="#fff"/><circle cx="3" cy="2" r="1" fill="#fff"/>`],
  ['ballS','Beach Ball','ev_summer','rare',`<circle r="16" fill="#fff" stroke="#9aa6b6" stroke-width="1.5"/><path d="M0 -16 Q-10 0 0 16 Q-16 10 -16 0 Q-14 -12 0 -16Z" fill="#ff6b57"/><path d="M0 -16 Q10 0 0 16 Q16 10 16 0 Q14 -12 0 -16Z" fill="#2f9fe0"/><circle r="3" fill="#ffc23d"/>`],
  ['popS','Golden Ice Pop','ev_summer','gold',`<rect x="-2" y="8" width="4" height="12" rx="2" fill="#e0a35a"/><rect x="-9" y="-16" width="18" height="26" rx="8" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/><path d="M-9 -4 H9" stroke="#fff" stroke-width="3"/>`]
].map(([id,name,set,rar,art])=>({id,name,set,rar,art,ev:true})));
function activeEvent(d=new Date()){
  const hm=String(location.hash||'').replace('#',''),forced=EVENTS.find(e=>hm==='ev'+e.id);if(forced)return forced;
  const md=(d.getMonth()+1)*100+d.getDate();
  for(const e of EVENTS){const s=e.s[0]*100+e.s[1],en=e.e[0]*100+e.e[1];if(s<=en?(md>=s&&md<=en):(md>=s||md<=en))return e}return null}
function eventKey(e,d=new Date()){let y=d.getFullYear();const md=(d.getMonth()+1)*100+d.getDate(),s=e.s[0]*100+e.s[1],en=e.e[0]*100+e.e[1];if(s>en&&md<=en)y--;return e.id+'-'+y}
const evEnd=e=>`${MONTHS[e.e[0]-1].slice(0,3)} ${e.e[1]}`;
function evState(e){G.events=G.events||{};const k=eventKey(e);return G.events[k]||(G.events[k]={pts:0,got:[]})}
function evArt(e,size){const s=STK.find(x=>x.set===e.set);return `<svg viewBox="-30 -30 60 60" style="width:${size}px;height:${size}px" aria-hidden="true">${s.art}</svg>`}
function genEvent(t){
  const e=CUR_EV||EVENTS[0],T=e.th,nm2=pick(NAMES);
  if(t===0){const b=R(3,9),p=R(Dv(6,12,25),Dv(12,30,60)),ans=b*p;return {prompt:`${nm2} collected <b>${b} ${T.box}</b> with <b>${p} ${T.items}</b> in each. How many ${T.items} in all?`,...numChoices(ans,[b+p,ans+b,ans-p,ans+10]),hint:`Equal groups: multiply ${b} × ${p}.`,explain:`${b} × ${p} = <b>${fmt(ans)}</b> ${T.items}.`,anim:multAnim(p,String(p).split('').map((c,i,a)=>+c*10**(a.length-1-i)).filter(x=>x>0),b)}}
  if(t===1){const d=R(3,8),q=R(Dv(3,6,12),Dv(9,15,30)),n=q*d;return {prompt:`<b>${n} ${T.items}</b> are shared equally by <b>${d} friends</b>. How many does each friend get?`,...numChoices(q,[q+1,q-1,n-d,q+d]),hint:`Divide: ${n} ÷ ${d}.`,explain:`${n} ÷ ${d} = <b>${q}</b>, because ${d} × ${q} = ${n}.`,anim:divAnim(n,d)}}
  if(t===2){const den=pick([4,6,8,10,12]),eat=R(1,den-1);return {prompt:`A ${T.food} is cut into <b>${den}</b> equal slices. <b>${eat}</b> slices are eaten. What fraction of the ${T.food} is <b>left</b>?`,visual:pieVis(den-eat,den),...strChoices(`${den-eat}/${den}`,[`${eat}/${den}`,`${den-eat}/${eat}`,`${den}/${den-eat}`,`${den-eat}/${den+1}`]),hint:`The bottom number is all the slices. How many slices are still there?`,explain:`${den} − ${eat} = ${den-eat} slices are left, so ${frac(den-eat,den)} is left.`}}
  if(t===3){const a=R(150,Dv(450,750,1500)),b=R(50,Dv(250,450,950)),s=a+b;return {prompt:`${T.buy1[0].toUpperCase()+T.buy1.slice(1)} costs <b>${fmtM(a)}</b> and ${T.buy2} costs <b>${fmtM(b)}</b>. How much is that in all?`,...strChoices(fmtM(s),[fmtM(s+100),fmtM(s-10),fmtM(s+10),fmtM(Math.abs(a-b))]),hint:`Add the dollars and the cents. 100¢ makes $1.`,explain:`${fmtM(a)} + ${fmtM(b)} = <b>${fmtM(s)}</b>.`}}
  if(t===4){const h=R(4,8),m=R(0,11)*5;let d;do{d=pick([15,20,25,30,35,40,45,50,55])}while(m+d>=120);const ans=addMin(h,m,d);
    return {prompt:`${T.act} starts at <b>${tf(h,m)}</b> and lasts <b>${d} minutes</b>. What time does it end?`,visual:clockSVG(h,m,200),...strChoices(ans,[tf(h,(m+d)%60),addMin(h,m,d+10),addMin(h,m,d-10),addMin(h,m,d+60)]),anim:clockSVG(h,m,180,'',d),hint:`Count up to the next full hour first, then add the rest.`,explain:m+d<60?`${m} + ${d} = ${m+d} minutes, so it ends at <b>${ans}</b>.`:`From ${tf(h,m)}, ${60-m} minutes gets to ${tf(wrapH(h+1),0)}. ${m+d-60} more minutes makes <b>${ans}</b>.`}}
  const a=R(1,6),dbl=coin(),s=R(2,9),seq=dbl?[a,a*2,a*4,a*8]:[a,a+s,a+2*s,a+3*s],ans=dbl?a*16:a+4*s;
  return {prompt:`Pip counts ${T.crit} each night. What number comes next?`,visual:`<div class="seq">${seq.map(x=>`<span>${x}</span>`).join('')}<span class="q">?</span></div>`,...numChoices(ans,[ans+1,dbl?seq[3]+8:ans+s,ans-1,dbl?seq[3]*3:ans+2*s]),hint:dbl?`The numbers double each time.`:`Find the jump between the numbers.`,explain:dbl?`Each number doubles: ${seq[3]} × 2 = <b>${ans}</b>.`:`The rule is add ${s}: ${seq[3]} + ${s} = <b>${ans}</b>.`};
}
let CUR_EV=activeEvent();
function eventIsland(){const e=CUR_EV;return e?{id:'ev',name:e.island,topic:'Limited-time event',color:e.color,lm:'ev',gen:genEvent,types:6,group:'ev'}:null}
const EV_WEEK=30;
function evWeek(st){const k=weekKey();if(!st.wk||st.wk.k!==k)st.wk={k,pts:0,got:0};return st.wk}
function addEventPts(n,el){
  const e=CUR_EV;if(!e)return;const st=evState(e),before=st.pts;st.pts+=n;
  {const w=evWeek(st);w.pts+=n;if(w.pts>=EV_WEEK&&!w.got){w.got=1;G.coins+=30;const pool=STK.filter(x=>x.set===e.set&&x.rar!=='gold'),sk=pick(pool);if(sk)G.stickers[sk.id]=(G.stickers[sk.id]||0)+1;
    toast('Weekly event quest done!',`+30 coins${sk?` and a ${sk.name} sticker`:''}! A new quest starts next week.`,e.color);updateStats('#coinPill')}}
  for(const [need,kind,amt] of EV_MILES){if(before<need&&st.pts>=need&&!st.got.includes(need)){st.got.push(need);
    if(kind==='coins'){G.coins+=amt;toast(`${e.name} prize!`,`${need} points: +${amt} coins!`,e.color)}
    else if(kind==='pet'){if(!G.pets.includes(e.pet))G.pets.push(e.pet);toast(`New pet: ${PETS[e.pet].name}!`,`You reached ${need} event points. Find it in Pip's Closet!`,e.color)}
    else{const s=STK.find(x=>x.set===e.set&&x.rar==='gold');G.stickers[s.id]=(G.stickers[s.id]||0)+1;G.coins+=amt;award('event');toast(`Golden ${s.name}!`,`Top prize! +${amt} coins and a gold sticker!`,e.color)}
    sBadge();updateStats('#coinPill')}}
}
function renderEventCard(){
  const box=$('#eventCard');const e=CUR_EV;document.body.className=document.body.className.replace(/\bev-\w+/g,'').trim();
  if(!e){box.hidden=true;return}document.body.classList.add('ev-'+e.id);
  const st=evState(e),max=EV_MILES[EV_MILES.length-1][0];
  box.hidden=false;box.style.setProperty('--ev',e.color);
  box.innerHTML=`<div class="evart">${evArt(e,96)}</div><div class="evbody"><div class="evtop"><b>${e.name}</b><span class="evtag">Limited · until ${evEnd(e)}</span></div>
    <p>${e.intro}</p>${(()=>{const w=evWeek(st);return `<div class="evweek"><b>This week's quest:</b> ${w.got?'done! A new one starts on Monday.':`get <b>${EV_WEEK} event points</b> this week for 30 coins and a sticker (${Math.min(w.pts,EV_WEEK)}/${EV_WEEK}).`}</div>`})()}<div class="evmeter"><div class="bar warm"><i style="width:${Math.min(100,st.pts/max*100)}%"></i></div><span>${st.pts>=max?`${CHECK} ${fmt(st.pts)} pts`:`${st.pts} / ${max} pts`}</span></div>
    <div class="evmiles">${EV_MILES.map(([n,k,a])=>`<span class="${st.pts>=n?'ok':''}">${n} pts: ${k==='coins'?`+${a} coins`:k==='pet'?PETS[e.pet].name.split(' the ')[0]+' (pet)':'gold sticker'}</span>`).join('')}</div>
    <div class="actrow" style="justify-content:flex-start"><button class="go small" type="button" id="evPlay">Play ${e.island}</button><button class="go small alt" type="button" id="evShop">Event shop</button></div></div>`;
  $('#evPlay').onclick=()=>{tone([523,784]);start(eventIsland())};$('#evShop').onclick=()=>{openCloset();setTimeout(()=>{const s=$('#evShopTitle');s&&s.scrollIntoView({behavior:'smooth'})},80)};
}

