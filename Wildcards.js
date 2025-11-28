/*
	WILDCARD COST STRUCTURE

	GOAL: 100+ cards
	
		20 Common, 30 Uncommon, 25 Rare, 15 Epic, 10 Myth

	CatWords1: Red, Pirate, Plants, Food, Music, Red, Sports
	CatWords2: Animals, Farm, Island, School, Yellow, Green, Blue, Numbers
	CatWords3: Bible, Birds, Cards, Colors, Fish, Auto, Medical,
	CatWords4: Bugs, Mythos, Stones, Fruit
*/

const IconCoin = '&#128192'; // coin
const IconPlus = '*'; //'(+)'; // Plus = &#x2795 but '+' looks better?
const IconStar = '&#x2B50'; // star
const IconGift = '&#x1F381'; // package = sell for coins
const IconGear = '&#x2699';
const IconLock = '&#x1F512';
const IconDiscard = '&#x1F53D'; // down arrow vs eject button?
const IconInfinity = '&#x1F4CC'; // push pin look better than '&#x267E' infinity?
const IconBlank = '&#x1F7E6'; // better than Free '&#x1F193'
const IconTicket = '&#x1F3AB';
const IconMedal1 = '&#x1F947';
const IconMedal2 = '&#x1F948';
const IconMedal3 = '&#x1F949';
const IconPencil = '&#x270F'; // looks like a white dash with tip
const IconQuarter = '&frac14';
const Icon8x = '&#127921';
const Icon16x = '&#x2B50';
const IconAdd = '&#x1F540'; // circle cross = add to score
const IconSilver = '&#x1F4BF;';
//const IconQuarter = IconSilver;
const IconPushPin = '&#128204';
const IconWipe = '&#x1F539'; // blue diamond
const IconHammer = '&#128296';
const IconCross = '&#128322'; // cross no circle is White?
const IconExpo = '&#x1F53A';

const IconYield = '&#x26D4'; // red circle slash -- single use or disposable

// Wildcard sets or categories built as post-process
let Words1 = [];
let Words2 = [];
let Words3 = [];
let Words4 = [];
let Words5 = [];
let WordCardTable = [Words1,Words2,Words3,Words4,Words5];

const ColorMulti = '#6060C0';
const ColorMultiNormal = '#8080C0'; // aka ColorMulti?
const ColorYellowRare = '#E0E060';
const ColorTiers = '#E0A0E0';

const ANIMALS = "AARDVARK|ADDER|ANACONDA|ANOLE|ANTEATER|ANTELOPE|APE|ASP"
	+"|BABOON|BADGER|BAT|BEAGLE|BEAR|BISON|BOA|BOAR|BUFFALO|BUNNY"
	+"|CALF|CAMEL|CARIBOU|CATTLE|CHIPMUNK|CLAM|COBRA|COLT|COON|CORAL|COW|CRAB|CROC"
	+"|DEER|DINGO|DOE|DOG|DONKEY|ELEPHANT|ELK|EWE|FAWN|FERRET|FOAL|FOX|FROG"
	+"|GATOR|GAZELLE|GECKO|GERBIL|GIBBON|GNU|GOAT|GOPHER|GORILLA"
	+"|HARE|HART|HIPPO|HOG|HOUND|HUMAN|HUSKY|HYENA"
	+"|IBEX|IBIS|IGUANA|JACKAL|KANGAROO|KOALA"
	+"|LAMB|LEECH|LEMUR|LIZARD|LLAMA|LOBSTER"
	+"|MAMBA|MAMMAL|MAN|MICE|MINK|MOLE|MOLLUSK|MONKEY|MOOSE|MOUSE|MUSSEL|MUSKRAT"
	+"|NEWT|NUTRIA"
	+"|OTTER|OYSTER|OX|OXEN|PANDA|PIG|PONY|PRIMATE"
	+"|RABBIT|RAM|RAT|REPTILE|RINGTAIL|RHINO|RODENT|RUNT"
	+"|SANDWORM|SEAL|SERPENT|SHEEP|SHREW|SKINK|SKUNK|SLOTH|SLUG"
	+"|SNAIL|SNAKE|STAG|STALLION|STEED|STEER|SQUIRREL"
	+"|TOAD|TORTOISE|TURTLE|VIPER|WALRUS|WEASEL|WOLF|WORM|YAK";
	
const BIRDS = "BIRD|BLUEJAY|BLUEBIRD|BUZZARD"
	+"|CANARY|CARDINAL|CHICKEN|CONDOR|COOT|CRANE|CROW|CUCKOO"
	+"|DODO|DOVE|DUCK|EAGLE|EGRET|EMU|FALCON|FINCH|FLAMINGO"
	+"|GANDER|GEESE|GOOSE|GOSLING|GREBE|GROUSE|GULL"
	+"|HAWK|HEN|HERON|HUMMING|IBIS|JAY|KIWI"
	+"|LARK|LOON|LORY|MACAW|MAGPIE|MALLARD|MARTIN|MOCKING|NUTHATCH"
	+"|ORIOLE|OSPREY|OSTRICH|OWL"
	+"|PARAKEET|PARROT|PEACOCK|PECKER|PELICAN|PENGUIN|PHEASANT|PHOENIX|PIGEON|PLOVER|PUFFIN"
	+"|QUAIL|RAVEN|RAPTOR|ROBIN|ROOK|ROOSTER"
	+"|SEAGULL|SONGBIRD|SPARROW|SQUAB|STARLING|STORK|SWALLOW|SWAN|SWIFT"
	+"|TERN|TURKEY|VULTURE|WARBLER|WREN";

const BLUES = "ANGEL|AQUA|AZURE|BABY|BAYOU|BELL|BERRY|BIRD|BLOOD|BONNET|BOTTLE|BROTHER"
	+"|CHEESE|COBALT|COOL|CRUSH|CYAN|DENIM|EYE|FIN|FISH|FLAME"
	+"|GLACIER|GRASS|HAIR|ICE|ICEBERG|INDIGO|INK|JAY|JAZZ|JEAN"
	+"|LAGOON|LINE|MAN|MOON|NAVY|NOTE|OCEAN|OX|POWDER|PRINT|RIBBON|ROYAL"
	+"|SAD|SAPPHIRE|SEA|SKY|SPRUCE|STEEL|TEAL|TOOTH|TUNA"
	+"|VELVET|WATER|WAVE|WHALE|WILD|YONDER";

const BUGS = "ANT|ANTLION|APHID|ARACHNID|BED|BEE|BEETLE|BUG|BUNNY"
	+"|CICADA|CRICKET|EARWIG|FIREFLY|FLEA|FLY"
	+"|GADFLY|GNAT|GRUB|HOPPER|HORNET|HORSEFLY"
	+"|LADY|LADYBUG|LARVA|LARVAE|LICE|LOCUST|LOUSE|MAGGOT|MANTIS|MIDGE|MITE|MOSQUITO|MOTH"
	+"|NYMPH|PUPA|ROACH|SCORPION|SPIDER|STICK|STINK|STRIDER"
	+"|TERMITE|TICK|WASP|WATER|WEEVIL|WORM";

const CATS = "BOBCAT|CAT|CHEETAH|COUGAR|FELINE|JAGUAR"
	+"|KITTEN|KITTY|LEOPARD|LION|LYNX|OCELOT|PANTHER|PUMA|SIAMESE|TIGER";

const COLORS = "AMBER|BEIGE|BLACK|BLUE|BRICK|BROWN|BRONZE"
	+"|COPPER|CORAL|CRIMSON|CYAN|EBONY|GOLD|GRAY|GREEN|GREY|HAZEL"
	+"|INDIGO|IVORY|JADE|LAVENDER|LIME|MAGENTA|MAROON|MAUVE|MOSS"
	+"|OCHER|OCHRE|OLIVE|ORANGE|PEARL|PINK|PUCE|PURPLE|RED|ROSE"
	+"|SABLE|SEPIA|SILVER|SLATE|SORREL|TAN|TAUPE|TEAL|VIOLET|WHITE|YELLOW";

// NOTE: These also have to qualify as food?	
const FISHES = "ANCHOVY|BASS|BELUGA|BETTA|BLOWFISH|BONEFISH"
	+"|CARP|CATFISH|CLOWN|COD|CRAPPIE|CRAWFISH|CRAYFISH|CUTTLE"
	+"|DOGFISH|DOLPHIN|EEL|FISH|FLOUNDER|FLUKE"
	+"|GAR|GOLDFISH|GROUPER|GUPPY|HADDOCK|HERRING|JACK|KOI|LIONFISH"
	+"|MACKEREL|MAKO|MANTA|MARLIN|MINNOW|MOLLY|NEON"
	+"|OCTOPUS|ORCA|PARROT|PERCH|PIKE|PIRANHA|POLLOCK|PORPOISE|PRAWN|PUFFER|RAY"
	+"|SALMON|SARDINE|SEAHORSE|SHARK|SHRIMP|SMELT|SNAPPER|SNOOK|SOCKEYE|SQUID"
	+"|STAR|STARFISH|STINGRAY|STURGEON|SWORD"
	+"|TARPON|TETRA|TROUT|TUNA|WHALE";

const DRINKS = "BEVERAGE|CIDER|JUICE|MILK|SODA|WATER|WINE";
	
const FOODS = "ALFALFA|AREPA|BACON|BAGEL|BAGUETTE|BEAN|BEEF|BEER|BEET|BISCUIT"
	+"|BRAT|BREAD|BRIE|BRISKET|BROCOLI|BUN|BURGER|BURRITO|BUTTER"
	+"|CABBAGE|CAKE|CALAMARI|CALZONE|CANDY|CARAMEL|CAROB|CARROT|CAVIAR|CELERY|CEREAL"
	+"|CHEDDAR|CHEESE|CHICKEN|CHIP|CHIVE|CHOWDER|COCONUT|COOKIE|CORN"
	+"|CRAB|CREAM|CREME|CREPE|CROUTON|CRUMPET|CURRY|CUSTARD"
	+"|DAIRY|DATE|DELI|DIET|DINNER|DONUT|DUCK|EGG|EMPANADA|ESCARGOT"
	+"|FAJITA|FILET|FISH|FLAN|FRIES|FRUIT|FUDGE"
	+"|GARLIC|GEESE|GOAT|GOOSE|GRAIN|GRAVY|GREEN|GRITS|GYRO"
	+"|HAM|HOAGIE|HOG|HEART|HERB|HOTDOG"
	+"|JAM|JELLY|JUICE|KABOB|KALE|KIMCHI|KIPPER"
	+"|LAMB|LEEK|LETTUCE|LICORICE|LIVER|LOX|LUNCH"
	+"|MACARONI|MANNA|MARINARA|MATZA|MEAT|MEATBALL|MILK|MINT|MUSHROOM|MUSTARD|MUTTON"
	+"|NACHO|NOODLE|NORI|NUGGET|NUT|OAT|OATMEAL|OMELETTE|ONION|ORGANIC|OVEN"
	+"|PANCAKE|PANINI|PASTA|PEA|PENNE|PEPPER|PESTO|PICKLE|PIE|PIG|PITA|PIZZA|POPCORN|PORK|POTATO|POULTRY|PUDDING"
	+"|QUICHE|QUINOA|RABBIT|RADISH|RAISIN|RAMEN|RAVIOLI|RAW|RIB|RICE|ROAST|ROE|RYE"
	+"|SALAD|SANDWICH|SAUCE|SAUSAGE|SCALLION|SCONE|SEAFOOD|SEAWEED|SESAME"
	+"|SHAKE|SHERBET|SIRLOIN|SLAW|SMOOTHIE|SNACK|SNAIL|SOLE|SOUP|SOYBEAN|SPAM|SPINACH|SPUD|STEAK|STEW|STRUDEL|SUSHI"
	+"|TACO|TART|TASTE|TEA|TOAST|TOFU|TAMALE|TOMATO|TORTA|TORTILLA|TRIPE"
	+"|VEAL|VEGEMITE|VEGGIE|VENISON|VICTUAL|WAFFLE|WIENER|WINE|WING|WURST"
	+"|YAM|YEAST|YOGURT|YOLK|ZITI";
	
const FRUITS = "ALAMO|APPLE|APRICOT|AVOCADO|BANANA|BEET|BERRY|CHERRY|CITRON|COCONUT|CORN"
	+"|CURRANT|CUCUMBER|CUKE|DATE|DRAGON|DURIAN|FIG|GRAPE|GUAVA|HONEYDEW"
	+"|KIWI|LEMON|LENTIL|LIME|LYCHEE|MANGO|MANDARIN|MELON|OLIVE|ORANGE"
	+"|PAPAYA|PASSION|PEA|PEACH|PEANUT|PEAR|PEPPER|PINOT|PLANTAIN|PLUM|PRUNE|PUMPKIN"
	+"|POMMELO|RAISIN|SEED|SQUASH|STAR|SUGAR|SWEET|TANGELO|TOMATO|ZUCCHINI";

const GREENS = "ALGAE|APPLE|ARMY|AVOCADO|BANANA|BAY|BEAN|BROCCOLI|CARD|CELERY|CLOVER"
	+"|DAY|EGG|EMERALD|ENERGY|ENVY|EVER|EYE|FERN|FOREST|FROG|GOBLIN|GOLF|GRASS|GREEN|HERON|HOLLY|HORNET|HUNTER"
	+"|IVY|JADE|JUNGLE|KALE|KELLY|KELP|LAND|LANTERN|LAWN|LEAF|LETTUCE|LIGHT|LIME|LINE|LIZARD"
	+"|MEAN|MILE|MINT|MONEY|MOSS|NEON|OLIVE|ONION|PARSLEY|PEA|PEAR|PEPPER|PICKLE|PINE|PLANT|PUTT|ROOM"
	+"|SAGE|SALAD|SCALLION|SCREEN|SEA|SHAMROCK|SNAKE|SPINACH|TEA|THUMB|TOAD|TOMATO|TREE|TURTLE|VINE|WIRE|ZONE";

const HOLIDAYS = "BELL|BUNNY|CANDY|CARD|CAROL|DATE|ELF|EGG|FAMILY|FEAST|FESTIVE"
	+"|GIFT|HOLIDAY|JOLLY|JOY|LIGHT|LOVE|MUSIC|PARTY|PEACE|PUMPKIN|SEASON|STAR|STOCKING"
	+"|TOAST|TRAVEL|TREE|TURKEY|YEAR";
	
const MONSTERS = "BANSHEE|BEAST|BEHEMOTH|BIGFOOT"
	+"|CENTAUR|CHIMERA|CREATURE|CYCLOPS"
	+"|DEMON|DEVIL|DJINN|DRAGON|DRUID|DRYAD|DWARF"
	+"|ELF|FAERIE|FAIRY|FATE|FAY|FEY|FIEND|FURY|GOLEM|GORGON"
	+"|GARGOYLE|GIANT|GENIE|GHAST|GHOST|GHOUL|GOBLIN|GRIFFIN|GRYPHON"
	+"|HARPY|HOBBIT|HYDRA|IMP|KRAKEN|LICH"
	+"|MAMMOTH|MEDUSA|MERMAID|MERMAN|MONSTER|MUMMY|NYMPH|OGRE|ORC|PHOENIX|PIXIE|REAPER"
	+"|SATYR|SERPENT|SIREN|SKELETON|SPHINX|SPRITE|TITAN|TROLL|UNICORN|WARLOCK|WEREWOLF"
	+"|WISP|WITCH|WIZARD|WRAITH|WYVERN|VAMPIRE|YETI|ZOMBIE";

const MYTHS = "ABYSS|ALCHEMY|ALIEN|ANCIENT|ANGEL|ARCANE|ARK|BARD"
	+"|CHALICE|CROWN|CRYPT|CUPID|CURSE|DEMIGOD|DESTINY|DUNGEON|ENCHANT|ETERNAL"
	+"|FABLE|FEAST|FLEECE|FORTUNE|FOUNT|FOUNTAIN|GOD|GRAIL|GUARDIAN"
	+"|HAUNT|HEAL|HEAVEN|HERO|HEX|JOURNEY|LAIR|LEGEND|LEGION|LORE|LUCK"
	+"|MAGE|MAGIC|MASON|MAZE|MIRAGE|MUSE|MYSTERY|MYSTIC|MYTH|MYTHIC|MYTHICAL|MYTHOS"
	+"|OBELISK|ODYSSEY|OMEN|PORTAL|PRINCE|PYRAMID|QUEST|RELIC|RING|RUNE"
	+"|SACRED|SCARAB|SCROLL|SCRY|SEANCE|SEER|SIGIL|SORCERY"
	+"|SPARTAN|SPELL|SPIRIT|STATUE|STORY|SWORD"
	+"|TALE|TAROT|TEMPLE|TOMB|TOME|UNDEAD"
	+"|VALOR|VOODOO|VOYAGE|WISDOM|WISH|YORE|ZODIAC";

const NUMBERS = "ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN"
	+"|ELEVEN|TWELVE|THIRTEEN|FOURTEEN|FIFTEEN|SIXTEEN|EIGHTEEN|NINETEEN"
	+"|FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH"
	+"|TWENTY|THIRTY|FORTY|FIFTY|SIXTY|SEVENTY|EIGHTY|NINETY"
	+"|HUNDRED|MILLION|THOUSAND|ZERO";
	
