export const bookableServiceNames = [
  "Home cleaning",
  "TV mounting",
  "Furniture assembly",
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
