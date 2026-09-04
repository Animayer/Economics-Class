import type { Amendment, Branch, CheckAction, Scenario } from "../types";

export const CLASS_LINE =
  "Battery Creek High School · U.S. History / Government · Constitution unit";

export const ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
] as const;

export const BRANCHES: readonly Branch[] = [
  {
    id: "legislative",
    article: "Article I",
    name: "Legislative",
    shortName: "Congress",
    who: "Congress writes the laws — a bicameral (two-house) legislature.",
    whoDetail: [
      "House of Representatives: seats by population, two-year terms, starts tax bills and can impeach.",
      "Senate: two senators per state, six-year terms, tries impeachments, and gives advice and consent on nominees and treaties.",
      "Together they are Congress. A bill usually needs both houses, then the President.",
    ],
    powers: [
      "Make federal laws (the lawmaking power).",
      "Tax and spend — the power of the purse.",
      "Declare war, raise and support armies and a navy, and regulate interstate and foreign commerce.",
      "Senate: confirm (or reject) judges and officers; approve treaties by a two-thirds vote.",
      "House impeaches; Senate holds the trial (two-thirds to convict and remove).",
    ],
    checks: [
      "Can override a veto with two-thirds of both houses.",
      "Can refuse to fund a program the President wants.",
      "Can impeach and remove a President, judge, or other civil officer.",
      "Senate can reject a nominee or a treaty.",
    ],
  },
  {
    id: "executive",
    article: "Article II",
    name: "Executive",
    shortName: "President",
    who: "The President enforces federal law and heads the executive branch.",
    whoDetail: [
      "President and Vice President, elected for four-year terms.",
      "The Cabinet and executive departments (State, Defense, Justice, and others) help carry out the law.",
      "The President is commander in chief of the armed forces — but Congress declares war and controls funding.",
    ],
    powers: [
      "Take care that the laws be faithfully executed.",
      "Commander in chief of the Army, Navy, and militia when called into service.",
      "Nominate federal judges, ambassadors, and other officers (with Senate consent).",
      "Negotiate treaties (they need two-thirds of the Senate to take effect).",
      "Veto bills. Issue pardons for federal crimes (not for impeachment).",
    ],
    checks: [
      "Can veto a bill Congress passed.",
      "Nominates the judges who will later interpret the law.",
      "Can pardon people convicted in federal court (a check on prosecution and sentencing).",
    ],
  },
  {
    id: "judicial",
    article: "Article III",
    name: "Judicial",
    shortName: "Courts",
    who: "Federal courts interpret the Constitution and federal law in real cases.",
    whoDetail: [
      "The Supreme Court is the only court the Constitution itself creates.",
      "Congress creates the lower federal courts (district courts and courts of appeals).",
      "Justices and federal judges hold office during good behavior — usually for life — so they are harder to pressure.",
      "Today the Supreme Court has one Chief Justice and eight Associate Justices (the number is set by Congress, not the Constitution).",
    ],
    powers: [
      "Decide cases arising under the Constitution, federal laws, and treaties.",
      "Judicial review: strike down a law or official action that conflicts with the Constitution (established in practice by Marbury v. Madison, 1803).",
      "Hear appeals from lower federal courts, and some cases from state courts on federal questions.",
    ],
    checks: [
      "Can declare an act of Congress unconstitutional.",
      "Can declare a presidential action unconstitutional.",
      "Life tenure plus impeachment-only removal protects judges from everyday politics.",
    ],
  },
];

