// day/night mode
$(document).ready(function(){
  const button_day_night = $("#jour_nuit_toggle");
  //listener on the day night button 
  button_day_night.on("click", function(){
      //check w/ mode is already active 
      if ($("html").attr("data-bs-theme") == "light"){
          // then applies darkmode
          $("html").attr("data-bs-theme","dark");
          $("#jour_nuit_toggle").attr("class", "btn btn-dark border-dark-subtle");
          $("#jour_nuit_toggle_icon").attr("class", "fa fa-toggle-on");
      }
      else {
          // then applies light mode
          $("html").attr("data-bs-theme","light");
          $("#jour_nuit_toggle").attr("class", "btn btn-light border-light-subtle");
          $("#jour_nuit_toggle_icon").attr("class", "fa fa-toggle-off");
      }
  });
});

//send to page search button
$(document).ready(function(){
  //for search bar
  const send_to_search_page_button = $("#research_button");
  send_to_search_page_button.on("click", function(){
    search_field_value = $("#research").val();
    document.location.href="./search_results.html?q=" + search_field_value;
  });
  // for advanced search bar
 const advanced_send_to_search_page_button = $("#advanced_research_button");
 advanced_send_to_search_page_button.on("click", function(){
    let format_flavor;
    //check the radio button for the flavored format value 
    if($('#radio_flavor_none').is(':checked')) {  
      format_flavor = "none"};
    if($('#radio_flavor_book').is(':checked')) {  
        format_flavor = "book"};
    if($('#radio_flavor_ebook').is(':checked')) {  
        format_flavor = "ebook"};
    //change the value of the filter parameter
    switch (format_flavor){
      case "none" :     
      search_field_value = $("#avanced_research").val();
      document.location.href="./search_results.html?q=" + search_field_value;
      break;
      case "book" :
        search_field_value = $("#avanced_research").val();
        document.location.href="./search_results.html?q=" + search_field_value +"&printType=books" ;
      break;
      case "ebook":
        search_field_value = $("#avanced_research").val();
        document.location.href="./search_results.html?q=" + search_field_value + "&filter=ebooks";
      break;
    }; 
  });
});

//Page action selector 
$(document).ready(function(){
  //if page index
  //if (document.location.pathname.includes("index.html")) {
  //
  //TODO URGENT ! : FIX PATHNAME ISSU W/GITHUB PAGE AND ROOT LUNCH
  
  //if page index
  if (document.location.href.includes("index.html")) {
    for (let j = 0 ; j <3 ; j++) {  
      let search_for = "?q=" + random_word_generator(word_list);
      let requestURL = "https://www.googleapis.com/books/v1/volumes" + search_for ;
              $.ajax({
              url : requestURL,
              maxResults : 1 ,
              type : "GET",
              success : function (result){
                book_of_the_week(result, j)
              },
              error : function (err){console.log(err)}
          });
    };
    // book of the moment link to search result page 
    
  };
    //if page result
    if (document.location.href.includes("search_results.html")) {
      let search_for = location.search;
      let requestURL = "https://www.googleapis.com/books/v1/volumes" + search_for;
              $.ajax({
              url : requestURL,
              type : "GET",
              success : function (result){
              console.log(result);
              for (let i = 0; i < result.items.length ; i++){
                div_duplicator(i);
                distibutor(i, result);
            }},
              error : function (err){console.log(err)}
          });
        }
});

// function book of the week
function book_of_the_week (result, j){
    console.log(result);
    //check if the result has a cover
    for (let l = 0;  l< result.items.length ; l++ ) {
    if (result.items[l].volumeInfo.hasOwnProperty("imageLinks")) {
      $("#book_of_the_moment_img_" + j).attr("src" , result.items[l].volumeInfo.imageLinks.thumbnail );
      $("#book_of_the_moment_link_" + j).attr("href", "./search_results.html?q=+isbn:" + result.items[l].volumeInfo.industryIdentifiers[0].identifier);
      $("#book_of_the_moment_title_" + j).text(result.items[l].volumeInfo.title.substring(0,30));
      $("#book_of_the_moment_title_" + j).attr("class", "text-center");

      break;
    }
    };
  };

