# Good Joe Pricing Proposal — Washington, DC 20001

**Prepared:** September 2, 2026  
**Status:** Draft for approval; no customer-facing price has been changed.

## Recommendation

Good Joe should lead with **clear starting prices for simple, common jobs** and use a small set of scope choices to create a reliable internal quote. This preserves the fast, low-friction experience reflected in Handy’s booking flows without falsely promising that every variable job has one fixed price.

> **Customer-facing rule:** “Starting at” applies to the smallest ordinary version of the selected service. Add-ons, unusual access, material/parts costs, and licensed-trade work are reviewed before final confirmation.

The proposal deliberately maintains the existing **$149 TV mounting** starting price rather than reducing it. Washington, DC has above-average service labor, and local benchmarks support protecting a two-hour floor for variable work.[1] [2] [3]

## Proposed Customer-Facing Starting Prices

| Good Joe service | Recommended starting price | Pricing basis | Customer-facing promise |
|---|---:|---|---|
| **House cleaning** | **$149** | Standard 1-bed/1-bath clean; 3-hour recommended baseline | “From $149” |
| **TV mounting** | **$149** | One TV on a standard drywall wall, customer has mount | “TV mounting from $149” |
| **Furniture assembly** | **$119** | One small/standard item, two-hour service minimum | “Assembly from $119” |
| **Picture hanging** | **$99** | Up to two small standard-height items | “Picture hanging from $99” |
| **Minor home repairs** | **$129** | Single small repair / two-hour labor minimum | “Small repairs from $129” |
| **Handyman visit** | **$129** | Two-hour general handyman base | “Handyman help from $129” |
| **Plumbing help** | **$159** | Minor diagnostic/repair visit; existing accessible plumbing only | “Plumbing help from $159” |
| **Electrical & lighting** | **$149** | One existing-access light, dimmer, or fixture task | “Electrical & lighting from $149” |
| **Interior painting** | **$199** | One pro, up to two labor hours for touch-ups or one standard accent wall; customer-supplied paint | “Painting help from $199” |
| **Moving help** | **$119/hr** | One helper; two-hour minimum; labor-only, no truck | “Moving labor from $119/hr” |
| **Lawn & yard care** | **$49** | Small, regularly maintained lawn; mow, edge, and blow | “Lawn care from $49” |
| **Junk removal** | **$129** | Small curbside / up-to-one-eighth truckload pickup | “Junk removal from $129” |
| **Pressure washing** | **$99** | Small ground-level patio or walkway | “Pressure washing from $99” |

These are **recommendations**, not claims that Handy publishes the same dollar values. Handy’s public Washington, DC flow exposed scope and scheduling choices but withheld actual quotes behind account authentication. The model above uses those verified choice structures together with current DC market benchmarks.[1] [2] [3] [4]

## Required Booking Choices by Service

The choices below are the required “price inputs” for the first Good Joe price book. Where Handy has a direct public booking flow, the first set of inputs follows Handy’s visible structure. Lawn care, junk removal, and pressure washing do not appear as direct Handy service categories and use current comparable DC booking structures instead.[5] [6] [7]