export const CHECKS: readonly CheckAction[] = [
  {
    id: "veto",
    label: "Veto",
    summary:
      "The President can refuse to sign a bill. It does not become law unless Congress overrides.",
    from: ["executive"],
    toward: ["legislative"],
    arrows: ["leg-exec"],
  },
  {
    id: "override",
    label: "2/3 override",
    summary:
      "If two-thirds of the House and two-thirds of the Senate vote yes again, the bill becomes law over a veto.",
    from: ["legislative"],
    toward: ["executive"],
    arrows: ["leg-exec"],
  },
  {
    id: "appointments",
    label: "Advise & consent",
    summary:
      "The President nominates judges and many officers. The Senate can confirm or reject them.",
    from: ["executive", "legislative"],
    toward: ["judicial"],
    arrows: ["leg-exec", "exec-jud"],
  },
  {
    id: "review",
    label: "Judicial review",
    summary:
      "Courts can void a law or executive action that conflicts with the Constitution. The other branches must live with that ruling unless the Constitution is amended or the Court later changes course.",
    from: ["judicial"],
    toward: ["legislative", "executive"],
    arrows: ["leg-jud", "exec-jud"],
  },
  {
    id: "impeach",
    label: "Impeachment",
    summary:
      "The House can impeach (accuse). The Senate holds a trial. A two-thirds Senate vote can remove a President, judge, or other civil officer.",
    from: ["legislative"],
    toward: ["executive", "judicial"],
    arrows: ["leg-exec", "leg-jud"],
  },
  {
    id: "purse",
    label: "Power of the purse",
    summary:
      "Only Congress can tax and appropriate money. A President cannot spend what Congress will not fund.",
    from: ["legislative"],
    toward: ["executive"],
    arrows: ["leg-exec"],
  },
  {
    id: "war",
    label: "War powers",
    summary:
      "The President commands the military. Only Congress can declare war, and Congress funds the forces. Modern deployments often sit in that tension — a good class discussion, not a trick question.",
    from: ["executive", "legislative"],
    toward: ["executive", "legislative"],
    arrows: ["leg-exec"],
  },
  {
    id: "treaties",
    label: "Treaties",
    summary:
      "The President negotiates a treaty. It becomes binding only if two-thirds of the Senate consents.",
    from: ["executive"],
    toward: ["legislative"],
    arrows: ["leg-exec"],
  },
];

