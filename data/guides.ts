export interface Guide {
  id: string;
  name: string;
  photo: string;
  region: string;
  languages: string[];
  yearsExperience: number;
  specialties: string[];
  bio: string;
}

export const guides: Guide[] = [
  {
    id: "okello-joseph",
    name: "Okello Joseph",
    photo:
      "https://images.pexels.com/photos/15929275/pexels-photo-15929275.jpeg?auto=compress&cs=tinysrgb&w=600",
    region: "Central Region, Kampala",
    languages: ["Luganda", "Acholi", "English"],
    yearsExperience: 14,
    specialties: ["Kampala city rides", "Heritage sites", "Street food tours"],
    bio: "Born in Gulu, moved to Kampala at sixteen. Has been riding boda through the capital since 2011 and knows every shortcut in Nakasero and Nakawa.",
  },
  {
    id: "namugga-florence",
    name: "Namugga Florence",
    photo:
      "https://images.pexels.com/photos/27038743/pexels-photo-27038743.jpeg?auto=compress&cs=tinysrgb&w=600",
    region: "Eastern Region, Jinja",
    languages: ["Luganda", "Lusoga", "English"],
    yearsExperience: 7,
    specialties: ["Jinja heritage tours", "Nile boat trips", "Colonial history"],
    bio: "Tourism graduate of Makerere University. Wrote her thesis on the industrial history of Jinja. Has been guiding the Jinja Road twice a week since 2019.",
  },
  {
    id: "ssemwogerere-david",
    name: "Ssemwogerere David",
    photo:
      "https://images.pexels.com/photos/3316263/pexels-photo-3316263.jpeg?auto=compress&cs=tinysrgb&w=600",
    region: "Central Region, Entebbe",
    languages: ["Luganda", "English", "Kiswahili"],
    yearsExperience: 9,
    specialties: ["Entebbe gardens", "Lake Victoria shore", "Wildlife centre"],
    bio: "Born and raised in Entebbe, two streets from the lake. Former fishing boat hand turned licensed guide. Knows where the fish auction starts at 5 AM.",
  },
];
