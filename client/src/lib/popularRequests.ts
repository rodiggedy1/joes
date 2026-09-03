import type { LucideIcon } from "lucide-react";
import { Armchair, Droplets, Hammer, Image, PaintRoller, Sparkles, Trash2, Truck, Tv, Wrench, Leaf } from "lucide-react";
import type { BookableServiceName } from "@shared/bookableServices";

export type PopularQuickRequest = {
  label: string;
  message: string;
  service: BookableServiceName;
  Icon: LucideIcon;
};

export const popularQuickRequests: PopularQuickRequest[] = [
  { label: "Deep cleaning", message: "I need a deep clean for my 3 bedroom house tomorrow morning.", service: "Home cleaning", Icon: Sparkles },
  { label: "TV mounting", message: "I need my 65-inch TV mounted in the living room.", service: "TV mounting", Icon: Tv },
  { label: "Handyman", message: "I have a few things around the house that need fixing.", service: "Handyman visit", Icon: Wrench },
  { label: "Lawn care", message: "My backyard is getting out of control and needs lawn care.", service: "Lawn & yard care", Icon: Leaf },
  { label: "Move in / out cleaning", message: "I need move-in cleaning for my new place.", service: "Home cleaning", Icon: Sparkles },
  { label: "Furniture assembly", message: "I need help assembling a dresser and a desk.", service: "Furniture assembly", Icon: Armchair },
  { label: "Picture hanging", message: "I need a few pictures and a mirror hung.", service: "Picture hanging", Icon: Image },
  { label: "Minor home repairs", message: "I have a few small home repairs that need taking care of.", service: "Minor home repairs", Icon: Hammer },
  { label: "Moving help", message: "My moving truck is ready, and I need help loading it.", service: "Moving help", Icon: Truck },
  { label: "Junk removal", message: "I need a junk pickup for a few household items.", service: "Junk removal", Icon: Trash2 },
  { label: "Pressure washing", message: "I want my patio and walkway pressure washed.", service: "Pressure washing", Icon: Droplets },
  { label: "Interior painting", message: "I would like an accent wall painted in my living room.", service: "Interior painting", Icon: PaintRoller },
];