const PLANTS = "AGAVE|ASH|BAMBOO|BANANA|BASIL|BEAN|BERRY|BIRCH|BLOOM|BUD|BUSH"
	+"|CABBAGE|CACTUS|CARROT|CANE|CEDAR|CELERY|CHIVE|CLOVER|COCONUT|CORK|CORN|COTTON|CUCUMBER|CYPRESS"
	+"|DAISY|DAFFODIL|ELM|FARM|FERN|FIR|FLOWER|FOREST|FRUIT|GARDEN|GARLIC|GRASS"
	+"|HAY|HEDGE|HEMP|IVY|JUNGLE|JUNIPER|KALE|KELP"
	+"|LEAF|LETTUCE|LILY|LOTUS|MAPLE|MARIGOLD|MILKWEED|MINT|MOSS|OAK|OAT|OLIVE|ONION|ORCHID"
	+"|PALM|PANSY|PARSLEY|PEA|PEANUT|PEPPER|PETUNIA|PINE|POPLAR|POTATO|POWER|PRIMROSE|PUMPKIN"
	+"|RADISH|REED|RICE|ROOT|ROSE|RYE|SAGE|SAPLING|SEAWEED|SEED|SHAMROCK|SHRUB|SPINACH|SPROUT|SPRUCE|SQUASH"
	+"|TEA|TOBACCO|TOMATO|TREE|TULIP|TURNIP|VINE|VIOLET|WEED|WHEAT|WILLOW|YAM|YAUPON";
	
const REDS = "ALERT|APPLE|ARMY|BALLOON|BARN|BEAN|BEARD|BEET|BERRY|BIG|BIRD|BLOOD|BRICK"
	+"|CAKE|CAPE|CAR|CARDINAL|CENT|CLAY|COAT|CODE|COLOR|CRIMSON|CROSS"
	+"|DEVIL|DOG|DOOR|DOT|DRAGON|DRESS|DYE|EYE|FAST|FIRE|FISH|FLAG|FLAME|FOX"
	+"|GEM|GRAPE|HAIR|HAT|HEAD|HEART|HERRING|HOOD|HOT"
	+"|LEAF|LETTER|LIGHT|LINE|LIP|MAPLE|MARS|MEAT|NOSE"
	+"|PAINT|PEAR|PEPPER|PILL|PLANET|QUEEN|RED|RIPE|ROBIN|ROCK|ROOM|ROSE|ROVER|RUBY|RUST"
	+"|SAUCE|SCARLET|SEA|SHOE|STAR|STOP|SQUARE"
	+"|TAPE|TEAM|TIDE|TOMATO|VELVET|WAGON|WINE|WIRE|WOOD|ZONE";

const SPORTS = "ARCHERY|ARENA|ATHLETE|ATHLETIC|AWARD"
	+"|BALL|BAND|BASE|BASEBALL|BASKET|BAT|BENCH|BET|BIKE|BLOCK|BLOOD|BOUNCE|BOWL|BOWLING|BRACKET"
	+"|CADDY|CAP|CAPTAIN|CAR|CAST|CHAMPION|CHANT|CHEER|COAT|CLEAT|CLINCH|CLOCK|CLUB|COACH|COURT|CRICKET|CUP"
	+"|DART|DASH|DEFEAT|DEFEND|DELAY|DISCUS|DIVE|DIVISION|DODGE|DRINK|DUGOUT|ERROR|EVENT|EXERCISE"
	+"|FAME|FAN|FAST|FIELD|FIRST|FITNESS|FISH|FLAG|FLAGRANT|FOOT|FOOTBALL|FORFEIT|FOUL"
	+"|GAME|GEAR|GOAL|GOLF|GLOVE|GREEN|GRIDIRON|GUM|GYM"
	+"|HALFTIME|HELMET|HIT|HOCKEY|HOOP|HUNT|INFLATE|INJURY|INNING"
	+"|JAVELIN|JERSEY|JOCK|JOG|JOUST|JUMP|KICK"
	+"|LAP|LEAGUE|LEAP|LEARN|LETTER|LINE|LOCKER|LOSE|LOSER|LOSS"
	+"|MASCOT|MATCH|MEDICINE|MEET|NET|OFFICIAL|OWNER"
	+"|PACE|PAD|PADDLE|PAIN|PARK|PASS|PING|PITCH|PLAY|PLAYER|PODIUM|POINT|POLO|PONG|PRACTICE|PUCK|PUTT"
	+"|RACE|RACKET|RACQUET|RADIO|RALLY|RANK|REBOUND|REF|REFEREE|RING|RIVAL|RIVALRY|ROSTER|ROUND|RUGBY|RULE|RUN"
	+"|SCORE|SCOUT|SCRUM|SEED|SERIES|SERVE|SET|SHOE|SIDE|SIDELINE|SKATE|SKI|SNAP|SOCCER|SOFTBALL|SPIKE|SPIN|SPIT"
	+"|SPEED|SPRAIN|SPRINT|SQUASH|STADIUM|STAR|STEAL|STRIKE|SURF|SWIM|SWING"
	+"|TACKLE|TAILGATE|TALENT|TEAM|TENNIS|THROW|TIE|TIME|TITLE|TOSS|TOURNEY|TRACK|TRAIN|TROPHY|TRYOUT"
	+"|UMPIRE|UPSET|VARSITY|VAULT|VICTORY|VOLLEY|WEAR|WHISTLE|WIN|WINNER|WINTER|WORKOUT|YARD|ZONE";

const STONES = "CARAT|CLARITY|COLOR|CORNER|CUT"
	+"|AGATE|AMBER|AMETHYST|AMULET|AQUA|ASTEROID"
	+"|BEDROCK|BERYL|BOULDER|BRICK|BRIM|BROWN"
	+"|CAIRN|CHALK|COAL|COBBLE|COMET|COPPER|CORAL|CRYSTAL|DIAMOND|EMERALD|FACET|FIRE|FLINT"
	+"|GALL|GARNET|GEM|GEMSTONE|GEODE|GLINT|GOLD|GRANITE|GRAVEL|GYPSUM|HAIL|HEARTH|HOPE"
	+"|INGOT|IRON|JADE|JASPER|JEWEL|KEY|KIDNEY|LAVA|LIME|LODE"
	+"|MARBLE|MICK|MINERAL|MOOD|MOON|NUGGET|ONYX|OPAL|ORE"
	+"|PEARL|PLATINUM|PUMICE|PYRITE|QUARTZ|RING|RIVER|ROCK|RUBY|RUNE"
	+"|SAND|SAPPHIRE|SHALE|SILICA|SILVER|SLATE|TOMB|TOPAZ|TOUCH|WHET";
	
const YELLOWS = "AMBER|ARCH|BANANA|BEARD|BEE|BELLY|BIRD|BLONDE|BRICK|BUS|BUTTER"
	+"|CAB|CAKE|CAMEL|CANARY|CARD|CAT|CAUTION|CHEESE|CHICK|CORN|CRAYON"
	+"|DAFFODIL|DAISY|DOLE|DUCK|DYE|FEVER|FIN|FIRE|FLAME|GLOW|GOLD|GOURD|GRAIN|HAIR|HAY|HONEY"
	+"|JACKET|LEAF|LEMON|LIGHT|LILY|LINE|LION|MANGO|MARIGOLD|MOON|MUSTARD|OCHRE|ONION"
	+"|PAGE|PEAR|PEE|PENCIL|PEPPER|PINE|PLANTAIN|RIBBON|RIPE|RIVER|ROSE"
	+"|SAND|SNOW|SQUASH|STAIN|STAR|STONE|SUB|SULFUR|SUN"
	+"|TAXI|TULIP|TUNA|URINE|WHEAT|YOLK";	

const TemplateWords =
{
	bonus: 1,
	limit: 5,
	unique: true,
	//action: {icon:'&#x1F525'},
	ui: {upgrade:true, show_words:true,},
	shop: {reqs:{once:true}},
	audio: { buy:'Buy', sell:'Sell' }
};

const TemplateMult =
{
	action: { icon:'&#x23EA' },	
	buy: { upgrade:true }, // this can be used to upgrade/enhance other cards
	log: { disable:true },
	shop: { reqs:{duplicates:true} }, // override default Unique requirement
};

const TemplateBaseGear = 
{
	weight: 5, // Increase probability for cards that support all styles
};

// The first shop is L=2, L=3, L=4, etc.
const ShopLevel3 = { shop: {reqs:{level:4}} };
const ShopLevel4 = { shop: {reqs:{level:5}} };
const ShopLevel5 = { shop: {reqs:{level:6}} };

// TODO: try to View some greens before blues in shop?
const CatWords1 = { multi: 2, category:Words1, swap:Words2, cost: 1, prize:{coin:1}, upgrade:{discard:2},
	corner: IconSilver,
	shop: {row:2}, OnLimit:{ prize:{ quarter:1 }}  };
const CatWords2 = { multi: 5, category:Words2, swap:Words3, cost: 6, prize:{coin:2}, upgrade:{discard:3},
	corner: IconSilver,
	shop: {row:2,reqs:{level:2}}, OnLimit:{ prize:{ quarter:1 }}  };
const CatWords3 = { multi: 8, category:Words3, swap:Words4, cost:10, prize:{coin:4}, upgrade:{discard:4},
	OnLimit:{ prize:{ quarter:2 }},
	shop: {row:3,reqs:{once:true,level:6}},
};
const CatWords4 = { multi:12, category:Words4, swap:Words5, cost:15, prize:{coin:5}, upgrade:{discard:5},
	OnLimit:{ prize:{ quarter:3 }},
	shop: {row:3,reqs:{once:true,level:9}},
};

const TemplateAdds =
{
	name:"Score +{score}", desc:"Add +{score} points to score.",
	emoji: '&#x1F540', // cross
	action: { icon:'&#x23EA' },	
	color: '#C4B0A0',
	buy: { upgrade:true }, // this can be used to upgrade/enhance other cards
	log: { disable:true },
	shop: { reqs:{duplicates:true} }, // override default Unique requirement
};

// TODO: Distinguish Mul vs Add rewards -- Words?
const Wild_SCORE_2 =
{
	CLASS: AddCard, cost:2,//4,
	score: 2,
	templates: [ TemplateAdds ],
	weight: 2,
};

const Wild_SCORE_4 =
{
	CLASS: AddCard,	cost:8,
	score: 4,
	templates: [ TemplateAdds ],
	shop: {reqs:{ view: Wild_SCORE_2 }},
	weight: 1,
};

const Wild_SCORE_8 =
{
	CLASS: AddCard,	cost:16,
	score: 8,
	templates: [ TemplateAdds ],
	shop: {reqs:{ view: Wild_SCORE_4 }},
	weight: 1,
};

const Wild_SCORE_16 =
{
	CLASS: AddCard,	cost:40,
	score: 16,
	templates: [ TemplateAdds ],
	shop:
	{
		reqs: { view: Wild_SCORE_8 }
	},
	weight: 1,
};

const TemplateExpo =
{
	name:"Expo +{expo}", desc:"Add +{expo} to exponent.",
	emoji: '&#x1F53A', // up-arrow
	action: { icon:IconPushPin },
	color: '#C4B0A0',
	buy: { upgrade:true }, // this can be used to upgrade/enhance other cards
	log: { disable:true },
	// only buy once to limit accumulation
	shop: { reqs:{once:true,duplicates:true} }, // override default Unique requirement
};

// Exponent => (Score)*(Multi)^(Expo)
const Wild_EXP_1 =
{
	CLASS: ExpoCard, cost:40,
	expo: 1,
	templates: [ TemplateExpo ],
	weight: 1,
};

// TODO: if you try to BUY and hand is full it fails?
// but if you have a Quarter-stack it needs to succeed
const Wild_SLOT_Quarter =
{
	CLASS: QuarterCard,
	name: 'Quarter', cost: 5,//8?
	desc: 'Collect coins for special shopping.',
	emoji: IconSilver,
	action: { icon:IconPushPin },
	buy: { upgrade:true }, // coins go directly into inventory w/o wildcard slot
	//shop:{reqs:{duplicates:true,level:4}},
	weight: 3,
};
const Wild_Quarter = Wild_SLOT_Quarter;

//-----------------------------------------------------------------------------
// Common (White) Cost=1-2
//-----------------------------------------------------------------------------

const Wild_LTR_A1 =
{
	CLASS: LetterCard,
	name: 'A+',	desc: 'Play [A] tiles for 4 points', cost: 2,
	emoji: '&#x1F4CB',
	letter_score: { clamp: 4 }, // fixed letter score
	letters: 'A',
	ie: 'AREA|DATA|BANANA|GALA|SALAD',
	log: {disable:true},
	weight: 1,
};

const Wild_LTR_E1 =
{
	CLASS: LetterCard,
	name: 'E+',	desc: 'Play [E] tiles for 4 points', cost: 2,
	emoji: '&#x1F453',
	letter_score: { add:3 }, // 1 => 4 with Upgrade support
	letters: 'E',
	ie: 'EEL|FREE|HERE|NEVER|ZEE',
	log: {disable:true},
	weight: 1,
};

const Wild_LTR_I1 =
{
	CLASS: LetterCard,
	name: 'I+',	desc: 'Play I tiles for 4 points', cost: 1,
	emoji: '&#x1F366', // icecream
	corner: IconCoin,
	letter_score: { clamp: 4 }, // fixed letter score
	letters: 'I',
	ie: 'CIVIC|DIGIT|ICE|MINI|ZIP',
	prize: {coin:1},
	log: {disable:true},
	weight: 1,
};

const Wild_LTR_R1 =
{
	CLASS: LetterCard,
	name:'ARR!', desc:'Play R tiles for 4 points.', cost:1,
	icon: 'Flag',
	emoji: '&#x2693;',
	letter_score: { clamp: 4}, // fixed letter score
	letters: 'R',
	ie: 'RUM|ROAR|RURAL|ARK|ARRIVE',
	shop:{reqs:{block:[]}}, // post-modify
	log: {disable:true},
	weight: 1,
};

const Wild_LTR_S1 =
{
	CLASS: LetterCard,
	name: 'S+',	desc: 'Play [S] tiles for 4 points [+Coin]', cost: 1,
	emoji: '&#x1F577',
	corner: IconCoin,
	letter_score: { clamp: 4 }, // fixed letter score
	letters: 'S',
	ie: 'ASSET|BASS|SISTER|TOSS|YES',
	prize: {coin:1},
	log: {disable:true},
	weight: 1,
};

const Wild_LTR_T1 =
{
	CLASS: LetterCard,
	name: 'T+',	desc: 'Play [T] tiles for 4 points [+Discard]', cost: 1,
	emoji: '&#x1F345',
	corner: IconDiscard,
	letter_score: { clamp: 4 }, // fixed letter score
	letters: 'T',
	ie: 'ART|CAT|TATTOO|TWIST|YET',
	prize: {discard:1},
	log: {disable:true},
	weight: 1,
};

const Wild_PAT_A =
{
	CLASS: PatternCard,
	name:'A-', desc:'Play A-words for +{multi} multiplier.', cost:1,
	emoji: '&#x1F41C',
	corner: IconSilver,
	multi: 3,
	pattern: '\\b[A]\\w*',
	limit: 5,
	swap: Wild_SLOT_Quarter,
	ie: 'ABOUT|ACE|AD|ANT|ARROW|ASK|AWARD|AWFUL',
	log: {disable:true},
	weight: 1,
};

const Wild_PAT_E =
{
	CLASS: PatternCard,
	name:'E-', desc:'Play E-words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F95A',
	corner: IconDiscard, // i.e. prize = discards
	multi: 5,
	pattern: '\\b[E]\\w*',
	ie: 'EASY|ECHO|EDGE|ENTER|EXIT',
	prize: {discard:1},
	log: {disable:true},
	weight: 1,
};

//-----------------------------------------------------------------------------
// Uncommon (Green) Cost=3-4
//-----------------------------------------------------------------------------

const Wild_02 =
{
	CLASS: LetterCard,
	name: 'Vowels', desc: 'Vowels are worth 3 points. A-E-I-O-U &#x1F33B;', cost: 3,
	icon: 'Petunia',
	emoji: '&#x1F62E',
	letter_score: { add: 2 }, // 1+2=3
	letters: "AEIOU",
	log: {disable:true},
	ie: 'AREA|POUR|LOOKOUT|SEE'	
};

const Wild_31 =
{
	CLASS: LetterCard,
	name: 'May 4', cost: 2,
	desc: 'May the Fourth be with you. All 4-point letters (FHVWY) are doubled.',
	emoji: '&#x1F680', // rocket
	corner: IconBlank,
	letter_score: { clamp: 8 }, // fixed letter score
	letters: "FHVWY",
	pattern: "F|H|V|W|Y",
	prize: {inject:' '},
	log: {disable:true},
	weight: 1,
};

const Wild_LTR_A2 =
{
	CLASS: LetterCard,
	name:'A++', desc:'Play [A] tiles for 9 points.', cost:6,
	icon: 'Clipoard',
	emoji: '&#x1F4CB;+',
	letter_score: { clamp: 9 }, // fixed letter score
	letters: 'A',
	ie: 'ALABAMA|AREA|DATA|BANANA|GALA|SALAD',
	shop: { reqs:{hand:Wild_LTR_A1} },
};

const Wild_LTR_R2 =
{
	CLASS: LetterCard,
	name:'AR+R!', desc:'Play R tiles for 6 points.', cost:6,
	icon: 'Flag',
	emoji: '&#x2693',
	multi: 0,
	letter_score: { clamp: 6}, // fixed letter score
	letters: 'R',
	ie: 'RUM|ROAR|RURAL|ARK|ARRIVE',
	shop: { reqs:{hand:Wild_LTR_R1} },
};

//-----------------------------------------------------------------------------
// Rare (Blue) Cost=5-6
//-----------------------------------------------------------------------------

