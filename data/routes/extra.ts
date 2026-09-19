import type { DestinationContent } from "@/types/destination-content";
import { gallery } from "@/lib/photos";

/**
 * Routes added for the marketplace build: the eastern mountains, community
 * tourism in the west, and the quotation-based custom desk.
 *
 * Photography is sourced through `scripts/photo-manifest.json` and stored
 * locally in `public/images/`. Every frame shows the place named on the card,
 * and each one carries the attribution its licence requires — generated from
 * the source file's own metadata rather than typed by hand.
 */
export const extraDestinations: DestinationContent[] = [
  {
    id: "sipi-falls-mbale",
    slug: "sipi-falls-mbale",
    name: "Sipi Falls & Mount Elgon Foothills",
    category: "Mountains & Waterfalls",
    narrative:
      "Wamala Robert has guided the Sipi trail since 2012, and the first thing he tells you is that Sipi is not one waterfall but three separate drops on the same river, spread across four kilometres of walking. The highest falls 95 metres, and you hear it before you see it — a low constant roar that you feel in your chest as you come up through the coffee terraces. The path climbs between smallholder Arabica plots, and in November the women on the terraces are stripping red cherries into plastic basins while the whole slope smells of fermenting fruit and wet volcanic soil. Robert's family has farmed this hillside for three generations; his grandmother sold their first coffee to a cooperative in 1974 for 80 shillings a kilo. You stop at a wet mill where the beans are drying on raised beds, and the caretaker, a woman called Naigaga, will let you taste a roasted bean straight off the pan if you ask. Lunch is matoke, beans and chapati at a banda above the second fall, cooked by Robert's aunt. The walk covers about 7 kilometres and takes five hours with stops. One honest note: the final descent to the base of Sipi Three is steep red clay, slippery even in the dry season, and the spray keeps the rocks wet all year. Robert carries a walking stick for every guest for exactly that reason.",
    keyFacts: [
      { label: "Total distance", value: "7 km on foot, 110 km by boda" },
      { label: "Duration", value: "5–6 hours" },
      { label: "Starting point", value: "Mbale town (hotel pickup)" },
      { label: "Best time", value: "Jun–Aug and Dec–Feb, when the clay is drier" },
    ],
    location: {
      lat: 1.3308,
      lng: 34.3747,
      region: "Eastern Region, Kapchorwa District",
    },
    images: gallery([
      [
        "dest-sipi-1.jpg",
        "The main drop at Sipi, one of three falls on the same river, seen from the coffee terraces",
      ],
      [
        "dest-sipi-2.jpg",
        "The falls from the base of the gorge, where the spray reaches you before you see the drop",
      ],
      [
        "dest-sipi-3.jpg",
        "Ripe coffee cherries on the branch. Wamala Robert's family has farmed this slope for three generations",
      ],
      [
        "dest-sipi-4.jpg",
        "Beans on the drying rack at Mbale, turned by hand through the day",
      ],
      [
        "dest-sipi-5.jpg",
        "Mbale town, where the road up to Sipi begins",
      ],
    ]),
    author: {
      name: "Wamala Robert",
      bio: "Trail guide on the Sipi falls since 2012. Third-generation coffee farmer from Kapchorwa. Speaks Luganda, Lumasaaba, and English.",
    },
    faqs: [
      {
        question: "How hard is the walk?",
        answer:
          "Moderate. About 7 kilometres with roughly 300 metres of climbing, spread over five hours with stops. The descent to the base of Sipi Three is the only genuinely steep section, and it is slippery — that is what the walking sticks are for. If you would rather not do the final descent, you can wait at the viewpoint above it.",
      },
      {
        question: "Do I need hiking boots?",
        answer:
          "Closed shoes with grip, yes. Trainers are fine in the dry season. Sandals and flip-flops are not, on any section below the second fall. If you arrive without suitable shoes, Robert can lend you a pair from the guide association store in Sipi village.",
      },
      {
        question: "Can I do the abseiling?",
        answer:
          "Abseiling at Sipi Three is included on the Experience Tour tier and runs with a licensed instructor and a separate safety briefing. It is not offered on the Freelance or Guided tiers, because it needs a second guide at the top of the pitch.",
      },
      {
        question: "Is the coffee actually for sale?",
        answer:
          "Yes, and it is not a tourist price list. The wet mill sells roasted beans at the same rate it sells to the cooperative, and Naigaga will write the weight and price on the bag. Bring cash — there is no card machine anywhere on the slope.",
      },
      {
        question: "How do we get to Mbale?",
        answer:
          "The ride from Kampala is roughly 245 kilometres and takes five to six hours on the boda, which is a long day in the saddle. Most travellers take the bus or a car to Mbale and start the tour there the following morning. We can arrange the full ride from Kampala as a custom quotation if you want it.",
      },
    ],
    tiers: [
      {
        name: "Boda Freelance",
        price: 140000,
        duration: "5 hours",
        inclusions: [
          "Boda transport from Mbale and back",
          "Helmet and fuel",
          "Digital route notes for all three falls",
          "Bottled water",
        ],
        bestFor:
          "Independent walkers who want the ride and the trail notes, and will find their own way between the falls",
      },
      {
        name: "Guided Tour",
        price: 210000,
        duration: "6 hours",
        inclusions: [
          "All Boda Freelance inclusions",
          "Licensed trail guide for the full walk",
          "Coffee-farm visit and tasting at the wet mill",
          "Lunch of matoke, beans and chapati at the banda",
          "Walking stick for the descent",
        ],
        bestFor:
          "Most visitors. You get the geology, the coffee and the farming history from someone whose family works the slope",
      },
      {
        name: "Experience Tour",
        price: 320000,
        duration: "2 days",
        inclusions: [
          "All Guided Tour inclusions",
          "One night at a lodge above Sipi",
          "Abseiling at Sipi Three with a licensed instructor",
          "Sunrise walk to the Elgon viewpoint",
          "Breakfast and dinner on day one",
        ],
        bestFor:
          "Travellers who want the falls properly rather than as a day trip bolted onto a bus timetable",
      },
    ],
  },

  {
    id: "kibale-community",
    slug: "kibale-community",
    name: "Kibale Community & Crater Lakes",
    category: "Community & Culture",
    narrative:
      "Kyomuhendo Justus runs the community tourism group at Nkingo, a village of about 400 households on the road out of Fort Portal, and he meets visitors at the trading centre rather than at a hotel gate. The walk starts at 7:00 AM, when the crater lake at Nyinambuga is still flat and the mist is sitting on the water. The first thing you notice is the cold — Fort Portal sits at 1,540 metres and the mornings are genuinely chilly, not what most people packed for. Justus walks you along the tea estate boundary and up to the crater rim, where his brother's hives hang in the fig trees; the honey is harvested twice a year and sold in reused Nile Special bottles at the Thursday market. Then a craft cooperative where twelve women weave, and the room smells of wet raffia and wood smoke. A woman called Beatrice shows you how the dye is made from avocado seed and soot. The village keeps 40% of what you pay, and the group paints the split on a board at the trading centre, so you can read it before you hand over anything. Lunch is beans, g-nut sauce, posho and greens, eaten with the family who cooked it. One honest note: this is a working village, not a staged one. If there is a funeral or a harvest that day, the walk is rearranged or cancelled and you are refunded in full. Justus will tell you that at the start, not at the end.",
    keyFacts: [
      { label: "Total distance", value: "18 km" },
      { label: "Duration", value: "4–5 hours" },
      { label: "Starting point", value: "Fort Portal (hotel pickup)" },
      { label: "Best time", value: "Year-round; driest in Jan–Feb" },
    ],
    location: {
      lat: 0.6541,
      lng: 30.2749,
      region: "Western Region, Kabarole District",
    },
    images: gallery([
      [
        "dest-kibale-1.jpg",
        "One of the crater lakes on the road out of Fort Portal, flat before the mist lifts",
      ],
      [
        "dest-kibale-2.jpg",
        "Crater lakes below the Rwenzori foothills, formed where the volcanoes blew their tops off",
      ],
      [
        "dest-kibale-3.jpg",
        "A chimpanzee in Kibale forest, a short ride from the village",
      ],
      [
        "dest-kibale-4.jpg",
        "Tea estate rows along the boundary the village walk follows",
      ],
      [
        "dest-kibale-5.jpg",
        "The market in Fort Portal, where the cooperative sells its honey and raffia work",
      ],
    ]),
    author: {
      name: "Kyomuhendo Justus",
      bio: "Runs the Nkingo community tourism group outside Fort Portal. Has hosted village walks since 2015. Speaks Rutooro, Runyankole, and English.",
    },
    faqs: [
      {
        question: "Where does my money actually go?",
        answer:
          "The village group keeps 40% of the tour price, paid to the cooperative on the day. The split is written on a board at the trading centre and you can read it before you pay. The remaining 60% covers the rider, the guide, transport and the platform.",
      },
      {
        question: "Is this a staged experience?",
        answer:
          "No, and that is the honest caveat. These are people going about their week. If a funeral or a harvest falls on your day, the walk is rearranged or cancelled and refunded in full. We would rather lose the booking than pretend the village is a set.",
      },
      {
        question: "Can I take photographs?",
        answer:
          "Yes, and ask before photographing anyone close up — Justus will tell you who is happy to be photographed and who is not. Photography inside the craft cooperative is fine. Drone flying is not permitted over the crater lakes without written permission from the district.",
      },
      {
        question: "Is it suitable for children?",
        answer:
          "Yes. The terrain is gentle, the walk is short, and children are usually absorbed by the weaving and the honey. The cooking session on the Experience tier is the part children ask about afterwards.",
      },
      {
        question: "Can we stay overnight in the village?",
        answer:
          "The Experience Tour includes a homestay night with a host family. It is a real household, not a lodge: shared bathroom, bucket shower, and dinner eaten with the family. If you would prefer a guesthouse instead, say so when you book and we will arrange that at the same price.",
      },
    ],
    tiers: [
      {
        name: "Boda Freelance",
        price: 110000,
        duration: "4 hours",
        inclusions: [
          "Boda transport from Fort Portal",
          "Helmet and fuel",
          "Crater lakes route map",
          "Bottled water",
        ],
        bestFor:
          "Riders who want the lake road and the viewpoints without a host walking with them",
      },
      {
        name: "Guided Tour",
        price: 175000,
        duration: "5 hours",
        inclusions: [
          "All Boda Freelance inclusions",
          "Community host for the village walk",
          "Craft cooperative visit with a weaving demonstration",
          "Bee-hive and tea-boundary walk",
          "Lunch with a host family",
        ],
        bestFor:
          "Travellers who want the village to be the point of the day, not a stop on the way to one",
      },
      {
        name: "Experience Tour",
        price: 260000,
        duration: "1 night / 2 days",
        inclusions: [
          "All Guided Tour inclusions",
          "Market-to-kitchen cooking session",
          "Second crater lake and viewpoint walk",
          "Homestay night with a host family",
          "All meals from lunch on day one",
        ],
        bestFor:
          "Travellers who want to stay long enough that the village stops noticing them",
      },
    ],
  },

  {
    id: "custom-destination-tour",
    slug: "custom-destination-tour",
    name: "Custom Destination Tour",
    category: "Custom & Bespoke",
    narrative:
      "Not every trip fits a published route. A custom tour starts with a conversation — thirty minutes on the phone or WhatsApp with a route planner in Kampala, in which you say how many days you have, what you want to see, and what you would rather avoid. Custom quotes are handled by Mbabazi Sarah, who has built routes for film crews, birdwatchers and two families travelling together with a six-year-old. Mbabazi Sarah runs every quote herself, and she will tell you plainly when an idea does not work. If you want to ride Kampala to Murchison Falls in a single day, she will say no — that is 305 kilometres on a road that takes seven hours before you stop for anything, and the dust alone should tell you why. What she offers instead is two days with a night in Masindi. Most custom trips are quoted within 48 hours, and the quote is itemised: distance and fuel, rider days, guide days, entry fees, meals and accommodation, each on its own line. Two thirds of custom bookings include at least one community stay, usually in a village where the group has asked us not to publish the name — you will smell wood smoke and roasting maize before you see the first house. Your boda rider stays with you for the whole trip rather than handing you on at each stage. One honest note: a custom trip costs more per day than a published route, because a route run once has no economy of scale. Expect a quote 15 to 25 percent above the equivalent standard tour, and expect the planner to say so before you ask.",
    keyFacts: [
      { label: "Total distance", value: "Set by your itinerary" },
      { label: "Duration", value: "By arrangement" },
      { label: "Starting point", value: "Anywhere in Uganda" },
      { label: "Best time", value: "Quoted per route" },
    ],
    location: {
      lat: 1.3733,
      lng: 32.2903,
      region: "Nationwide, Uganda",
    },
    images: gallery([
      [
        "dest-custom-1.jpg",
        "Open road through the hills of western Uganda — the kind of route the custom desk builds",
      ],
      [
        "dest-custom-2.jpg",
        "A boda on the tarmac, with the rain pooled at the verge where the drainage gives out",
      ],
      [
        "dest-custom-3.jpg",
        "A rider between towns, on a route that only exists because somebody asked for it",
      ],
      [
        "dest-custom-4.jpg",
        "Lake Bunyonyi, one of the places travellers ask for by name",
      ],
      [
        "dest-custom-5.jpg",
        "The Nile forcing through the gorge at Murchison Falls, a two-day custom route",
      ],
    ]),
    author: {
      name: "Mbabazi Sarah",
      bio: "Route planner for the custom desk. Has built itineraries for film crews, birdwatchers and family groups since 2017. Speaks Luganda, English, and Kiswahili.",
    },
    faqs: [
      {
        question: "How does the quoting work?",
        answer:
          "You describe the trip, the planner comes back within 48 hours with an itemised quote — distance and fuel, rider days, guide days, entry fees, meals and accommodation on separate lines. Nothing is charged until you approve the quote in writing.",
      },
      {
        question: "Why are the prices on this page not final?",
        answer:
          "Because a custom route has no fixed cost. The figures shown are indicative starting points for a solo rider and a standard party. Your actual quote depends on distance, days, group size and how much of the day is guided.",
      },
      {
        question: "What is the minimum lead time?",
        answer:
          "Seventy-two hours for a single-day custom route, and two weeks for anything multi-day that needs accommodation and park permits booked in your name. Birdwatching and film-crew trips usually need longer, because specialist guides book out.",
      },
      {
        question: "Can you do a route nobody has run before?",
        answer:
          "Often, yes. The rider will have ridden the roads, but may not have run them as a guided route. For a genuinely new route we send a rider to scout it first and quote the scouting day separately, rather than pretending the first run will be smooth.",
      },
      {
        question: "What if the plan does not work on the day?",
        answer:
          "Roads close, rain comes early, a site is shut for a function. The rider and guide will re-plan with you on the road and any difference in cost is settled at the end, in either direction. You are not charged for a stop you never reached.",
      },
    ],
    tiers: [
      {
        name: "Boda Freelance",
        price: 150000,
        duration: "By arrangement",
        inclusions: [
          "Boda transport and rider for the agreed route",
          "Helmet and fuel",
          "Digital route notes",
          "WhatsApp route desk before departure",
        ],
        bestFor:
          "Travellers who know where they want to go and need the bike, the rider and nothing else",
      },
      {
        name: "Guided Tour",
        price: 320000,
        duration: "By arrangement",
        inclusions: [
          "All Boda Freelance inclusions",
          "Licensed guide for the whole route",
          "Itemised quote before any payment",
          "Accommodation booked to your budget",
          "Meal stops planned with you",
        ],
        bestFor:
          "Mixed groups and multi-stop routes where somebody needs to hold the plan together",
      },
      {
        name: "Experience Tour",
        price: 620000,
        duration: "By arrangement",
        inclusions: [
          "All Guided Tour inclusions",
          "Multi-day itinerary with overnight stays",
          "Park and site entry fees arranged",
          "Interpreter available on request",
          "Airport pickup and drop-off",
        ],
        bestFor:
          "Film crews, birdwatching groups and families booking a week or more",
      },
    ],
  },
];
