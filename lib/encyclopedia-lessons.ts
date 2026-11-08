/** Add lessons here without editing the website interface. */
export type Lesson = { id: string; category: string; title: string; level: string; summary: string; steps: string[]; tip: string };
export const lessons: Lesson[] = [
  {
    "id": "your-first-crochet-setup",
    "category": "Getting started",
    "title": "Your first crochet setup",
    "level": "Beginner",
    "summary": "Start with a comfortable hook and easy-to-see yarn.",
    "steps": [
      "Choose a smooth, light-colored medium-weight yarn and a hook close to the label recommendation.",
      "Make a slip knot, chain 15, and practice single crochet in rows.",
      "Count stitches at the end of each row before turning."
    ],
    "tip": "Skip fuzzy, dark, and novelty yarn for your first practice square."
  },
  {
    "id": "slip-knots-and-foundation-chains",
    "category": "Getting started",
    "title": "Slip knots and foundation chains",
    "level": "Beginner",
    "summary": "Make an adjustable loop and an even starting chain.",
    "steps": [
      "Cross the working yarn over itself to make a loop.",
      "Pull a bight through, place it on the hook, and snug without tightening hard.",
      "Yarn over and pull through repeatedly; count V shapes, not the loop on the hook."
    ],
    "tip": "If your foundation curls or puckers, use a hook one size larger for the chain only."
  },
  {
    "id": "how-to-hold-yarn-and-hook",
    "category": "Getting started",
    "title": "How to hold yarn and hook",
    "level": "Beginner",
    "summary": "Find tension that is comfortable and repeatable.",
    "steps": [
      "Try a pencil grip or knife grip; neither is universally correct.",
      "Guide yarn over a finger on your non-dominant hand, adjusting wraps until it feeds smoothly.",
      "Pause often to relax hands and shoulders."
    ],
    "tip": "Consistency matters more than copying someone else’s grip."
  },
  {
    "id": "turning-chains-and-straight-edges",
    "category": "Getting started",
    "title": "Turning chains and straight edges",
    "level": "Beginner",
    "summary": "Keep the same stitch count from row to row.",
    "steps": [
      "Identify the last actual stitch before turning.",
      "Follow your pattern’s instructions on whether the turning chain counts as a stitch.",
      "Mark the first and last stitches of every row until edges are reliable."
    ],
    "tip": "A marker in the last stitch prevents the mysterious disappearing-stitch problem."
  },
  {
    "id": "single-crochet-us",
    "category": "Stitches & techniques",
    "title": "Single crochet (US)",
    "level": "Beginner",
    "summary": "A dense, sturdy basic stitch.",
    "steps": [
      "Insert hook in next stitch and pull up a loop: two loops on hook.",
      "Yarn over and pull through both loops.",
      "Repeat; work into the correct top loops unless instructed otherwise."
    ],
    "tip": "UK patterns call US single crochet “double crochet.” Always check terminology."
  },
  {
    "id": "half-double-crochet-us",
    "category": "Stitches & techniques",
    "title": "Half double crochet (US)",
    "level": "Beginner",
    "summary": "A flexible stitch between single and double crochet in height.",
    "steps": [
      "Yarn over, insert hook, and pull up a loop: three loops on hook.",
      "Yarn over and pull through all three loops.",
      "Repeat and check edge stitch placement."
    ],
    "tip": "Third-loop half double crochet creates a knit-like ridge."
  },
  {
    "id": "double-crochet-us",
    "category": "Stitches & techniques",
    "title": "Double crochet (US)",
    "level": "Beginner",
    "summary": "A taller stitch with good drape.",
    "steps": [
      "Yarn over, insert hook, and pull up a loop: three loops.",
      "Yarn over and pull through two loops.",
      "Yarn over and pull through the remaining two loops."
    ],
    "tip": "Use a swatch to see how your turning chain affects edge height."
  },
  {
    "id": "treble-crochet-us",
    "category": "Stitches & techniques",
    "title": "Treble crochet (US)",
    "level": "Intermediate",
    "summary": "A tall open stitch useful for lace.",
    "steps": [
      "Yarn over twice, insert hook, and pull up a loop.",
      "Yarn over and pull through two loops three times.",
      "Keep loops even to avoid stretched, uneven posts."
    ],
    "tip": "Tall stitches benefit from consistent yarn tension."
  },
  {
    "id": "front-loop-and-back-loop-only",
    "category": "Stitches & techniques",
    "title": "Front-loop and back-loop only",
    "level": "Beginner",
    "summary": "Create ridges and flexible ribbing.",
    "steps": [
      "Look at the V on top of each stitch.",
      "For FLO work under only the loop nearest you; for BLO work under the loop farthest from you.",
      "Work several rows and compare the texture."
    ],
    "tip": "BLO single crochet makes stretchy ribbing when worked sideways."
  },
  {
    "id": "slip-stitch-and-invisible-joins",
    "category": "Stitches & techniques",
    "title": "Slip stitch and invisible joins",
    "level": "Beginner",
    "summary": "Connect rounds and move without adding height.",
    "steps": [
      "Insert hook where the pattern directs.",
      "Yarn over and pull through the stitch and loop on hook in one motion.",
      "For a clean finish, fasten off and use a needle to imitate the top V when appropriate."
    ],
    "tip": "Do not mistake the joining slip stitch for the first stitch of the next round."
  },
  {
    "id": "magic-ring-without-the-struggle",
    "category": "Stitches & techniques",
    "title": "Magic ring without the struggle",
    "level": "Beginner",
    "summary": "Start circular motifs with an adjustable center.",
    "steps": [
      "Make a loop with the working yarn, leaving a generous tail.",
      "Insert hook through the loop, pull up a loop, and chain to secure.",
      "Work stitches around the ring and tail, then gently pull the tail closed."
    ],
    "tip": "With chunky yarn, try a smooth thinner temporary pull strand alongside the tail; test gently to avoid snagging."
  },
  {
    "id": "increase-and-decrease-neatly",
    "category": "Stitches & techniques",
    "title": "Increase and decrease neatly",
    "level": "Beginner",
    "summary": "Shape fabric by changing stitch counts.",
    "steps": [
      "Increase by placing two stitches into one stitch.",
      "Decrease using the stitch-specific method in your pattern.",
      "Mark repeat boundaries and recount after shaping rounds."
    ],
    "tip": "Invisible single-crochet decreases are especially useful on amigurumi."
  },
  {
    "id": "working-in-rounds-vs-rows",
    "category": "Stitches & techniques",
    "title": "Working in rounds vs rows",
    "level": "Beginner",
    "summary": "Know when to turn and when to keep spiraling.",
    "steps": [
      "Rows reverse direction after turning; joined rounds connect at a seam.",
      "Continuous rounds spiral without joining; mark the first stitch of each round.",
      "Read whether the pattern expects a join, chain, or turn."
    ],
    "tip": "A removable marker in continuous rounds is essential, not optional."
  },
  {
    "id": "read-pattern-abbreviations",
    "category": "Patterns & charts",
    "title": "Read pattern abbreviations",
    "level": "Beginner",
    "summary": "Decode common shorthand before starting.",
    "steps": [
      "Find the pattern’s abbreviation key and identify US or UK terms.",
      "Common US terms include ch, sc, hdc, dc, sl st, inc, and dec.",
      "Work instructions in parentheses or brackets the specified number of times."
    ],
    "tip": "Write unfamiliar abbreviations on a small reference card."
  },
  {
    "id": "read-a-crochet-stitch-chart",
    "category": "Patterns & charts",
    "title": "Read a crochet stitch chart",
    "level": "Intermediate",
    "summary": "Follow symbols rather than written rows.",
    "steps": [
      "Find the chart legend and starting point.",
      "Read flat rows in alternating directions; rounds typically progress outward.",
      "Check repeats and stitch counts against the written pattern if available."
    ],
    "tip": "Use a highlighter or digital annotation to track the current row."
  },
  {
    "id": "understand-repeats-and-multiples",
    "category": "Patterns & charts",
    "title": "Understand repeats and multiples",
    "level": "Beginner",
    "summary": "Adjust project width without breaking stitch patterns.",
    "steps": [
      "Identify the stitch multiple and any extra edge stitches.",
      "Choose a foundation chain count matching the multiple plus extras.",
      "Make a small test repeat to verify the instructions."
    ],
    "tip": "A “multiple of 6 + 2” means 6n + 2 chains, not 6 + 2 total."
  },
  {
    "id": "us-and-uk-crochet-terms",
    "category": "Patterns & charts",
    "title": "US and UK crochet terms",
    "level": "Beginner",
    "summary": "Avoid making a completely different fabric by accident.",
    "steps": [
      "Check the pattern origin and terminology note.",
      "US sc = UK dc; US dc = UK tr; US hdc = UK htr.",
      "Compare stitch diagrams or finished gauge when terminology is unclear."
    ],
    "tip": "Never assume a UK double crochet means a US double crochet."
  },
  {
    "id": "yarn-weight-and-fiber-basics",
    "category": "Yarn & tools",
    "title": "Yarn weight and fiber basics",
    "level": "Beginner",
    "summary": "Choose yarn for structure, softness, and care.",
    "steps": [
      "Read yarn weight, yardage, fiber, and washing instructions on the label.",
      "Compare cotton, wool, acrylic, and blends for stretch and drape.",
      "Make a swatch before committing to a large project."
    ],
    "tip": "Two yarns in the same weight category can still work up differently."
  },
  {
    "id": "substitute-yarn-confidently",
    "category": "Yarn & tools",
    "title": "Substitute yarn confidently",
    "level": "All levels",
    "summary": "Match fabric behavior, not only label weight.",
    "steps": [
      "Compare recommended gauge, fiber, construction, and care.",
      "Make a swatch with your planned stitch and hook.",
      "Check drape, stretch, and total yardage before purchasing."
    ],
    "tip": "Calculate total yardage rather than matching skein counts."
  },
  {
    "id": "choose-the-right-hook-size",
    "category": "Yarn & tools",
    "title": "Choose the right hook size",
    "level": "Beginner",
    "summary": "Hook size affects fabric density and finished fit.",
    "steps": [
      "Start with the yarn label or pattern suggestion.",
      "Swatch and measure stitches and rows.",
      "Adjust hook size to reach the desired fabric and gauge."
    ],
    "tip": "Larger hooks generally make looser fabric; your personal tension changes the result."
  },
  {
    "id": "prevent-yarn-splitting-and-snagging",
    "category": "Yarn & tools",
    "title": "Prevent yarn splitting and snagging",
    "level": "All levels",
    "summary": "Reduce frustration with difficult fibers.",
    "steps": [
      "Try a hook with a smoother tip and different head shape.",
      "Slow down and catch the entire strand before pulling through.",
      "For fuzzy yarn, use stitch markers and good side lighting."
    ],
    "tip": "A contrast-colored mat beneath your work makes stitches easier to see."
  },
  {
    "id": "measure-crochet-gauge",
    "category": "Sizing & fit",
    "title": "Measure crochet gauge",
    "level": "Beginner",
    "summary": "Make pieces fit their intended dimensions.",
    "steps": [
      "Work a swatch larger than the measured area in the pattern stitch.",
      "Wash and dry it the same way as the finished piece.",
      "Measure stitches and rows in the center, avoiding distorted edges."
    ],
    "tip": "Changing hook size may fix stitch gauge without fixing row gauge."
  },
  {
    "id": "calculate-foundation-stitches",
    "category": "Sizing & fit",
    "title": "Calculate foundation stitches",
    "level": "Intermediate",
    "summary": "Turn a desired width into a starting stitch count.",
    "steps": [
      "Measure stitches across a 10 cm or 4 in swatch.",
      "Divide stitch count by measured width to get stitches per unit.",
      "Multiply by desired width and adjust for pattern multiples."
    ],
    "tip": "For garments, include planned ease before converting inches into stitches."
  },
  {
    "id": "measure-a-dog-for-a-sweater",
    "category": "Sizing & fit",
    "title": "Measure a dog for a sweater",
    "level": "All levels",
    "summary": "Fit the actual dog, not a breed chart.",
    "steps": [
      "Measure neck circumference, chest girth behind front legs, and back length.",
      "Record front-leg spacing and distance from neck to legs.",
      "Allow comfortable movement and keep the underside clear for toileting."
    ],
    "tip": "Try the garment on frequently; never leave an ill-fitting sweater on an unattended dog."
  },
  {
    "id": "ease-and-garment-fit",
    "category": "Sizing & fit",
    "title": "Ease and garment fit",
    "level": "Intermediate",
    "summary": "Plan room to move without losing shape.",
    "steps": [
      "Measure the body or a well-fitting garment.",
      "Compare the finished garment dimensions to body measurements.",
      "Add positive ease for looseness or carefully planned negative ease for stretch."
    ],
    "tip": "Fabric stretch and stitch choice matter as much as the numbers."
  },
  {
    "id": "shape-armholes-and-necklines",
    "category": "Sizing & fit",
    "title": "Shape armholes and necklines",
    "level": "Intermediate",
    "summary": "Plan decreases and opening placement.",
    "steps": [
      "Make a measured sketch of the finished piece.",
      "Convert target shaping dimensions into stitch and row counts.",
      "Spread increases or decreases across rows, checking symmetry and fit."
    ],
    "tip": "Count shaping rows separately so both sides match."
  },
  {
    "id": "join-crochet-panels-neatly",
    "category": "Garments & joining",
    "title": "Join crochet panels neatly",
    "level": "Intermediate",
    "summary": "Choose a seam with suitable stretch and strength.",
    "steps": [
      "Block pieces to the planned dimensions.",
      "Clip matching points and distribute any excess evenly.",
      "Use mattress stitch for a discreet seam or slip stitches for a ridge."
    ],
    "tip": "Mark quarter points along long seams to prevent bunching."
  },
  {
    "id": "sew-on-sleeves-without-puckers",
    "category": "Garments & joining",
    "title": "Sew on sleeves without puckers",
    "level": "Intermediate",
    "summary": "Set sleeves evenly into armholes.",
    "steps": [
      "Find and mark sleeve cap and armhole centers.",
      "Match shoulder, underarm, and quarter points.",
      "Join gradually while distributing fullness, then try on."
    ],
    "tip": "Do not pull the seam yarn tight; it can make the armhole rigid."
  },
  {
    "id": "make-stretchy-ribbed-cuffs",
    "category": "Garments & joining",
    "title": "Make stretchy ribbed cuffs",
    "level": "Intermediate",
    "summary": "Build cuffs that stretch and recover.",
    "steps": [
      "Work BLO single crochet in short sideways rows.",
      "Continue until the ribbed strip fits comfortably around the opening.",
      "Join strip ends and attach evenly to the garment edge."
    ],
    "tip": "Measure ribbing gently stretched, not fully stretched."
  },
  {
    "id": "add-buttons-and-buttonholes",
    "category": "Garments & joining",
    "title": "Add buttons and buttonholes",
    "level": "Intermediate",
    "summary": "Keep closures secure and easy to use.",
    "steps": [
      "Choose button size and placement before making the band.",
      "Make chain-space buttonholes and test them with the actual buttons.",
      "Reinforce button attachments and check for loose components."
    ],
    "tip": "Avoid detachable buttons on pet items if they could be chewed or swallowed."
  },
  {
    "id": "frog-stitches-without-losing-progress",
    "category": "Fixes & troubleshooting",
    "title": "Frog stitches without losing progress",
    "level": "All levels",
    "summary": "Undo only the section that needs fixing.",
    "steps": [
      "Photograph the current row and count stitches.",
      "Protect the row you want to keep with markers or a tested lifeline.",
      "Unravel slowly, secure the working loop, and resume."
    ],
    "tip": "With fuzzy yarn, unpick stitch by stitch instead of pulling hard."
  },
  {
    "id": "add-a-safety-lifeline",
    "category": "Fixes & troubleshooting",
    "title": "Add a safety lifeline",
    "level": "Intermediate",
    "summary": "Protect a row before risky changes.",
    "steps": [
      "Thread smooth contrasting yarn onto a blunt needle.",
      "Run it carefully through a stable row without splitting yarn.",
      "Leave ends free and test before unraveling to it."
    ],
    "tip": "Crochet lifelines vary by stitch; practice on a swatch first."
  },
  {
    "id": "fix-accidental-increases-and-decreases",
    "category": "Fixes & troubleshooting",
    "title": "Fix accidental increases and decreases",
    "level": "Beginner",
    "summary": "Find why your edges are growing or shrinking.",
    "steps": [
      "Count stitches in the last correct row.",
      "Check whether you worked into turning chains or skipped edge stitches.",
      "Mark first and last stitches before continuing."
    ],
    "tip": "Photograph row ends for comparison when learning a new stitch."
  },
  {
    "id": "repair-a-dropped-or-loose-loop",
    "category": "Fixes & troubleshooting",
    "title": "Repair a dropped or loose loop",
    "level": "Intermediate",
    "summary": "Stop unraveling and secure the fabric.",
    "steps": [
      "Place a removable marker or safety pin through the live loop.",
      "Trace the yarn path to determine where the stitch came loose.",
      "Rebuild carefully with a hook or undo to the last stable row."
    ],
    "tip": "Do not pull random loose strands; identify the stitch path first."
  },
  {
    "id": "why-your-circle-turns-into-a-bowl",
    "category": "Fixes & troubleshooting",
    "title": "Why your circle turns into a bowl",
    "level": "Beginner",
    "summary": "Flat circles need the right increase rate.",
    "steps": [
      "Count stitches in each round.",
      "Compare increase frequency with the pattern and your stitch height.",
      "Adjust only after checking tension and whether you skipped increases."
    ],
    "tip": "Too few increases often cups; too many can ripple."
  },
  {
    "id": "prevent-twisting-foundation-chains",
    "category": "Fixes & troubleshooting",
    "title": "Prevent twisting foundation chains",
    "level": "Beginner",
    "summary": "Join long chains without accidental twists.",
    "steps": [
      "Lay the foundation chain flat with the V faces aligned.",
      "Mark the first chain and trace the full chain before joining.",
      "Join only after confirming it has not rotated."
    ],
    "tip": "Work one foundation row flat before joining if your pattern allows it."
  },
  {
    "id": "stuff-amigurumi-evenly",
    "category": "Amigurumi & toys",
    "title": "Stuff amigurumi evenly",
    "level": "Beginner",
    "summary": "Avoid lumps and distorted shapes.",
    "steps": [
      "Add small amounts of stuffing as the piece grows.",
      "Fill corners and narrow sections before closing access.",
      "Shape gently without overstuffing."
    ],
    "tip": "Use a smaller hook for dense fabric that hides stuffing."
  },
  {
    "id": "attach-parts-symmetrically",
    "category": "Amigurumi & toys",
    "title": "Attach parts symmetrically",
    "level": "Intermediate",
    "summary": "Place ears, arms, and legs evenly.",
    "steps": [
      "Count rounds and stitches to mark attachment points.",
      "Pin all parts before sewing and check from multiple angles.",
      "Sew firmly with matching yarn and weave ends inside."
    ],
    "tip": "Use embroidered details rather than detachable plastic eyes for items intended for very young children."
  },
  {
    "id": "change-colors-cleanly",
    "category": "Colorwork & texture",
    "title": "Change colors cleanly",
    "level": "Beginner",
    "summary": "Reduce awkward color bumps.",
    "steps": [
      "Work the final stitch of the old color until its last yarn-over.",
      "Complete the final pull-through with the new color.",
      "Secure ends on the wrong side without pulling tight."
    ],
    "tip": "For neat stripes, plan where joins will fall before starting."
  },
  {
    "id": "tapestry-crochet-basics",
    "category": "Colorwork & texture",
    "title": "Tapestry crochet basics",
    "level": "Intermediate",
    "summary": "Carry unused colors inside stitches.",
    "steps": [
      "Use a simple two-color chart and consistent stitch tension.",
      "Work over the inactive yarn as you crochet with the active color.",
      "Check both sides and avoid pulling carried strands tight."
    ],
    "tip": "High-contrast yarn can show through; test color combinations on a swatch."
  },
  {
    "id": "granny-squares-that-stay-square",
    "category": "Colorwork & texture",
    "title": "Granny squares that stay square",
    "level": "Beginner",
    "summary": "Make consistent motifs for blankets and bags.",
    "steps": [
      "Work corners exactly as written and count side groups.",
      "Use markers to identify each corner.",
      "Block finished motifs to consistent dimensions before joining."
    ],
    "tip": "Mixing different hook tensions across motifs creates uneven joins."
  },
  {
    "id": "weave-in-ends-securely",
    "category": "Finishing & care",
    "title": "Weave in ends securely",
    "level": "Beginner",
    "summary": "Keep finished projects from coming undone.",
    "steps": [
      "Leave a generous yarn tail when fastening off.",
      "Use a tapestry needle to weave through the backs of several stitches.",
      "Change direction and trim only after checking stretch."
    ],
    "tip": "Slippery yarn may need longer, multi-directional weaving."
  },
  {
    "id": "block-crochet-safely",
    "category": "Finishing & care",
    "title": "Block crochet safely",
    "level": "Intermediate",
    "summary": "Set dimensions and improve stitch definition.",
    "steps": [
      "Check fiber care instructions before adding water or heat.",
      "Pin or lay the piece to its target measurements.",
      "Allow it to dry fully before removing pins or wearing."
    ],
    "tip": "Avoid direct high heat on acrylic; test a swatch first."
  },
  {
    "id": "wash-and-store-handmade-items",
    "category": "Finishing & care",
    "title": "Wash and store handmade items",
    "level": "All levels",
    "summary": "Keep your projects looking good longer.",
    "steps": [
      "Follow the most delicate fiber or embellishment care instructions.",
      "Use gentle washing and support heavy wet pieces when drying.",
      "Store completely dry, away from direct sunlight and pests."
    ],
    "tip": "Photograph care labels before discarding yarn bands."
  },
  {
    "id": "estimate-yarn-for-a-project",
    "category": "Planning & projects",
    "title": "Estimate yarn for a project",
    "level": "Intermediate",
    "summary": "Avoid running out halfway through.",
    "steps": [
      "Make and weigh a representative swatch.",
      "Estimate total project area or number of repeated motifs.",
      "Scale swatch consumption and add a sensible margin for joining and variation."
    ],
    "tip": "Buy the same dye lot when possible; keep the receipt until finished."
  },
  {
    "id": "plan-a-crochet-project-notebook",
    "category": "Planning & projects",
    "title": "Plan a crochet project notebook",
    "level": "All levels",
    "summary": "Track hooks, yarn, changes, and lessons learned.",
    "steps": [
      "Record project name, yarn, dye lot, hook, and gauge.",
      "Log row counts, measurements, and modifications as you go.",
      "Add finished photos and notes for next time."
    ],
    "tip": "A quick note about what went wrong is often more valuable than a perfect photo."
  },
  {
    "id": "read-a-pattern-before-buying-yarn",
    "category": "Planning & projects",
    "title": "Read a pattern before buying yarn",
    "level": "Beginner",
    "summary": "Catch confusing instructions before committing.",
    "steps": [
      "Check skill level, abbreviations, size chart, and materials.",
      "Scan for unusual techniques and finishing requirements.",
      "Confirm yardage and whether a gauge swatch is required."
    ],
    "tip": "Look for errata or pattern updates before starting."
  }
] satisfies Lesson[];