//function distributor (distribute the elements of "result" into the matching div) 
function distibutor (i, result){
  //check if the result has a cover
  if (result.items[i].volumeInfo.hasOwnProperty("imageLinks")) {
    $("#book_cover_img_"+ i).attr("src" , result.items[i].volumeInfo.imageLinks.thumbnail );
  }
  else{
    // else call to function cover generator
  book_cover_generator( "#book_cover_" + i , i , result);
  };
  //title
  if (result.items[i].volumeInfo.hasOwnProperty("title")) {
    $("#book_name_"+i).text(result.items[i].volumeInfo.title);
  };
  //author
  if (result.items[i].volumeInfo.hasOwnProperty("authors")) {
    $("#book_author_"+i).text("Author : " + result.items[i].authors);
  }
  else{
    $("#book_author_"+i).text("Author : not available or unknown"); 
  };
  //isbn
  if (result.items[i].volumeInfo.hasOwnProperty("industryIdentifiers")) {
    $("#book_isbn_"+i).text("ID : " + result.items[i].volumeInfo.industryIdentifiers[0].identifier);
  }
  else{
    $("#book_isbn_"+i).text("ID : not available");
  };
  //publication date
  if (result.items[i].volumeInfo.hasOwnProperty("publishedDate")) {
    $("#book_date_"+i).text("1st publication : " + result.items[i].volumeInfo.publishedDate);
  }
  else{
    $("#book_date_"+i).text("1st publication : not available"); 
  };
  //tags
  if (result.items[i].volumeInfo.hasOwnProperty("categories")) {
    $("#book_misc_"+i).text("Tags : " + result.items[i].volumeInfo.categories);
  }
  else{
    $("#book_misc_"+i).text("Tags : not available");
  };
  //synopsis
  if (result.items[i].volumeInfo.hasOwnProperty("description")) {
    $("#book_synopsis_"+i).text( "Synopsis : "+result.items[i].volumeInfo.description.substring(0,400) + "...");
  }
  else{
    $("#book_synopsis_"+i).text("Synopsis : not available"); 
  };
  //rating
  if (result.items[i].volumeInfo.hasOwnProperty("averageRating")) {
    $("#book_rating_"+i).text( "Rating : ");
    rating (i , result); 
  }
  else {
    $("#book_rating_"+i).text(" Rating : not available");
  };
  //ebook download 
  if (result.items[i].volumeInfo.hasOwnProperty("infoLink")){
    $("#book_ebook_link_" + i).attr("href", result.items[i].volumeInfo.infoLink);
  }
  else{
    $("#book_ebook_link_" + i).remove();
  };
};


//function book_cover_generator (genrerate a standardized cover for books)
function book_cover_generator(id, i, result){
let title_short = result.items[i].volumeInfo.title.substring(0,30);
$(id).empty();
$(id).prepend("<div class='bg-primary w-auto h-auto d-flex my-3 mx-1' style='width: 120px!important ; height : 203px!important'><p class='text-wrap align-self-center text-center'>" + title_short + "..." + "</p></div>")
};

//function rating (translate the rating into the five stars systems)
function rating (i, result){
let average_rating_floor = Math.floor(result.items[i].volumeInfo.averageRating);
for (let k=0 ; k < 5 ; k++){
  if (average_rating_floor > k){
  $("#book_rating_"+i).append("<span class='fa-solid fa-star'></span>")
  }
  else{
    $("#book_rating_"+i).append("<span class='fa-regular fa-star'></span>") 
  }
};
};

