/* Pip's Sky Islands: the Common Core packs (us-3, us-4, us-5) for every state without its own pack.
   Math, English and science are the same as in California (Common Core and NGSS). Social studies follows the national
   C3 Framework instead of California's history standards:
   - grade 3: the same community, map, economy, government, symbols and heroes questions, minus the California-only ones
     (tagged ...ca in js/english3*.js), and Native peoples of North America instead of California Indians;
   - grade 4: regions of the United States, states and capitals, Native nations of the regions, government and the economy,
     instead of California history;
   - grade 5: U.S. history, the same as California's.
   Loaded after js/english5d.js and before js/islands.js. */

/* grade 3: Native peoples of North America (C3 D2.Geo.4.3-5, D2.His.2.3-5) */
const NATIVE_US=[
 ['nativeus','Long before Europeans arrived, who lived in North America?','many different Native nations',['nobody at all','only explorers from Spain','only farmers from England'],'People lived here for thousands of years.','<b>Many Native nations</b> lived all across North America.'],
 ['nativeus','Why did Native peoples in different places build different kinds of homes?','They used the materials found where they lived.',['They all copied one picture.','The king told them to.','They bought homes in stores.'],'Think about forests, deserts and plains.','Homes were made from <b>what grew or lay nearby</b>: wood, bark, clay, hides or snow.'],
 ['nativeus','Plains nations like the Lakota followed herds of which animal?','buffalo (bison)',['penguins','camels','kangaroos'],'It is big and shaggy.','The <b>buffalo</b> gave food, clothing and tipi covers.'],
 ['nativeus','What kind of home could Plains peoples pack up quickly to follow the buffalo?','a tipi',['a longhouse','an adobe pueblo','a brick house'],'It is made of poles and hides.','A <b>tipi</b> can be taken down and moved.'],
 ['nativeus','The Haudenosaunee (Iroquois) lived in long wooden homes for many families. What were they called?','longhouses',['igloos','tipis','castles'],'The name tells the shape.','Many families shared a <b>longhouse</b>.'],
 ['nativeus','Pueblo peoples of the Southwest built homes from sun-dried clay bricks. What are these bricks called?','adobe',['marble','glass','ice'],'It keeps homes cool in the desert.','<b>Adobe</b> is sun-dried clay.'],
 ['nativeus','Which three crops did many Native nations grow together, calling them the "Three Sisters"?','corn, beans and squash',['apples, pears and plums','rice, wheat and oats','carrots, peas and lettuce'],'They help each other grow.','<b>Corn, beans and squash</b>.'],
 ['nativeus','How did the Inuit of the far north stay warm?','with thick fur clothing and snow houses for hunting trips',['with electric heaters','by moving to the desert','by never going outside'],'It is very cold in the Arctic.','<b>Fur clothing</b> and snow houses kept them warm.'],
 ['nativeus','Native peoples of the Pacific Northwest caught lots of which fish?','salmon',['goldfish','sharks','tuna from Hawaii'],'It swims up rivers.','<b>Salmon</b> was a main food.'],
 ['nativeus','What were tall carved totem poles used to show?','family history and stories',['the time of day','the speed of the wind','prices in a store'],'Each animal had a meaning.','Totem poles told <b>family histories and stories</b>.'],
 ['nativeus','How did many Native nations pass down history before writing books?','by telling stories aloud',['by sending emails','by making movies','by printing newspapers'],'Elders told the young.','History was shared through <b>stories told aloud</b>.'],
 ['nativeus','How did Native peoples use the land and animals around them?','for food, tools, clothing and shelter',['only for decoration','not at all','only for trading with Europe'],'Very little was wasted.','They used nature for <b>food, tools, clothing and shelter</b>.'],
 ['nativeus','Are there Native nations in the United States today?','Yes, hundreds of Native nations keep their cultures alive.',['No, they all moved away.','Only in books.','Only one is left.'],'Many have their own governments.','<b>Yes</b>: there are hundreds of Native nations today.'],
 ['nativeus','The Cherokee lived in the Southeast. What did Sequoyah create for the Cherokee language?','a writing system',['a railroad','a telephone','a calendar of holidays'],'He finished it in 1821.','Sequoyah created a <b>writing system</b> for Cherokee.'],
 ['nativeus','Why did many Native villages grow near rivers and lakes?','for water, fish and travel by canoe',['to stay away from water','because rivers were warm','to hide from the sun'],'People need water every day.','Rivers gave <b>water, fish and a way to travel</b>.'],
 ['nativeus','What can an old basket or tool made by Native people teach us?','what materials they had and how skilled they were',['nothing at all','what TV shows they liked','what cars they drove'],'Objects are clues about the past.','It shows <b>materials and skills</b> from long ago.'],
 ['govt','Who leads a <b>state</b>, like Texas or New York?','a governor',['a mayor','the President','a principal'],'Every state has one leader chosen by its voters.','A state is led by a <b>governor</b>.'],
 ['heroes','César Chávez and Dolores Huerta are remembered for...','helping farm workers get fair pay and safer work',['inventing the airplane','writing the Constitution','exploring the Moon'],'They led marches and boycotts.','They fought for <b>farm workers\' rights</b>.'],
 ['nativeus','Wampum belts made from shells were used by Eastern Woodland nations to...','record agreements and important events',['catch fish','build houses','play music'],'Patterns had meanings.','Wampum <b>recorded agreements and events</b>.'],
 ['nativeus','Why did Native nations of the desert Southwest farm near rivers?','The desert gets little rain, so crops needed river water.',['Rivers were cold.','The desert has too much rain.','Fish ate the crops.'],'Plants need water.','Little rain meant crops needed <b>river water</b>.']
];
/* grade 3 banks without the California-only questions */
BANK3.geo3us=BANK3.geo3.filter(x=>!/ca$/.test(x[0]));
BANK3.history3us=BANK3.history3.filter(x=>!/ca$/.test(x[0])&&x[0]!=='native').concat(NATIVE_US);