const Wild_LTR_A3 =
{
	CLASS: LetterCard,
	name:'A+++', desc:'Play [A] tiles for 12 points.', cost:8,
	emoji: '&#x1F4CB;++',
	letter_score: { clamp: 12 }, // fixed letter score
	letters: 'A',
	ie: 'ALABAMA|AREA|DATA|BANANA|GALA|SALAD',
	shop: { reqs:{hand:Wild_LTR_A2} },
};

const Wild_LTR_R3 =
{
	CLASS: LetterCard,
	name:'AR+R+R!', desc:'Play R tiles for 8 points.', cost:10,
	icon: 'Flag',
	emoji: '&#127988;&#8205;&#9760;&#65039;',
	letter_score: { clamp: 8}, // fixed letter score
	letters: 'R',
	ie: 'RUM|ROAR|RURAL|ARK|ARRIVE',
	shop: { reqs:{hand:Wild_LTR_R2} },
};

// Post-modify references
Wild_LTR_R1.shop.reqs.block = [Wild_LTR_R2,Wild_LTR_R3];
Wild_LTR_R2.shop.reqs.block = [Wild_LTR_R3];

const JoyWords = "JOY|BLISS|CHEER|ELATE|GLEE|HAPPY|SMILE|MERRY|LAUGH";
const SadWords = "SAD|CRY|FROWN|GLOOM|MOURN|SOB|SORROW|TEAR";

const Wild_S4 =
{
	CLASS: DualWordCard,
	name:'Joy/Sad', desc:'Play alternating words for +{multi} multiplier.', cost:6,
	emoji: '&#x1F603',
	corner: IconPlus,
	multi: 4,
	bonus: 1,
	dict: "JOY|SAD",// prevent assert
	one: { emoji:'&#x1F603;', dict:JoyWords, name:'JOY-sad' },
	two: { emoji:'&#x1F641;', dict:SadWords, name:'joy-SAD' },
	// Help nerd find all words
	include: [JoyWords,SadWords],
};

const Wild_CK =
{
	CLASS: PatternCard,
	name:'-CK', desc:'Play -CK words for +{multi} multiplier.', cost:8,
	emoji: '&#x1F9F1',
	corner: IconPlus,
	multi: 10,
	bonus: 1,
	limit: 15,
	pattern: '\\b\\w+[Cc][Kk]\\b',
	keyword: 'BRICK',
	ie: 'BLACK|BRICK|LOCK|PUCK|SACK|WHACK',
	shop: {reqs:{level:6}},
	weight: 1,
};

//-----------------------------------------------------------------------------
// Epic (Red) Cost=7-8
//-----------------------------------------------------------------------------

// TODO: Letter vs Pattern -- no words with multiple Q's?
// TODO: if you play keyword=Queen then something extra should happen.. +10 coins?
const Wild_LTR_Q =
{
	CLASS: PatternCard,
	name:'Queen', desc:'Play -Q- words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F451;',
	corner: IconPlus,
	multi: 10,
	bonus: 1,
	limit: 8,
	unique: true,
	pattern: '\\w*[Q]\\w*',
	keyword: 'QUEEN',
	ie: 'AQUA|EQUAL|SQUAD|QUEEN|QUEST',
	swap: Wild_SCORE_8,
	shop: {reqs:{level:6}},
	weight: 10,
};

// TODO: Letter vs Pattern -- no words with multiple X's?
const Wild_LTR_X =
{
	CLASS: PatternCard,
	name:'X', desc:'Play -X- words for +{multi} multiplier.', cost:5,
	emoji: '&#x2702',
	corner: IconPlus,
	multi: 10,
	bonus: 1,
	limit: 10,
	unique: true,
	pattern: '\\w*[X]\\w*',
	ie: 'AX|EXIT|TOXIC|WAX',
	shop: {reqs:{level:3}},
	weight: 1,
};

//-----------------------------------------------------------------------------
// Mythic (Yellow) Cost=10
//-----------------------------------------------------------------------------

const Wild_Riddle =
{
	CLASS: RiddleCard,
	name:'Riddle', desc:'Solve the riddle word for +{multi} multiplier. [5-letter]', cost:3,
	emoji: '&#x1F5FF', // Statue head
	corner: IconSilver,
	multi: 8,
	limit: 1,
	questions:
	{
		//A: ["The first letter of the alphabet."]
		SPACE: ["Dark as night it wraps the stars."],
		SLEEP: ["Eyes dark, body still, mind bright."],
		OCEAN: ["Splashes of blue separating east and west.", "Blue green swirls the earth's briney cover."],
		FROST: ["First sign of winter on window glass."],
		HEART: ["Steady drummer, hidden clock, proof of life.", "Cupid's target but never pierced."],
		FLAME: ["Light blooms from wood in burning petals."],
		BRIDE: ["Maiden in white joins her dark knight by the altar."],
		CHESS: ["This field of kings is no game of chance."],
		TIGER: ["Jungle killer hides a mouth of daggers."],
		APPLE: ["Like vampire garlic but I keep doctors away?"],
		CHALK: ["Slowly ground to dust, my trail is a lesson taught."],
		CROWN: ["Worn by few, this hat is neither warm nor useful."],
		HOUSE: ["This nest of sticks is for no bird but a man."],
		CROWD: ["Like a beast, it tramples the market and devours food."],
		HORSE: ["Four legs aloft, it bears the king's rein."],
		KNIFE: ["Its small ground edge divides food or foe."],
	},
	dict: "A", // dummy to prevent assert
	swap: Wild_SLOT_Quarter,
	shop: {reqs:{level:5}},
	weight: 2,
};

//-----------------------------------------------------------------------------