export const AMENDMENTS: readonly Amendment[] = [
  {
    number: 1,
    roman: "I",
    title: "Five Freedoms",
    subtitle: "Speech · Press · Religion · Assembly · Petition",
    gist: "Congress may not establish a religion or stop people from freely exercising one. It may not abridge freedom of speech or of the press, or the right to peaceably assemble and to petition the government for a change.",
    protects: [
      "Speech: you may criticize officials and argue about public issues — including unpopular views.",
      "Press: newspapers, sites, and other publishers may report and editorialize without a government license to print.",
      "Religion: no official national church (establishment) and people may practice their faith (free exercise).",
      "Assembly and petition: peaceful rallies, and asking government for a remedy.",
    ],
    doesNot: [
      "It is not a blank check for true threats, incitement to imminent lawless action, or disrupting class.",
      "At school (Tinker-level civics, not legal advice): students do not shed these rights at the schoolhouse gate, but schools may limit speech that substantially disrupts learning.",
    ],
    whyItMattered:
      "The founding generation had seen governments punish speech, license the press, and pick official churches. Amendment I puts those five freedoms in writing first.",
  },
  {
    number: 2,
    roman: "II",
    title: "Keep and Bear Arms",
    subtitle: "Militia clause · individual right",
    gist: "A well regulated militia is called necessary to the security of a free state, and the right of the people to keep and bear arms shall not be infringed.",
    protects: [
      "The Supreme Court has read this as including an individual right to have a firearm for self-defense in the home (District of Columbia v. Heller, 2008).",
      "The text ties the right to a militia and to “the people,” which is why class debates about meaning are long-standing.",
    ],
    doesNot: [
      "Heller itself said the right is not unlimited — governments may still set some rules (for example, who may possess a firearm, and where).",
      "This board does not take a policy side. It states the text and the main Court reading used in civics class.",
    ],
    whyItMattered:
      "After the Revolution, many Americans wanted a written check against a disarmed public and a standing army they did not control.",
  },
  {
    number: 3,
    roman: "III",
    title: "No Quartering",
    subtitle: "Soldiers in private homes",
    gist: "In peacetime, soldiers may not be housed in a private home without the owner’s consent. In wartime, quartering must follow a law Congress writes.",
    protects: [
      "The privacy of your house against the government parking troops there.",
      "A bright-line rule: consent in peacetime; a statute in wartime.",
    ],
    doesNot: [
      "It is not a general “privacy amendment” for phones or data — that conversation usually runs through Amendments IV and others.",
      "It is rarely the center of a modern court case. That does not make it unimportant history.",
    ],
    whyItMattered:
      "British quartering of soldiers in colonial homes was a listed grievance in the Declaration of Independence. Amendment III answers that complaint.",
  },
  {
    number: 4,
    roman: "IV",
    title: "Search and Seizure",
    subtitle: "Persons, houses, papers, and effects",
    gist: "People have a right to be secure against unreasonable searches and seizures. Warrants must be backed by probable cause and must describe the place and the things or people to be seized.",
    protects: [
      "Police generally need a warrant or a recognized exception before searching your home.",
      "“Unreasonable” is the key word: the amendment limits how government may look and take.",
    ],
    doesNot: [
      "It does not mean government can never search. Warrants, hot pursuit, and other exceptions exist.",
      "At school: students have some Fourth Amendment protection, but officials often need reasonable suspicion, not a full probable-cause warrant (New Jersey v. T.L.O. — a civics landmark, not a hall-pass for any search).",
    ],
    whyItMattered:
      "Colonial “writs of assistance” let officials rummage widely. Amendment IV demands a reason, and usually a specific warrant.",
  },
  {
    number: 5,
    roman: "V",
    title: "Due Process",
    subtitle: "Silence · double jeopardy · takings",
    gist: "Serious federal crimes need a grand jury. No one may be tried twice by the same sovereign for the same offense, forced to incriminate themselves, or deprived of life, liberty, or property without due process. Private property may not be taken for public use without just compensation.",
    protects: [
      "The right to remain silent — the government cannot compel you to be a witness against yourself.",
      "Due process: fair procedures before the government takes life, liberty, or property.",
      "If the government takes property for public use (eminent domain), it must pay just compensation.",
    ],
    doesNot: [
      "Double jeopardy does not always block a separate state and federal case on the same facts (dual-sovereign rule) — a nuance for advanced discussion.",
      "“I want a lawyer” is more Amendment VI. The two amendments work together in a police station.",
    ],
    whyItMattered:
      "English and colonial practice had shown how a government can bully a confession or seize land. Amendment V writes down several shields at once.",
  },
  {
    number: 6,
    roman: "VI",
    title: "Fair Criminal Trial",
    subtitle: "Speedy · public · jury · counsel",
    gist: "In criminal cases, the accused has a right to a speedy and public trial by an impartial jury, to be told the charge, to confront witnesses, to call witnesses, and to have the assistance of counsel.",
    protects: [
      "A lawyer — including, in serious cases, one the government must provide if you cannot pay (Gideon v. Wainwright).",
      "A jury of the community, and the chance to face and question accusers.",
      "Notice of the accusation so you can prepare a defense.",
    ],
    doesNot: [
      "It is about criminal prosecutions, not ordinary school discipline or a civil lawsuit (civil juries are Amendment VII).",
      "“Speedy” is not instant. It means the government cannot park a charge forever without a trial.",
    ],
    whyItMattered:
      "Secret courts and trials without counsel were tools of unfair power. Amendment VI makes a criminal trial something the public can see and the accused can fight.",
  },
  {
    number: 7,
    roman: "VII",
    title: "Civil Jury Trial",
    subtitle: "Federal common-law suits",
    gist: "In federal civil cases at common law where the value exceeds twenty dollars, the right to a jury trial is preserved, and a jury’s fact-finding is not to be re-examined except by common-law rules.",
    protects: [
      "A jury can decide the facts in many federal civil lawsuits (for example, some damages cases).",
      "Judges do not get a free do-over on the jury’s fact findings.",
    ],
    doesNot: [
      "Twenty dollars was a 1791 amount — the point was “real civil cases,” not a modern shopping list.",
      "Most everyday civil cases are in state court and follow state jury rules. This amendment is about federal court.",
    ],
    whyItMattered:
      "Juries were a trusted check on judges. Anti-Federalists wanted that check in writing for civil suits, not only criminal ones.",
  },
  {
    number: 8,
    roman: "VIII",
    title: "Bail and Punishment",
    subtitle: "No cruel or unusual punishment",
    gist: "Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.",
    protects: [
      "Limits on how harsh a punishment may be — torture and barbaric methods are off the table.",
      "Bail and fines cannot be wildly out of scale just to keep someone poor or trapped.",
    ],
    doesNot: [
      "It does not mean every punishment students think is “mean” is unconstitutional. Courts ask whether a punishment is cruel and unusual, not merely strict.",
      "School detentions and sports benchings are not what this amendment was written to police.",
    ],
    whyItMattered:
      "The English Bill of Rights (1689) already targeted cruel punishments and stacked bail. Americans copied the idea into their own list.",
  },
  {
    number: 9,
    roman: "IX",
    title: "Rights Retained",
    subtitle: "The list is not the whole of liberty",
    gist: "Listing certain rights in the Constitution does not mean the people do not have other rights. The enumeration shall not be construed to deny or disparage others retained by the people.",
    protects: [
      "A rule of reading: “we wrote down some rights” is not the same as “these are the only rights.”",
      "Arguments that people hold liberties beyond the first eight amendments — a door the Founders left open.",
    ],
    doesNot: [
      "It does not name those extra rights. Courts and politics still argue about what they are.",
      "It is not a free-floating “do whatever you want” clause.",
    ],
    whyItMattered:
      "Some Framers feared a bill of rights would be treated as a complete catalog. Amendment IX says: do not read it that way.",
  },
  {
    number: 10,
    roman: "X",
    title: "Reserved Powers",
    subtitle: "States or the people",
    gist: "Powers not delegated to the United States by the Constitution, nor prohibited to the states, are reserved to the states respectively, or to the people.",
    protects: [
      "Federalism: the national government has enumerated powers. Much else stays with the states or the people.",
      "Everyday examples often left to states: driver’s licenses, most school systems, many criminal laws, local elections.",
    ],
    doesNot: [
      "It does not say states can ignore the Constitution or the Bill of Rights. Later amendments and the Fourteenth Amendment bind the states in important ways.",
      "If the Constitution does give a power to Congress (commerce, coin money, declare war), Amendment X does not take it back.",
    ],
    whyItMattered:
      "Anti-Federalists wanted a written reminder that the new national government was limited. Amendment X is that reminder.",
  },
];

