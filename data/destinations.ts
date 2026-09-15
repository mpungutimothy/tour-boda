import type { Destination } from "@/types/destination";

export const destinations: Destination[] = [
  {
    id: "kampala-city-heritage",
    slug: "kampala-city-heritage",
    name: "Kampala City Heritage Tour",
    category: "City & Heritage",
    narrative:
      "Okello Joseph has been riding boda through Kampala for fourteen years. He knows which pothole floods first when the afternoon rain hits Nakasero Hill, and he knows the woman who sells the best rolex at the Nakawa market junction — her name is Sarah, and she starts cooking at 6:15 every morning. The smell of eggs and raw onion sizzling on a flat pan mixes with two-stroke exhaust and charcoal smoke from the groundnut stalls next door. Okello will take you there if you ask. The ride begins at the old taxi park, where the sound is a wall of engines and Luganda shouts that takes about ten minutes to stop feeling overwhelming. From there you head to Kasubi Tombs, the burial ground of the Buganda kings, rebuilt after the 2010 fire at a cost of 1.2 billion shillings. The thatched main building sits on four acres of cleared ground, and the guide inside — a clan elder named Ssalongo — will tell you about the nine kings buried there and why women could not enter the inner chamber for two hundred years. After Kasubi you ride to the Bahai Temple on Kikaya Hill, one of only seven continent-wide mother temples, and the only one in Africa. The dome is visible from the Jinja Road, 38 kilometres away on a clear day. The ride covers about 38 kilometres total and takes three and a half hours including stops. One honest note: the road between Kasubi and the temple is unpaved for roughly 800 metres, and in the wet season that stretch is red mud. You will get dirty shoes. Okello carries extra plastic bags for exactly this reason.",
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
        answer: "Yes. Okello carries a spare full-face helmet for passengers. You are required by Ugandan law to wear one on any boda.",
      },
      {
        question: "Can I pay in dollars?",
        answer: "You can, but the exchange rate offered by street traders is poor. We recommend paying in Ugandan shillings. Your guide can help you find a reliable forex bureau if needed.",
      },
      {
        question: "What happens if it rains?",
        answer: "Kampala afternoon rains are short and heavy. Okello carries two ponchos. The tour can pause for 20 to 30 minutes under shelter until the rain passes.",
      },
      {
        question: "Is the tour suitable for children?",
        answer: "Children aged 10 and up can ride as passengers on the boda. For younger children we recommend booking the Guided Tour tier, which includes a car option for the Kasubi-to-temple stretch.",
      },
      {
        question: "Can I bring my camera?",
        answer: "Yes, but photography is not allowed inside the inner chamber at Kasubi Tombs. Your guide will tell you when to put it away. The outside grounds and the temple are fine.",
      },
    ],
    tiers: [
      {
        name: "Boda Freelance",
        price: 85000,
        duration: "3.5 hours",
        inclusions: ["Helmet", "Fuel", "Bottled water", "Entrance fees to Kasubi Tombs"],
        bestFor: "Solo travellers who want a personal, unhurried ride with a local driver",
      },
      {
        name: "Guided Tour",
        price: 150000,
        duration: "3.5 hours",
        inclusions: ["Two helmets", "Fuel", "Bottled water", "Entrance fees", "Rolex breakfast at Nakawa junction", "Historical commentary at each stop"],
        bestFor: "Couples or friends who want context and commentary, not just transport",
      },
      {
        name: "Experience Tour",
        price: 220000,
        duration: "7 hours",
        inclusions: ["All Guided Tour inclusions", "Lunch at a local restaurant in Nakasero", "Visit to the Uganda Museum", "Namirembe Cathedral stop", "Afternoon tea at a hilltop cafe"],
        bestFor: "Travellers who want a full day covering more than the standard stops",
      },
    ],
  },
  {
    id: "jinja-heritage-nile",
    slug: "jinja-nile",
    name: "Jinja Heritage & Nile Experience",
    category: "Heritage & Nature",
    narrative:
      "The drive from Kampala to Jinja is 84 kilometres east on the Jinja Road, and your guide, Namugga Florence, has been making this trip twice a week since 2019. She points out the sugar cane plantations at Lugazi — 22,000 acres of Kakira Sugar Works land stretching to both sides of the road — and tells you that the air smells like burnt caramel during the November harvest when the cane fields are fired before cutting. Florence studied tourism at Makerere University and wrote her thesis on the economic history of Jinja, so when she talks about the old railway line you are getting something most boda riders do not know. Jinja was the industrial centre of Uganda in the 1950s, with a textile mill, a brewery, and the Owens Falls Dam completed in 1954. You stop at the Source of the Nile — the point where Lake Victoria empties into the White Nile — and take a small wooden boat out to the exact spot marked by a plaque from 1952. The boat costs 15,000 shillings per person, and the operator, Wasswa, has been rowing that stretch for twenty-three years. He will tell you that the water is deeper than it looks. In the afternoon you ride to the Jinja Sailing Club, where you can hear the Nile moving over the rocks at Bujagali, a low constant sound like traffic on a distant highway. One honest note: the Ripon Falls that Speke wrote about in 1862 were largely submerged when the dam was built, so the dramatic waterfall you might expect from old photographs is mostly gone. What remains is a wide, fast stretch of river. It is still worth seeing, but manage your expectations.",
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
        answer: "The boat is a small wooden rowing boat operated by a licensed guide. Life jackets are provided. The water is calm at the Source point, and Wasswa has been rowing this stretch for over twenty years.",
      },
      {
        question: "Can we do white-water rafting on this tour?",
        answer: "Not on this heritage tour. Rafting requires a separate half-day booking with a licensed operator. We can arrange it as an add-on and adjust your schedule accordingly.",
      },
      {
        question: "How long is the drive each way?",
        answer: "Approximately 2.5 hours each way, depending on traffic. The Mabira Forest stretch is single-lane and can be slow behind lorries, so we leave early to avoid the worst of it.",
      },
      {
        question: "What is included for lunch?",
        answer: "The Boda Freelance tier does not include lunch. The Guided Tour tier includes lunch at the Jinja Sailing Club — typically grilled tilapia with matoke and a salad. The Experience Tour adds a riverside afternoon tea.",
      },
      {
        question: "Can we stop at Mabira Forest for a walk?",
        answer: "Yes, but only on the Experience Tour tier. The forest walk adds about 90 minutes to the day. We recommend it if you enjoy birdwatching — over 200 species have been recorded in the reserve.",
      },
    ],
    tiers: [
      {
        name: "Boda Freelance",
        price: 180000,
        duration: "8–9 hours",
        inclusions: ["Round-trip transport", "Boat ride at Source of the Nile", "Bottled water", "Helmet"],
        bestFor: "Travellers who want the essential Jinja trip without the extras",
      },
      {
        name: "Guided Tour",
        price: 250000,
        duration: "9–10 hours",
        inclusions: ["All Boda Freelance inclusions", "Lunch at Jinja Sailing Club", "Guided walk through colonial-era buildings", "Historical commentary at each stop"],
        bestFor: "Travellers who want context, history, and a proper lunch built in",
      },
      {
        name: "Experience Tour",
        price: 450000,
        duration: "2 days",
        inclusions: ["All Guided Tour inclusions", "One night at a mid-range Jinja lodge", "Sunset boat cruise on the Nile", "Mabira Forest walk", "Breakfast on day two"],
        bestFor: "Travellers who want to slow down and enjoy Jinja without rushing back",
      },
    ],
  },
  {
    id: "entebbe-cultural-leisure",
    slug: "entebbe-cultural",
    name: "Entebbe Cultural & Leisure Tour",
    category: "Culture & Leisure",
    narrative:
      "Entebbe is 40 kilometres south of Kampala on a road that follows the north shore of Lake Victoria, and your guide, Ssemwogerere David, grew up two streets from the lake. He knows where the fish auction starts at 5:00 AM at the Entebbe Landing Site — tilapia and Nile perch brought in by seventeen registered boats — and he knows the best fried fish joint in town, run by a woman called Maama Nalongo, who seasons hers with rock salt and crushed bird's-eye pepper she will not disclose even to her daughters. The taste is smoky and sharp, nothing like the bland fillets you get in a hotel. David will take you there for lunch if you ask. The tour starts at the Entebbe Botanical Gardens, established in 1898 during the Protectorate era. The gardens cover 41 hectares with over 300 plant species, including mahogany trees planted in 1905 that now stand over 30 metres tall. You walk through the fern section, where the air smells like wet earth and green rot, and David points out the black-and-white colobus monkeys that sleep in the taller ficus trees at night. From the gardens you ride to the Uganda Wildlife Education Centre, where 273 animals live in semi-natural enclosures. Entry is 15,000 shillings for non-residents. After that you go to the shore at Nakiwogo, sit on the jetty with a Nile Special, and watch the lake change colour as the afternoon clouds move in. The whole tour covers about 22 kilometres over 5 to 6 hours. One honest note: the Botanical Gardens are not well signposted, and some paths are overgrown between June and August. David carries a machete in his boda's tool box for exactly this reason. Wear closed shoes and long trousers in the wet months.",
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
        answer: "We do not recommend it. Bilharzia is present in parts of the lake near the mainland shore. The jetty is fine for viewing and photography, but save swimming for the Ssese Islands side where the water is clear.",
      },
      {
        question: "What should I wear for the Botanical Gardens walk?",
        answer: "Closed shoes and long trousers year-round, especially in the wet months from June to August when paths are overgrown. Mosquito repellent is strongly advised.",
      },
      {
        question: "Can we arrange airport pickup?",
        answer: "Yes. Entebbe International Airport is about 5 kilometres from the Botanical Gardens. We can meet you at arrivals and start the tour directly. There is no extra charge for airport pickup.",
      },
      {
        question: "Is the fried fish lunch included in every tier?",
        answer: "No. The Boda Freelance tier does not include lunch. The Guided Tour tier includes a standard lunch. The Experience Tour tier includes the fried fish lunch at Maama Nalongo's, which is the one most people ask about.",
      },
    ],
    tiers: [
      {
        name: "Boda Freelance",
        price: 60000,
        duration: "5–6 hours",
        inclusions: ["Round-trip boda transport", "Botanical Gardens entry", "UWEC entry", "Bottled water", "Helmet"],
        bestFor: "Travellers with a layover or limited time who want the essential stops",
      },
      {
        name: "Guided Tour",
        price: 95000,
        duration: "6 hours",
        inclusions: ["All Boda Freelance inclusions", "Lunch at a local restaurant", "Nile Special at Nakiwogo jetty", "Historical commentary at each stop"],
        bestFor: "Travellers who want a proper lunch and a more relaxed pace",
      },
      {
        name: "Experience Tour",
        price: 130000,
        duration: "7–8 hours",
        inclusions: ["All Guided Tour inclusions", "Fried fish lunch at Maama Nalongo's", "Sunset boat ride from Nakiwogo (45 min)", "Visit to Entebbe Golf Club terrace"],
        bestFor: "Travellers who want the full afternoon with local food and a boat ride",
      },
    ],
  },
];