const Wild_WORD_Animals =
{
	CLASS: WordCard,
	name: 'Animals', desc:'Play animal names for +{multi} multiplier.', cost:5,
	emoji: '&#x1F9A8',
	corner: IconPlus,
	dict: "ANIMAL|FARM|FLOCK|HERD|PET|ZOO",
	include: [ANIMALS,BIRDS,BUGS,CATS,FISHES],
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Auto =
{
	CLASS: WordCard,
	name: 'Auto', desc: 'Play automobile words for +{multi} multiplier.', cost: 2,
	emoji: '&#x1F69A', // Car
	corner: IconPlus,
	dict: "AUTO|AXLE|BATTERY|BELT|BODY|BRAKE|BRONCO|BUMPER|BUS"
	+"|CABLE|CAM|CAR|CHASSIS|CLUTCH|COMBUST|COOLANT|COUPE|CRASH|CYLINDER"
	+"|DASH|DEALER|DENT|DETOUR|DIESEL|DODGE|DOOR|DRIVE"
	+"|ENGINE|EXHAUST|FAN|FENDER|FILTER|FRAME|FUEL"
	+"|GALLON|GAS|GAUGE|GEAR|GLASS|GREASE|GRIDLOCK"
	+"|HEADREST|HONK|HOOD|HORN|HOSE|HUB|HYBRID"
	+"|IGNITION|IMMUNE|JACK|JEEP|JUMP|JUNKYARD|KEY"
	+"|LANE|LEASE|LICENSE|LIGHT|LOAN|LUG|MECHANIC|MOBILE|MIRROR|MOBILE|MOTOR|MUSTANG"
	+"|NEUTRAL|ODOMETER|OIL|PAINT|PARK|PART|PEDAL|PETROL|PILOT|PISTON|PRICE"
	+"|RACE|RADIAL|RADIATOR|RADIO|RAM|REPAIR|REV|REVERSE|RIM|ROAD|ROOF|ROTOR"
	+"|SALVAGE|SEAT|SEDAN|SHIFT|SHOCK|SHOP|SHOW|SIGNAL|SPARK|SPEED|STEER|STICKER|STREET"
	+"|TAXI|TESLA|TIRE|TORQUE|TOW|TRAFFIC|TREAD|TRUCK|TRUNK|TUNE|TURBO"
	+"|VALET|VALVE|VAN|VEHICLE|VIPER|VISOR|VROOM"
	+"|WAGON|WASH|WHEEL|WINDOW|WIPER|WRECK",
	templates: [ TemplateWords, CatWords3 ],
	weight: 1,
};

const Wild_WORD_Bible =
{
	CLASS: WordCard,
	name: 'Bible', desc: 'Play bible words for +{multi} multiplier.', cost: 4,
	icon: 'Book',
	emoji: '&#x1F4D3', //&#x1F4D6
	corner: IconSilver,
	dict: "BIBLE"
	+"|AMEN|ANGEL|APOSTLE|APPLE|ARK|ATONE|BABY|BIRTH|BLESS|BLOOD|BOOK|BREAD|BREATH|BUSH"
	+"|CAMEL|CHARIOT|CHERUB|CHERUBIM|CHILD|CHURCH|CLOAK|COMMAND|COVENANT|CROSS|CROWN|CUP"
	+"|DEAD|DEATH|DEMON|DESERT|DEVIL|DISCIPLE|DONKEY|DOVE|DRAGON"
	+"|EAGLE|EARTH|ENEMY|EPISTLE|ETERNAL|EVIL"
	+"|FAITH|FATHER|FEAR|FIRST|FISH|FLOOD|FORGET|FORGIVE|FORTY|FRUIT"
	+"|GARDEN|GATE|GENESIS|GIANT|GIFT|GLORY|GOD|GOLD|GOLIATH|GOOD|GRAIN|GRACE|GRAVE|GUARD"
	+"|HARP|HEAL|HEART|HEAVEN|HELL|HELMET|HOLY|HONEY|HOPE|INN|IRON"
	+"|JAIL|JAWBONE|JOY|JUDGE|KING|KINGDOM|KNOCK|LAMB|LAMP|LAW|LEPER|LEPROSY|LIFE|LIGHT|LION|LOCUST|LORD|LOVE"
	+"|MAGI|MANGER|MIRACLE|MOTHER|MOUNT|NAIL|NEIGHBOR|OFFER|OFFERING|OIL|ONE"
	+"|PALM|PARABLE|PEACE|PHARAOH|PLAGUE|POOR|PRAISE|PRAY|PRAYER|PREACH|PRIEST|PRISON|PROPHET|PSALM"
	+"|RABBI|RAPTURE|REDEEM|REPENT|REVEAL|ROCK"
	+"|SABBATH|SACRED|SAINT|SALT|SANDAL|SAVIOR|SCROLL|SEED|SEVEN|SHEEP|SHEPHERD|SHIELD|SIN|SLAVE|SNAKE|SUFFER|SUPPER"
	+"|SOIL|SON|SONG|SOUL|SPIRIT|STABLE|STAFF|STAR|SWORD"
	+"|TABLET|TEMPLE|TEMPT|TEN|THIEF|THORN|TITHE|TOMB|TREE|TRIBE|TRUTH|TWELVE|VERSE|VIRGIN"
	+"|WATER|WELL|WHALE|WHEAT|WIDOW|WINE|WORD|WORSHIP|WOUND|WRATH",
	multi: 7,
	templates: [ TemplateWords, CatWords3 ],
	weight: 1,
};

// TODO: app achievement for all words played?
const Wild_WORD_Birds =
{
	CLASS: WordCard,
	name: 'Birds', cost:2,
	desc: 'Play bird names for +{multi} multiplier.',
	emoji: '&#x1F986',
	corner: IconBlank,
	dict: "BIRD|AVIAN|BEAK|CHICK|CHIRP|EGG|EYRIE|FEATHER|FLY|FOWL|FLOCK"
	+"|GAGGLE|LOVE|NEST|PHOENIX|PLUMAGE|ROOST|SOAR|SONG|TALON|TWEET|WING",
	include: [BIRDS],
	// Template prizes will be combined
	prize: {inject:' '},
	templates: [ TemplateWords, CatWords3 ],
	weight: 1,
};

const Wild_WORD_Blue =
{
	CLASS: WordCard,
	name: 'Blue', desc: 'Play blue words for +{multi} multiplier.', cost: 3,
	emoji: '&#x1F40B', // whale
	corner: IconPlus,
	dict: "BLUE|BLEW|COLOR|HOLE|PAINT",
	include: [BLUES],
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Bugs =
{
	CLASS: WordCard,
	name: 'Bugs', desc: 'Play bug words for +{multi} multiplier.', cost: 5,
	emoji: '&#x1F41E', // Bug
	corner: Icon16x,
	dict: "BUG|BITE|GERM|HIVE|HUMBUG|INFEST|INSECT|JITTER|JUNE|LADY|MOUND|PEST|PILL|QUEEN|RAID|STING|STUNG|SWARM",
	include: [BUGS],
	templates: [ TemplateWords, CatWords4 ],
	weight: 1,
};

// TODO: limit:10 swap for free +6 multiplier?
const Wild_WORD_Cards =
{
	CLASS: WordCard,
	name: 'Cards', desc: 'Play card words for +{multi} multiplier.', cost: 1,
	emoji: '&#x1F498', // Heart
	corner: IconPlus,
	dict: "ANTE|BET|BLACK|BLIND|BLUFF|CARD|CASINO|CHIP|CLUB"
	+"|DEAL|DECK|DEUCE|DIAMOND|DISCARD|DRAW|FACE|FLOP|FLUSH|FOLD"
	+"|HAND|HEART|PAIR|POKER|RAISE|RED|SPADE|SHUFFLE|STRAIGHT|SUIT|TRICK|WILD"
	+"|ACE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN"
	+"|JACK|QUEEN|KING|JOKER|JESTER",
	templates: [ TemplateWords, CatWords3 ],
};

const Wild_WORD_Numbers =
{
	CLASS: WordCard,
	name: 'Numbers', desc: 'Play number words for +{multi} multiplier.', cost: 1,
	emoji: '&#x1F522', // 1234
	corner: IconPlus,
	dict: 'NUMBER|NUMERAL|DIGIT',
	include: [NUMBERS],
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Colors =
{
	CLASS: WordCard,
	name: 'Colors', desc: 'Play color words for +{multi} multiplier.', cost: 1,
	icon: 'Rainbow',
	emoji: '&#x1F308',
	corner: IconSilver,
	dict: "COLOR|ART|AURORA|HUE|PAINT|PALETTE|PRISM|PIGMENT|RAINBOW|TINT|TONE|WATER",
	include: [COLORS],
	templates: [ TemplateWords, CatWords3 ],
};

const Wild_WORD_Farm =
{
	CLASS: WordCard,
	name: 'Farm', cost:2,
	desc: 'Play farm words for +{multi} multiplier.',
	emoji: '&#x1F69C', // Tractor
	corner: IconPlus,
	dict: "ACRE|ALFALFA|ANIMAL|APPLE|ASS|BALE|BARN|BARNYARD|BARLEY|BEAN|BED|BEE|BEEHIVE|BEET"
	+"|BONNET|BOOT|BOVINE|BRAND|BREED|BUCOLIC|BULL|BUTTER"
	+"|CABBAGE|CAGE|CALF|CARROT|CAT|CATTLE|CHEESE|CHICK|CHICKEN|CHORE|CIDER|COLT|CORN|COW|CROP|CROW"
	+"|DAIRY|DAUGHTER|DENIM|DIRT|DOG|EGG|FARM|FEED|FENCE|FERTILE|FIELD|FLOCK|FOAL|FORK|FRESH|FRUIT|FURROW"
	+"|GARDEN|GATE|GOAT|GRAIN|GRASS|GRAZE|GROUND|GROW"
	+"|HARVEST|HATCH|HAY|HEIFER|HEN|HERD|HIVE|HOE|HOG|HONEY|HORSE|HOUSE|IRRIGATE|KIN"
	+"|LAND|LEAF|LOT|MAGNET|MANURE|MARE|MARKET|MEADOW|MILK|MOO|MULE"
	+"|OAT|OINK|ORCHARD|ORGANIC|OVERALL|OX"
	+"|PAIL|PASTURE|PEA|PEANUT|PEN|PIG|PITCH|PLANT|PLOT|PLOW|PRUNE|PUMPKIN"
	+"|RABBIT|RAIN|RANCH|RAKE|REAP|RICE|RIFLE|ROOSTER|ROPE|ROW|RUSTIC|RYE"
	+"|SACK|SADDLE|SEED|SCYTHE|SHEEP|SHUCK|SICKLE|SILO|SOIL|SOW|SPADE|SPRAY|STABLE|STEER|STOCKADE|STRAW|SUN|SWINE"
	+"|TEA|TILL|TOOL|TRACT|TRACTOR|TRAILER|TROUGH"
	+"|UDDER|VEGGIE|VINE|WAGON|WATER|WEED|WELL|WHEAT|WIFE|WOOL|YOKE",
	prize: {discard:2},
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Fish =
{
	CLASS: WordCard,
	name: 'Fish', desc: 'Play fishy words for +{multi} multiplier.', cost: 5,
	emoji: '&#x1F41F',
	corner: IconPlus,
	dict: "FISH|ANGEL|AQUARIUM|AQUATIC|BAIT|BLOW|BLUE|BONE|BOWL|CRAW|DAMSEL|DORSAL"
		+"|FIN|FILET|FLY|FRY|GILL|GOLD|GULF|HOOK|JAWS|KRILL|LAKE|LINE|LION|LUNKER"
		+"|MERMAID|MONGER|NET|PET|PIER|POLE|RED|REEF|REEL|RIVER|ROCK|ROE"
		+"|SAIL|SCALE|SEA|SHELL|SPAWN|SUN|SUSHI|SWIM|TANK|TIGER|TRIGGER|TROPICAL|ZEBRA",
	include: [FISHES],
	templates: [ TemplateWords, CatWords3 ],
	weight: 1,
};

const NUTS = "ALMOND|CASHEW|PEANUT|PUMPKIN|WALNUT";

const Wild_WORD_Food =
{
	CLASS: WordCard,
	name: 'Food', desc: 'Play food words for +{multi} multiplier.', cost: 1,
	emoji: '&#x1F374',
	//corner: IconPlus,
	dict: "FOOD|COMBO|DESSERT|DINE|DINER|DINNER|EAT|FAST|FORK|LUNCH|MEAL|PLATE|SOUL",
	include: [DRINKS,FOODS,FRUITS,FISHES,NUTS],
	templates: [ TemplateWords, CatWords1 ],
	weight: 1,
};

const Wild_WORD_Fruit =
{
	CLASS: WordCard,
	name: 'Fruit', cost: 4,
	desc: 'Play fruit words for +{multi} multiplier<br>&#x1F34E;&#x1F34C;&#x1F95D;&#x1F349;',
	emoji: '&#x1F352',
	corner: IconPlus,
	dict: "FRUIT|BOWL|CAKE|CIDER|CITRUS|FLY|FRUCTOSE|JAM|JUICE|LOOM|LOOP|NINJA"
	+"|ORCHARD|ORGANIC|PEEL|PIE|PIT|RIPE|ROLL|ROTTEN|SALAD|SEED|STEM|SWEET|TART|TREE|VINE|WINE",
	include: [FRUITS],
	prize: {coin:1},
	templates: [TemplateWords,CatWords4],
};

const Wild_WORD_Green =
{
	CLASS: WordCard,
	name: 'Green', desc: 'Play green words for +{multi} multiplier.', cost: 3,
	emoji: '&#x1F422;',
	corner: IconPlus,
	dict: "GREEN|COLOR|PAINT",
	include: [GREENS],
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Island =
{
	CLASS: WordCard,
	name: 'Island', desc: 'Play island words for +{multi} multiplier.', cost: 4,
	emoji: '&#x1F334',
	corner: IconPlus,
	dict: "ISLAND|ATOLL|BANANA|BAMBOO|BARRIER|BAY|BEACH|BIG|BOAR|BOAT|BREEZE|BRINE"
	+"|CABANA|CASTAWAY|CHAIN|CHICKEN|COAST|COCONUT|CORAL|COVE|CRAB|DESERT|DIVE|DUNE|EMERALD|EXILE"
	+"|FIRE|FISH|FLOWER|GOAT|HAMMOCK|HUT|ISLE|LAGOON|LAND|LEI|LONG|LOST"
	+"|LOBSTER|MERMAID|MONKEY|NATIVE|NET|OASIS|OCEAN"
	+"|PALM|PARROT|PIG|PIRATE|PORT|PRIVATE|RAFT|REEF|REMOTE"
	+"|SAIL|SAND|SALT|SAVAGE|SALVAGE|SCAVENGE|SEA|SEAGULL|SEAL|SEASHORE|SEAWEED"
	+"|SHARK|SHELL|SHIP|SHORE|SIREN|SPEAR|SPONGE|STARFISH|STORM|SUN|SURF|SURVIVOR|SWIM"
	+"|TAN|TIDAL|TIDE|TIKI|TIME|TRAVEL|TREASURE|TRIBE|TROPIC|TROPICAL|TURTLE"
	+"|URCHIN|VINE|VOLCANO|WATER|WAVE|WIND|WRECK|YACHT",
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Medical =
{
	CLASS: WordCard,
	name: 'Medical', desc: 'Play medical words for<br>+{multi} multiplier.', cost: 1,
	emoji: '&#x1FA7A',
	corner: IconPlus,
	dict: "MEDICAL"
	+"|ABDOMEN|ACHE|AILMENT|ALERT|AMNESIA|ANATOMY|ANTIDOTE|AORTA|APPENDIX|ARTERY"
	+"|BANDAGE|BED|BIO|BIOPSY|BIRTH|BLADDER|BLEED|BLOOD|BODY|BONE|BOOK|BRACE|BRAIN|BREAST|BRUISE|BURN"
	+"|CADAVER|CANCER|CARDIO|CARE|CAST|CHART|CHECKUP|CLAIM|CLAVICLE|CLINIC"
	+"|CODE|COLD|COLON|COMA|COMATOSE|CORNEA|CORONARY|CORONER|CORPSE|CORTEX|CURE"
	+"|DEAD|DEATH|DEGREE|DENTIST|DEVICE|DOCTOR|DONOR|DOSAGE|DOSE|DRUG"
	+"|EAR|EPIDEMIC|EXAM|EYE|FEVER|FLU|FRACTURE|GERM|GLAND|GLOVE|GONAD|GOWN|GRAFT|GROIN|GUT"
	+"|HAND|HEAL|HEALTH|HEART|HERNIA|HIVE|HOSPITAL"
	+"|ILL|ILLNESS|INJECT|INJURY|INSURE|INTERN|IRIS|JAB|JAW|JOURNAL|KIDNEY|KNEE"
	+"|LAB|LAME|LATEX|LEG|LEPER|LEPROSY|LICE|LIFE|LIVER|LOBBY|LOBE|LUNG"
	+"|MALADY|MAMMOGRAM|MASK|MED|MEDIC|MEDICINE|MEND|METH|MONITOR|MORGUE|MORPHINE"
	+"|NARCOTIC|NASAL|NATAL|NAUSEA|NAVEL|NEEDLE|NEONATAL|NERVE|NOSE|NURSE"
	+"|OFFICE|OPERATE|OPIATE|OPIOID|ORAL|ORGAN|OUTBREAK"
	+"|PAGER|PAIN|PATIENT|PILL|PLASMA|PLATELET|POISON|PRACTICE|PREGNANT|PROBE|PSYCHE|PULSE|PUPIL"
	+"|RASH|REMEDY|RESEARCH|RETINA|RIB|RINSE"
	+"|SAINT|SANITIZE|SCALPEL|SCAN|SCHOOL|SCOPE|SCROTUM|SCRUB|SEDATE|SEDATIVE|SERUM"
	+"|SHOCK|SICK|SINUS|SKIN|SORE|SPINE|SPINAL|SPLEEN|SPLINT|STEROID|SWAB"
	+"|STITCH|STOMACH|STREP|STUDY|SURGEON|SURGERY|SURGICAL|SYMPTOM|SYRINGE"
	+"|TEST|THERAPY|THROAT|TORSO|TOXIC|TOXIN|TRIAGE|TUMOR|TYPHOID"
	+"|UNIT|URINE|URGENT|UTERUS|UVULA"
	+"|VACCINE|VEIN|VERTEBRA|VET|VIRAL|VIRUS|VISIT|VITAMIN|WARD|WOUND|XRAY",
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_WORD_Music =
{
	CLASS: WordCard,
	name: 'Music', desc: 'Play music words for +{multi} multiplier.', cost: 1,
	emoji: '&#x1F3BC',
	//corner: IconPlus,
	dict: "MUSIC|MUSICAL|MUSICIAN"
	+"|ACOUSTIC|ALBUM|ALTO|ANDANTE|BAGPIPE|BALLAD|BALLET|BAND|BANJO"
	+"|BAR|BARD|BARITONE|BASS|BASSOON|BEAT|BELL|BONGO|BOX|BRASS|BUGLE"
	+"|CASETTE|CELLO|CHANT|CHIME|CHOIR|CHORAL|CHORD|CLASSIC|CLEF|CODA|CONCERT|COUNTRY|CRUNK|CYMBAL"
	+"|DANCE|DIGITAL|DISC|DISCO|DO|DRUM|DUET|DUO|EAR|ENCORE"
	+"|FA|FIFE|FLAT|FLUTE|FOLK|FRET|GIG|GONG|GUITAR|HALF|HARMONIC|HARMONY|HARP|HORN"
	+"|INDIE|JAZZ|JINGLE|JIVE|KARAOKE|KEY|KEYBOARD|LA|LOUD|LUTE|LYRE|LYRIC"
	+"|MEASURE|MELODY|METER|MAJOR|MI|MIC|MINOR|NOISE|NOTE|OBOE|OCTAVE|OPERA|ORGAN"
	+"|PERFORM|PIANO|PICCOLO|PIPE|PLAY|PLAYER|POLKA|POP|PRODIGY|QUARTER|QUARTET"
	+"|RADIO|RAVE|RE|RECORD|REFRAIN|REHEARSE|REST|RIFF|RING|ROCK|RHYTHM"
	+"|SANG|SAX|SCALE|SCORE|SHARP|SHEET|SING|SO|SOFT|SOLO|SONATA|SONG|SONNET"
	+"|SOPRANO|SOUND|STAFF|STAGE|STANZA|STRING|STRUM|SYMPHONY"
	+"|TEMPO|TENOR|TI|TIMBRE|TIME|TONE|TOUR|TREBLE|TRILL|TRUMPET|TUBA|TUNE|TUNER|UKELELE"
	+"|VIBE|VIBRATO|VIOLA|VIOLIN|VOCAL|VOICE|WALTZ|WAVEFORM|WHOLE|WIND",
	templates: [ TemplateWords, CatWords1 ],
	weight: 1,
};

// IDEA: 5-words for +1 PLATINUM (ie. alt currency)
// Shop could have 4-PLAT = Legendary Wildcard?
const Wild_WORD_Mythos =
{
	CLASS: WordCard,
	name: 'Mythos', desc:'Play mythical things for +{multi} multiplier.', cost:1,
	emoji: '&#x1F409',
	corner: Icon16x,
	dict: "MYTH|MYTHIC|MYTHICAL|MYTHOS",
	include: [MYTHS,MONSTERS],
	templates: [ TemplateWords, CatWords4 ],
	swap: Wild_Riddle,
};

const Wild_WORD_Office =
{
	CLASS: WordCard,
	name: 'Office', desc: 'Use office words for +{multi} multiplier.',
	emoji: '&#x1F4CE', // paperclip
	dict: "ACCOUNT|AGENDA|APPROVE|BADGE|BIN|BONUS|BOSS|BREAK|BUDGET|BUSINESS"
	+"|CABINET|CALENDAR|CAREER|CHAIR|CHECK|CLIP|CLOCK|COFFEE"
	+"|COMPUTER|CONTACT|CONTRACT|COOLER|COPY|CUBICLE"
	+"|DATA|DESK|DISC|DOCUMENT|DRAWER|EMAIL|EMPLOYEE|EMPLOYER|EXPERT"
	+"|FAX|FILE|FIRE|FOLDER|FORM|GRAPH|HIRE|HOLIDAY|HOUR"
	+"|ID|INBOX|INTERN|JOB|JUNIOR|KEYBOARD|LAYOFF|LEAVE|LEVEL"
	+"|MANAGER|MEMO|MEETING|MOUSE|NOTEPAD|OFFICE|OVERTIME"
	+"|PAPER|PAY|PEN|PENCIL|PHONE|PITCH|PLAN|POLICY|PRINTER|PRIORITY|PROJECT"
	+"|RAISE|REPORT|RESUME|RETIRE|REVIEW|RULER"
	+"|SALARY|SCHEDULE|SCISSOR|SCRUM|SENIOR|SHIFT|SHRED|SKILL|STAFF|STAPLE|STAPLER|STRIKE|SUIT|SURVEY"
	+"|TABLE|TABLET|TALENT|TASK|TEA|TEAM|TEMPLATE|TIE|TIMELINE|TRAIN|TRASH"
	+"|UNION|VACATION|WATER|WORK",
	templates: [ TemplateWords, CatWords3 ],
};

const Wild_WORD_Pirate =
{
	CLASS: WordCard,
	name: 'Pirate', desc: 'Use piratey words for +{multi} multiplier.',
	emoji: '&#127988;&#8205;&#9760;&#65039;', // Flag
	//corner: IconPlus,
	OnAllWordsPlayed: 'Achievement',
	dict: "ABOARD|AFT|AHOY|ALE|ANCHOR|AVAST|AYE"
	+"|BARMAID|BARNACLE|BARREL|BAY|BEARD|BILGE|BLACK|BLADE|BLOOD|BOAT"
	+"|BOMB|BONE|BOOTY|BOUNTY|BOW|BREEZE|BRIG|BRINE|BURY"
	+"|CABIN|CANNON|CAPTAIN|CARGO|CHANTEY|CHART|CHEAT|CHEST|COAST|COIN|COMPASS|CORSAIR"
	+"|CODE|COVE|CRAB|CREW|CROW|CUTLASS"
	+"|DAGGER|DECK|DEEP|DIAMOND|DIG|DINGHY|DIRGE|DOCK|DOUBLOON|DROWN|DRUNK|DUEL"
	+"|EMERALD|FATHOM|FLAG|FLEET|FLOAT|FORT|GALLEON|GALLEY|GEM|GOLD|GREED|GROG|GRUB|GUST|GUT"
	+"|HARPOON|HEAVE|HELM|HO|HOIST|HOOK|HULL|INGOT|ISLAND|ISLE"
	+"|JADE|JEWEL|JIB|JIG|JOLLY|JOURNAL|KEEL|KEELHAUL|KEG|KNIFE|KRAKEN"
	+"|LAIR|LAD|LASS|LEGEND|LENS|LIE|LOOKOUT|LOOT"
	+"|MAP|MAROON|MAST|MATE|MATEY|MONKEY|MUTINY|NEST|NET|OAR|OATH|OCEAN"
	+"|PARROT|PATCH|PEARL|PEG|PILFER|PILLAGE|PIRACY|PIRATE|PISTOL|PLANK|PLUNDER|PORT|POWDER"
	+"|RAFT|RAID|RAT|REBEL|REEF|RIG|RIGGING|ROPE|ROT|RUBY|RUDDER|RUM"
	+"|SABER|SAIL|SAILOR|SAND|SEA|SEADOG|SEAGULL|SCOURGE|SCURVY|SCUTTLE"
	+"|SHANTY|SHARK|SHIP|SHIVER|SHORE|SIREN|SKELETON|SKIFF|SKULL|SLY"
	+"|SNEAK|SPYGLASS|STEAL|STERN|STORM|SURF|SWAB|SWASH|SWORD"
	+"|THIEF|TIDE|TIMBER|TREASURE|VOYAGE"
	+"|WAKE|WAVE|WATER|WEALTH|WENCH|WHEEL|WIND|YO",
	templates: [ TemplateWords, CatWords1 ],
};

const Wild_WORD_Plants =
{
	CLASS: WordCard,
	name: 'Plants', desc: 'Play plant words for +{multi} multiplier.', cost: 1,
	emoji: '&#x1F335', // cactus
	//corner: IconPlus,
	dict: "PLANT",
	include: [PLANTS],
	templates: [ TemplateWords, CatWords1 ],
	weight: 1,
};

const Wild_WORD_Red =
{
	CLASS: WordCard,
	name: 'Red', desc: 'Play red words for +{multi} multiplier.', cost: 1,
	emoji: '&#x1F34E',
	//corner: IconPlus,
	dict: "RED",
	include: [REDS],
	templates: [ TemplateWords, CatWords1 ],
	weight: 1,
};

// TODO: Common (multi) vs Uncommon (bonus)?
const Wild_WORD_School =
{
	CLASS: WordCard,
	name: 'School', cost: 2,
	desc: 'Play school words for +{multi} multiplier.',
	emoji: '&#x1F393', // grad cap
	corner: IconPlus,
	dict: "APPLE|ART|BACKPACK|BAND|BELL|BIOLOGY|BOOK|BREAK|BULLY|BUS"
	+"|CAMPUS|CAP|CHAIR|CHALK|CHEAT|CHEER|CHOIR|CLASS|CLUB|COACH|COLLEGE|COURSE"
	+"|DANCE|DEAN|DEGREE|DESK|DIPLOMA|DOCENT|DOCTOR|DORM|DRAMA"
	+"|EDUCATE|ENGLISH|ENROLL|ERASER|EXAM|EXPEL"
	+"|FAIL|FELLOW|FINAL|FISH|FLAG|FLIGHT|GEOMETRY|GOWN|GRAD|GRADE|GRADUATE|GRAMMAR|GYM"
	+"|HALL|HALLWAY|HIGH|HISTORY|HOME|HOMEWORK|HONOR|IVY|JANITOR|JOCK|JUNIOR"
	+"|FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH"
	+"|KINDER|LAB|LAW|LEARN|LECTURE|LESSON|LIBRARY|LOCKER|LUNCH"
	+"|MASCOT|MATH|MEDICAL|MIDDLE|MIDTERM|MILK|MIND|NOTE|NOTEBOOK|OFFICE"
	+"|PASS|PEER|PEN|PENCIL|PHYSICS|PIZZA|PLEDGE|PREP|PRIMARY|PRIMER|PRIVATE|PROM|PUBLIC"
	+"|QUIZ|READ|RECESS|REFORM|REPORT|RING|ROOM|RULER|SCHOLAR|SCHOOL|SCIENCE|SENIOR|SHOP"
	+"|SKIP|SPIRIT|SPORT|STUDENT|STUDY|SUMMER"
	+"|TASSEL|TEACH|TEACHER|TEAM|TEST|THINK|TRADE|TRUANT|TUITION|TUTOR"
	+"|UNIFORM|VARSITY|WORK|WRITE|YEAR|YEARBOOK",
	templates: [TemplateWords,CatWords2],
	weight: 1,
};

const Wild_WORD_Sports =
{
	CLASS: WordCard,
	name: 'Sports', desc: 'Play sports words for +{multi} multiplier.', cost: 1,
	emoji: '&#x26BD',
	//corner: IconPlus,
	dict: "SPORT",
	include: [SPORTS],
	templates: [ TemplateWords, CatWords1 ],
	weight: 1,
};

const Wild_WORD_Stones =
{
	CLASS: WordCard,
	name: 'Stones', desc: 'Play stone words for +{multi} multiplier.', cost: 5,
	emoji: '&#x1F48E',
	corner: Icon16x,
	dict: "STONE",
	include: [STONES],
	templates: [ TemplateWords, CatWords4 ],
	swap: Wild_Riddle,
	weight: 1,
};

const Wild_WORD_Yellow =
{
	CLASS: WordCard,
	name: 'Yellow', desc: 'Play yellow words for +{multi} multiplier.', cost: 3,
	emoji: '&#x1F34C',
	corner: IconPlus,
	dict: "YELLOW|COLOR|PAINT",
	include: [YELLOWS],
	templates: [ TemplateWords, CatWords2 ],
	weight: 1,
};

const Wild_MULTI_2 =
{
	CLASS: MultiplyCard,
	name: 'Multi +2', desc:'Multiplier +{multi}', cost:2,
	emoji: '&#x2694', // swords
	multi: 2,
	templates: [ TemplateMult ],
	weight: 2,
};

// Multiply cards are stackable to conserve slots
// +2/+2=+4.. +4/+4=+8.. +8/+8=+16 etc.
const Wild_MULTI_4 =
{
	CLASS: MultiplyCard,
	name: 'Multi +4', desc:'Multiplier +{multi}', cost:8,
	emoji: '&#x1F3F9', // Bow & Arrow
	color: ColorMulti,
	multi: 4,
	shop:
	{
		reqs: { view: Wild_MULTI_2 }
	},
	templates: [ TemplateMult ],
	weight: 1,
};

const Wild_MULTI_8 =
{
	CLASS: MultiplyCard,
	name: 'Multi +8', desc:'Multiplier +{multi}', cost:10,
	emoji: '&#x1F3F9', // Bow & Arrow
	color: ColorMulti,
	multi: 8,
	shop:
	{
		reqs: { view: Wild_MULTI_4 }
	},
	templates: [ TemplateMult ],
	weight: 1,
};

const Wild_MULTI_16 =
{
	CLASS: MultiplyCard,
	name: 'Multi +16', desc:'Multiplier +{multi}', cost:24,
	emoji: '&#x1F3F9', // Bow & Arrow
	color: ColorYellowRare,
	multi: 16,
	shop:
	{
		reqs: { view: Wild_MULTI_8 }
	},
	templates: [ TemplateMult ],
	category: Words5, // prize for completing word chain
	weight: 1,
};

const Wild_MULTI_32 =
{
	CLASS: MultiplyCard,
	name: 'Multi +32', desc:'Multiplier +{multi}', cost:48,
	emoji: '&#x1F3F9', // Bow & Arrow
	color: ColorYellowRare,
	multi: 32,
	templates: [ TemplateMult ],
	shop:
	{
		// Level >= 4.1?
		reqs: { view: Wild_MULTI_16 }
	},
};

const Wild_M1 = Wild_MULTI_2;
const Wild_M2 = Wild_MULTI_4;
const Wild_M3 = Wild_MULTI_8;
const Wild_M4 = Wild_MULTI_16;
const Wild_M5 = Wild_MULTI_32;

const Wild_00 = { name:'Adam', desc:'+5 Score', cost:1, word_score:{add:5, always:true} };
const Wild_01 = { name:'2X', desc:'+2 Multiplier', cost:1, word_score:{multi:2, always:true} };

// TODO: initial version with lower stats? Bonus(0) and/or limit(5)
// every 5 words it can upgrade to the next Rarity color
const Wild_SIZE_05 =
{
	CLASS: SizeCard,
	name: '5x5', desc: 'Play 5-letter words for +{multi} multiplier.', cost: 3,
	emoji: '&#128400', // Hand
	corner: IconSilver,//IconDiscard
	size: 5,
	multi: 3,
	bonus: 1,
	limit: 8,
	prize: {discard:1}, // bonus per word played
	swap: Wild_SLOT_Quarter,
	weight: 5,
};

const Wild_SIZE_06 =
{
	CLASS: SizeCard,
	name: 'Six', desc: 'Play 6-letter words for +{multi} multiplier', cost: 4,
	emoji: '&#x1F9E9', // puzzle piece
	corner: Icon16x,
	size: 6,
	multi: 6,
	limit: 5,
	bonus: 1,
	swap: Wild_M4,
	shop:
	{
		reqs:{ view: Wild_SIZE_05 }
	},
	weight: 1,
};

// OLD IDEAS
const Wild_12 = { name:"Silverado", desc:"All vowels turn to Silver tiles.", cost:1 };
const Wild_13 = { name:"Cashier", desc:"Silver tiles are worth 5-points.", cost:1 };
const Wild_15 = { name:"Midas", desc:"Tiles next to silver turn silver.", cost:1 };

const Wild_SIZE_04 =
{
	CLASS: SizeCard,
	name:"4+", desc:"Play 4-letter words for +{multi} multipler.", cost:3,
	emoji: '&#127808', // lucky 4-leaf clover
	corner: IconCoin,
	size: 4,
	multi: 4,
	limit: 8,
	prize: {coin:1},
	swap: Wild_SLOT_Quarter,
	weight: 2,
};

const Wild_HIGH =
{
	CLASS: HighCard,
	name:"High", desc:"Highest played tile doubles.", cost:1,
	emoji: '&#x1F388', // red balloon
	multi: 2, // applies to letter score
	weight: 1,
};

const Wild_ULTRA=
{
	CLASS: HighCard,
	name:"Ultra", desc:"Highest played tile scores 5x", cost:10,
	emoji: '&#x1F388', // red balloon
	multi: 5, // applies to letter score
	color: ColorYellowRare,
	shop:
	{
		reqs:{ view: Wild_HIGH }
	},	
	weight: 1,
};

// TODO: new version with 1-coin per letter played?
const Wild_LTR_Coins =
{
	CLASS: SizeCard,
	name:"Size Coins", desc:"Each played tile generates 1 coin.", cost:4,
	emoji: IconCoin,
	corner: IconAdd,
	size: 1,
	op: 'greater-equal',
	limit: 8,
	give: { coins: true },
	swap: Wild_SCORE_2,
	weight: 1,
};

// TODO: limit property not working?
const Wild_HIGH_Coins =
{
	CLASS: HighCard,
	name:"High Coin", desc:"Highest played tile generates coins.", cost:5,
	emoji: '&#x1F388', // balloon
	corner: IconCoin,
	limit: 10,
	color: '#8080C0', // blue?
	give: { coins: 'HighTile' },
	swap: Wild_SCORE_2,
	weight: 1,
};

const Wild_HIGH_Discards =
{
	CLASS: HighCard,
	name:"High Disc", desc:"Highest played tile generates discards.", cost:5,
	emoji: '&#x1F388', // balloon
	corner: IconDiscard,
	limit: 10,
	color: '#8080C0', // blue?
	give: { discards: 'HighTile' },
	weight: 1,
};

const Wild_HIGH_First =
{
	CLASS: HighCard,
	name:"High 1st", desc:"Play highest first letter for +{multi} multiplier", cost:5,
	emoji: '&#x1F388', // balloon
	//corner: IconCoin,
	mult: 5,
	match: { first:true },
	weight: 1,
};

const Wild_LOW =
{
	CLASS: LowCard,
	name:"Low", desc:"Lowest played letter is worth 5-points.", cost:1,
	emoji: '&#x1F9E6', // sock
	clamp: 5, // applies to letter score
	weight: 1,
};

const Wild_20 = { name:'Quick', desc:'Play word within 10-seconds for +5 bonus.', cost:1 };

// 21 SEE: Bottom!

const Wild_22 = { name:'C2R', desc:'Swap C for R tiles.', cost:1 };
const Wild_23 = { name:'Cannon', desc:'Double any pirate themed bonus.', cost:1 };
const Wild_24 = { name:'AAA', desc:'Replace O/U tiles with A tiles.', cost:1 };

const Wild_27 = { name:'SH@T', desc:'Play any 4 tiles for free word.', cost:1 };
const Wild_28 = { name:'Noun', desc:'Play nouns for 2x multiplier.', cost:5 };

const Wild_Rx =
{
	CLASS: PatternCard,
	name:'R-', desc:'Play R-words for +{multi} multiplier.', cost:1,
	emoji: '&#x1F98F;',
	corner: IconAdd,
	multi: 3,
	bonus: 1,
	limit: 6,
	unique: true,
	pattern: '\\b[Rr]\\w*',
	swap: Wild_SCORE_8,
	ie: 'RUN|RADAR|ROUND|ROCK|RHINO',
	// TODO: Special bonus if you play emoji?
	keyword: 'RHINO',
	weight: 1,
};

const Wild_Rx5 =
{
	CLASS: PatternCard,
	name:'Rx5', desc:'Play R-words with 5-letters for +{multi} multiplier.', cost:5,
	emoji: '&#x1F98F',
	corner: IconAdd,
	multi: 5,
	bonus: 1,
	limit: 5,
	unique: true,
	pattern: '\\b[Rr]\\w{4}\\b',
	ie: 'RADAR|ROUND|RHINO',
	// TODO: Special bonus if you play emoji?
	keyword: 'RHINO',
	swap: Wild_SCORE_8,
	shop: {reqs:{level:6}},
	weight: 1,
};

const Wild_29 = // Wild_LTR_T1
{
	CLASS: PatternCard,
	name:'T-', desc:'Play T-words for +{multi} multiplier.', cost:5,
	emoji: '&#x2615', // tea cup
	corner: IconAdd,
	multi: 2,
	bonus: 1,
	limit: 6,
	pattern: '\\b[Tt]\\w*',
	swap: Wild_SCORE_4,
	ie: 'TACO|TABLE|TATTOO|TAX'
};

const Wild_29x = // Wild_LTR_T2
{
	CLASS: PatternCard,
	name:'T-', desc:'Play T-words for +{multi} multiplier.', cost:10,
	emoji: '&#x2615', // tea cup
	corner: IconPlus,
	multi: 4,
	bonus: 1,
	limit: 8,
	pattern: '\\b[Tt]\\w*',
	swap: Wild_SCORE_8,
	ie: 'TACO|TABLE|TATTOO|TAX',
	shop: {reqs:{ view: Wild_29 }},
	weight: 1,
};

const Wild_30x = // Wild_PAT_S2
{
	CLASS: PatternCard,
	name:'S-', desc:'Play S-words for +{multi} multiplier.', cost:10,
	emoji: '&#x1F40D',
	corner: IconSilver,
	multi: 8,
	bonus: 1,
	limit: 6,
	pattern: '\\b[Ss]\\w*',
	ie: 'SAINT|SALE|SASSY|SO',
	swap: Wild_SLOT_Quarter,
	weight: 1,
};

// TODO: generalize the S1 vs S2 availability?
const Wild_30 = // Wild_PAT_S1
{
	CLASS: PatternCard,
	name:'S-', desc:'Play S-words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F40D',
	corner: IconSilver,
	multi: 4,
	bonus: 1,
	limit: 8,
	pattern: '\\b[Ss]\\w*',
	ie: 'SAINT|SALE|SASSY|SO',
	// shop: TODO: block if you have Wild_30x?
	shop: {reqs:{block:[Wild_30x]}},
	swap: Wild_SLOT_Quarter,
	weight: 1,
};

const Wild_PAT_P =
{
	CLASS: PatternCard,
	name:'P-', desc:'Play P-words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F968',
	corner: IconPlus,
	multi: 6,
	bonus: 1,
	limit: 10,
	pattern: '\\b[P]\\w*',
	ie: 'PACK|PICKLE|POP|PRETZEL',
	weight: 1,
};

const Wild_32 =
{
	CLASS: PatternCard,
	name: 'AE 2x', desc: 'Play vowel pairs for +{multi} multiplier.', cost: 1,
	icon: 'Two-Headed',
	emoji: '&#129346;',
	corner: IconAdd,
	multi: 2,
	limit: 5,
	swap: Wild_SCORE_4,
	//pattern: 'AE|AI|AU|EA|EE|EI|EO|EU|IA|IE|IO|OA|OI|OO|OU|UA|UE|UI|UO',
	pattern: '[AEIOU]{2}',
	ie: 'TEACH|LOOK|YOU|BREAD|DEER',
	weight: 1,
};

const Wild_33 = { name:'AAA', desc:'Triple A words gets +33 multiplier. (ARMADA)', cost:10 };

const Wild_35 =
{
	CLASS: StatCard,
	name: 'BONUS', desc:'Extra discard (+2) per round.', cost:2,
	icon: 'Trash',
	emoji: '&#x1F9FA;', // &#x1F5D1;
	stat: {discards:2},
};

const Wild_36 =
{
	CLASS: StatCard,
	name: 'BONUS+', desc:'Extra discards (+3) per round.', cost:4,
	icon: 'Trash',
	emoji: '&#x1F9FA;',
	stat: {discards:3},
};

const Wild_37 =
{
	CLASS: StatCard,
	name: 'BONUS', desc:'Extra coins (+3) per round.', cost:4,
	icon: 'Stats',
	emoji: '&#128192',
	trigger: {round:true},
	stat: {coins:3},
	weight: 1,
};

const Wild_38 =
{
	CLASS: StatCard,
	name: 'BONUS+', desc:'Extra coins (+4) per round.', cost:6,
	icon: 'Stats',
	emoji: '&#x1F4B0',
	trigger: {round:true},
	stat: {coins:4},
};

const Wild_38x =
{
	CLASS: StatCard,
	name: 'BONUS!', desc:'Extra coins (+1) per Word.', cost:10,
	icon: 'Stats',
	emoji: '&#x1F4B0',
	trigger: {word:true},
	stat: {coins:1},
	weight: 1,
};

const Wild_PAT_O =
{
	CLASS: PatternCard,
	name:'-O', desc:'Play -O words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F954', // Potato
	corner: IconAdd,
	multi: 8,
	bonus: 1,
	limit: 6,
	pattern: '\\b\\w*[O]\\b',
	swap: Wild_SCORE_4,
	ie: 'ALSO|BRAVO|NO|POTATO|TACO|TOMATO',
	weight: 1,
};

// Placholder cards to make useful cards feel rare.
const Wild_JUNK_01 =
{
	CLASS: LetterCard,
	name:'JUNK-1', desc:'You dont want this card.', cost:5,
	icon: 'Toilet',
	emoji: '&#x1F6BD;',
	multi: 0,
	letter_score: { clamp: 1}, // fixed letter score
	letters: '?',
};

// Placholder cards to make useful cards feel rare.
const Wild_JUNK_02 =
{
	CLASS: LetterCard,
	name:'JUNK-2', desc:'You dont want this card.', cost:5,
	icon: 'Toilet',
	emoji: '&#x1F6BD;',
	multi: 0,
	letter_score: { clamp: 1}, // fixed letter score
	letters: '?',
};
// Placholder cards to make useful cards feel rare.
const Wild_JUNK_03 =
{
	CLASS: LetterCard,
	name:'JUNK-3', desc:'You dont want this card.', cost:5,
	icon: 'Toilet',
	emoji: '&#x1F6BD;',
	multi: 0,
	letter_score: { clamp: 1}, // fixed letter score
	letters: '?',
};
// Placholder cards to make useful cards feel rare.
const Wild_JUNK_04 =
{
	CLASS: LetterCard,
	name:'JUNK-4', desc:'You dont want this card.', cost:5,
	icon: 'Toilet',
	emoji: '&#x1F6BD;',
	multi: 0,
	letter_score: { clamp: 1}, // fixed letter score
	letters: '?',
};

const Wild_CASH1 =
{
	CLASS: ActionCard,
	name:'Ring', desc:'A valuable trinket.', cost:16,
	emoji: '&#x1F48D',
	//corner: IconCoin,
	action: {}, // no-op
	shop: {reqs:{level:12}},
	weight: 1,
};

const Wild_CASHX =
{
	CLASS: ActionCard,
	name:'Coin', desc:'A single coin.', cost:1,
	emoji: IconCoin,
	action: {}, // no-op
	shop: {reqs:{level:12}},
	weight: 1,
};

// TODO: if you build up to 8 blanks -- something nice should happen?
const Wild_ACT_Ghost =
{
	CLASS: TransferCard,
	name:'GHOST', desc:'Unused blanks carry to next round.', cost:5,
	emoji: '&#x1F47B', // ghost
	letter: ' ',
	limit: 8,
	swap: Wild_M5,
	weight: 1,
};

const Wild_SIZE_Big =
{
	CLASS: SizeCard,
	name:'Bigs', desc:'Play 6+ letter words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F98D', // gorilla
	corner: IconBlank,
	size: 6,
	op: 'greater-equal',
	multi: 8,
	limit: 8,
	prize: { coin:4, inject:' ' },
	swap: Wild_HIGH_Discards, // TODO: Random pick from prize cards?
	weight: 1,
};

// TODO: play duplicate words immediately or multipler expires?
// ie. "DOG"=+3, "FROG"=+4, "TWELVE"=+6, etc.
const Wild_ACT_Parrot =
{
	CLASS: ReplayCard,
	name:'Parrot', desc:'Play duplicate words for +{multi} multiplier.', cost:2,
	emoji: '&#x1F99C', // parrot
	corner: IconCoin,
	size: 3, // 3+
	multi: 12,
	dict: "CRACKER", // the parrot always wants a cracker
	prize: { coin:5 },
	weight: 1,
};

const Wild_P1 =
{
	CLASS: StatCard,
	name:'PRIZE-1', desc:'Auto +3 discards per round.', cost:20,
	emoji: IconGift,
	corner: IconDiscard,
	stat: {discards:3},
};
const Wild_P2 =
{
	CLASS: StatCard,
	name:'PRIZE-2', desc:'Auto +4 discards per round.', cost:40,
	emoji: IconGift,
	corner: IconDiscard,
	stat: {discards:4},
};
const Wild_P3 =
{
	CLASS: StatCard,
	name:'PRIZE-3', desc:'Auto +6 discards per round.', cost:50,
	emoji: IconStar,
	corner: IconDiscard,
	stat: {discards:6},
};

const VaultWords = "ZERO|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE";

const Wild_V1 =
{
	CLASS: VaultCard,
	name:'Vault 01', desc:'Play the digit words to unlock. +{multi}', cost:2,
	icon: 'Lock',
	emoji: '&#x1F512;',
	corner: IconSilver,
	multi: 3,
	digits: 1,
	prizes: [Wild_SLOT_Quarter],
	// Allow nerd card to show some hints
	dict: VaultWords,
	shop: {reqs:{level:3}},
	weight: 1,
};

const Wild_V2 =
{
	CLASS: VaultCard,
	name:'VAULT 02', desc:'Play the digit words to unlock.  +{multi}', cost:5,
	icon: 'Lock',
	emoji: '&#x1F512;',
	corner: IconSilver,
	multi: 4,
	digits: 2,
	// TODO: Two quarters?
	prizes: [Wild_SLOT_Quarter],
	shop: {reqs:{view:Wild_V1,block:[Wild_V1],level:6}},
	weight: 1,
};

const Wild_V3 =
{
	CLASS: VaultCard,
	name:'VAULT 03', desc:'Play the digit words to unlock.  +{multi}', cost:10,
	icon: 'Lock',
	emoji: '&#x1F512;',
	corner: IconAdd,
	multi: 5,
	digits: 3,
	prizes: [Wild_SCORE_16],
	shop: {reqs:{view:Wild_V2,block:[Wild_V1,Wild_V2]}},
	weight: 1,
};

const Wild_V4 =
{
	CLASS: HealthCard,
	name:'Pi&ntilde;ata', desc:'Break open to see inside.', cost:1,
	emoji: '&#x1F38A;', // Confetti ball?
	corner: IconAdd,
	multi: 2,
	digits: 3,
	dict: "ATTACK|AXE|BANG|BASH|BAT|BEAT|BLAST|BLUDGEON|BOP|BOX|BREAK|BUST"
		+"|CHOP|CLOBBER|CLOCK|CONK|DAMAGE|DASH|FIGHT"
		+"|HACK|HIT|JAB|KICK|KNOCK|PELT|POKE|PUNCH|RAM|RIP"
		+"|SHAKE|SHOOT|SLAM|SLAP|SLASH|SLICE|SMACK|SMASH|STAB"
		+"|STOMP|STRIKE|SWAT|SWING|SWIPE|TEAR|THWACK|WALLOP|WHACK|ZAP",
	prizes: [Wild_SCORE_4],
	shop: {reqs:{level:3}},
	weight: 1,
};

const Wild_MULT_Tree =
{
	CLASS: MultiplyCard,
	name: 'Tree +6', desc:'Multiplier +{multi}', cost:8,
	emoji: '&#x1F333',
	color: ColorMulti,
	multi: 6,
	weight: 0,
};

const Wild_HEALTH_Wet =
{
	CLASS: HealthCard,
	name:'Seedling', desc:'Play wet words to grow this seed into a tree.', cost:1,
	emoji: '&#127793', // Seedling
	corner: IconStar,
	multi: 3,
	digits: 5,
	dict: "AQUA|BAY|BROOK|DAMP|DEW|DOUSE|DRENCH|DRINK|DRIP|DROP|DROPLET|FLOOD|FLUID|FOG|FOUNTAIN"
		+"|GEYSER|GUSH|HYDRATE|ICE|LAKE|LAGOON|LIQUID|MIST|OCEAN|POND|POOL|POUR|PUDDLE|QUENCH|RAIN|RIVER"
		+"|SEA|SHOWER|SOAK|SPIT|SPLASH|SPRAY|SPRING|STREAM|VAPOR|WASH|WATER|WAVE|WET",
	prizes: [Wild_MULT_Tree],
	shop: {reqs:{level:3}},
	weight: 1,
};

const Wild_S1 =
{
	CLASS: MultiplyCard,
	name:'Alarm', desc:'Last turn +{multi} multiplier.', cost:2,
	icon: 'Clock',
	emoji: '&#x23F0;', // alarm clock
	multi: 5,
	req: { turn:4 },
};

const WordTable_01 =
{
	APPLE: '&#x1F34E', // PP is hard?
	BIKE: '&#x1F6B2',
	BREAD: '&#x1F35E', // bread vs loaf?
	BUS: '&#x1F68C',
	CAKE: '&#x1F370',
	CARROT: '&#x1F955',
	CHICKEN: '&#x1f414', // Hard?
	CLOCK: '&#x23F0',
	CORN: '&#x1F33D',
	CRAB: '&#x1F980',
	CRATE: '&#x1F4E6',
	DUCK: '&#x1f986',
	EGG: '&#x1F95A',
	FIRE: '&#x1F525',
	//FOOTBALL: '&#x1F3C8', // Hard?
	FROG: '&#x1f438',
	GRAPE: '&#x1F347',
	ICE: '&#x1F9CA',
	LEMON: '&#x1F34B',
	MELON: '&#x1F349',
	MOON: '&#x1F31B', // x1F319
	PAWN: '&#x265F',
	ROCKET: '&#x1F680',
	SALAD: '&#x1F957',
	SALT: '&#x1F9C2',
	SHARK: '&#x1F988',
	SKATE: '&#x26F8',
	SNAIL: '&#x1F40C',
	STAR: '&#x2B50',
	SUN: '&#x1F31E',
	TACO: '&#x1F32E',
	TAXI: '&#x1F695',
	TRAIN: '&#x1F682',
	TREE: '&#x1F333',
	WINE: '&#x1F377',
};

const Wild_WORD_Mimic =
{
	CLASS: WordCard,
	name:'Mimic', desc:'Identify the mimic for +{multi} multiplier.', cost:7,
	emoji: '&#x1F4E6', // box/crate
	corner: IconStar,
	multi: 13,
	limit: 4,
	randomize: WordTable_01,
	dict: 'CRATE',
	swap: Wild_M4, // Unify prize and swap?
	weight: 1,
};

const Wild_S3 = // Wild_DISCARD_I
{
	CLASS: ClickCard,
	name:'Eye', desc:'Discard I-tiles<br>for a blank tile.', cost:2,
	icon: 'Eye',
	small: '&#x1F441;',
	emoji: '&#x1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F',
	corner: IconBlank,
	action: { discard:'I', inject:' ' },
	limit: 8,
	swap: Wild_SCORE_4,
	weight: 1,
};

const Wild_S3x = // Wild_DISCARD_O
{
	CLASS: ClickCard,
	name:'Ewe', desc:'Discard O-tiles for<br>a blank tile.', cost:2,
	icon: 'Sheep',
	small: '&#x1F411;',
	emoji: '&#x1F411;',
	corner: IconBlank,
	action: { discard:'O', inject:' ' },
	limit: 8,
	swap: Wild_SCORE_4,
	weight: 1,
};

const Wild_AHA = // Wild_DISCARD_A
{
	CLASS: ClickCard,
	name:'Aha!', desc:'Discard A-tiles for a free blank tile.', cost:1,
	emoji: '&#128124', // angel
	corner: IconBlank,
	action: { discard:'A', inject:' ' },
	limit: 8,
	swap: Wild_SCORE_4,
	weight: 1,
};

// TODO: multiple cards = EVE + V-CHANGE = discard E but "I" appears?
const Wild_EVE = // Wild_DISCARD_E
{
	CLASS: ClickCard,
	name:'Eve', desc:'Use on E-tiles<br>for a blank tile.', cost:1,
	emoji: '&#x1F30E',
	corner: IconBlank,
	action: { discard:'E', inject:' ' },
	limit: 8,
	swap: Wild_SCORE_2,
	weight: 1,
};

const Wild_ACT_Z = // Wild_DISCARD_Z
{
	CLASS: ClickCard,
	name:'Zzz', desc:'Discard Z-tiles for +5 discards.', cost:1,
	emoji: '&#x1F4A4',
	corner: IconDiscard,
	action: { discard:'Z', add_discard:5 },
	weight: 1,
};

// ie. Spell MAGNET to reset charges
const TriggerMagnetReset =
{
	Condition: { OnWordPlayed: 'MAGNET' },
	Action:    { SetCharges: 0}, // TODO: Max-#
};

const Wild_ACT_Mag6 =
{
	CLASS: LetterActionCard,
	name:'Magnet', desc:'Use on single letter for blank tile.', cost:5,
	emoji: '&#x1F9F2', // magnet
	corner: IconBlank,
	triggers: [ TriggerMagnetReset ],
	limit: 6,
	action: { icon:IconWipe },
	swap: Wild_SCORE_4,
	weight: 1,
};

const Wild_ACT_Mag10 =
{
	CLASS: LetterActionCard,
	name:'Magnet+', desc:'Use on single letter for blank tile.', cost:10,
	emoji: '&#x1F9F2', // magnet
	corner: IconBlank,
	color: ColorYellowRare,
	limit: 10,
	action: { icon:IconWipe },
	// Require buy the lower card first, but not currently held
	shop: {reqs:{ buy: Wild_ACT_Mag6, block: Wild_ACT_Mag6 }},
	swap: Wild_SCORE_8,
	weight: 1,
};

const HotWords = "HOT|BATH|BLAZE|BOIL|BONFIRE|BURN|COAL|COOK|DESERT|EMBER|FEVER|FIRE|FLAME|FURNACE|HEAT|IGNITE|INFERNO|LAVA|MELT|METEOR|OVEN|SALSA|SAUNA|SINGE|SCALD|SCORCH|SPARK|SPICE|SPICY|STEAM|SUMMER|SUN|TEA|TOAST|VOLCANO|WARM";
const IceWords = "ICE|ARCTIC|BATH|BREEZE|CHILL|COLD|COOL|COMET|FJORD|FREEZE|FRIGID|FROST|FROZE|FROZEN|GLACIER|HAIL|ICEBERG|ICICLE|ICY|IGLOO|POLAR|SNOW|SLEET|SLUSH|SUBZERO|TEA|WINTER|ZERO";

const Wild_S5 =
{
	CLASS: DualWordCard,
	name:'Hot/Cold', desc:'Play alternating words for +{multi} multiplier.', cost:6,
	emoji: '&#x1f525',//'&#x1F9CA;',
	multi: 6,
	bonus: 1,
	limit: 4,
	corner: Icon8x,
	swap: Wild_M3,
	dict: "HOT|COLD",// prevent assert
	one: { emoji:'&#x1f525', dict:HotWords },
	two: { emoji:'&#x1F9CA', dict:IceWords },
	shop: {reqs:{level:6}},
	weight: 1,
};

const TemplateTiers =
{
	CLASS: WordTiers,
	corner: IconSilver,
	color: ColorTiers,
	cost:  4,
	multi: 5,
	limit: 0,
	
	// Automatic upgrade on tier increment
	upgrade:{ quarter:1 },
	
	swap: Wild_SLOT_Quarter,
	weight: 1,	
};

// Play ICE/COLD words
// Tiers escalate each 5-words to level up multiplier
const Wild_ICE_TIERS =
{
	name: 'ICE', desc:'Play ice cold words for Tier +{multi} multiplier.',
	emoji: '&#x1F9CA',
	templates: [ TemplateTiers ],
	
	dict: "ICE"
		+"|AGE|ARCTIC|BATH|BERG|BLIZZARD|BLUE|BOX|BREEZE"
		+"|CAVE|CHEST|CHILL|CLIMB|COLD|COOL|COMET|CONE|CREAM|CRYSTAL|CUBE|DIAMOND|DRY"
		+"|FIELD|FJORD|FLAKE|FLOE|FREEZE|FRIDGE|FRIGID|FROST|FROZE|FROZEN"
		+"|GLACIER|HAIL|HOUSE|ICEBERG|ICICLE|ICY|IGLOO"
		+"|MELT|PACK|PENGUIN|PICK|POLAR|POWDER|RINK|ROAD"
		+"|SCARF|SCULPT|SHEET|SHIVER|SKATE|SNOW|SNOWMAN|SNOWBALL|SNOWFALL|SLEET|SLUSH|STORM|SUBZERO"
		+"|TEA|TUNDRA|WATER|WINTER|YETI|ZERO",

	tiers:
	[
		{ multi: 5, limit:3, name:'ICE-1', emoji:'&#x1F9CA'}, // ice cube
		{ multi: 8, limit:3, name:'ICE-2', emoji:'&#x2744;&#xfe0f'}, // snowflake
		{ multi:12, limit:3, name:'ICE-3', emoji:'&#x1F366'}, // icecream cone
		{ multi:15, limit:3, name:'ICE-4', emoji:'&#x1F427'}, // penguin
		{ multi:20, limit:3, name:'ICE-5', emoji:'&#x1F976'}, // ice face
	],
};

// Play HOT/FIRE words
// Tiers escalate each 5-words to level up multiplier
const Wild_FIRE_TIERS =
{
	name: 'HOT', desc:'Play hot/fire words for<br> Tier +{multi} multiplier.',
	emoji: '&#x1f525',
	templates: [ TemplateTiers ],
	
	dict: "HOT"
		+"|AIR|ANGER|ANGRY|ASH|BATH|BLAZE|BOIL|BONFIRE|BROIL|BURN|BURNT"
		+"|CANDLE|CHAR|CHILI|COAL|COCOA|COFFEE|COMBUST|COOK|CORAL|CRACKER"
		+"|DEMON|DESERT|DOG|DRAGON"
		+"|EMBER|ENGINE|FEVER|FIERY|FIRE|FLAME|FLY|FORGE|FURNACE"
		+"|GLOW|GLUE|HEAT|HELL|HOT|IGNITE|INFERNO|JALAPENO"
		+"|LAVA|LINE|MELT|METEOR|MOLTEN|OIL|OVEN"
		+"|PEPPER|PINK|POTATO|PYRE|PYRO|RAMEN|RED|ROAST|ROD"
		+"|SALSA|SAUCE|SAUNA|SEAR|SHOWER|SINGE|SIZZLE|SCALD|SCORCH|SMOKE|SOLAR|SOUP"
		+"|SPARK|SPICE|SPICY|STEAM|STOVE|SUMMER|SUN|SUNBURN|SWAP|SWEAT"
		+"|TAR|TEA|THERMAL|TIP|TOAST|TORCH|TOWEL|VOLCANO"
		+"|WARM|WATER|WAX|WHITE|WILDFIRE|WING|WIRE|YOGA",

	tiers:
	[
		{ multi: 5, limit:4, name:'HOT-1', emoji:'&#x1f525'}, // fire
		{ multi: 8, limit:4, name:'HOT-2', emoji:'&#x1F336;&#xfe0f'}, // pepper
		{ multi:12, limit:4, name:'HOT-3', emoji:'&#x1F9EF;'}, // extinguisher
		{ multi:15, limit:4, name:'HOT-4', emoji:'&#x1F4A5;'}, // explosion
		{ multi:20, limit:4, name:'HOT-5', emoji:'&#x1F47F;'}, // demon
	],
};

// Play TEXAS/COWBOY words
// Tiers escalate each 5-words to level up multiplier
const Wild_TEXAS_TIERS =
{
	name: 'TEXAS', desc:'Play Texas words for<br> Tier +{multi} multiplier.',
	emoji: '&#x1F404',
	templates: [ TemplateTiers ],
	
	dict: "TEXAS"
		+"|ALAMO|ANVIL|BADGE|BARB|BARBECUE|BARN|BEEF|BELT|BIG|BOLO|BOOT|BOVINE"
		+"|BRIDLE|BRISKET|BRONCO|BUCKAROO|BUCKLE|BULL|BULLET|BURGER|BUZZARD"
		+"|CACTUS|CALF|CATTLE|CHAP|CHILI|COAST|COLT|CORRAL|COW|COWBOY|COWGIRL|COYOTE"
		+"|DAIRY|DANCE|DESERT|DOGIE|DRAWL|DRY|DUDE"
		+"|FENCE|FLAG|FOAL|FOOTBALL|FRONTIER|GULF|GUN|HAT|HEAT|HERD|HORN|HORSE|HOT|HOWDY"
		+"|LAND|LASSO|LEATHER|LIZARD|LONE|MESA|MOO|MUSTANG|OIL|PISTOL|PRAIRIE"
		+"|RANCH|RANGE|RANGER|RAWHIDE|REIN|RIFLE|ROCKET|RODEO|ROPE|ROSE|RUSTLER"
		+"|SADDLE|SHERIFF|SHOOT|SHOTGUN|SNAKE|SOUTH|SPACE|SPUR"
		+"|STALLION|STAR|STATE|STEAK|STEED|STEER|STEP|SUN"
		+"|TACO|TAMALE|TEQUILA|TORNADO|TRAIL"
		+"|VULTURE|WAGON|WARM|WEST|WHISKEY|WILD|WRANGLE",

	tiers:
	[
		{ multi: 5, limit:4, name:'TEX-1', emoji:'&#x1F404'}, // cow
		{ multi: 8, limit:4, name:'TEX-2', emoji:'&#x1F335'}, // cactus
		{ multi:12, limit:4, name:'TEX-3', emoji:'&#x1F969'}, // steak
		{ multi:15, limit:4, name:'TEX-4', emoji:'&#x1F40E'}, // horse
		{ multi:20, limit:4, name:'TEX-5', emoji:'&#x1F920'}, // cowboy
	],
};

// Play TRAVEL words
// Tiers escalate each N-words to level up multiplier
const Wild_TRAVEL_TIERS =
{
	name: 'TRAVEL', desc:'Play Travel words for<br> Tier +{multi} multiplier.',
	emoji: '&#x1F697',
	templates: [ TemplateTiers ],
	
	dict: "TRAVEL"
		+"|AGENT|AIR|AIRPLANE|AIRPORT|ARRIVE|AUTO"
		+"|BAG|BAGGAGE|BEACH|BOARD|BOAT|BORDER|BUS"
		+"|CAB|CABIN|CALENDAR|CAMERA|CAMP|CAR|CARAVAN|CITY|COAST|COMMUTE|COPTER|CRUISE"
		+"|DEPART|DESERT|DIVE|DRIVE"
		+"|EMBARK|ESCAPE|EXPLORE|EXPRESS|FERRY|FLIGHT|FLY|FOREST|FUEL"
		+"|GATE|GETAWAY|GUIDE|GUEST"
		+"|HARBOR|HIKE|HORSE|HOSTEL|HOTEL|ISLAND|ISLE|JEEP|JET|JOURNEY|JUNGLE"
		+"|LANGUAGE|LAYOVER|LUGGAGE|MAP|MONEY|MOUNTAIN|OVERLAND"
		+"|PACK|PASSPORT|PATH|PHOTO|PILOT|PLANE|PLATINUM|POSTCARD"
		+"|RAIL|RIDE|ROAD|ROAM|ROCKET|ROOM|RUNWAY"
		+"|SAND|SAIL|SCUBA|SEA|SEAT|SECURITY|SHIP|SHUTTLE|SKI|SPACE|SPEED|SUBWAY|SURF"
		+"|TAXI|TENT|TICKET|TIME|TOUR|TOURIST|TRAIL|TRAIN|TRIP|TREK"
		+"|VACATION|VAN|VENTURE|VISA|VISIT|VISITOR|VOYAGE|WALK|WANDER",

	tiers:
	[
		{ multi: 5, limit:4, name:'FLY-1', emoji:'&#x1F697'}, // auto
		{ multi: 8, limit:4, name:'FLY-2', emoji:'&#x1F4BC'}, // luggage
		{ multi:12, limit:4, name:'FLY-3', emoji:'&#x1F68C'}, // bus
		{ multi:15, limit:4, name:'FLY-4', emoji:'&#x1F6A2'}, // ship
		{ multi:20, limit:4, name:'FLY-5', emoji:'&#x2708;&#xfe0f;'}, // plane
	],
};

// TODO: Debug feature add 'I' to all word lists?
const DualWords = "CHESS|KING|KNIGHT|PEARL|PENGUIN|ZEBRA|"
const DarkWords = DualWords+"BLACK|COAL|CROW|DARK|INK|NIGHT|NITE|ONYX|RAVEN|SHADOW|TAR";
const LiteWords = DualWords+"WHITE|BRIDE|COTTON|CRANE|DAY|DICE|DOVE|LIGHT|MOON|SNOW|SUN|QUARTZ";

const Wild_S6 =
{
	CLASS: DualWordCard,
	name:'Blk/Wht', desc:'Play alternating words for +{multi} multiplier.', cost:6,
	icon: 'Pawn',
	dict: "BLACK|WHITE",// prevent assert
	one: { emoji:'<span class="bigger">&#9818</bigger>', dict:DarkWords },
	two: { emoji:'<span class="bigger">&#9812</bigger>', dict:LiteWords },
	// Pawn &#x2659;&#x265F;
	// Rook &#9814;&#9820;
	// Knight '<span class="left">&#9822;<span class="hflip">&#9816;</span></span>',
	// K/Q &#9819;&#9812;
	//emoji: '<span class="left">&#9812;&#9818;</span>',
	emoji: '<span class="bigger">&#9818;</bigger>',
	log: { emoji: '&#9818' },
	multi: 6,
	limit: 4,
	swap: Wild_SCORE_4,
//	shop: {reqs:{level:6}},
	bonus: 1,
	weight: 1,
};

// TODO: too hard/slow to play these words to get clues?
// Maybe play one word to turn ON for the rest of the round
// any word played gives a new hint until end of round
// then it needs to be turned ON again next round?
const Wild_S7 =
{
	CLASS: HintCard,
	name:'Nerd', desc:'Play words for hints and +{multi} multiplier.', cost:4,
	icon: 'Nerd',
	emoji: '&#x1F913;',
	dict: "CLUE|HELP|HINT|NERD|SMART|TIP|WORD",// prevent assert
	multi: 5,
	shop: {reqs:{level:4}},
	weight: 1,
};

// TODO: change DISCARD behavior to Play in word!
const Wild_X1 =
{
	CLASS: ClickCard,
	name:'X-change', desc:'Use on 5+ point letters for coins. [KJXQZ]', cost:2,
	icon: 'Cash',
	emoji: '&#x1F4B8',
	corner: IconCoin,
	action: { discards:'KJXQZ', add_coins:5 },
	limit: 5,
	swap: Wild_SCORE_4,
	weight: 1,
};

// TODO: change DISCARD behavior to Play in word!
const Wild_X2 =
{
	CLASS: ClickCard,
	name:'5-change', desc:'Use on 5+ point letters for 3-discards. [KJXQZ]', cost:2,
	emoji: '&#x1F4B8',
	corner: IconDiscard,
	action: { discards:'KJXQZ', add_discards:4 },
	limit: 15,
	weight: 1,
};

const Wild_X3 =
{
	CLASS: ClickCard,
	name:'Q-change', desc:'Use on [QZ] tiles for<br>blank tile.', cost:1,//5,
	emoji: '&#x1F4B8;', // flying cash
	action: { discards:'QZ', replace:' ' },
	limit: 6,
	swap: Wild_SCORE_4,
	weight: 1,
};

const Wild_X4 =
{
	CLASS: ClickCard,
	name:'V-change', desc:'Use on vowels for new vowels. [AEIOU]', cost:3,
	icon: 'Cash',
	emoji: '&#x1F4B8;',
	action: { discards:'AEIOU', inject:'EIOUA' },
	limit: 10,
	weight: 1,
};

// TODO: this needs to be a Reward card?
const Wild_ACT_Blank =
{
	CLASS: ActionCard,
	name:'Blank', desc:'Start each round with a blank tlie.', cost:5,
	emoji: '&#x1F193', // FREE
	corner: IconInfinity,
	action: { turn:1, inject:' ' },
	templates: [ TemplateBaseGear ],
};

// TODO: this needs to be a Reward card?
// Maybe get initial WordCard to 5-words? (charges:5)
const Wild_ACT_Peacock =
{
	CLASS: ActionCard,
	name:'Expand', desc:'Play WILD for +1 slot', cost:10,
	emoji: '&#x1F99A;',
	corner: IconAdd,
	multi: 4,
	action: { word:'WILD', add_slots:1 },
	swap: Wild_SCORE_2,
	limit: 1,
	weight: 2,
};

const Wild_S12 = // Wild_SIZE_345
{
	CLASS: SizeCard,
	name:'3+', desc:'Play {multi}-letter words for +{multi} multiplier.', cost:2,
	emoji: '&#x1F531',
	corner: Icon16x,
	size:  1,
	multi: 1,
	limit: 3,
	bonus: 1,
	levels:
	[
		{size:3, multi:3, limit:3, name:'3-LTR', desc:'Play 3-letter words for +3 multiplier. [LVL-1]', emoji:'&#x1F531'},
		{size:4, multi:4, limit:3, name:'4-LTR', desc:'Play 4-letter words for +4 multiplier. [LVL-2]', emoji:'&#x1F340'},
		{size:5, multi:5, limit:3, name:'5-LTR', desc:'Play 5-letter words for +5 multiplier. [LVL-3]', emoji:'&#128400'},
		//{size:6, multi:6, limit:3, name:'6-LTR', desc:'Play 6-letter words for +6 multiplier. [LVL-4]', emoji:'&#x1F9E9'}
	],
	swap: Wild_M4, // 4=16x, 5=32x
	weight: 1,
};

// TODO: BUG: the button appear and combined with HORSE card?
const Wild_S13 =
{
	CLASS: MultiplyCard,
	name: 'One-shot', desc:'Play a word without discards for +{multi} multiplier.', cost:4,
	emoji: '&#x23F3', // clock
	multi: 4,
	disable_merge: true, // TODO: more specific than disable action?
	disable_action: true, // disable Multiply merge action button
	req: { discards:0 },
	log: { disable:true },
	weight: 1,
};

// Sequence of letters in any position -- allow multiple per word?
// ie. CAB scores triple?
const Wild_S14 =
{
	CLASS: MultiplyCard,
	name: 'Alphabet', desc:'Play A-Z for +{multi} multiplier.', cost:1,
	emoji: '&#x1F520;',
	//corner: IconMult,
	multi: 3,
	bonus: 1,
	limit: 8,
	swap: Wild_M4,
	req: { alpha:'A' },
	weight: 1,
};

// First letter of first word establishes pattern
const Wild_S14X = // Wild_SEQ_ABC
{
	CLASS: StraightCard,
	name: 'Straight', desc:'Play ?- words in alpha order for +4 multiplier.', cost:1,
	emoji: '&#x1F520;',
	corner: IconSilver,
	multi: 4,
	limit: 5,
	first: '[A-Z]',
	pattern: '[A-Z]+',
	swap: Wild_SLOT_Quarter,
	ex1: 'ALPHA|BETA|CHOP|DOOR|EDGE',
	ex2: 'MONEY|NOUN|OUT|PUB|QUEEN',
	weight: 1,
};

// TODO: Allow word HORSE to be played for instant swap?
const Wild_SEQ_Horse =
{
	CLASS: StraightCard,
	name: 'Horse', desc:'Play sequence H- word then O- R- S- E- for +{multi} multiplier.', cost:3,
	emoji: '&#x1F3C0', // Basketball vs Horse=x1F40E
	corner: IconSilver,
	multi: 5,
	limit: 5,
	sequence: 'HORSE',
	pattern: '[H|O|R|S|E]+',
	swap: Wild_SLOT_Quarter,
	ex1: 'HORSE|ONION|ROOF|SHIP|EGG',
	weight: 1,
};

const Wild_S15 =
{
	CLASS: ClickCard,
	name:'xxx', desc:'Discard X-tiles for 200 points.', cost:2,
	emoji: '&#x1F6E2',
	action: { discard:'X', damage:200 },
	limit: 10,
	increase: '2x', // TODO: increase score with each use?
	weight: 1,
};

const Wild_ACT_Discard =
{
	CLASS: ActionCard,
	name:'Juggle', desc:'Discard any tile for its weight in coins.', cost:5,
	emoji: '&#x1F939',
	corner: IconCoin,
	action: { discards:'ABCDEFGHIJKLMNOPQRSTUVWXYZ', score_to_coins:true },
	limit: 8,
	weight: 1,
};

const Wild_S16 =
{
	CLASS: FlipCard,
	name:'Flip-it', desc:'Play U/D/L/R-words to flip tiles.', cost:10,
	emoji: '<div class="maze">&#x26AA;&#x26AA;&#x26AB;<br>&#x26AB;&#x2B1C;&#x26AA<br>&#x26AA;&#x26AB;&#x26AA;</div>',
	corner: IconAdd,
	dict: 'UP|DOWN|LEFT|RIGHT|NORTH|SOUTH|WEST|EAST',
	multi: 3,
	swap: Wild_SCORE_8,
	weight: 1,
};

const Wild_Z1 =
{
	CLASS: ActionCard,
	name: 'Sticky', desc:'Keep the 1st letter.', cost:5,
	emoji: '&#x1F36F',
	action: { preserve:1 },
	weight: 1,
};

const Wild_ACT_Backpack =
{
	CLASS: ActionCard,
	name:"Backpack", desc:"Add highest un-played letter score from hand.", cost:2,
	emoji: '&#x1F392',
	action: { any:true },
	score: { high_card:true },
	log: { disable:true },
	weight: 1,
};

const Wild_ACT_Megapack =
{
	CLASS: ActionCard,
	name:"Megapack", desc:"Add all un-played letters to score.", cost:8,
	emoji: '&#x1F392',
	action: { any:true },
	score: { all:true },
	log: { disable:true },
	shop: {reqs:{level:9}},
	weight: 1,
};

// TODO: Add new feature to DETECT when letters COULD spell 8-letters!
// Build custom list of 8-letter words?
// Traverse spelling combinations for current letters?
// Dash outline if ANY 8-letter word is possible with current letters!
const Wild_SIZE_08 =
{
	CLASS: SizeCard,
	name:'8-Ball', desc:'Play 8-letter word for +{multi} multiplier.', cost:8,
	emoji: '&#127921',
	corner: IconSilver,
	size: 8,
	multi: 25,
	magic: true,
	limit: 1,
	swap: Wild_SLOT_Quarter,
	prize: {coin:10},
	shop:
	{
		reqs:{ prize_limit:1 }, row:3,
	},		
	weight: 5,
	weights: [0,1,2,3,100],
};

const Wild_SIZE_08X =
{
	CLASS: SizeCard,
	name:'8-Ball', desc:'Play 8-letter word for +{multi} multiplier.', cost:10,
	emoji: '&#127921',
	corner: IconExpo,
	color: ColorYellowRare,
	size: 8,
	multi: 80,
	magic: true,
	limit: 1,
	swap: Wild_EXP_1,
	prize: {coin:10},
	shop:
	{
		reqs:{ view:Wild_SIZE_08, prize_limit:1 }, row:3,
	},		
	weight: 5,
	weights: [0,1,1,2,100],
};

// TEST: Additional reward coins or discards?
const Wild_PAT_Twin =
{
	CLASS: PatternCard,
	name: 'Twins', desc:'Play words with double letters for +{multi} multiplier. [HELLO]', cost:2,
	emoji: '&#x1F46F',
	corner: IconCoin,
	multi: 5,
	pattern: '(\\w)\\1',
	// TODO: discard vs inject based on Vowel vs Consonant?
	prize: { coin:2, discard:2, inject:' ' },
	weight: 1,
};

const Wild_PAL =
{
	CLASS: PatternCard,
	name: 'Palindrome', desc:'Play palindrome words for +{multi} multiplier.', cost:5,
	emoji: '&#x1F4E1',
	corner: IconAdd,
	palindrome: true,
	multi: 15,
	limit: 5,
	pattern: '\\w+',
	swap: Wild_SCORE_8,
	weight: 1,
};

const Wild_WHO =
{
	CLASS: PatternCard,
	name: 'WHO?', desc:'Play WH- words for +{multi} multiplier.', cost:4,
	emoji: '&#x1F989;',
	multi: 6,
	pattern: '\\bWH\\w+',
	weight: 1,
};

const ColorBright = '#F0F0F0';

// Extra bonus for playing any rarity WORD wildcards
const Wild_BONUS_Words =
{
	CLASS: BonusCard,
	name:'Wordy', desc:'Play key words for extra +{multi} multiplier.', cost:1,
	emoji: '&#x1F4DA', // books
	color: ColorBright,
	multi: 3,
	any_dict: true,
	// TODO: restrict dictionaries to WORD cards!
	match: [Words1,Words2,Words3,Words4], // categories
	//mod: { color:'GREEN', rarity:1, multi:3 },
	shop:
	{
		reqs:{ level:3 } // maybe hand or at least view a green card?
	},	
	weight: 1,
};

/*
const Wild_MOD_Blue =
{
	CLASS: ModCard,
	name:'BLUE', desc:'Blue wildcards get 3x multiplier.', cost:2,
	emoji: '&#x2747',
	color: '#0000B4',
	mod: { color:'BLUE', rarity:2, multi:3 },
	shop:
	{
		reqs:{ hand: Wild_MOD_Green }
	},
	weight: 1,
};
*/

// TODO: Consider idea that card does take up slot and instead increases Vision stat by +1?
const Wild_INFO_Future =
{
	CLASS: InfoCard,
	name: 'Future', desc:'Gaze into the crystal ball to see the future.', cost:2,
	emoji: '&#x1F52E;',
	info: { letter:8 },
	// TODO: Allow playing FUTURE to extend sight by 1 up to 10 letters?
	trigger: { word:'FUTURE', extend:1, max:10 },
	log: { disable:true },
	templates: [ TemplateBaseGear ],
};

const Wild_WORD_Speak =
{
	CLASS: WordCard,
	name: 'No Evil', cost: 1,
	desc: '????? +{multi} multiplier?',
	emoji: '&#x1F64A', // Monkey cover-mouth
	corner: IconSilver,
	multi: 5,
	limit: 1,
	unique: true,
	dict: "SPEAK|EVIL",
	reject: "EVIL", // if you play the word EVIL the card disappears
	swap: Wild_SLOT_Quarter, //Wild_SCORE_8, // final prize wildcard
	prize: { coin:10 },
	shop: {reqs:{level:1000}}, // Not for sale?
	weight: 1,
};

const Wild_WORD_Hear =
{
	CLASS: WordCard,
	name: 'No Evil', cost: 1,
	desc: '???? +{multi} multiplier',
	emoji: '&#x1F649', // Monkey cover-ears
	corner: IconSilver,
	multi: 5,
	limit: 1,
	unique: true,
	dict: "HEAR|EVIL",
	reject: "EVIL",
	swap: Wild_WORD_Speak,
	shop: {reqs:{level:1000}}, // Not for sale?
	weight: 1,
};

const Wild_WORD_See =
{
	CLASS: WordCard,
	name: 'No Evil', cost: 2,
	desc: '??? +{multi} multiplier',
	emoji: '&#x1F648', // Monkey cover-eyes
	corner: IconSilver,
	multi: 5,
	limit: 1,
	unique: true,
	dict: "SEE|EVIL",
	reject: "EVIL",
	swap: Wild_WORD_Hear,
	shop: {reqs:{block:[Wild_WORD_Hear,Wild_WORD_Speak]}},
	weight: 1,
};

// TODO: extra effective vs Boss enemies?
// TODO: some residual behavior so more help?
const Wild_WORD_BossKey =
{
	CLASS: WordCard,
	name: 'Boss Key', cost: 8,
	desc: 'Play ???? +{multi} multiplier',
	emoji: '&#x1F511',
	corner: '&#x1F4A3',
	multi: 40,
	limit: 1,
	dict: "BOSS|KEY",
	shop: {reqs:{level:6}},
	swap: Wild_M3,
	weight: 1,
};

// TODO: drag letters for alt discard -- sell later to inject stored cards to top of deck?
const Wild_ACT_Mailbox =
{
	CLASS: StorageCard,
	name: 'Box', cost: 2,
	desc: 'Drag letters into storage.',
	emoji: '&#x1F4EE',
	corner: IconGear,
	limit: 3,
	storage: 2,
	action: { icon:'&#x1F504', icon2:'&#x1F4A1', icon3:'&#x267B' },
	// drag_target:true
	weight: 1,
};

const Wild_ACT_Alpha3 =
{
	CLASS: AlphaCard,
	name: 'Alphacube', cost: 1,//10,
	desc: 'Play words with 3+ alphabetical letters for +{multi} multiplier. [GHI=>HIGH]',
	emoji: '&#x1F524', // abc
	corner: IconSilver,
	multi: 25,
	letters: 3,
	limit: 4,
	swap: Wild_SLOT_Quarter,
	weight: 1,
};

const Wild_ACT_Reset =
{
	CLASS: ActionCard,
	name: 'Reset', cost: 2,
	desc: 'Play RESET to blank all the letters in your hand.',
	emoji: '&#x2622',
	color: ColorYellowRare,
	action: { words:'RESET', blank:8 },
	shop: { row:3 },
	weight: 1,
};

const Wild_LTR_Z =
{
	CLASS: PatternCard,
	name: 'Z-', cost: 2,
	desc: 'Play Z- words for +{multi} multiplier.',
	emoji: '&#x1F993', // Zebra
	corner: Icon8x,
	multi: 10,
	pattern: '\\b[Z]\\w*',
	limit: 6,
	prize: {coin:2},
	swap: Wild_SCORE_8,
	weight: 1,
};

const Wild_SCORE_Z600 =
{
	CLASS: ScoreCard,
	name: 'Z-750', cost: 4,
	desc: 'Play Z- words to reach 750-pts.',
	emoji: '&#x1F993', // Zebra
	corner: Icon8x,
	action: { accum:750 },
	pattern: '\\b[Z]\\w*',
	swap: Wild_M3,
	weight: 1,
};

const Wild_SCORE_S500 =
{
	CLASS: ScoreCard,
	name: 'S-500', cost: 2,
	desc: 'Play S- words to reach 500-pts.',
	emoji: '&#x1F991', // Squid
	corner: IconAdd,
	action: { accum:500 },
	pattern: '\\b[S]\\w*',
	swap: Wild_SCORE_8,
	weight: 1,
};

const Wild_SCORE_E250 =
{
	CLASS: ScoreCard,
	name: 'E-250', cost: 2,
	desc: 'Play E- words to reach 250-pts.',
	emoji: '&#x1F418', // Elephant
	corner: IconAdd,
	action: { accum:250 },
	pattern: '\\b[E]\\w*',
	swap: Wild_SCORE_4,
	weight: 1,
};

const Wild_SCORE_PowerUp =
{
	CLASS: ScoreCard,
	name: 'Power Up', cost: 2,
	desc: 'Play words for any card to reach 500-pts.',
	emoji: '&#x1F9EE', // Abacus
	corner: Icon8x,
	multi: 5, // not working?
	action: { accum:500 },
	any_dict: true,
	swap: Wild_M3,
	weight: 1,
};

const Wild_ACT_Stash =
{
	CLASS: ActionCard,
	name: 'Stash', cost: 2,
	desc: 'Collect 5 unused blanks for a prize.',
	emoji: '&#x1f4bc',
	corner: IconAdd,
	limit: 5,
	action: { unused:' ' },
	swap: Wild_SCORE_8,
	weight: 1,
};

const Wild_LTR_Upgrade =
{
	CLASS: ActionCard,
	name: 'Pinned', cost: 2,
	desc: 'First letter is preserved and gains +1 bonus.',
	emoji: '&#x1F4CD', // push pin
	corner: IconLock,
	limit: 24,
	action: { preserve:1, upgrade:1 },
	swap: Wild_JUNK_01,
	weight: 1,
};

const Wild_LTR_HX =
{
	CLASS: LetterCard,
	name:'Letter', desc:'Play -H- tiles for 50 points.', cost:50,
	emoji: 'H',
	corner: '#',
	letter_score: {clamp:50}, // fixed letter score
	letters: 'H',
	unique: true,
	pattern: '\\w*[H]\\w*',
	ie: 'ASH|HABIT|HASH|WASH',
	shop: {reqs:{level:9}},
	weight: 1,
};

const Wild_LTR_PX =
{
	CLASS: LetterCard,
	name:'Letter', desc:'Play -P- tiles for 50 points.', cost:50,
	emoji: 'P',
	corner: '#',
	letter_score: {clamp:50}, // fixed letter score
	letters: 'P',
	unique: true,
	pattern: '\\w*[P]\\w*',
	ie: 'APE|APPLE|HELP|REPORT',
	shop: {reqs:{level:9}},
	weight: 1,
};

// TODO: define Shop slots with options to increase 1 upgrade?
//       [Common=Upgrade,Word] [Mid=X] [High=Specials]
const TemplateUpgrade = // Tile = 2-points
{
	name:'Upgrade', desc:'Upgrade {letter}-tiles = 2 points.', cost:1,
	score: 1, // 1+1=2
	color: '#A0E0A0',
	shop: {reqs:{once:true,check:true},row:1}, // ,level:3}},
	audio: { buy:'Upgrade1', sell:'Sell' },
	weight: 2
};

const TemplateUpgrade4 = // Tile = 4-points
{
	name:'Upgrade', desc:'Upgrade {letter}-tiles = 4 points.', cost: 3,
	score: 3, // 1+3=4
	color: '#A0A0E0',
	shop: {reqs:{once:true,check:true,level:1},row:1},
	audio: { buy:'Upgrade2', sell:'Sell' },
	weight: 1,
};

const TemplateUpgrade8 = // Tile = 8-points
{
	name:'Upgrade', desc:'Upgrade {letter}-tiles = 8 points.', cost: 7,
	score: 7, // 1+7=8
	color: '#E0A0A0',
	shop: {reqs:{once:true,check:true,level:2},row:1},
	audio: { buy:'Upgrade3', sell:'Sell' },
	weight: 1,
};

const Wild_UPGRADE_A =
{
	CLASS: UpgradeCard,
	emoji: '+A+',
	letter: 'A',
	// TODO: don't allow buying A2 if A4 was bought?
	templates: [ TemplateUpgrade ],
};

const Wild_UPGRADE_A4 =
{
	CLASS: UpgradeCard,
	//name:'Upgrade', desc:'Upgrade A-tiles +3 points.',
	emoji: '+A+',
	letter: 'A',
	templates: [ TemplateUpgrade4 ],
};

const Wild_UPGRADE_A8 =
{
	CLASS: UpgradeCard,
	name:'Upgrade', desc:'Upgrade {letter}-tiles = 8 points.', cost: 7,
	emoji: '+A+',
	letter: 'A',
	//templates: [ TemplateUpgrade8 ],
	score: 7, // 1+7=8
	color: '#E0A0A0',
	shop: {reqs:{once:true,check:true,level:4}},
	weight: 1,	
};

const Wild_UPGRADE_A10 = // Tile = 10-points
{
	CLASS: UpgradeCard,
	name:'Upgrade', desc:'Upgrade {letter}-tiles = 10 points.', cost: 10,
	emoji: '+A+',
	letter: 'A',
	score: 9, // 1+9=8
	color: '#E0C060',
	shop: {reqs:{once:true,check:true,level:5}},
	weight: 1,
};

// i.e. Upgrade T with Red corner T=(2) double = 4-points
const Wild_PAY_Bonus =
{
	CLASS: PayoutCard,
	name:'Upgrade', desc:'Upgraded tiles are double when played.', cost:1,
	emoji: '+2+',
	payout: { multi:2 },
	weight: 1,
};

// i.e. +1 coin for each Upgraded tile
const Wild_PAY_Coins =
{
	CLASS: PayoutCard,
	name:'Payout', desc:'Upgraded tiles earn coins when played.', cost:5,
	emoji: '+&#128192;+',
	match: { upgrade:true },
	payout: { coins:1 },
	weight: 1,
};

// i.e. +1 discard for each Upgraded tile
const Wild_PAY_Discards =
{
	CLASS: PayoutCard,
	name:'Payout', desc:'Upgraded tiles earn discards when played.', cost:1,
	emoji: '+&#x1F53D;+',
	match: { upgrade:true },
	payout: { discards:2 },
	weight: 1,
};

//////////////////////////////////////////
// aka Consumable tiles
//////////////////////////////////////////

const Play_01 = // Consumable
	{
		name: 'Royal Flush',
		desc: 'Discard all tiles for free. (1/10)',
		icon: 'ToiletThrone',
		OnTimer10: 'Highlight = 2x bonus',
		charges: 10,
		multi: 2,
	};

const Play_02 = // Consumable
	{
		name: 'White Out',
		desc: 'Turn one letter in hand into Blank tile.',
		icon: 'Pencil Eraser',
	};
	
// Ideas:
// Double-Twos = each 2-point letter gives double word
// All vowels turn Gold
// Each Gold letter +1 point
// Each Gold letter +2 point
// All Gold equal 5-point letters
// Midas - letter beside gold become gold
// Sss (serpent) - Add (S) to anything +1-score +1-multiplier
// Hoarder = Get +1 letter tile in hand
// Quick-draw = x2 Multiplier if play word without discard
// Mirror = x3 Multiplier for palindromes (A,Eye,Boob,Radar,Noon,etc.)
// Action = x1.5 Multiplier for Verbs
// Backpack = Add highest letter not played in hand

function TestPattern(wild, word)
{
	if (wild != null && wild.pattern)
	{
		// TODO: cache the regex?
		let regex = new RegExp(wild.pattern);
		return regex.test(word);
	}
	return false;
}

const AllWildcards =
[
	Wild_SIZE_04,
	Wild_SIZE_05,
	Wild_SIZE_06,
	Wild_SIZE_08, Wild_SIZE_08X,
	Wild_SIZE_Big,
	
	// Words
	Wild_WORD_Animals,
	Wild_WORD_Auto,
	Wild_WORD_Bible,
	Wild_WORD_Birds,
	Wild_WORD_Blue,
	Wild_WORD_Bugs,
	Wild_WORD_Cards,
	Wild_WORD_Colors,
	Wild_WORD_Farm,
	Wild_WORD_Fish,
	Wild_WORD_Food,
	Wild_WORD_Fruit,
	Wild_WORD_Green,
	Wild_WORD_Island,
	Wild_WORD_Medical,
	Wild_WORD_Music,
	Wild_WORD_Mythos,
	Wild_WORD_Numbers,
	Wild_WORD_Office,
	Wild_WORD_Pirate,
	Wild_WORD_Plants,
	Wild_WORD_Red,
	Wild_WORD_School,
	Wild_WORD_Sports,
	Wild_WORD_Stones,
	Wild_WORD_Yellow,

	Wild_ICE_TIERS,
	Wild_FIRE_TIERS,
	Wild_TEXAS_TIERS,
	Wild_TRAVEL_TIERS,
	
	// TODO: name ##A,B,C,D for level series?
	Wild_00, Wild_01, Wild_02,
	
	Wild_HIGH,	
	Wild_ULTRA,
	Wild_LOW,
			  
	Wild_12, Wild_13, Wild_15,
	Wild_20,          Wild_22, Wild_23, Wild_24,
	         Wild_27, Wild_28, Wild_29, Wild_29x, Wild_Rx, Wild_Rx5,
	Wild_30, Wild_31, Wild_32, Wild_33, Wild_30x,
	Wild_35, Wild_36, Wild_37, Wild_38,

	//Wild_JUNK_01,
	//Wild_JUNK_02,
	//Wild_JUNK_03,
	//Wild_JUNK_04,
	
	// Letters
	Wild_LTR_A1, Wild_LTR_A2, Wild_LTR_A3,
	Wild_LTR_E1,
	Wild_LTR_I1,
	Wild_LTR_S1,
	Wild_LTR_T1,
	Wild_LTR_Z,
	Wild_LTR_R1, Wild_LTR_R2, Wild_LTR_R3,
	Wild_LTR_Upgrade,
	Wild_LTR_HX,
	Wild_LTR_PX,
	Wild_LTR_Coins,
	
	// Patterns
	Wild_PAT_A, Wild_PAT_E, Wild_CK,
	Wild_LTR_Q,
	Wild_LTR_X,
	Wild_PAT_O,
	Wild_PAT_P,
	
	Wild_HEALTH_Wet,
	
	Wild_M1, Wild_M2,
	Wild_MULTI_8,
	Wild_M4, Wild_M5,
	
	Wild_WORD_Mimic,
	
	Wild_S1, Wild_S3, Wild_S4, Wild_S5, Wild_S3x, Wild_S6, Wild_S7,

	Wild_Riddle,
	
	Wild_AHA,
	Wild_EVE,
	Wild_ACT_Z,

	Wild_ACT_Blank,
	Wild_ACT_Peacock,
	Wild_ACT_Backpack,
	Wild_ACT_Megapack,
	Wild_ACT_Ghost,
	Wild_ACT_Parrot,

	Wild_SEQ_Horse,
	
	Wild_S12, Wild_S13, Wild_S14, Wild_S14X, Wild_S15, Wild_S16,
	
	Wild_Z1, Wild_PAL, Wild_WHO,
	
	Wild_X1, Wild_X2, Wild_X3, Wild_X4,
	
	Wild_V1, Wild_V2, Wild_V2, Wild_V3, Wild_V4, 
	
	Wild_BONUS_Words, //Wild_MOD_Green, Wild_MOD_Blue,
	
	Wild_INFO_Future,
	Wild_ACT_Mag6,
	Wild_ACT_Mag10,
	Wild_ACT_Discard,
	Wild_PAT_Twin,
	
	Wild_WORD_Hear,
	Wild_WORD_See,
	Wild_WORD_Speak,
	
	Wild_WORD_BossKey,
	Wild_ACT_Mailbox,
	Wild_ACT_Alpha3,
	Wild_ACT_Reset,
	Wild_ACT_Stash,
	
	Wild_SCORE_PowerUp,
	Wild_SCORE_E250,
	Wild_SCORE_S500,
	Wild_SCORE_Z600,

	Wild_SCORE_2,
	Wild_SCORE_4,
	Wild_SCORE_8,
	Wild_SCORE_16,
	
	Wild_EXP_1,
	
	Wild_HIGH_Coins,
	Wild_HIGH_Discards,
	Wild_HIGH_First,
	
	Wild_CASH1,
	
	Wild_PAY_Coins,
	Wild_PAY_Discards,
	
	Wild_SLOT_Quarter,
];

function MakeUpgrade(T,letter)
{
	let wild = {};
	Object.keys(T).forEach(prop =>
	{
		wild[prop] = T[prop];
	});
	wild.emoji = '+'+letter+'+',
	wild.letter = letter;
	return wild;
}

	// Build Upgrade Wildcards
	const Upgradable = ['A','E','I','O','U','L','N','R','S','T'];
	for (let letter of Upgradable)
	{
		AllWildcards.push(MakeUpgrade(Wild_UPGRADE_A ,letter));
		AllWildcards.push(MakeUpgrade(Wild_UPGRADE_A4,letter));
		AllWildcards.push(MakeUpgrade(Wild_UPGRADE_A8,letter));
		AllWildcards.push(MakeUpgrade(Wild_UPGRADE_A10,letter));		
	}

function CombinePrizes(wild, prizes)
{
	Object.keys(prizes).forEach(prop =>
	{
		wild.prize[prop] = prizes[prop];
	});
}

function ApplyTemplate(wild, template)
{
	if (wild && template)
	{
		// Loop through keys of the template object
		Object.keys(template).forEach(prop =>
		{
			if (prop == 'prize' && wild.prize)
			{
				CombinePrizes(wild, template[prop]);
			}
			else
			{
				wild[prop] = template[prop];
			}
			
		});		
	}
}

// Builds Words1, Words2, etc. so that cards can
// refer to other sets regardless of their order
for (let W of AllWildcards)
{
	ApplyTemplate(W,W.template);
	
	if (W.templates)
	{
		for (let T of W.templates)
		{
			ApplyTemplate(W,T);
		}
	}

	if (W.category)
	{
		W.category.push(W);
	}
}

function DumpWordCardStats()
{
	console.log("// Word Cards");
	for (let k=0; k<WordCardTable.length; ++k)
	{
		console.log("//");
		let Cat = WordCardTable[k];
		for (let W of Cat)
		{
			let count = W.dict ? W.dict.split('|').length : 0;
			if (W.include)
			{
				for (let g of W.include)
				{
					count += g.split('|').length;
				}
			}
			let text = '// Words'+(k+1)+': ';
			text += W.name.padEnd(6,' ');
			text += ' | '+W.cost+' coins';
			text += ' | +'+W.multi+' multi';
			text += ' | limit='+(W.limit||0);
			text += ' | '+count+' words';
			//console.log('// Words'+(k+1)+': '+W.name.padEnd(6,' ')+' | '+W.cost+' coins | +'
				//+W.multi+' multi | '+count+' words');
			console.log(text);
		}
	}	
}

DumpWordCardStats();