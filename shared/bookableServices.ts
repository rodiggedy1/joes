export const bookableServiceNames = [
  "Home cleaning",
  "TV mounting",
  "Furniture assembly",
  "Picture hanging",
  "Minor home repairs",
  "Handyman visit",
  "Plumbing help",
  "Electrical & lighting",
  "Interior painting",
  "Moving help",
  "Lawn & yard care",
  "Junk removal",
  "Pressure washing",
] as const;

export type BookableServiceName = typeof bookableServiceNames[number];