//function div_duplicator (duplicate the book div for each results we get)
function div_duplicator(i){
  let original_book = $("#book");
    let new_book = original_book.clone();
    let newId = "book_" + i;
      new_book.attr("id", newId);
      new_book.find("#book_cover").attr("id", "book_cover_" + i);
      new_book.find("#book_cover_img").attr("id", "book_cover_img_" + i);
      new_book.find("#book_info").attr("id", "book_info_" + i);
      new_book.find("#book_name").attr("id", "book_name_" + i);
      new_book.find("#book_author").attr("id", "book_author_" + i);
      new_book.find("#book_isbn").attr("id", "book_isbn_" + i);
      new_book.find("#book_date").attr("id", "book_date_" + i);
      new_book.find("#book_misc").attr("id", "book_misc_" + i);
      new_book.find("#book_rating").attr("id", "book_rating_" + i);
      new_book.find("#book_synopsis").attr("id", "book_synopsis_" + i);
      new_book.find("#book_ebook_link").attr("id", "book_ebook_link_" + i);

      new_book.removeAttr("hidden");
    $("#book_container").append(new_book);
  };

  // function generating a randow word from the list
  function random_word_generator(word_list){
    return (word_list[Math.floor(Math.random() * 1944)])
  }

  //word list 
  var word_list = [
    // Borrowed from "random-words" which borrowed it from "xkcd password generator" which borrowed it from wherever
    "ability","able","aboard","about","above","accept","accident","according",
    "account","accurate","acres","across","act","action","active","activity",
    "actual","actually","add","addition","additional","adjective","adult","adventure",
    "advice","affect","afraid","after","afternoon","again","against","age",
    "ago","agree","ahead","aid","air","airplane","alike","alive",
    "all","allow","almost","alone","along","aloud","alphabet","already",
    "also","although","am","among","amount","ancient","angle","angry",
    "animal","announced","another","answer","ants","any","anybody","anyone",
    "anything","anyway","anywhere","apart","apartment","appearance","apple","applied",
    "appropriate","are","area","arm","army","around","arrange","arrangement",
    "arrive","arrow","art","article","as","aside","ask","asleep",
    "at","ate","atmosphere","atom","atomic","attached","attack","attempt",
    "attention","audience","author","automobile","available","average","avoid","aware",
    "away","baby","back","bad","badly","bag","balance","ball",
    "balloon","band","bank","bar","bare","bark","barn","base",
    "baseball","basic","basis","basket","bat","battle","be","bean",
    "bear","beat","beautiful","beauty","became","because","become","becoming",
    "bee","been","before","began","beginning","begun","behavior","behind",
    "being","believed","bell","belong","below","belt","bend","beneath",
    "bent","beside","best","bet","better","between","beyond","bicycle",
    "bigger","biggest","bill","birds","birth","birthday","bit","bite",
    "black","blank","blanket","blew","blind","block","blood","blow",
    "blue","board","boat","body","bone","book","border","born",
    "both","bottle","bottom","bound","bow","bowl","box","boy",
    "brain","branch","brass","brave","bread","break","breakfast","breath",
    "breathe","breathing","breeze","brick","bridge","brief","bright","bring",
    "broad","broke","broken","brother","brought","brown","brush","buffalo",
    "build","building","built","buried","burn","burst","bus","bush",
    "business","busy","but","butter","buy","by","cabin","cage",
    "cake","call","calm","came","camera","camp","can","canal",
    "cannot","cap","capital","captain","captured","car","carbon","card",
    "care","careful","carefully","carried","carry","case","cast","castle",
    "cat","catch","cattle","caught","cause","cave","cell","cent",
    "center","central","century","certain","certainly","chain","chair","chamber",
    "chance","change","changing","chapter","character","characteristic","charge","chart",
    "check","cheese","chemical","chest","chicken","chief","child","children",
    "choice","choose","chose","chosen","church","circle","circus","citizen",
    "city","class","classroom","claws","clay","clean","clear","clearly",
    "climate","climb","clock","close","closely","closer","cloth","clothes",
    "clothing","cloud","club","coach","coal","coast","coat","coffee",
    "cold","collect","college","colony","color","column","combination","combine",
    "come","comfortable","coming","command","common","community","company","compare",
    "compass","complete","completely","complex","composed","composition","compound","concerned",
    "condition","congress","connected","consider","consist","consonant","constantly","construction",
    "contain","continent","continued","contrast","control","conversation","cook","cookies",
    "cool","copper","copy","corn","corner","correct","correctly","cost",
    "cotton","could","count","country","couple","courage","course","court",
    "cover","cow","cowboy","crack","cream","create","creature","crew",
    "crop","cross","crowd","cry","cup","curious","current","curve",
    "customs","cut","cutting","daily","damage","dance","danger","dangerous",
    "dark","darkness","date","daughter","dawn","day","dead","deal",
    "dear","death","decide","declared","deep","deeply","deer","definition",
    "degree","depend","depth","describe","desert","design","desk","detail",
    "determine","develop","development","diagram","diameter","did","die","differ",
    "difference","different","difficult","difficulty","dig","dinner","direct","direction",
    "directly","dirt","dirty","disappear","discover","discovery","discuss","discussion",
    "disease","dish","distance","distant","divide","division","do","doctor",
    "does","dog","doing","doll","dollar","done","donkey","door",
    "dot","double","doubt","down","dozen","draw","drawn","dream",
    "dress","drew","dried","drink","drive","driven","driver","driving",
    "drop","dropped","drove","dry","duck","due","dug","dull",
    "during","dust","duty","each","eager","ear","earlier","early",
    "earn","earth","easier","easily","east","easy","eat","eaten",
    "edge","education","effect","effort","egg","eight","either","electric",
    "electricity","element","elephant","eleven","else","empty","end","enemy",
    "energy","engine","engineer","enjoy","enough","enter","entire","entirely",
    "environment","equal","equally","equator","equipment","escape","especially","essential",
    "establish","even","evening","event","eventually","ever","every","everybody",
    "everyone","everything","everywhere","evidence","exact","exactly","examine","example",
    "excellent","except","exchange","excited","excitement","exciting","exclaimed","exercise",
    "exist","expect","experience","experiment","explain","explanation","explore","express",
    "expression","extra","eye","face","facing","fact","factor","factory",
    "failed","fair","fairly","fall","fallen","familiar","family","famous",
    "far","farm","farmer","farther","fast","fastened","faster","fat",
    "father","favorite","fear","feathers","feature","fed","feed","feel",
    "feet","fell","fellow","felt","fence","few","fewer","field",
    "fierce","fifteen","fifth","fifty","fight","fighting","figure","fill",
    "film","final","finally","find","fine","finest","finger","finish",
    "fire","fireplace","firm","first","fish","five","fix","flag",
    "flame","flat","flew","flies","flight","floating","floor","flow",
    "flower","fly","fog","folks","follow","food","foot","football",
    "for","force","foreign","forest","forget","forgot","forgotten","form",
    "former","fort","forth","forty","forward","fought","found","four",
    "fourth","fox","frame","free","freedom","frequently","fresh","friend",
    "friendly","frighten","frog","from","front","frozen","fruit","fuel",
    "full","fully","fun","function","funny","fur","furniture","further",
    "future","gain","game","garage","garden","gas","gasoline","gate",
    "gather","gave","general","generally","gentle","gently","get","getting",
    "giant","gift","girl","give","given","giving","glad","glass",
    "globe","go","goes","gold","golden","gone","good","goose",
    "got","government","grabbed","grade","gradually","grain","grandfather","grandmother",
    "graph","grass","gravity","gray","great","greater","greatest","greatly",
    "green","grew","ground","group","grow","grown","growth","guard",
    "guess","guide","gulf","gun","habit","had","hair","half",
    "halfway","hall","hand","handle","handsome","hang","happen","happened",
    "happily","happy","harbor","hard","harder","hardly","has","hat",
    "have","having","hay","he","headed","heading","health","heard",
    "hearing","heart","heat","heavy","height","held","hello","help",
    "helpful","her","herd","here","herself","hidden","hide","high",
    "higher","highest","highway","hill","him","himself","his","history",
    "hit","hold","hole","hollow","home","honor","hope","horn",
    "horse","hospital","hot","hour","house","how","however","huge",
    "human","hundred","hung","hungry","hunt","hunter","hurried","hurry",
    "hurt","husband","ice","idea","identity","if","ill","image",
    "imagine","immediately","importance","important","impossible","improve","in","inch",
    "include","including","income","increase","indeed","independent","indicate","individual",
    "industrial","industry","influence","information","inside","instance","instant","instead",
    "instrument","interest","interior","into","introduced","invented","involved","iron",
    "is","island","it","its","itself","jack","jar","jet",
    "job","join","joined","journey","joy","judge","jump","jungle",
    "just","keep","kept","key","kids","kill","kind","kitchen",
    "knew","knife","know","knowledge","known","label","labor","lack",
    "lady","laid","lake","lamp","land","language","large","larger",
    "largest","last","late","later","laugh","law","lay","layers",
    "lead","leader","leaf","learn","least","leather","leave","leaving",
    "led","left","leg","length","lesson","let","letter","level",
    "library","lie","life","lift","light","like","likely","limited",
    "line","lion","lips","liquid","list","listen","little","live",
    "living","load","local","locate","location","log","lonely","long",
    "longer","look","loose","lose","loss","lost","lot","loud",
    "love","lovely","low","lower","luck","lucky","lunch","lungs",
    "lying","machine","machinery","mad","made","magic","magnet","mail",
    "main","mainly","major","make","making","man","managed","manner",
    "manufacturing","many","map","mark","market","married","mass","massage",
    "master","material","mathematics","matter","may","maybe","me","meal",
    "mean","means","meant","measure","meat","medicine","meet","melted",
    "member","memory","men","mental","merely","met","metal","method",
    "mice","middle","might","mighty","mile","military","milk","mill",
    "mind","mine","minerals","minute","mirror","missing","mission","mistake",
    "mix","mixture","model","modern","molecular","moment","money","monkey",
    "month","mood","moon","more","morning","most","mostly","mother",
    "motion","motor","mountain","mouse","mouth","move","movement","movie",
    "moving","mud","muscle","music","musical","must","my","myself",
    "mysterious","nails","name","nation","national","native","natural","naturally",
    "nature","near","nearby","nearer","nearest","nearly","necessary","neck",
    "needed","needle","needs","negative","neighbor","neighborhood","nervous","nest",
    "never","new","news","newspaper","next","nice","night","nine",
    "no","nobody","nodded","noise","none","noon","nor","north",
    "nose","not","note","noted","nothing","notice","noun","now",
    "number","numeral","nuts","object","observe","obtain","occasionally","occur",
    "ocean","of","off","offer","office","officer","official","oil",
    "old","older","oldest","on","once","one","only","onto",
    "open","operation","opinion","opportunity","opposite","or","orange","orbit",
    "order","ordinary","organization","organized","origin","original","other","ought",
    "our","ourselves","out","outer","outline","outside","over","own",
    "owner","oxygen","pack","package","page","paid","pain","paint",
    "pair","palace","pale","pan","paper","paragraph","parallel","parent",
    "park","part","particles","particular","particularly","partly","parts","party",
    "pass","passage","past","path","pattern","pay","peace","pen",
    "pencil","people","per","percent","perfect","perfectly","perhaps","period",
    "person","personal","pet","phrase","physical","piano","pick","picture",
    "pictured","pie","piece","pig","pile","pilot","pine","pink",
    "pipe","pitch","place","plain","plan","plane","planet","planned",
    "planning","plant","plastic","plate","plates","play","pleasant","please",
    "pleasure","plenty","plural","plus","pocket","poem","poet","poetry",
    "point","pole","police","policeman","political","pond","pony","pool",
    "poor","popular","population","porch","port","position","positive","possible",
    "possibly","post","pot","potatoes","pound","pour","powder","power",
    "powerful","practical","practice","prepare","present","president","press","pressure",
    "pretty","prevent","previous","price","pride","primitive","principal","principle",
    "printed","private","prize","probably","problem","process","produce","product",
    "production","program","progress","promised","proper","properly","property","protection",
    "proud","prove","provide","public","pull","pupil","pure","purple",
    "purpose","push","put","putting","quarter","queen","question","quick",
    "quickly","quiet","quietly","quite","rabbit","race","radio","railroad",
    "rain","raise","ran","ranch","range","rapidly","rate","rather",
    "raw","rays","reach","read","reader","ready","real","realize",
    "rear","reason","recall","receive","recent","recently","recognize","record",
    "red","refer","refused","region","regular","related","relationship","religious",
    "remain","remarkable","remember","remove","repeat","replace","replied","report",
    "represent","require","research","respect","rest","result","return","review",
    "rhyme","rhythm","rice","rich","ride","riding","right","ring",
    "rise","rising","river","road","roar","rock","rocket","rocky",
    "rod","roll","roof","room","root","rope","rose","rough",
    "round","route","row","rubbed","rubber","rule","ruler","run",
    "running","rush","sad","saddle","safe","safety","said","sail",
    "sale","salmon","salt","same","sand","sang","sat","satellites",
    "satisfied","save","saved","saw","say","scale","scared","scene",
    "school","science","scientific","scientist","score","screen","sea","search",
    "season","seat","second","secret","section","see","seed","seeing",
    "seems","seen","seldom","select","selection","sell","send","sense",
    "sent","sentence","separate","series","serious","serve","service","sets",
    "setting","settle","settlers","seven","several","shade","shadow","shake",
    "shaking","shall","shallow","shape","share","sharp","she","sheep",
    "sheet","shelf","shells","shelter","shine","shinning","ship","shirt",
    "shoe","shoot","shop","shore","short","shorter","shot","should",
    "shoulder","shout","show","shown","shut","sick","sides","sight",
    "sign","signal","silence","silent","silk","silly","silver","similar",
    "simple","simplest","simply","since","sing","single","sink","sister",
    "sit","sitting","situation","six","size","skill","skin","sky",
    "slabs","slave","sleep","slept","slide","slight","slightly","slip",
    "slipped","slope","slow","slowly","small","smaller","smallest","smell",
    "smile","smoke","smooth","snake","snow","so","soap","social",
    "society","soft","softly","soil","solar","sold","soldier","solid",
    "solution","solve","some","somebody","somehow","someone","something","sometime",
    "somewhere","son","song","soon","sort","sound","source","south",
    "southern","space","speak","special","species","specific","speech","speed",
    "spell","spend","spent","spider","spin","spirit","spite","split",
    "spoken","sport","spread","spring","square","stage","stairs","stand",
    "standard","star","stared","start","state","statement","station","stay",
    "steady","steam","steel","steep","stems","step","stepped","stick",
    "stiff","still","stock","stomach","stone","stood","stop","stopped",
    "store","storm","story","stove","straight","strange","stranger","straw",
    "stream","street","strength","stretch","strike","string","strip","strong",
    "stronger","struck","structure","struggle","stuck","student","studied","studying",
    "subject","substance","success","successful","such","sudden","suddenly","sugar",
    "suggest","suit","sum","summer","sun","sunlight","supper","supply",
    "support","suppose","sure","surface","surprise","surrounded","swam","sweet",
    "swept","swim","swimming","swing","swung","syllable","symbol","system",
    "table","tail","take","taken","tales","talk","tall","tank",
    "tape","task","taste","taught","tax","tea","teach","teacher",
    "team","tears","teeth","telephone","television","tell","temperature","ten",
    "tent","term","terrible","test","than","thank","that","thee",
    "them","themselves","then","theory","there","therefore","these","they",
    "thick","thin","thing","think","third","thirty","this","those",
    "thou","though","thought","thousand","thread","three","threw","throat",
    "through","throughout","throw","thrown","thumb","thus","thy","tide",
    "tie","tight","tightly","till","time","tin","tiny","tip",
    "tired","title","to","tobacco","today","together","told","tomorrow",
    "tone","tongue","tonight","too","took","tool","top","topic",
    "torn","total","touch","toward","tower","town","toy","trace",
    "track","trade","traffic","trail","train","transportation","trap","travel",
    "treated","tree","triangle","tribe","trick","tried","trip","troops",
    "tropical","trouble","truck","trunk","truth","try","tube","tune",
    "turn","twelve","twenty","twice","two","type","typical","uncle",
    "under","underline","understanding","unhappy","union","unit","universe","unknown",
    "unless","until","unusual","up","upon","upper","upward","us",
    "use","useful","using","usual","usually","valley","valuable","value",
    "vapor","variety","various","vast","vegetable","verb","vertical","very",
    "vessels","victory","view","village","visit","visitor","voice","volume",
    "vote","vowel","voyage","wagon","wait","walk","wall","want",
    "war","warm","warn","was","wash","waste","watch","water",
    "wave","way","we","weak","wealth","wear","weather","week",
    "weigh","weight","welcome","well","went","were","west","western",
    "wet","whale","what","whatever","wheat","wheel","when","whenever",
    "where","wherever","whether","which","while","whispered","whistle","white",
    "who","whole","whom","whose","why","wide","widely","wife",
    "wild","will","willing","win","wind","window","wing","winter",
    "wire","wise","wish","with","within","without","wolf","women",
    "won","wonder","wonderful","wood","wooden","wool","word","wore",
    "work","worker","world","worried","worry","worse","worth","would",
    "wrapped","write","writer","writing","written","wrong","wrote","yard",
    "year","yellow","yes","yesterday","yet","you","young","younger",
    "your","yourself","youth","zero","zebra","zipper","zoo","zulu"
  ];