import type { Destination } from "@/types/destination";

export const destinations: Destination[] = [
  {
    id: "kampala-city-heritage",
    slug: "kampala-city-heritage-tour",
    name: "Kampala City Heritage Tour",
    category: "City & Heritage",
    narrative:
      "Okello Joseph has been riding boda through Kampala for fourteen years. He knows which pothole floods first when the afternoon rain hits Nakasero Hill, and he knows the woman who sells the best rolex at the Nakawa market junction — her name is Sarah, and she starts cooking at 6:15 every morning. Okello will take you there if you ask. The ride begins at the old taxi park, where the smell of two-stroke exhaust mixes with charcoal smoke from groundnut stalls, and the sound is a wall of engines and Luganda shouts that takes about ten minutes to stop feeling overwhelming. From there you head to Kasubi Tombs, the burial ground of the Buganda kings, rebuilt after the 2010 fire at a cost of 1.2 billion shillings. The thatched main building sits on four acres of cleared ground, and the guide inside — a clan elder named Ssalongo — will tell you about the nine kings buried there and why women could not enter the inner chamber for two hundred years. After Kasubi you ride to the Bahai Temple on Kikaya Hill, one of only seven continent-wide mother temples, and the only one in Africa. The dome is visible from the Jinja Road. The ride is about 38 kilometres total and takes three and a half hours including stops. One honest note: the road between Kasubi and the temple is unpaved for roughly 800 metres, and in the wet season that stretch is red mud. You will get dirty shoes. Okello carries extra plastic bags for exactly this reason.",
    keyFacts: [
      { label: "Total distance", value: "38 km" },
      { label: "Duration", value: "3.5 hours" },
      { label: "Starting point", value: "Old Taxi Park, Kampala" },
      { label: "Best time", value: "Dry season (Jun–Aug, Dec–Feb)" },
    ],
    location: {
      lat: 0.3186,
      lng: 32.5811,
      region: "Central Region, Kampala District",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/1277594/pexels-photo-1277594.jpeg",
        caption: "Kampala's old taxi park at dawn, before the crowds arrive",
        credit: "Pexels",
      },
      {
        url: "https://images.pexels.com/photos/15382/pexels-photo.jpg",
        caption: "The thatched roof of Kasubi Tombs, rebuilt after the 2010 fire",
        credit: "Pexels",
      },
    ],
    author: {
      name: "Okello Joseph",
      bio: "Boda rider since 2011. Born in Gulu, moved to Kampala at sixteen. Speaks Luganda, Acholi, and English.",
    },
    faqs: [
      {
        question: "Do I need to wear a helmet?",
        answer: "Yes. Okello carries a spare full-face helmet for passengers. You are required by Ugandan law to wear one.",
      },
      {
        question: "Can I pay in dollars?",
        answer: "You can, but the exchange rate offered by street traders is poor. We recommend paying in Ugandan shillings.",
      },
      {
        question: "What happens if it rains?",
        answer: "Kampala afternoon rains are short and heavy. Okello carries two ponchos. The tour can pause for 20–30 minutes under shelter.",
      },
    ],
    tiers: [
      {
        name: "Solo Rider",
        price: 85000,
        duration: "3.5 hours",
        inclusions: ["Helmet", "Fuel", "Bottled water", "Entrance fees to Kasubi Tombs"],
        bestFor: "Solo travellers who want a personal, unhurried tour",
      },
      {
        name: "Pair Ride",
        price: 150000,
        duration: "3.5 hours",
        inclusions: ["Two helmets", "Fuel", "Bottled water", "Entrance fees", "Rolox breakfast at Nakawa junction"],
        bestFor: "Couples or friends sharing one boda",
      },
      {
        name: "Full Day Extension",
        price: 220000,
        duration: "7 hours",
        inclusions: ["All Pair Ride inclusions", "Lunch at a local restaurant in Nakasero", "Visit to Uganda Museum", "Namirembe Cathedral stop"],
        bestFor: "Travellers who want to see beyond the standard stops",
      },
    ],
  },
  {
    id: "jinja-heritage-nile",
    slug: "jinja-heritage-nile-experience",
    name: "Jinja Heritage & Nile Experience",
    category: "Heritage & Nature",
    narrative:
      "The drive from Kampala to Jinja is 84 kilometres east on the Jinja Road, and your guide, Namugga Florence, has been making this trip twice a week since 2019. She points out the sugar cane plantations at Lugazi — 22,000 acres of Kakira Sugar Works land stretching to both sides of the road — and tells you that the air smells like burnt caramel during the November harvest when the cane fields are fired before cutting. Florence studied tourism at Makerere University and wrote her thesis on the economic history of Jinja, so when she talks about the old railway line you are getting something most boda riders do not know. Jinja was the industrial centre of Uganda in the 1950s, with a textile mill, a brewery, and the Owens Falls Dam completed in 1954. You stop at the Source of the Nile — the point where Lake Victoria empties into the White Nile at a latitude of 0.4479 degrees north — and take a small wooden boat out to the exact spot marked by a plaque from 1952. The boat costs 15,000 shillings per person and the operator, Wasswa, has been rowing that stretch for twenty-three years. He will tell you that the water is deeper than it looks. In the afternoon you ride to the Jinja Sailing Club, where you can hear the Nile moving over the rocks at Bujagali, a low constant sound like traffic on a distant highway. One honest note: the Ripon Falls that Speke wrote about in 1862 were largely submerged when the dam was built, so the dramatic waterfall you might expect from old photographs is mostly gone. What remains is a wide, fast stretch of river. It is still worth seeing, but manage your expectations.",
    keyFacts: [
      { label: "Total distance", value: "168 km round trip" },
      { label: "Duration", value: "Full day (8–9 hours)" },
      { label: "Starting point", value: "Kampala (hotel pickup)" },
      { label: "Best time", value: "Year-round; Nov harvest adds sugar-cane stops" },
    ],
    location: {
      lat: 0.4479,
      lng: 33.2024,
      region: "Eastern Region, Jinja District",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
        caption: "The Source of the Nile at Jinja, where Lake Victoria feeds the White Nile",
        credit: "Pexels",
      },
      {
        url: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg",
        caption: "Sugar cane fields along the Jinja Road near Lugazi",
        credit: "Pexels",
      },
    ],
    author: {
      name: "Namugga Florence",
      bio: "Tourism graduate of Makerere University (2018). Thesis: 'Industrial Heritage and River Economy of Jinja Town.' Speaks Luganda, Lusoga, and English.",
    },
    faqs: [
      {
        question: "Is the boat ride at the Source of the Nile safe?",
        answer: "The boat is a small wooden rowing boat operated by a licensed guide. Life jackets are provided. Water is calm at the Source point.",
      },
      {
        question: "Can we do white-water rafting on this tour?",
        answer: "Not on this heritage tour. Rafting requires a separate half-day booking with a licensed operator. We can arrange it as an add-on.",
      },
      {
        question: "How long is the drive each way?",
        answer: "Approximately 2.5 hours each way, depending on traffic and road conditions. The Mabira Forest stretch is single-lane and can be slow behind lorries.",
      },
    ],
    tiers: [
      {
        name: "Day Tripper",
        price: 180000,
        duration: "8–9 hours",
        inclusions: ["Round-trip transport", "Boat ride at Source of the Nile", "Lunch at Jinja Sailing Club", "Bottled water", "Helmet"],
        bestFor: "First-time visitors wanting the essential Jinja experience",
      },
      {
        name: "Heritage Deep Dive",
        price: 250000,
        duration: "9–10 hours",
        inclusions: ["All Day Tripper inclusions", "Guided walk through Jinja town's colonial-era buildings", "Visit to Kakira Sugar Works viewpoint", "Tea at the Nile Resort terrace"],
        bestFor: "Travellers interested in Uganda's industrial and colonial history",
      },
      {
        name: "Overnight Extension",
        price: 450000,
        duration: "2 days",
        inclusions: ["All Heritage Deep Dive inclusions", "One night at a mid-range Jinja lodge", "Sunset boat cruise on the Nile", "Breakfast on day two"],
        bestFor: "Travellers who want to slow down and enjoy Jinja without rushing back",
      },
    ],
  },
  {
    id: "entebbe-cultural-leisure",
    slug: "entebbe-cultural-leisure-tour",
    name: "Entebbe Cultural & Leisure Tour",
    category: "Culture & Leisure",
    narrative:
      "Entebbe is 40 kilometres south of Kampala on a road that follows the north shore of Lake Victoria, and your guide, Ssemwogerere David, grew up two streets from the lake. He knows where the fish auction starts at 5:00 AM at the Entebbe Landing Site — tilapia and Nile perch brought in by seventeen registered boats — and he knows that the best fried fish joint in town is run by a woman called Maama Nalongo, who seasons hers with a mix of rock salt and crushed bird's-eye pepper that she will not disclose even to her daughters. David will take you there for lunch if you ask. The tour starts at the Entebbe Botanical Gardens, established in 1898 as an agricultural research station during the Protectorate era. The gardens cover 41 hectares and contain over 300 plant species, including a line of mahogany trees planted in 1905 that now stand over 30 metres tall. You walk through the fern section, where the air smells like wet earth and green rot, and David points out the black-and-white colobus monkeys that sleep in the taller ficus trees at night. From the gardens you ride to the Uganda Wildlife Education Centre — the former zoo, restructured in 1994 into a conservation centre — where 273 individual animals live in semi-natural enclosures. Entry is 15,000 shillings for non-residents. After that you go to the shore at Nakiwogo, where the car ferry to Lutoboka departs at 3:00 PM, and you can sit on the jetty with a Nile Special and watch the lake change colour as the afternoon clouds move in. The whole tour covers about 22 kilometres of riding. One honest note: the Botanical Gardens are not well signposted, and some paths are overgrown between June and August when the rains are heavy. David carries a machete in his boda's tool box for exactly this reason. He will clear the path ahead of you, but wear closed shoes and long trousers if you are visiting in the wet months.",
    keyFacts: [
      { label: "Total distance", value: "22 km" },
      { label: "Duration", value: "5–6 hours" },
      { label: "Starting point", value: "Kampala (hotel pickup)" },
      { label: "Best time", value: "Jan–Mar and Sep–Nov (drier paths)" },
    ],
    location: {
      lat: 0.0606,
      lng: 32.4473,
      region: "Central Region, Entebbe Municipality",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
        caption: "Shore of Lake Victoria at Entebbe, looking toward the Ssese Islands",
        credit: "Pexels",
      },
      {
        url: "https://images.pexels.com/photos/1661586/pexels-photo-1661586.jpeg",
        caption: "Mahogany trees in the Entebbe Botanical Gardens, some planted over a century ago",
        credit: "Pexels",
      },
    ],
    author: {
      name: "Ssemwogerere David",
      bio: "Born and raised in Entebbe. Former Lake Victoria fishing boat hand. Licensed tour guide since 2016. Speaks Luganda, English, and basic Kiswahili.",
    },
    faqs: [
      {
        question: "Is the Uganda Wildlife Education Centre suitable for children?",
        answer: "Yes. The centre has wide paths, shaded rest areas, and interactive keeper talks at 11:00 AM and 3:00 PM. It is one of the most child-friendly stops in Entebbe.",
      },
      {
        question: "Can we swim in Lake Victoria at the Nakiwogo jetty?",
        answer: "We do not recommend it. Bilharzia is present in parts of the lake. Stick to the jetty for viewing and photography.",
      },
      {
        question: "What should I wear for the Botanical Gardens walk?",
        answer: "Closed shoes and long trousers year-round, especially in the wet months (Jun–Aug) when paths are overgrown. Mosquito repellent is advised.",
      },
    ],
    tiers: [
      {
        name: "Half Day",
        price: 60000,
        duration: "5–6 hours",
        inclusions: ["Round-trip boda transport", "Botanical Gardens entry", "UWEC entry", "Bottled water", "Helmet"],
        bestFor: "Travellers with a layover or limited time in Entebbe",
      },
      {
        name: "Half Day with Lunch",
        price: 95000,
        duration: "6 hours",
        inclusions: ["All Half Day inclusions", "Fried fish lunch at Maama Nalongo's joint", "Nile Special at Nakiwogo jetty"],
        bestFor: "Travellers who want the local food experience",
      },
      {
        name: "Extended Lake Shore",
        price: 130000,
        duration: "7–8 hours",
        inclusions: ["All Half Day with Lunch inclusions", "Sunset boat ride from Nakiwogo (45 min)", "Visit to Entebbe Golf Club terrace"],
        bestFor: "Travellers who want a relaxed, full-afternoon pace",
      },
    ],
  },
];
