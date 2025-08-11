export interface Verse {
  id: number
  lines: {
    chinese: string
    pinyin?: string
    translations: Record<string, string>
  }[]
  analysis?: string
  commonWords?: string[]
}

export interface Translator {
  id: string
  name: string
  publicationYear: number
  translatorBio?: string
  license?: string
  link?: string
}

export const translators: Translator[] = [
  {
    id: "waley",
    name: "Arthur Waley",
    publicationYear: 1934,
    translatorBio: "On Trust in the Heart",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Arthur_Waley",
  },
  {
    id: "suzuki",
    name: "D.T. Suzuki",
    publicationYear: 1935,
    translatorBio: "On Believing in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/D._T._Suzuki",
  },
  {
    id: "goddard",
    name: "Dwight Goddard",
    publicationYear: 1932,
    translatorBio: "On Believing in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Dwight_Goddard",
  },
  {
    id: "clarke",
    name: "Richard B. Clarke",
    publicationYear: 1973,
    translatorBio: "Have Faith in Your Mind",
    license: "Unknown",
    link: "https://terebess.hu/zen/xinxinming.html#Clarke",
  },
  {
    id: "sheng",
    name: "Sheng-Yen",
    publicationYear: 1987,
    translatorBio: "Faith in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Sheng-yen",
  },
  {
    id: "mitchell",
    name: "Stephen Mitchell",
    publicationYear: 1989,
    translatorBio: "The Mind of Absolute Trust",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Stephen_Mitchell_(translator)",
  },
  {
    id: "cleary",
    name: "Thomas Cleary",
    publicationYear: 1998,
    translatorBio: "Faith Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Thomas_Cleary",
  },
  {
    id: "red_pine",
    name: "Red Pine",
    publicationYear: 2001,
    translatorBio: "Trust in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Red_Pine_(author)",
  },
  {
    id: "wu",
    name: "John Wu",
    publicationYear: 1975,
    translatorBio: "On Trust in the Heart",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/John_C._H._Wu",
  },
  {
    id: "puqun",
    name: "Puqun Li",
    publicationYear: 2012,
    translatorBio: "Trust in Mind",
    license: "Unknown",
    link: "https://terebess.hu/zen/xinxinming.html#Li",
  },
  {
    id: "heine",
    name: "Steven Heine",
    publicationYear: 2014,
    translatorBio: "Faith in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Steven_Heine_(academic)",
  },
  {
    id: "addiss",
    name: "Stephen Addiss",
    publicationYear: 2015,
    translatorBio: "Trust in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Stephen_Addiss",
  },
  {
    id: "hinton",
    name: "David Hinton",
    publicationYear: 2016,
    translatorBio: "Trust in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/David_Hinton",
  },
  {
    id: "dusan",
    name: "Dusan Pajin",
    publicationYear: 1988,
    translatorBio: "Faith in Mind",
    license: "Unknown",
    link: "https://terebess.hu/zen/xinxinming.html#Pajin",
  },
  {
    id: "reps",
    name: "Paul Reps",
    publicationYear: 1957,
    translatorBio: "Affirming Faith in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Paul_Reps",
  },
  {
    id: "takakusu",
    name: "Junjiro Takakusu",
    publicationYear: 1906,
    translatorBio: "On Faith in the Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Junjir%C5%8D_Takakusu",
  },
  {
    id: "yampolsky",
    name: "Philip Yampolsky",
    publicationYear: 1967,
    translatorBio: "On Faith in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Philip_Yampolsky",
  },
  {
    id: "luk",
    name: "Charles Luk",
    publicationYear: 1960,
    translatorBio: "On Believing in Mind",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Charles_Luk",
  },
  {
    id: "bancroft",
    name: "Anne Bancroft",
    publicationYear: 1997,
    translatorBio: "Trust in Mind",
    license: "Unknown",
    link: "https://terebess.hu/zen/xinxinming.html#Bancroft",
  },
  {
    id: "conze",
    name: "Edward Conze",
    publicationYear: 1958,
    translatorBio: "Trust in the Heart",
    license: "Unknown",
    link: "https://en.wikipedia.org/wiki/Edward_Conze",
  },
  {
    id: "translator24",
    name: "Translator 24",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  {
    id: "translator25",
    name: "Translator 25",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  {
    id: "translator26",
    name: "Translator 26",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  {
    id: "translator27",
    name: "Translator 27",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  {
    id: "translator28",
    name: "Translator 28",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  {
    id: "translator29",
    name: "Translator 29",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  {
    id: "translator30",
    name: "Translator 30",
    publicationYear: 2024,
    translatorBio: "Additional Version",
    license: "Unknown",
  },
  // Add more translators as needed
]

// Export the translations data
export const translations = {
  xinxinming: {
    title: "Xinxin Ming",
    description: "Faith in Mind",
    translators: translators,
    verses: [
      {
        id: 1,
        lines: [
          {
            chinese: "至道無難，唯嫌揀擇。",
            pinyin: "Zhì dào wú nán, wéi xián jiǎn zé.",
            translations: {
              waley: "The Perfect Way is only difficult for those who pick and choose.",
              suzuki: "The Perfect Way knows no difficulties.",
              goddard: "The Perfect Way knows no difficulties, except that it refuses to make preferences.",
            },
          },
          {
            chinese: "但莫憎愛，洞然明白。",
            pinyin: "Dàn mò zēng ài, dòng rán míng bái.",
            translations: {
              waley: "Do not like, do not dislike; all will then be clear.",
              suzuki: "Only when freed from hate and love, it reveals itself fully and without disguise.",
              goddard: "Only when freed from hate and love, it reveals itself fully and without disguise.",
            },
          },
        ],
      },
    ],
  },
}

// Also export verses for backward compatibility
export const verses = translations.xinxinming.verses