/* grade 4: regions of the United States, states, Native nations, government, economy (C3 Geo, Civ, Eco, His) */
BANK3.us4=[
 /* regions */
 ['regions','The United States is often divided into five regions. Which list names them?','Northeast, Southeast, Midwest, Southwest and West',['North, South, East, West and Center','Atlantic, Pacific, Gulf, Lakes and Plains','Coast, Mountains, Desert, Forest and Farm'],'Think of the compass.','The five regions are the <b>Northeast, Southeast, Midwest, Southwest and West</b>.'],
 ['regions','What is a region?','an area with features that make it different from other areas',['a single city','a kind of map key','a river'],'Places in a region have something in common.','A <b>region</b> shares features like land, climate or history.'],
 ['regions','Which region is known for the Great Lakes and large farms of corn and soybeans?','the Midwest',['the Southwest','the Northeast','the West'],'It is in the middle of the country.','The <b>Midwest</b> is called "America\'s breadbasket."'],
 ['regions','Which region has deserts, canyons like the Grand Canyon, and states like Arizona and New Mexico?','the Southwest',['the Northeast','the Midwest','the Southeast'],'It is hot and dry.','The <b>Southwest</b>.'],
 ['regions','Which region has the Rocky Mountains, the Pacific coast, and states like Washington and Colorado?','the West',['the Southeast','the Midwest','the Northeast'],'It is the largest region.','The <b>West</b>.'],
 ['regions','Which region has many of the oldest cities, like Boston and Philadelphia?','the Northeast',['the Southwest','the West','the Midwest'],'The first colonies were here.','The <b>Northeast</b>.'],
 ['regions','Which region has a warm, wet climate, beaches on the Gulf of Mexico and the Atlantic, and states like Georgia and Florida?','the Southeast',['the Midwest','the West','the Northeast'],'Think of oranges and peanuts.','The <b>Southeast</b>.'],
 ['regions','Why is the Midwest good for farming?','It has flat land and rich soil.',['It is all desert.','It has no rain at all.','It is covered in glaciers.'],'Think of wide, flat plains.','<b>Flat land and rich soil</b> make the Midwest great for farming.'],
 ['regions','Which mountain range runs through the West?','the Rocky Mountains',['the Appalachian Mountains','the Alps','the Andes'],'It goes from New Mexico into Canada.','The <b>Rocky Mountains</b>.'],
 ['regions','Which mountain range runs through the Northeast and Southeast?','the Appalachian Mountains',['the Rocky Mountains','the Sierra Nevada','the Himalayas'],'It is the older, lower range in the east.','The <b>Appalachian Mountains</b>.'],
 ['regions','Which river is the longest river system in the United States and flows through the Midwest to the Gulf of Mexico?','the Mississippi River (with the Missouri River)',['the Hudson River','the Colorado River','the Rio Grande'],'Barges carry grain on it.','The <b>Mississippi</b>, joined by the Missouri.'],
 ['regions','Why do hurricanes hit the Southeast more than the Midwest?','The Southeast is next to warm ocean water.',['The Midwest has more mountains.','Hurricanes only start on land.','The Southeast is colder.'],'Hurricanes form over warm oceans.','Hurricanes form over <b>warm ocean water</b> near the Southeast.'],
 ['regions','How does climate affect the way people live in a region?','It changes the clothes, homes, crops and jobs people choose.',['It does not change anything.','It only changes the color of cars.','It decides people\'s names.'],'Think about snow vs. desert.','Climate shapes <b>clothes, homes, crops and jobs</b>.'],
 ['regions','In which region is the Grand Canyon?','the Southwest',['the Northeast','the Midwest','the Southeast'],'It is in Arizona.','The Grand Canyon is in Arizona, in the <b>Southwest</b>.'],
 ['regions','Which two states are not connected to the other 48 states?','Alaska and Hawaii',['Texas and Florida','Maine and Ohio','Utah and Nevada'],'One is far north; one is in the Pacific Ocean.','<b>Alaska and Hawaii</b>.'],
 ['regions','What are the Great Plains?','a wide, mostly flat grassland in the middle of the country',['a mountain range','an ocean','a desert in the Northeast'],'Buffalo once roamed there.','The <b>Great Plains</b> are wide, flat grasslands.'],
 ['regions','People in the Northeast get cold, snowy winters. What is one way they adapt?','They build homes with heating and wear warm coats.',['They grow palm trees outside.','They live in tents all winter.','They swim in the ocean every day.'],'How do you stay warm?','<b>Heating and warm clothes</b>.'],
 ['regions','Why do many big cities sit on coasts, rivers or lakes?','Water helps people trade, travel and get drinking water.',['Water keeps people away.','Cities must be near volcanoes.','Land near water is always free.'],'How were goods moved long ago?','Water made <b>trade and travel</b> easier.'],
 /* states and capitals */
 ['usstates','What is the capital of New York?','Albany',['New York City','Buffalo','Rochester'],'It is not the biggest city.','<b>Albany</b>.'],
 ['usstates','What is the capital of Ohio?','Columbus',['Cleveland','Cincinnati','Toledo'],'It shares a name with an explorer.','<b>Columbus</b>.'],
 ['usstates','What is the capital of Michigan?','Lansing',['Detroit','Grand Rapids','Flint'],'Not Detroit!','<b>Lansing</b>.'],
 ['usstates','What is the capital of North Carolina?','Raleigh',['Charlotte','Durham','Asheville'],'It is in the middle of the state.','<b>Raleigh</b>.'],
 ['usstates','What is the capital of New Jersey?','Trenton',['Newark','Jersey City','Princeton'],'Washington won a battle there.','<b>Trenton</b>.'],
 ['usstates','What is the capital of Utah?','Salt Lake City',['Provo','Ogden','Moab'],'It is near a big salty lake.','<b>Salt Lake City</b>.'],
 ['usstates','What is the capital of Tennessee?','Nashville',['Memphis','Knoxville','Chattanooga'],'Famous for country music.','<b>Nashville</b>.'],
 ['usstates','What is the capital of Minnesota?','Saint Paul',['Minneapolis','Duluth','Rochester'],'It has a twin city.','<b>Saint Paul</b>.'],
 ['usstates','What is the capital of Louisiana?','Baton Rouge',['New Orleans','Shreveport','Lafayette'],'Its name means "red stick."','<b>Baton Rouge</b>.'],
 ['usstates','What is the capital of Missouri?','Jefferson City',['St. Louis','Kansas City','Springfield'],'Named after a President.','<b>Jefferson City</b>.'],
 ['usstates','What is the capital of Alaska?','Juneau',['Anchorage','Fairbanks','Nome'],'You can only reach it by boat or plane.','<b>Juneau</b>.'],
 ['usstates','What is the capital of Hawaii?','Honolulu',['Hilo','Maui','Pearl City'],'It is on the island of Oahu.','<b>Honolulu</b>.'],
 ['usstates','Which state is the largest by area?','Alaska',['Texas','California','Montana'],'It is in the far north.','<b>Alaska</b>.'],
 ['usstates','Which is the smallest state by area?','Rhode Island',['Delaware','Connecticut','Vermont'],'It is in New England.','<b>Rhode Island</b>.'],
 ['usstates','Which state is a long peninsula in the Southeast?','Florida',['Ohio','Kansas','Nevada'],'It has water on three sides.','<b>Florida</b>.'],
 ['usstates','Which state is known as the "Lone Star State"?','Texas',['Alaska','Georgia','Maine'],'It has one star on its flag.','<b>Texas</b>.'],
 ['usstates','Mount Rushmore, with the faces of four Presidents, is in which state?','South Dakota',['Colorado','Virginia','New York'],'It is in the Black Hills.','<b>South Dakota</b>.'],
 ['usstates','The Statue of Liberty stands in the harbor of which city?','New York City',['Boston','Miami','Chicago'],'It welcomed immigrants by ship.','<b>New York City</b>.'],
 ['usstates','How many states are in the United States?','50',['48','13','52'],'Count the stars on the flag.','There are <b>50</b> states.'],
 ['usstates','What is a state capital?','the city where the state government meets',['the biggest city in the state','the oldest city in the state','a city by the ocean'],'It is not always the biggest city.','A capital is where <b>the state government meets</b>.'],
 /* Native nations of the regions */
 ['native4','How many nations first joined together to form the Haudenosaunee (Iroquois) Confederacy in the Northeast?','five (a sixth joined later)',['two','twenty','one'],'They made a Great Law of Peace.','<b>Five</b> nations joined first; the Tuscarora became the sixth.'],
 ['native4','Which Southeast nation was forced to leave its homeland on the Trail of Tears in the 1830s?','the Cherokee',['the Inuit','the Hopi','the Tlingit'],'They lived in Georgia and nearby.','The <b>Cherokee</b> were forced west.'],
 ['native4','Plains nations such as the Lakota and Comanche depended on which animal?','the buffalo (bison)',['the salmon','the seal','the camel'],'It gave food, clothing and shelter.','The <b>buffalo</b>.'],
 ['native4','The Hopi and Zuni of the Southwest are known for living in...','pueblos made of adobe or stone',['tipis made of hides','longhouses made of bark','igloos made of snow'],'Desert homes keep cool.','<b>Pueblos</b>.'],
 ['native4','The Navajo (Diné) of the Southwest are known for...','weaving blankets and rugs, and living in hogans',['building totem poles by the ocean','hunting whales','building longhouses'],'A hogan is a round home.','The <b>Navajo</b> are known for weaving and hogans.'],
 ['native4','Native nations of the Pacific Northwest, like the Tlingit and Haida, used tall cedar trees to build...','plank houses, canoes and totem poles',['adobe pueblos','snow houses','stone pyramids'],'Huge forests grew there.','<b>Plank houses, canoes and totem poles</b>.'],
 ['native4','What did the Inuit of Alaska hunt for food and clothing?','seals and whales',['buffalo','alligators','camels'],'They live by the Arctic Ocean.','<b>Seals and whales</b>.'],
 ['native4','Many Eastern Woodland nations lived in wigwams. What were wigwams made of?','bent saplings covered with bark or mats',['sun-dried clay','blocks of snow','buffalo hides only'],'Forests gave the materials.','<b>Saplings and bark</b>.'],
 ['native4','Many Seminole people live in which state today?','Florida',['Alaska','Maine','Montana'],'A warm, swampy state.','The <b>Seminole</b> live in Florida.'],
 ['native4','How did the environment shape the lives of Native nations in each region?','It decided their food, homes and clothing.',['It did not matter.','Everyone lived the same way.','They ordered supplies from far away.'],'Compare the Arctic and the desert.','The environment shaped <b>food, homes and clothing</b>.'],
 ['native4','Many Native nations have their own governments today. What is land set aside for a Native nation often called?','a reservation',['a colony','a capital','a county fair'],'Many nations govern their own land.','A <b>reservation</b>.'],
 ['native4','What did the horse, brought by the Spanish, change for many Plains nations?','It made hunting buffalo and traveling much easier.',['It made them stop hunting.','It replaced farming everywhere.','It brought snow.'],'Faster travel across the plains.','Horses made <b>hunting and travel easier</b>.'],
 ['native4','The Ancestral Puebloans built cliff dwellings at a place now called...','Mesa Verde in Colorado',['the Everglades in Florida','Niagara Falls','the Grand Canyon\'s river only'],'It is a national park.','<b>Mesa Verde</b>.'],
 ['native4','What did the Cahokia people build near today\'s St. Louis?','a large city with huge earth mounds',['a stone castle','a wooden railroad','a lighthouse'],'Monks Mound is the largest.','<b>A city with earth mounds</b>.'],
 /* government and citizenship */
 ['govt4','What are the three levels of government in the United States?','local, state and federal (national)',['city, school and club','mayor, governor and President only','legislative, executive and judicial'],'From your town to the whole country.','<b>Local, state and federal</b>.'],
 ['govt4','What are the three branches of government?','legislative, executive and judicial',['local, state and federal','House, Senate and President','police, fire and schools'],'Make, carry out, and explain laws.','<b>Legislative, executive, judicial</b>.'],
 ['govt4','Which branch makes laws?','the legislative branch',['the executive branch','the judicial branch','the military'],'Congress is part of it.','The <b>legislative branch</b> makes laws.'],
 ['govt4','Which branch carries out (enforces) laws?','the executive branch',['the legislative branch','the judicial branch','the courts'],'The President and governors lead it.','The <b>executive branch</b>.'],
 ['govt4','Which branch decides what laws mean?','the judicial branch',['the executive branch','the legislative branch','the mayor'],'Judges and courts.','The <b>judicial branch</b>.'],
 ['govt4','Who leads a state\'s executive branch?','the governor',['the President','the mayor','the chief justice'],'Every state has one.','The <b>governor</b>.'],
 ['govt4','Who leads the executive branch of the whole country?','the President',['the governor','the mayor','the Speaker'],'Lives in the White House.','The <b>President</b>.'],
 ['govt4','What is the highest law of the United States?','the U.S. Constitution',['a state law','a city rule','the Declaration of Independence'],'Written in 1787.','The <b>Constitution</b>.'],
 ['govt4','Can a state law go against the U.S. Constitution?','No, the Constitution is the highest law.',['Yes, states come first.','Only on holidays.','Only if a mayor agrees.'],'Which is the highest law?','<b>No</b>: the Constitution is supreme.'],
 ['govt4','Why do we have three branches of government?','so no one part gets too much power',['so laws are made faster','so there are more jobs','so the President can do anything'],'Checks and balances.','So <b>no branch gets too much power</b>.'],
 ['govt4','Who makes laws for a city or town?','a city council',['Congress','the Supreme Court','the governor'],'A local group of leaders.','A <b>city council</b>.'],
 ['govt4','What does a state legislature do?','makes laws for the state',['runs the schools in one city','decides court cases','leads the army'],'It is like Congress for a state.','It <b>makes state laws</b>.'],
 ['govt4','What is one responsibility of a citizen?','obeying laws and voting when old enough',['ignoring rules','littering','skipping jury duty forever'],'How do citizens help?','<b>Obeying laws and voting</b>.'],
 ['govt4','What is one right protected by the Bill of Rights?','freedom of speech',['the right to break laws','the right to free toys','the right to skip school'],'The First Amendment.','<b>Freedom of speech</b>.'],
 ['govt4','How does a state pay for roads, schools and parks?','with taxes',['with lemonade stands','with prizes','with money printed by the governor'],'Citizens pay them.','<b>Taxes</b>.'],
 ['govt4','At what age can U.S. citizens vote in national elections?','18',['12','16','30'],'Set by the 26th Amendment.','At <b>18</b>.'],
 /* economy and resources */
 ['econ4','What are natural resources?','things from nature people use, like water, soil, trees and minerals',['things made in factories','money in a bank','computer games'],'They come from the Earth.','<b>Natural resources</b> come from nature.'],
 ['econ4','Which resource is most important for farming in the Midwest?','rich soil',['oil from the ocean floor','snow','sand dunes'],'Crops grow in it.','<b>Rich soil</b>.'],
 ['econ4','Why does the Southeast grow lots of cotton, peanuts and oranges?','It has a long, warm growing season.',['It has the coldest winters.','It has no rain.','It is covered in mountains.'],'Think about climate.','A <b>long, warm growing season</b>.'],
 ['econ4','What is "human capital"?','the skills and knowledge people use to do their jobs',['a capital city','money in a piggy bank','a kind of tractor'],'Learning builds it.','<b>Human capital</b> is people\'s skills and knowledge.'],
 ['econ4','A factory machine that makes cars is an example of...','capital resources (tools and machines)',['natural resources','human capital','a service'],'It is a tool used to make goods.','Machines are <b>capital resources</b>.'],
 ['econ4','Why do regions trade with each other?','Each region makes some goods well and needs goods from others.',['Regions have everything they need.','Trading is against the law.','Only cities trade.'],'Midwest wheat, Southeast oranges.','Regions <b>specialize and trade</b>.'],
 ['econ4','What does it mean to specialize?','to focus on making a few things very well',['to make everything yourself','to stop working','to buy only imported goods'],'Think of a baker or a farmer.','To <b>specialize</b> is to focus on what you do best.'],
 ['econ4','Many people in coastal New England work in fishing. Why?','The ocean nearby has lots of fish.',['There is no ocean there.','Fish grow on trees there.','The law makes everyone fish.'],'Use the nearby resource.','The <b>ocean</b> is a nearby resource.'],
 ['econ4','What is a good?','something you can touch and buy, like a bike',['a haircut','a doctor\'s checkup','a music lesson'],'You can hold it.','A <b>good</b> is a thing you can touch.'],
 ['econ4','What is a service?','work done for others, like teaching or fixing cars',['a toy','a sandwich','a pair of shoes'],'Someone does something for you.','A <b>service</b> is work done for others.'],
 ['econ4','What is a producer?','someone who makes goods or provides services',['someone who only buys things','a kind of map','a natural resource'],'They make or do.','A <b>producer</b> makes goods or services.'],
 ['econ4','What is a consumer?','someone who buys or uses goods and services',['someone who makes goods','a factory','a bank'],'They buy and use.','A <b>consumer</b> buys and uses.'],
 ['econ4','Lena has $10. She can buy a book or a ball, not both. She picks the book. What is the ball for her?','the opportunity cost',['a natural resource','a tax','a service'],'What did she give up?','The thing given up is the <b>opportunity cost</b>.'],
 ['econ4','How does money make trading easier than bartering?','Everyone accepts money, so you don\'t need to find someone who wants your goods.',['Money tastes better.','Bartering is faster.','Money never runs out.'],'Bartering needs a match.','Money is <b>accepted by everyone</b>.']
];

