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
  year: string
  description?: string
  link?: string
}

export const translators: Translator[] = [
  {
    id: "waley",
    name: "Arthur Waley",
    year: "1934",
    description: "On Trust in the Heart",
    link: "https://en.wikipedia.org/wiki/Arthur_Waley",
  },
  {
    id: "suzuki",
    name: "D.T. Suzuki",
    year: "1935",
    description: "On Believing in Mind",
    link: "https://en.wikipedia.org/wiki/D._T._Suzuki",
  },
  {
    id: "goddard",
    name: "Dwight Goddard",
    year: "1932",
    description: "On Believing in Mind",
    link: "https://en.wikipedia.org/wiki/Dwight_Goddard",
  },
  {
    id: "clarke",
    name: "Richard B. Clarke",
    year: "1973",
    description: "Have Faith in Your Mind",
    link: "https://terebess.hu/zen/xinxinming.html#Clarke",
  },
  {
    id: "sheng",
    name: "Sheng-Yen",
    year: "1987",
    description: "Faith in Mind",
    link: "https://en.wikipedia.org/wiki/Sheng-yen",
  },
  {
    id: "mitchell",
    name: "Stephen Mitchell",
    year: "1989",
    description: "The Mind of Absolute Trust",
    link: "https://en.wikipedia.org/wiki/Stephen_Mitchell_(translator)",
  },
  {
    id: "cleary",
    name: "Thomas Cleary",
    year: "1998",
    description: "Faith Mind",
    link: "https://en.wikipedia.org/wiki/Thomas_Cleary",
  },
  {
    id: "red_pine",
    name: "Red Pine",
    year: "2001",
    description: "Trust in Mind",
    link: "https://en.wikipedia.org/wiki/Red_Pine_(author)",
  },
  {
    id: "wu",
    name: "John Wu",
    year: "1975",
    description: "On Trust in the Heart",
    link: "https://en.wikipedia.org/wiki/John_C._H._Wu",
  },
  {
    id: "puqun",
    name: "Puqun Li",
    year: "2012",
    description: "Trust in Mind",
    link: "https://terebess.hu/zen/xinxinming.html#Li",
  },
  {
    id: "heine",
    name: "Steven Heine",
    year: "2014",
    description: "Faith in Mind",
    link: "https://en.wikipedia.org/wiki/Steven_Heine_(academic)",
  },
  {
    id: "addiss",
    name: "Stephen Addiss",
    year: "2015",
    description: "Trust in Mind",
    link: "https://en.wikipedia.org/wiki/Stephen_Addiss",
  },
  {
    id: "hinton",
    name: "David Hinton",
    year: "2016",
    description: "Trust in Mind",
    link: "https://en.wikipedia.org/wiki/David_Hinton",
  },
  {
    id: "dusan",
    name: "Dusan Pajin",
    year: "1988",
    description: "Faith in Mind",
    link: "https://terebess.hu/zen/xinxinming.html#Pajin",
  },
  {
    id: "reps",
    name: "Paul Reps",
    year: "1957",
    description: "Affirming Faith in Mind",
    link: "https://en.wikipedia.org/wiki/Paul_Reps",
  },
  {
    id: "takakusu",
    name: "Junjiro Takakusu",
    year: "1906",
    description: "On Faith in the Mind",
    link: "https://en.wikipedia.org/wiki/Junjir%C5%8D_Takakusu",
  },
  {
    id: "yampolsky",
    name: "Philip Yampolsky",
    year: "1967",
    description: "On Faith in Mind",
    link: "https://en.wikipedia.org/wiki/Philip_Yampolsky",
  },
  {
    id: "luk",
    name: "Charles Luk",
    year: "1960",
    description: "On Believing in Mind",
    link: "https://en.wikipedia.org/wiki/Charles_Luk",
  },
  {
    id: "bancroft",
    name: "Anne Bancroft",
    year: "1997",
    description: "Trust in Mind",
    link: "https://terebess.hu/zen/xinxinming.html#Bancroft",
  },
  {
    id: "conze",
    name: "Edward Conze",
    year: "1958",
    description: "Trust in the Heart",
    link: "https://en.wikipedia.org/wiki/Edward_Conze",
  },
  {
    id: "translator24",
    name: "Translator 24",
    year: "2024",
    description: "Additional Version",
  },
  {
    id: "translator25",
    name: "Translator 25",
    year: "2024",
    description: "Additional Version",
  },
  {
    id: "translator26",
    name: "Translator 26",
    year: "2024",
    description: "Additional Version",
  },
  {
    id: "translator27",
    name: "Translator 27",
    year: "2024",
    description: "Additional Version",
  },
  {
    id: "translator28",
    name: "Translator 28",
    year: "2024",
    description: "Additional Version",
  },
  {
    id: "translator29",
    name: "Translator 29",
    year: "2024",
    description: "Additional Version",
  },
  {
    id: "translator30",
    name: "Translator 30",
    year: "2024",
    description: "Additional Version",
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
