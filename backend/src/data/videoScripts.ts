/**
 * Localized narration scripts for the EcoQuest awareness video.
 * Each script is ~45-60 seconds when spoken at a natural pace.
 * Language codes match the 9 supported languages in LanguageContext.
 */

export type VideoTopic =
  | 'carbon_awareness'
  | 'green_city'
  | 'transport'
  | 'energy'
  | 'waste';

export type SupportedLanguage =
  | 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'ja' | 'zh';

interface ScriptEntry {
  /** The spoken narration text (used for TTS synthesis) */
  text: string;
  /** Short display title for the frontend */
  title: string;
}

/**
 * All video scripts indexed by topic and then language.
 * Kept as flat strings so TTS can read them verbatim.
 */
export const VIDEO_SCRIPTS: Record<VideoTopic, Record<SupportedLanguage, ScriptEntry>> = {

  // ── Topic 1: Carbon Awareness (default intro) ────────────────────────────
  carbon_awareness: {
    en: {
      title: 'The Carbon Crisis',
      text: `Every year, human activities pump over 37 billion tonnes of carbon dioxide into our atmosphere. That is more than all the forests on Earth can absorb. The result? Rising temperatures. Melting ice. Extreme weather. But here is the incredible truth: the choices you make every single day — how you travel, what you eat, how you power your home — directly shape that number. Your daily decisions are not small. Collectively, they move mountains. This is EcoQuest. Let us discover the power of your choices.`,
    },
    hi: {
      title: 'कार्बन संकट',
      text: `हर साल, मानवीय गतिविधियाँ हमारे वायुमंडल में 37 अरब टन से अधिक कार्बन डाइऑक्साइड पंप करती हैं। यह पृथ्वी के सभी जंगलों की अवशोषण क्षमता से कहीं अधिक है। परिणाम? बढ़ता तापमान। पिघलती बर्फ। चरम मौसम। लेकिन सच्चाई यह है: आप हर दिन जो चुनाव करते हैं — आप कैसे यात्रा करते हैं, क्या खाते हैं, अपने घर को कैसे ऊर्जा देते हैं — ये सब उस संख्या को सीधे प्रभावित करते हैं। यह EcoQuest है। आइए अपने विकल्पों की शक्ति खोजें।`,
    },
    es: {
      title: 'La Crisis del Carbono',
      text: `Cada año, las actividades humanas bombean más de 37 mil millones de toneladas de dióxido de carbono a nuestra atmósfera. Eso es más de lo que todos los bosques de la Tierra pueden absorber. ¿El resultado? Temperaturas en aumento. Hielo derritiéndose. Climas extremos. Pero aquí está la increíble verdad: las elecciones que haces cada día — cómo viajas, qué comes, cómo alimentas tu hogar — dan forma directamente a ese número. Bienvenido a EcoQuest. Descubramos el poder de tus elecciones.`,
    },
    fr: {
      title: 'La Crise Carbone',
      text: `Chaque année, les activités humaines injectent plus de 37 milliards de tonnes de dioxyde de carbone dans notre atmosphère. C'est plus que ce que toutes les forêts de la Terre peuvent absorber. Le résultat ? Des températures en hausse. Des glaces qui fondent. Des conditions météorologiques extrêmes. Mais voici l'incroyable vérité : les choix que vous faites chaque jour — comment vous vous déplacez, ce que vous mangez, comment vous alimentez votre maison — façonnent directement ce chiffre. Bienvenue dans EcoQuest. Découvrons le pouvoir de vos choix.`,
    },
    de: {
      title: 'Die Klimakrise',
      text: `Jedes Jahr pumpen menschliche Aktivitäten über 37 Milliarden Tonnen Kohlendioxid in unsere Atmosphäre. Das ist mehr als alle Wälder der Erde aufnehmen können. Das Ergebnis? Steigende Temperaturen. Schmelzendes Eis. Extremwetter. Aber hier ist die unglaubliche Wahrheit: Die Entscheidungen, die Sie jeden Tag treffen — wie Sie reisen, was Sie essen, wie Sie Ihr Zuhause mit Energie versorgen — formen direkt diese Zahl. Willkommen bei EcoQuest. Entdecken wir die Kraft Ihrer Entscheidungen.`,
    },
    pt: {
      title: 'A Crise do Carbono',
      text: `A cada ano, as atividades humanas bombeiam mais de 37 bilhões de toneladas de dióxido de carbono para nossa atmosfera. Isso é mais do que todas as florestas da Terra conseguem absorver. O resultado? Temperaturas em alta. Gelo derretendo. Clima extremo. Mas aqui está a incrível verdade: as escolhas que você faz todos os dias — como você viaja, o que come, como abastece sua casa — moldam diretamente esse número. Bem-vindo ao EcoQuest. Vamos descobrir o poder das suas escolhas.`,
    },
    ar: {
      title: 'أزمة الكربون',
      text: `كل عام، تضخ الأنشطة البشرية أكثر من 37 مليار طن من ثاني أكسيد الكربون في غلافنا الجوي. هذا أكثر مما يمكن لجميع غابات الأرض امتصاصه. النتيجة؟ ارتفاع درجات الحرارة. ذوبان الجليد. طقس متطرف. لكن إليك الحقيقة المذهلة: الخيارات التي تتخذها كل يوم — كيف تتنقل، وماذا تأكل، وكيف تزود منزلك بالطاقة — تشكل هذا الرقم مباشرة. مرحباً بك في EcoQuest. لنكتشف قوة خياراتك.`,
    },
    ja: {
      title: '炭素危機',
      text: `毎年、人間の活動によって370億トン以上の二酸化炭素が大気中に排出されています。これは地球上のすべての森林が吸収できる量をはるかに超えています。その結果は？気温の上昇。氷の融解。異常気象。しかし、驚くべき真実があります。あなたが毎日行う選択 — 移動手段、食べ物、家のエネルギーの使い方 — がその数字を直接左右しています。EcoQuestへようこそ。あなたの選択の力を一緒に発見しましょう。`,
    },
    zh: {
      title: '碳危机',
      text: `每年，人类活动向大气层排放超过370亿吨二氧化碳。这超过了地球上所有森林所能吸收的总量。结果呢？气温上升。冰川融化。极端天气。但有一个令人振奋的真相：您每天做出的选择——如何出行、吃什么、如何为家庭供电——直接影响着这个数字。欢迎来到EcoQuest。让我们一起发现您的选择所具有的力量。`,
    },
  },

  // ── Topic 2: Green City ───────────────────────────────────────────────────
  green_city: {
    en: {
      title: 'Cities of Tomorrow',
      text: `Imagine a city where clean air is the norm. Where solar panels line the rooftops and electric trams glide silently through tree-lined boulevards. Where parks outnumber parking lots. This is not a fantasy. Cities like Copenhagen, Singapore, and Amsterdam are already proving it is possible. And the blueprint? It starts with individual choices. When enough people choose green transport, clean energy, and sustainable food, cities transform. You have more power than you think. Play EcoQuest and see exactly how much.`,
    },
    hi: {
      title: 'कल के शहर',
      text: `कल्पना करें एक ऐसे शहर की जहाँ स्वच्छ हवा आम बात हो। जहाँ छतों पर सौर पैनल हों और बिजली की ट्रामें पेड़-पंक्तिबद्ध सड़कों पर खामोशी से चलें। जहाँ पार्क पार्किंग की जगहों से ज्यादा हों। यह कोई कल्पना नहीं है। कोपेनहेगन, सिंगापुर और एम्स्टर्डम जैसे शहर पहले से यह साबित कर रहे हैं। और इसकी नींव? यह व्यक्तिगत विकल्पों से शुरू होती है। EcoQuest खेलें और देखें आप कितना बदलाव ला सकते हैं।`,
    },
    es: {
      title: 'Ciudades del Mañana',
      text: `Imagina una ciudad donde el aire limpio es la norma. Donde los paneles solares cubren los tejados y los tranvías eléctricos se deslizan silenciosamente por bulevares arbolados. Donde los parques superan en número a los estacionamientos. Esto no es una fantasía. Ciudades como Copenhague, Singapur y Ámsterdam ya están demostrando que es posible. ¿Y el plan? Empieza con las elecciones individuales. Juega EcoQuest y descubre exactamente cuánto puedes cambiar.`,
    },
    fr: {
      title: 'Les Villes de Demain',
      text: `Imaginez une ville où l'air pur est la norme. Où les panneaux solaires recouvrent les toits et où les tramways électriques glissent silencieusement le long des boulevards arborés. Où les parcs surpassent en nombre les parkings. Ce n'est pas une fantaisie. Des villes comme Copenhague, Singapour et Amsterdam le prouvent déjà. Jouez à EcoQuest et découvrez exactement combien vous pouvez changer les choses.`,
    },
    de: {
      title: 'Städte von Morgen',
      text: `Stellen Sie sich eine Stadt vor, in der saubere Luft die Norm ist. Wo Sonnenkollektoren auf den Dächern liegen und Elektrostrassenbahnen lautlos durch baumgesäumte Boulevards gleiten. Wo Parks die Parkplätze überwiegen. Das ist keine Fantasie. Städte wie Kopenhagen, Singapur und Amsterdam beweisen es bereits. Spielen Sie EcoQuest und entdecken Sie, wie viel Sie verändern können.`,
    },
    pt: {
      title: 'Cidades do Amanhã',
      text: `Imagine uma cidade onde o ar limpo é a norma. Onde painéis solares cobrem os telhados e bondes elétricos deslizam silenciosamente por bulevares arborizados. Onde parques superam estacionamentos em número. Isso não é uma fantasia. Cidades como Copenhague, Singapura e Amsterdã já estão provando que é possível. Jogue EcoQuest e descubra exatamente quanto você pode mudar.`,
    },
    ar: {
      title: 'مدن الغد',
      text: `تخيل مدينة يكون فيها الهواء النقي هو القاعدة. حيث تُغطي الألواح الشمسية أسطح المنازل وتنزلق ترامات كهربائية بصمت عبر الشوارع المزروعة بالأشجار. حيث تفوق المتنزهات عدد مواقف السيارات. هذا ليس خيالاً. مدن مثل كوبنهاغن وسنغافورة وأمستردام تثبت ذلك بالفعل. العب EcoQuest واكتشف مقدار ما يمكنك تغييره.`,
    },
    ja: {
      title: '未来の都市',
      text: `きれいな空気が当たり前の都市を想像してください。屋上に太陽光パネルが並び、電気トラムが並木道を静かに走る都市を。駐車場より公園の多い都市を。これは夢物語ではありません。コペンハーゲン、シンガポール、アムステルダムなどの都市がすでに実現しています。EcoQuestをプレイして、あなたにどれだけの変革力があるか確かめてください。`,
    },
    zh: {
      title: '明日之城',
      text: `想象一座清洁空气是常态的城市。太阳能板铺满屋顶，电动有轨电车在林荫大道上静静滑行。公园比停车场更多。这不是幻想。哥本哈根、新加坡和阿姆斯特丹等城市已经在证明这是可能的。玩EcoQuest，看看您能改变多少。`,
    },
  },

  // ── Topic 3: Transport ────────────────────────────────────────────────────
  transport: {
    en: {
      title: 'How We Move Matters',
      text: `Transport accounts for around 24 percent of global carbon emissions. A single return flight from London to New York produces as much CO2 as three months of average daily driving. But here is something remarkable: switching just your daily commute from a private car to cycling or public transport can reduce your personal carbon footprint by up to one tonne per year. That is the equivalent of planting 50 trees. The way you move is one of the most powerful levers you have. Let us explore it together in EcoQuest.`,
    },
    hi: {
      title: 'आवागमन का महत्व',
      text: `परिवहन वैश्विक कार्बन उत्सर्जन का लगभग 24 प्रतिशत है। लंदन से न्यूयॉर्क की एक वापसी उड़ान तीन महीने की दैनिक ड्राइविंग जितना CO2 पैदा करती है। लेकिन एक उल्लेखनीय तथ्य: अपनी दैनिक यात्रा को निजी कार से साइकिल या सार्वजनिक परिवहन में बदलने से आप प्रति वर्ष एक टन तक कार्बन कम कर सकते हैं। यह 50 पेड़ लगाने के बराबर है। EcoQuest में इसे अन्वेषण करें।`,
    },
    es: {
      title: 'Cómo nos Movemos Importa',
      text: `El transporte representa alrededor del 24 por ciento de las emisiones globales de carbono. Un vuelo de ida y vuelta de Londres a Nueva York produce tanto CO2 como tres meses de conducción diaria promedio. Pero aquí hay algo notable: cambiar solo tu viaje diario de un auto particular a la bicicleta o el transporte público puede reducir tu huella de carbono personal hasta en una tonelada por año. Eso equivale a plantar 50 árboles. Exploremos esto juntos en EcoQuest.`,
    },
    fr: {
      title: 'Notre Façon de Voyager',
      text: `Le transport représente environ 24 pour cent des émissions mondiales de carbone. Un vol aller-retour de Londres à New York produit autant de CO2 que trois mois de conduite quotidienne moyenne. Mais voici quelque chose de remarquable : remplacer votre trajet quotidien en voiture par le vélo ou les transports en commun peut réduire votre empreinte carbone d'une tonne par an. Explorons cela ensemble dans EcoQuest.`,
    },
    de: {
      title: 'Wie wir uns Bewegen',
      text: `Der Verkehr ist für rund 24 Prozent der globalen Kohlenstoffemissionen verantwortlich. Ein Hin- und Rückflug von London nach New York produziert so viel CO2 wie drei Monate durchschnittliches tägliches Fahren. Aber hier ist etwas Bemerkenswertes: Wenn Sie Ihren täglichen Arbeitsweg vom Auto auf das Fahrrad oder öffentliche Verkehrsmittel umstellen, können Sie Ihren persönlichen CO2-Fußabdruck um eine Tonne pro Jahr reduzieren. Erkunden wir das gemeinsam in EcoQuest.`,
    },
    pt: {
      title: 'Como Nos Movemos Importa',
      text: `O transporte representa cerca de 24 por cento das emissões globais de carbono. Um voo de ida e volta de Londres para Nova York produz tanto CO2 quanto três meses de direção diária média. Mas aqui está algo notável: mudar apenas seu trajeto diário de carro particular para bicicleta ou transporte público pode reduzir sua pegada de carbono pessoal em até uma tonelada por ano. Isso equivale a plantar 50 árvores. Vamos explorar isso juntos no EcoQuest.`,
    },
    ar: {
      title: 'كيف ننتقل يهم',
      text: `يمثل النقل نحو 24 بالمئة من انبعاثات الكربون العالمية. تنتج رحلة ذهاب وإياب من لندن إلى نيويورك من ثاني أكسيد الكربون ما يعادل ثلاثة أشهر من القيادة اليومية المعتادة. لكن إليك شيئاً مذهلاً: مجرد تغيير تنقلك اليومي من السيارة الخاصة إلى الدراجة أو وسائل النقل العام يمكن أن يقلل بصمتك الكربونية بطن واحد سنوياً. دعنا نستكشف ذلك معاً في EcoQuest.`,
    },
    ja: {
      title: '移動の選択が重要',
      text: `交通機関は世界の炭素排出量の約24パーセントを占めています。ロンドン・ニューヨーク間の往復フライトは、3ヶ月間の平均的な毎日の運転と同量のCO2を排出します。しかし注目すべき事実があります。日常の通勤を自家用車から自転車や公共交通機関に切り替えるだけで、年間最大1トンの炭素フットプリントを削減できます。これは50本の木を植えることに相当します。EcoQuestで一緒に探っていきましょう。`,
    },
    zh: {
      title: '出行方式的重要性',
      text: `交通运输约占全球碳排放量的24%。伦敦到纽约的往返航班产生的CO2相当于三个月日常驾车的排放量。但有一个惊人的事实：仅将日常通勤从私家车改为骑行或公共交通，每年就能减少高达一吨的个人碳足迹。这相当于种植50棵树。让我们在EcoQuest中一起探索这个话题。`,
    },
  },

  // ── Topic 4: Energy ───────────────────────────────────────────────────────
  energy: {
    en: {
      title: 'Power Your World Differently',
      text: `Energy is the lifeblood of modern civilization — but how we generate it defines our future. Today, fossil fuels still power over 60 percent of global electricity. Every kilowatt-hour of coal electricity releases nearly one kilogram of CO2. Solar? Just four grams. That is 250 times cleaner. And the good news: renewable energy is now the cheapest source of electricity in history. Your home energy choices — LED lighting, smart thermostats, green tariffs — are votes for the world you want to live in. Cast your vote in EcoQuest.`,
    },
    hi: {
      title: 'ऊर्जा का नया अध्याय',
      text: `ऊर्जा आधुनिक सभ्यता की जीवन रेखा है — लेकिन हम इसे कैसे उत्पन्न करते हैं यही हमारा भविष्य तय करता है। आज भी जीवाश्म ईंधन वैश्विक बिजली का 60 प्रतिशत से अधिक उत्पन्न करते हैं। कोयले से उत्पन्न बिजली का हर किलोवाट-घंटा लगभग एक किलोग्राम CO2 छोड़ता है। सौर ऊर्जा? मात्र चार ग्राम। और अच्छी खबर यह है कि अक्षय ऊर्जा अब इतिहास में बिजली का सबसे सस्ता स्रोत है। EcoQuest में अपना वोट दें।`,
    },
    es: {
      title: 'Energía para un Mundo Mejor',
      text: `La energía es el sustento de la civilización moderna, pero cómo la generamos define nuestro futuro. Hoy, los combustibles fósiles aún alimentan más del 60 por ciento de la electricidad mundial. Cada kilovatio-hora de electricidad de carbón libera casi un kilogramo de CO2. ¿Solar? Solo cuatro gramos. La buena noticia: la energía renovable es ahora la fuente de electricidad más barata de la historia. Emite tu voto en EcoQuest.`,
    },
    fr: {
      title: 'Alimenter le Monde Autrement',
      text: `L'énergie est le sang de la civilisation moderne, mais la façon dont nous la générons définit notre avenir. Aujourd'hui, les combustibles fossiles alimentent encore plus de 60 pour cent de l'électricité mondiale. Chaque kilowattheure d'électricité au charbon libère près d'un kilogramme de CO2. Le solaire ? Seulement quatre grammes. Bonne nouvelle : les énergies renouvelables sont désormais la source d'électricité la moins chère de l'histoire. Votez dans EcoQuest.`,
    },
    de: {
      title: 'Energie neu denken',
      text: `Energie ist das Lebensblut der modernen Zivilisation — aber wie wir sie erzeugen, definiert unsere Zukunft. Heute werden noch über 60 Prozent des weltweiten Stroms mit fossilen Brennstoffen erzeugt. Jede Kilowattstunde Kohlestrom setzt fast ein Kilogramm CO2 frei. Solar? Nur vier Gramm. Die gute Nachricht: Erneuerbare Energien sind heute die günstigste Stromquelle der Geschichte. Geben Sie Ihre Stimme in EcoQuest ab.`,
    },
    pt: {
      title: 'Energia para um Mundo Melhor',
      text: `A energia é a força vital da civilização moderna — mas como a geramos define nosso futuro. Hoje, os combustíveis fósseis ainda alimentam mais de 60 por cento da eletricidade global. Cada quilowatt-hora de eletricidade a carvão libera quase um quilograma de CO2. Solar? Apenas quatro gramas. A boa notícia: a energia renovável é agora a fonte de eletricidade mais barata da história. Vote no EcoQuest.`,
    },
    ar: {
      title: 'طاقة لعالم أفضل',
      text: `الطاقة هي شريان الحياة للحضارة الحديثة، لكن طريقة توليدها تحدد مستقبلنا. اليوم، لا تزال الوقود الأحفوري تولد أكثر من 60 بالمئة من الكهرباء العالمية. كل كيلوواط ساعة من كهرباء الفحم تطلق ما يقارب كيلوغراماً من CO2. الطاقة الشمسية؟ أربعة غرامات فقط. والخبر الجيد: الطاقة المتجددة هي الآن أرخص مصدر للكهرباء في التاريخ. أدلِ بصوتك في EcoQuest.`,
    },
    ja: {
      title: '未来のエネルギー',
      text: `エネルギーは現代文明の生命線ですが、それをどのように生み出すかが私たちの未来を決定します。今日でも、化石燃料が世界の電力の60パーセント以上を担っています。石炭による電力1キロワット時は約1キログラムのCO2を排出します。太陽光は？わずか4グラムです。良いニュースは、再生可能エネルギーが今や史上最も安い電源になったことです。EcoQuestであなたの一票を投じてください。`,
    },
    zh: {
      title: '能源新选择',
      text: `能源是现代文明的命脉——但我们如何产生它决定了我们的未来。如今，化石燃料仍然为全球超过60%的电力提供动力。每千瓦时的煤炭电力会释放近一公斤的CO2。太阳能呢？仅仅四克。好消息是：可再生能源现在是历史上最廉价的电力来源。在EcoQuest中投下您的一票。`,
    },
  },

  // ── Topic 5: Waste ────────────────────────────────────────────────────────
  waste: {
    en: {
      title: 'Closing the Loop',
      text: `Every year, the world generates over 2 billion tonnes of solid waste. Landfills are a major source of methane — a greenhouse gas 80 times more potent than CO2 over 20 years. But waste is also an opportunity. Composting, recycling, and choosing products designed to last transforms what we throw away into resources. A circular economy — where nothing becomes waste — is within reach. It begins with the choices in your bin. In your kitchen. In your shopping cart. EcoQuest shows you how every decision creates ripples.`,
    },
    hi: {
      title: 'चक्रीय अर्थव्यवस्था',
      text: `हर साल, दुनिया 2 अरब टन से अधिक ठोस अपशिष्ट उत्पन्न करती है। लैंडफिल मीथेन का एक प्रमुख स्रोत हैं — एक ग्रीनहाउस गैस जो 20 वर्षों में CO2 से 80 गुना अधिक शक्तिशाली है। लेकिन कचरा एक अवसर भी है। कम्पोस्टिंग, पुनर्चक्रण और टिकाऊ उत्पाद चुनना हमारे फेंके जाने वाले कचरे को संसाधनों में बदल देता है। EcoQuest में देखें कि आपके हर निर्णय से लहरें कैसे उठती हैं।`,
    },
    es: {
      title: 'Cerrando el Ciclo',
      text: `Cada año, el mundo genera más de 2 mil millones de toneladas de residuos sólidos. Los vertederos son una fuente importante de metano, un gas de efecto invernadero 80 veces más potente que el CO2 en 20 años. Pero los residuos también son una oportunidad. El compostaje, el reciclaje y elegir productos duraderos transforma lo que tiramos en recursos. EcoQuest te muestra cómo cada decisión crea ondas.`,
    },
    fr: {
      title: 'Fermer la Boucle',
      text: `Chaque année, le monde génère plus de 2 milliards de tonnes de déchets solides. Les décharges sont une source majeure de méthane, un gaz à effet de serre 80 fois plus puissant que le CO2 sur 20 ans. Mais les déchets représentent aussi une opportunité. Le compostage, le recyclage et le choix de produits durables transforment ce que nous jetons en ressources. EcoQuest vous montre comment chaque décision crée des ondulations.`,
    },
    de: {
      title: 'Den Kreislauf schließen',
      text: `Jedes Jahr produziert die Welt über 2 Milliarden Tonnen Feststoffabfälle. Deponien sind eine wichtige Methanquelle — ein Treibhausgas, das über 20 Jahre 80-mal wirksamer ist als CO2. Aber Abfall ist auch eine Chance. Kompostierung, Recycling und die Wahl langlebiger Produkte verwandeln das, was wir wegwerfen, in Ressourcen. EcoQuest zeigt Ihnen, wie jede Entscheidung Wellen schlägt.`,
    },
    pt: {
      title: 'Fechando o Ciclo',
      text: `A cada ano, o mundo gera mais de 2 bilhões de toneladas de resíduos sólidos. Os aterros são uma das principais fontes de metano, um gás de efeito estufa 80 vezes mais potente que o CO2 em 20 anos. Mas o lixo também é uma oportunidade. Compostagem, reciclagem e escolha de produtos duráveis transformam o que jogamos fora em recursos. EcoQuest mostra como cada decisão cria ondulações.`,
    },
    ar: {
      title: 'إغلاق الحلقة',
      text: `يولد العالم سنوياً أكثر من 2 مليار طن من النفايات الصلبة. مدافن النفايات مصدر رئيسي للميثان، وهو غاز دفيئة أقوى من CO2 بمقدار 80 مرة على مدى 20 عاماً. لكن النفايات تمثل فرصة أيضاً. يُظهر لك EcoQuest كيف أن كل قرار يخلق تموجات تؤثر على عالمنا.`,
    },
    ja: {
      title: '循環の輪を閉じる',
      text: `毎年、世界は20億トン以上の固形廃棄物を生み出しています。埋立地は主要なメタン発生源であり、メタンは20年間でCO2の80倍の温室効果を持ちます。しかし廃棄物は機会でもあります。コンポスト化、リサイクル、耐久性のある製品の選択が、廃棄物を資源に変えます。EcoQuestで、あなたの一つひとつの決断がどのように波紋を生み出すかを見てみましょう。`,
    },
    zh: {
      title: '完成循环',
      text: `每年，世界产生超过20亿吨固体废物。垃圾填埋场是甲烷的主要来源——甲烷是一种在20年内比CO2强80倍的温室气体。但废物也是一种机遇。堆肥、回收利用以及选择耐用产品将我们丢弃的东西转化为资源。EcoQuest向您展示每一个决定如何产生涟漪效应。`,
    },
  },
};

/**
 * Get a script by topic and language, falling back to English.
 */
export function getScript(
  topic: VideoTopic,
  language: SupportedLanguage,
): ScriptEntry {
  return VIDEO_SCRIPTS[topic]?.[language] ?? VIDEO_SCRIPTS[topic]?.['en'] ?? {
    title: 'Eco Awareness',
    text: 'Every choice you make shapes our planet. Welcome to EcoQuest.',
  };
}