/* lessons for the Common Core social studies islands (shown when a child struggles, like every island's lessons) */
const tagIdxUS=(bank,tag,n=3)=>BANK3[bank].map((it,i)=>it[0]===tag?i:-1).filter(i=>i>=0).slice(0,n);
LESSONS3E.push(
 {id:'us3_geo_maps',gen:'geo3us',isl:'geo',types:[],title:'Reading a map',
  build(){return [
   teachCard('Map tools',`<p>The <b>compass rose</b> shows directions: north, south, east, west.</p><p>The <b>map key</b> tells what the symbols mean.</p><p>The <b>scale</b> tells real distance: if 1 inch = 10 miles, 3 inches = 30 miles.</p>`,'Let\'s try one!'),
   guided(`Which direction is opposite of east?`,strChoices('west',['north','south']),`Look at a compass rose.`,`East and <b>west</b> are opposites.`),
   guided(`1 inch = 5 miles. How far are towns 2 inches apart?`,strChoices('10 miles',['2 miles','7 miles']),`2 × 5`,`2 × 5 = <b>10 miles</b>.`)]},
  get practice(){return tagIdxUS('geo3us','maps')}},
 {id:'us3_hist_native',gen:'history3us',isl:'history',types:[],title:'Native peoples and their homes',
  build(){return [
   teachCard('Homes from the land',`<p>Long before Europeans came, <b>many Native nations</b> lived all over North America.</p><p>Each nation used what was nearby: <b>tipis</b> of poles and buffalo hides on the Plains, <b>longhouses</b> of wood and bark in the Northeast, <b>adobe pueblos</b> in the dry Southwest.</p><p>Hundreds of Native nations live in the United States <b>today</b>.</p>`,'Let\'s try one!'),
   guided(`Which home could Plains nations pack up to follow the buffalo?`,strChoices('a tipi',['a longhouse','an adobe pueblo']),`It is made of poles and hides.`,`A <b>tipi</b> can be moved.`),
   guided(`Why were homes different in different places?`,strChoices('People used the materials found where they lived.',['Everyone copied one picture.','Homes came from stores.']),`Forests, deserts, plains...`,`They used <b>nearby materials</b>.`)]},
  get practice(){return tagIdxUS('history3us','nativeus')}}
);
LESSONS5E.push(
 {id:'us4_regions',gen:'us4',isl:'history',types:[],title:'Five regions of the United States',
  build(){return [
   teachCard('Our five regions',`<p>The United States is often split into <b>five regions</b>:</p><p><b>Northeast</b> (old cities, cold winters), <b>Southeast</b> (warm and wet, long coasts), <b>Midwest</b> (flat farmland, the Great Lakes), <b>Southwest</b> (deserts and canyons), <b>West</b> (the Rocky Mountains and the Pacific coast).</p><p>Land and climate shape the <b>homes, crops and jobs</b> in each region.</p>`,'Let\'s try one!'),
   guided(`Which region is famous for flat farmland and the Great Lakes?`,strChoices('the Midwest',['the Southwest','the Northeast']),`It is in the middle of the country.`,`The <b>Midwest</b>.`),
   guided(`Which region has deserts and the Grand Canyon?`,strChoices('the Southwest',['the Southeast','the Midwest']),`Hot and dry.`,`The <b>Southwest</b>.`)]},
  get practice(){return tagIdxUS('us4','regions')}},
 {id:'us4_geo_compass',gen:'geous',isl:'geo',types:[],title:'Directions on a map',
  build(){return [
   teachCard('The compass rose',`<p><b>North</b> is usually at the top of a map, <b>south</b> at the bottom, <b>east</b> on the right and <b>west</b> on the left.</p><p>In between are <b>northeast, southeast, southwest and northwest</b>. North or south always comes first.</p><p>Remember: <b>N</b>ever <b>E</b>at <b>S</b>oggy <b>W</b>affles, going clockwise.</p>`,'Let\'s try one!'),
   guided(`Which direction is halfway between south and west?`,strChoices('southwest',['westsouth','northeast']),`South comes first.`,`<b>Southwest</b>.`),
   guided(`On most maps, which direction is on the right?`,strChoices('east',['west','north']),`Never Eat Soggy Waffles, clockwise from the top.`,`<b>East</b> is on the right.`)]},
  practice:[0,2,1]}
);