export const SCENARIOS: readonly Scenario[] = [
  {
    id: "armbands",
    kind: "amendment",
    topic: "School speech",
    prompt:
      "Students wear black armbands to protest a war. The protest is silent and class is not disrupted. The principal bans the armbands anyway. Which amendment is this argument about?",
    answer: 1,
    explain:
      "Amendment I covers speech. Civics landmark Tinker v. Des Moines said students do not shed that right at the schoolhouse gate — though schools may still limit speech that substantially disrupts learning. Teaching example, not legal advice.",
  },
  {
    id: "rally",
    kind: "amendment",
    topic: "Assembly and petition",
    prompt:
      "A group holds a peaceful Saturday rally on the public sidewalk at the State House and hands a letter to their representative asking for a new law. Which amendment protects that?",
    answer: 1,
    explain:
      "Amendment I includes peaceable assembly and petition — asking the government for a change — along with speech, press, and religion.",
  },
  {
    id: "lockers",
    kind: "amendment",
    topic: "Search and seizure",
    prompt:
      "A principal searches a student’s locker after a staff member reports seeing stolen phones go in. Which amendment limits unreasonable searches?",
    answer: 4,
    explain:
      "Amendment IV protects against unreasonable searches and seizures. At school, officials generally need reasonable suspicion, not a full police warrant. Still a Fourth Amendment conversation.",
  },
  {
    id: "silence",
    kind: "amendment",
    topic: "Self-incrimination",
    prompt:
      "Police question a teenager at the station and say, “You have to answer us.” Which amendment protects the right not to be forced to incriminate yourself?",
    answer: 5,
    explain:
      "Amendment V includes the right against compelled self-incrimination — the idea behind remaining silent. The right to a lawyer is mainly Amendment VI; the two often travel together.",
  },
  {
    id: "counsel",
    kind: "amendment",
    topic: "Right to counsel",
    prompt:
      "A defendant facing a serious criminal charge cannot afford an attorney. Which amendment guarantees the assistance of counsel?",
    answer: 6,
    explain:
      "Amendment VI includes the right to a lawyer. Later cases said the government must provide one in serious criminal cases if the person cannot pay.",
  },
  {
    id: "branding",
    kind: "amendment",
    topic: "Cruel punishment",
    prompt:
      "A town proposes branding people convicted of vandalism as their official punishment. Which amendment bans cruel and unusual punishments?",
    answer: 8,
    explain:
      "Amendment VIII bars cruel and unusual punishments — and also excessive bail and fines.",
  },
  {
    id: "quartering",
    kind: "amendment",
    topic: "Quartering (historical)",
    prompt:
      "In the 1770s, colonists were angry that British soldiers could be housed in private homes. Which amendment answers that grievance?",
    answer: 3,
    explain:
      "Amendment III bans peacetime quartering of soldiers in private homes without the owner’s consent. Rarely litigated today; it is about the privacy of the home.",
  },
  {
    id: "licenses",
    kind: "amendment",
    topic: "Reserved powers",
    prompt:
      "South Carolina sets the age and rules for a driver’s license. The Constitution never lists “driver’s licenses” as a federal job. Which amendment explains why states usually handle this?",
    answer: 10,
    explain:
      "Amendment X reserves powers not given to the national government — and not denied to the states — to the states or the people.",
  },
  {
    id: "override",
    kind: "choice",
    topic: "Veto override",
    prompt:
      "The President vetoes a bill that already passed Congress. How can Congress still make it law?",
    choices: [
      "The Supreme Court signs it",
      "Two-thirds of both houses vote to override",
      "The Cabinet overrules the veto",
      "A majority of state governors agree",
    ],
    answer: "Two-thirds of both houses vote to override",
    explain:
      "A two-thirds vote in both the House and the Senate can override a veto. That is Congress checking the President.",
  },
  {
    id: "review",
    kind: "choice",
    topic: "Judicial review",
    prompt:
      "The Supreme Court rules that a new federal law conflicts with the Constitution, so the law cannot be enforced. What is this check called?",
    choices: [
      "Veto",
      "Impeachment",
      "Judicial review",
      "Power of the purse",
    ],
    answer: "Judicial review",
    explain:
      "Judicial review is the courts’ power to strike down laws or actions that conflict with the Constitution. Marbury v. Madison (1803) is the civics landmark.",
  },
  {
    id: "impeach",
    kind: "choice",
    topic: "Impeachment",
    prompt:
      "The House votes to accuse a President of high crimes and misdemeanors. The Senate will hold a trial. Which check is that?",
    choices: [
      "Judicial review",
      "Advise and consent",
      "Impeachment",
      "Commander in chief",
    ],
    answer: "Impeachment",
    explain:
      "The House impeaches (accuses). The Senate tries the case. A two-thirds Senate vote is required to convict and remove.",
  },
  {
    id: "war",
    kind: "choice",
    topic: "War powers",
    prompt:
      "The President is commander in chief of the armed forces. Who has the power to declare war?",
    choices: [
      "The Supreme Court",
      "The Cabinet",
      "Congress",
      "State governors",
    ],
    answer: "Congress",
    explain:
      "Article I gives Congress the power to declare war. The President directs the military; declaring war and funding the forces are legislative powers.",
  },
];

export function branchById(id: string): Branch | undefined {
  return BRANCHES.find((b) => b.id === id);
}

export function checkById(id: string): CheckAction | undefined {
  return CHECKS.find((c) => c.id === id);
}

export function amendmentByNumber(n: number): Amendment | undefined {
  return AMENDMENTS.find((a) => a.number === n);
}

export function isCorrect(scenario: Scenario, pick: string | number): boolean {
  if (scenario.kind === "amendment") {
    return Number(pick) === scenario.answer;
  }
  return pick === scenario.answer;
}
