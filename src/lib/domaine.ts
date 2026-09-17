import type { LucideIcon } from "lucide-react";
import {
  Anvil,
  Church,
  Eye,
  Home,
  Shield,
  Trees,
  Crown,
} from "lucide-react";

/**
 * Description du fief des Karnstein.
 *
 * Les coordonnées `x` / `y` sont exprimées dans le repère de la carte
 * (public/carte/comte-karnstein.svg) : origine en haut à gauche,
 * 2400 x 1600 unités. La conversion vers le repère Leaflet (CRS.Simple,
 * axe Y vers le haut) est faite dans le composant de carte.
 */

export const CARTE_LARGEUR = 2400;
export const CARTE_HAUTEUR = 1600;
export const CARTE_URL = "/carte/comte-karnstein.svg";

export type CategorieId =
  | "siege"
  | "bourg"
  | "culte"
  | "artisanat"
  | "defense"
  | "nature"
  | "mystere";

export type Categorie = {
  id: CategorieId;
  nom: string;
  description: string;
  /** Teinte du marqueur sur la carte (hex, lisible sur le parchemin sombre). */
  couleur: string;
  icone: LucideIcon;
};

export const CATEGORIES: Categorie[] = [
  {
    id: "siege",
    nom: "Siège comtal",
    description: "Le cœur du pouvoir de la maison.",
    couleur: "#c8a24a",
    icone: Crown,
  },
  {
    id: "bourg",
    nom: "Bourgs & hameaux",
    description: "Là où vivent les sujets du Comté.",
    couleur: "#d8c6a8",
    icone: Home,
  },
  {
    id: "culte",
    nom: "Culte & mémoire",
    description: "Sanctuaires, chapelles et sépultures.",
    couleur: "#9b8fb0",
    icone: Church,
  },
  {
    id: "artisanat",
    nom: "Artisanat & négoce",
    description: "Forges, vignes, moulins et carrières.",
    couleur: "#b07a4a",
    icone: Anvil,
  },
  {
    id: "defense",
    nom: "Défense",
    description: "Guets, ponts et postes de garnison.",
    couleur: "#8ea0aa",
    icone: Shield,
  },
  {
    id: "nature",
    nom: "Terres sauvages",
    description: "Sylves, marais et camps de chasse.",
    couleur: "#7f9a70",
    icone: Trees,
  },
  {
    id: "mystere",
    nom: "Lieux proscrits",
    description: "Ce dont le Comté ne parle qu'à voix basse.",
    couleur: "#a9202a",
    icone: Eye,
  },
];

export const CATEGORIES_PAR_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategorieId, Categorie>;

export type Acces = "libre" | "invitation" | "interdit";

export const ACCES_LABEL: Record<Acces, string> = {
  libre: "Accès libre",
  invitation: "Sur invitation",
  interdit: "Interdit par édit comtal",
};

export type Lieu = {
  id: string;
  nom: string;
  categorie: CategorieId;
  /** Position dans le repère de la carte. */
  x: number;
  y: number;
  resume: string;
  description: string;
  /** Ce que l'on peut y obtenir : services rendus aux hôtes et aux sujets. */
  services: string[];
  acces: Acces;
};