BANK3.us4.push(
 ['native4','The Lakota, Cheyenne and Comanche lived in which region?','the Great Plains',['the Arctic','the Pacific coast','the Florida swamps'],'Wide grasslands with buffalo.','They lived on the <b>Great Plains</b>.'],
 ['native4','Why did Pacific Northwest nations not need to farm as much as some other nations?','Rivers and the ocean gave plenty of salmon and other food.',['They had no land.','Farming was against their rules.','It never rained there.'],'Think of salmon runs.','Rich <b>rivers and ocean</b> gave plenty of food.'],
 ['native4','What did Eastern Woodland nations make from the bark of birch trees?','canoes and containers',['adobe bricks','igloos','metal tools'],'Light and waterproof.','Birch bark made <b>canoes and containers</b>.'],
 ['native4','The Great Law of Peace united the Haudenosaunee nations. What did it set up?','a council where the nations made decisions together',['a single king for all nations','a railroad between villages','a gold mine'],'Leaders met and agreed.','A <b>council</b> made shared decisions.'],
 ['native4','Many Native nations hold powwows today. What is a powwow?','a gathering with dancing, singing and drums to celebrate culture',['a kind of canoe','a winter house','a trading coin'],'Families come together.','A <b>powwow</b> celebrates Native culture.'],
 ['native4','Desert nations like the Tohono O\'odham found water and food in a dry land. What is one way they did it?','They harvested desert plants like saguaro cactus fruit.',['They fished in the ocean every day.','They hunted seals.','They grew rice in swamps.'],'Use what the desert gives.','They harvested <b>desert plants</b> like saguaro fruit.'],
 ['econ4','Why does the West have many lumber (wood) businesses?','It has large forests.',['It has no trees.','Wood is imported from the moon.','Forests grow only in deserts.'],'Use the nearby resource.','Large <b>forests</b>.'],
 ['econ4','Oil and natural gas are important resources in which kind of place?','where they are found underground, like Texas and Alaska',['only in big cities','only in the ocean surface','nowhere in the U.S.'],'They are found under the ground.','They come from <b>underground deposits</b>.'],
 ['econ4','What is an export?','a good sold to another state or country',['a good bought from another country','a kind of tax','a map'],'Ex- means out.','An <b>export</b> goes out to be sold elsewhere.'],
 ['econ4','What is an import?','a good bought from another state or country',['a good sold to another country','a natural resource at home','a service'],'Im- means in.','An <b>import</b> comes in from elsewhere.'],
 ['econ4','A farm in the Midwest grows wheat and sells it to a bakery in the Northeast. What does this show?','Regions depend on each other.',['Regions never trade.','Wheat grows only in cities.','Bakeries grow wheat.'],'Who needs whom?','Regions are <b>interdependent</b>.'],
 ['econ4','Why do people save money in a bank?','to keep it safe and use it later',['to make it disappear','to pay more taxes','to give it to strangers'],'Saving is for later.','To keep it <b>safe for later</b>.']
);