| Service | Required checkout choices | Price / review trigger |
|---|---|---|
| **House cleaning** | Service type: standard, deep, move-in/out; bedrooms; bathrooms; duration; recurring frequency; add-ons such as oven, fridge, laundry, baseboards | Deep clean, move-out, heavy buildup, or large home adds time and changes price. |
| **TV mounting** | Number of TVs; size band; wall type; mount supplied; cable concealment; fireplace/high location; soundbar/devices | Brick, stone, tile, above-fireplace, over-60-inch screens, hidden-wire work, and no mount supplied add scope. |
| **Furniture assembly** | Small/medium/large item count; furniture type; additional purchase/haul request; job notes | Uses two-hour floor plus 30-minute blocks for multiple or complex items. |
| **Picture hanging** | Small-item count; large-item count; ladder: none/6 ft/10 ft; shelves; job notes | Large/heavy items, high access, multiple anchors, and shelving add scope. |
| **Minor repair / Handyman** | Job description; number of unrelated tasks; existing parts/materials; photos optional | Anything requiring licensed trade work, major structural repair, or multiple unrelated jobs is reviewed. |
| **Plumbing help** | Problem type; leak active?; fixture/toilet/drain; accessible shutoff; photos; job notes | Active major leak, gas, sewer backup, water heater, permitting, or inaccessible plumbing must be routed for reviewed pricing. |
| **Electrical & lighting** | Light fixture count; dimmer count; ceiling fan count; ladder: none/6 ft/10 ft; wiring accessible? | Existing accessible wiring only. New circuits, panel work, service upgrades, and inaccessible wiring need licensed-trade confirmation. |
| **Interior painting** | Project type; rooms/walls; approximate room-size band; ceilings/trim; paint supplied?; prep/patching; furniture moving; ladder height; photo; job notes | Full rooms, more than one wall, high ceilings, trim, repair, specialty finish, wallpaper removal, or furniture moving trigger review. |
| **Moving help** | One/two/three helpers; load, unload, or both; hours; floors/elevator; customer-supplied truck; certificate of insurance; boxes/materials; heavy/special items | Labor-only means Good Joe does not supply a truck. Piano, safe, long carry, parking permit, and more than three helpers require review. |
| **Lawn & yard care** | Property size; mowing frequency; grass height; mow/edge/blow; cleanup; hedge/pruning/weeding; bag/haul; access | One-time overgrowth, leaf haul, steep terrain, garden work, debris, and large lots add scope. |
| **Junk removal** | Junk category; estimated volume; curbside vs in-home; stairs/elevator; parking; photos; heavy/special items | Appliances, mattresses, electronics, hazardous materials, construction debris, and same-day service require explicit rules or review. |
| **Pressure washing** | Area: patio/walkway, driveway, siding, deck/porch, roof; size; surface material; stain type; property height; water source; home/business | Oil/rust/mold treatment, multiple surfaces, no outdoor water, roof, three-story, or delicate surfaces require review/qualified provider confirmation. |

## Internal Price-Book Rules

The public starting price should not be a fake quote. The internal Operations view should receive the selected choices and calculate or display a **quote floor, scope notes, and review flag**.

| Pricing engine | Use for | Initial rule |
|---|---|---|
| **Fixed base + add-ons** | TV mounting, cleaning, lawn care, junk removal, pressure washing | Start with the simple base job and add published increments for common selections. |
| **Two-hour base + 30-minute blocks** | Furniture assembly, picture hanging, handyman, plumbing, electrical, small painting | Mirrors Handy’s visible 2–10 hour / 30-minute job structure and protects variable labor time.[1] |
| **Per-helper hourly blocks** | Moving help | $119 per helper-hour, two-hour minimum; Good Joe does not provide a truck. Travel, permit, and special handling are separate. |
| **Review-only quote** | Licensed trade work, major repair, high access, roof washing, major painting, hazardous removal | Do not show a false final price; display “We’ll confirm the right pro and price before scheduling.” |

## Why These Starting Prices Fit the DC Market

The proposed prices sit around the accessible end of local DC ranges while retaining room for dispatch, insurance, and scope risk. For example, Washington, DC cleaning is reported at $129–$237 per visit with a $183 average; local handyman help is reported around $67 per hour, plumbing around $71 per hour, and pressure washing around $72 per hour.[2] [3] [4] Taskrabbit’s current pressure-washing guide also reports a $263 average invoice in DC; the $99 Good Joe entry price is intentionally limited to a small ground-level surface, not a whole home.[4]

| Category | Benchmark signal | Good Joe positioning |
|---|---|---|
| Cleaning | $129–$237 DC typical visit; $170–$270 DC standard cleaning for 2,000 sq. ft. | $149 for a tightly defined small-home standard clean, rising by size/type. |
| Handyman / plumbing | ~$67/hr handyman and ~$71/hr plumbing in DC | $129 and $159 minimums protect a two-hour/service-call floor while remaining legible to customers. |
| TV / furniture | ~$56/hr TV mounting and ~$48/hr assembly on Taskrabbit DC; common service platforms use minimums | $149 TV and $119 assembly starts avoid underpricing skilled, insured in-home work. |
| Moving | $120–$185/hr for two movers + truck; generally three-hour minimum | $119/helper-hour positions Good Joe as labor-only help; vehicle moves are separately scoped. |
| Lawn care | DC mowing from ~$44 and roughly $50 average per cut | $49 applies only to a small maintained lawn, not cleanup/overgrowth. |
| Junk / pressure washing | DC junk averages $248; DC pressure wash starts around $75 and averages ~$263 invoice | $129 junk / $99 wash are tightly defined entry products, with volume and area increments. |
| Painting | $2–$6/sq. ft. or $50–$82 per painter-hour in DC | $199 covers a paint-ready touch-up or one standard accent wall, not a full-room promise. |