export const LIEUX: Lieu[] = [
  {
    id: "castel-karnstein",
    nom: "Castel Karnstein",
    categorie: "siege",
    x: 1160,
    y: 700,
    resume: "Le donjon noir dressé sur l'éperon qui surplombe la Sanguine.",
    description:
      "Bâti sur une faille de basalte, le Castel veille sur le fief depuis onze générations. Ses vitraux vermeils ne s'allument qu'après le crépuscule, quand la maisonnée s'éveille. Les audiences comtales se tiennent dans la Salle des Serments, sous les portraits des aïeux.",
    services: [
      "Audiences de la Comtesse",
      "Archives et cartulaire du fief",
      "Table du soir pour les hôtes de marque",
      "Droit d'asile sous le sceau comtal",
    ],
    acces: "invitation",
  },
  {
    id: "rougecendre",
    nom: "Bourg de Rougecendre",
    categorie: "bourg",
    x: 1230,
    y: 990,
    resume: "Le principal bourg du Comté, blotti au pied de l'éperon.",
    description:
      "Trois cents âmes, des toits d'ardoise et une halle de bois noirci par les incendies d'antan. Le marché s'y tient aux nuits de pleine lune, usage qui surprend toujours les marchands de passage.",
    services: [
      "Marché nocturne (chaque pleine lune)",
      "Tabellion et registre des baux",
      "Milice bourgeoise",
      "Étuves et écuries",
    ],
    acces: "libre",
  },
  {
    id: "calice-noir",
    nom: "Auberge du Calice Noir",
    categorie: "bourg",
    x: 1140,
    y: 1070,
    resume: "La seule auberge du fief qui tienne sa porte ouverte la nuit.",
    description:
      "Tenue par la famille Vorne depuis quatre générations, elle sert un vin épais dont on ne discute pas le millésime. On y loue des chambres aux voyageurs assez sages pour ne pas marcher après complies.",
    services: [
      "Gîte et couvert",
      "Change de monnaie krytienne",
      "Courrier et messagerie du fief",
      "Guides pour la Sylve",
    ],
    acces: "libre",
  },
  {
    id: "forge-des-braises",
    nom: "Forge des Braises",
    categorie: "artisanat",
    x: 1318,
    y: 1064,
    resume: "L'atelier comtal, dont la cheminée ne s'éteint jamais.",
    description:
      "Maître Halvard y trempe l'acier dans l'eau du Lac Vermeil, ce qui donne aux lames leur reflet rougeâtre — et leur réputation. La maison y entretient l'armement de sa garde.",
    services: [
      "Forge d'armes et de harnois",
      "Réparation d'équipement",
      "Ferrage des montures",
      "Commandes héraldiques",
    ],
    acces: "libre",
  },
  {
    id: "chapelle-grenth",
    nom: "Chapelle de Grenth",
    categorie: "culte",
    x: 1352,
    y: 892,
    resume: "Un sanctuaire de pierre grise dédié au dieu de la mort.",
    description:
      "La maison Karnstein honore Grenth plus que les cinq autres dieux — question de convenance, dit-on au bourg. Le prêtre Aldric y célèbre les veillées funèbres et tient le registre des défunts du fief.",
    services: [
      "Veillées et rites funéraires",
      "Registre des défunts",
      "Bénédiction des voyageurs",
      "Consolation et confession",
    ],
    acces: "libre",
  },
  {
    id: "crypte-des-aieux",
    nom: "Crypte des Aïeux",
    categorie: "culte",
    x: 1020,
    y: 470,
    resume: "La nécropole familiale, creusée à même la roche des Crocs Gris.",
    description:
      "Sept niveaux descendent sous la montagne, un par branche éteinte de la maison. Seuls la Comtesse et son intendant en possèdent la clef ; l'édit de 1287 en interdit l'accès à toute autre personne, vivante ou non.",
    services: ["Sépulture des membres de la maison"],
    acces: "interdit",
  },
  {
    id: "vignes-de-sanguine",
    nom: "Vignes de Sanguine",
    categorie: "artisanat",
    x: 1560,
    y: 950,
    resume: "Les coteaux qui donnent le vin noir de Karnstein.",
    description:
      "Un cépage ramené de Vabbi voilà deux siècles, qui n'a prospéré nulle part ailleurs. Les vendanges se font de nuit, à la lanterne, pour préserver l'arôme — telle est du moins la version officielle.",
    services: [
      "Cave et dégustation",
      "Vente au tonneau",
      "Embauche saisonnière aux vendanges",
    ],
    acces: "libre",
  },
  {
    id: "pont-des-gargouilles",
    nom: "Pont des Gargouilles",
    categorie: "defense",
    x: 620,
    y: 895,
    resume: "L'unique passage sur la Sanguine, et le péage du Comté.",
    description:
      "Douze gargouilles de basalte en gardent les parapets ; la treizième, dit-on, descend la nuit. Un poste de garde y contrôle toute entrée par la marche ouest.",
    services: [
      "Péage et sauf-conduits",
      "Poste de garde permanent",
      "Relais de chevaux",
    ],
    acces: "libre",
  },
  {
    id: "brumelac",
    nom: "Embarcadère de Brumelac",
    categorie: "bourg",
    x: 676,
    y: 796,
    resume: "Quelques masures de pêcheurs sur la rive ouest du Lac Vermeil.",
    description:
      "Le lac tire son nom des reflets du couchant sur ses eaux ferrugineuses. Les pêcheurs n'y jettent jamais leurs filets au-delà de la troisième bouée, et ne disent pas pourquoi.",
    services: [
      "Passage en barque vers la rive est",
      "Poisson fumé et anguilles",
      "Location de canots",
    ],
    acces: "libre",
  },
  {
    id: "moulin-cendrefeuille",
    nom: "Moulin de Cendrefeuille",
    categorie: "artisanat",
    x: 560,
    y: 1290,
    resume: "Un moulin à eau en lisière du marais, à demi enfoncé dans la tourbe.",
    description:
      "Il moud le seigle noir des terres basses et, à l'occasion, sèche les simples que la guérisseuse du marais vient y chercher. Sa roue grince d'une manière que les meuniers voisins jugent inconvenante.",
    services: [
      "Mouture du grain",
      "Herboristerie et remèdes",
      "Tourbe de chauffage",
    ],
    acces: "libre",
  },
  {
    id: "guet-des-crocs",
    nom: "Guet des Crocs",
    categorie: "defense",
    x: 1810,
    y: 400,
    resume: "Une tour de guet au col, face aux terres centaures du nord.",
    description:
      "Douze hommes s'y relaient toute l'année. Le fanal du sommet peut être vu depuis le Castel : trois feux signifient une incursion, quatre n'ont jamais été allumés.",
    services: [
      "Garnison et patrouilles du col",
      "Fanal d'alerte",
      "Abri d'urgence pour les voyageurs",
    ],
    acces: "invitation",
  },
  {
    id: "carriere-obsidienne",
    nom: "Carrière d'Obsidienne",
    categorie: "artisanat",
    x: 1960,
    y: 452,
    resume: "La veine noire dont est tirée la pierre du Castel.",
    description:
      "Exploitée par corvée seigneuriale jusqu'en 1302, elle emploie aujourd'hui des tailleurs salariés. La pierre en est si sombre qu'elle avale la lumière des lampes.",
    services: [
      "Extraction et taille de pierre",
      "Commandes de stèles et de sarcophages",
      "Embauche de tailleurs",
    ],
    acces: "libre",
  },
  {
    id: "ermitage-du-sylvain",
    nom: "Ermitage du Sylvain",
    categorie: "nature",
    x: 1850,
    y: 780,
    resume: "La cabane du garde-forestier, au cœur de la Sylve des Murmures.",
    description:
      "Torvald le Sylvain connaît chaque sente de la forêt et chaque chose qui y vit. Il accorde les permis de chasse au nom de la Comtesse et raccompagne les égarés — quand il les trouve à temps.",
    services: [
      "Permis de chasse et de coupe",
      "Guidage en forêt",
      "Battues contre les prédateurs",
    ],
    acces: "libre",
  },
  {
    id: "camp-des-veneurs",
    nom: "Camp des Veneurs",
    categorie: "nature",
    x: 1500,
    y: 1180,
    resume: "Le rendez-vous de chasse de la maison, en lisière du Bois du Pendu.",
    description:
      "Un long bâtiment de rondins, une meute de quarante chiens et un cor dont la sonnerie porte jusqu'au bourg. La chasse comtale s'y rassemble aux premières neiges.",
    services: [
      "Chenil et meute",
      "Rendez-vous de chasse",
      "Dépeçage et boucanage",
    ],
    acces: "invitation",
  },
  {
    id: "sept-steles",
    nom: "Les Sept Stèles",
    categorie: "mystere",
    x: 560,
    y: 560,
    resume: "Un cercle de pierres dressées bien avant la venue des hommes.",
    description:
      "Nul ne sait qui les a levées. Les bergers des Hautes Landes y mènent leurs bêtes en été mais n'y dorment jamais ; la neige, dit-on, n'y tient pas au sol.",
    services: [],
    acces: "interdit",
  },
  {
    id: "gibets-du-pendu",
    nom: "Les Gibets du Bois du Pendu",
    categorie: "mystere",
    x: 1660,
    y: 1300,
    resume: "Une clairière de potences que la maison laisse debout.",
    description:
      "Trente-deux gibets, tous antérieurs à l'actuelle Comtesse. L'édit comtal interdit d'y couper le bois, d'y chasser et d'y passer la nuit — dans cet ordre de gravité.",
    services: [],
    acces: "interdit",
  },
];

export const LIEUX_PAR_ID = Object.fromEntries(
  LIEUX.map((l) => [l.id, l]),
) as Record<string, Lieu>;