## Interior Painting — Final Good Joe Model

Good Joe should begin Interior Painting at **$199** for one professional, up to two labor hours, a paint-ready touch-up or one standard accent wall, with customer-supplied paint. It is intentionally a small-project entry price rather than a full-room estimate: current Washington, DC interior-painting benchmarks span roughly $436–$1,742 per room, depending on scope.[9]

The checkout should ask project type, walls/room count, size band, ceilings/trim, paint ownership, prep/patching, furniture moving, ladder height, photo, and notes. A full room, more than one wall, ceiling/trim work, patching, wallpaper removal, furniture moving, high access, specialty finishes, or uncertainty about paint should show a clear review notice instead of a false final quote.

## Approved Decisions and Remaining Review

The following decisions are now set for implementation:

1. **Moving Help:** $119 per helper-hour, two-hour minimum, labor-only; Good Joe does **not** provide a truck.
2. **All non-painting starting prices:** approved as proposed for the Washington, DC 20001 launch market.
3. **Interior Painting:** $199 for a paint-ready touch-up or one standard accent wall, then Operations review for larger/complex scope.

The remaining implementation work is to translate these choices into the checkout, define published add-on increments, and ensure Operations can see every answer before a customer’s request is confirmed.

## Scope and Compliance Notes

Good Joe should not give instant fixed prices for work that requires a licensed professional, permit, specialist equipment, or safety review. In particular, electrical panel/circuit work, inaccessible wiring, gas plumbing, major active leaks, structural work, high roof access, hazardous disposal, and regulated moving work must enter Operations as **review required**. These boundaries should be shown in checkout before a customer submits a request.

The most useful next implementation is a **service-specific choice step** before the calendar: the customer answers only the relevant scope questions, sees either a calculated “starting at” amount or a review-required notice, then chooses their preferred appointment. Operations receives the exact answers and can confirm or amend the final price.

## Approval Decisions Needed

The starting-price decisions are now approved. Before final checkout pricing goes live, the remaining business decision is the published **add-on increment** for each customer choice and the exact Operations review rules for licensed work, emergency work, high access, materials, and disposal-sensitive items.

## References

[1]: https://www.handy.com/services/furniture-assembly/washington-dc “Handy Furniture Assembly, Washington, DC”
[2]: https://www.angi.com/articles/how-much-does-it-cost-hire-house-cleaner/dc/washington “Professional House Cleaning Cost in Washington, DC (2026)”
[3]: https://www.taskrabbit.com/locations/washington-dc/general-handyman “Handyman Services in Washington, DC”
[4]: https://www.taskrabbit.com/cost-guides/pressure-washing “Pressure Washing Cost Guide (updated September 1, 2026)”
[5]: https://www.taskrabbit.com/locations/washington-dc/plumbing “Plumbing Services in Washington, DC”
[6]: https://lawnguru.co/cities/washington-d-c-dc/lawn-mowing “Lawn Mowing in Washington, DC”
[7]: https://www.thumbtack.com/dc/washington/pressure-washing “Pressure Washing in Washington, DC”
[8]: https://www.micsmoving.com/blog/how-much-does-it-cost-to-hire-movers-in-dc “How Much Does It Cost to Hire Movers in DC”
[9]: https://www.angi.com/articles/how-much-does-it-cost-paint-room/dc/washington “Interior Painting Cost in Washington, DC (2026)”
[10]: https://www.housecallpro.com/resources/house-cleaning-prices/ “House Cleaning Prices (2026)”
