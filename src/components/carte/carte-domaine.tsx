"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./carte.css";

import {
  ACCES_LABEL,
  CARTE_HAUTEUR,
  CARTE_LARGEUR,
  CARTE_URL,
  CATEGORIES_PAR_ID,
  type Lieu,
} from "@/lib/domaine";

/**
 * La carte n'est pas géographique : on utilise `L.CRS.Simple`, dont l'axe Y
 * pointe vers le haut. Les lieux sont décrits dans le repère du fichier SVG
 * (origine en haut à gauche), d'où l'inversion ci-dessous.
 */
const BOUNDS = L.latLngBounds([0, 0], [CARTE_HAUTEUR, CARTE_LARGEUR]);

function position(lieu: Lieu): L.LatLngExpression {
  return [CARTE_HAUTEUR - lieu.y, lieu.x];
}

function icone(lieu: Lieu, actif: boolean) {
  const couleur = CATEGORIES_PAR_ID[lieu.categorie].couleur;
  return L.divIcon({
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -14],
    tooltipAnchor: [0, -16],
    html:
      `<span class="carte-pin${actif ? " is-active" : ""}" style="--pin:${couleur}">` +
      `<span class="carte-pin__ecu"></span><span class="carte-pin__coeur"></span>` +
      `</span>`,
  });
}

/** Recadre la vue et ouvre la bulle quand la sélection change. */
function Recentrage({
  lieu,
  markers,
}: {
  lieu: Lieu | null;
  markers: React.RefObject<Record<string, L.Marker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!lieu) return;
    map.flyTo(position(lieu), Math.max(map.getZoom(), -0.8), {
      duration: 0.7,
    });
    markers.current[lieu.id]?.openPopup();
  }, [lieu, map, markers]);

  return null;
}

type Props = {
  lieux: Lieu[];
  lieuActif: Lieu | null;
  onSelection: (id: string) => void;
};

export default function CarteDomaine({ lieux, lieuActif, onSelection }: Props) {
  const markers = useRef<Record<string, L.Marker | null>>({});

  // `maxBounds` un peu plus large que la carte : on peut respirer autour du
  // parchemin sans pouvoir s'en éloigner tout à fait.
  const limites = useMemo(() => BOUNDS.pad(0.28), []);

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={BOUNDS}
      maxBounds={limites}
      maxBoundsViscosity={0.9}
      minZoom={-2.4}
      maxZoom={1.5}
      zoomSnap={0.1}
      zoomDelta={0.4}
      wheelPxPerZoomLevel={140}
      attributionControl={false}
      className="h-full w-full"
    >
      <ImageOverlay url={CARTE_URL} bounds={BOUNDS} />

      {lieux.map((lieu) => {
        const actif = lieuActif?.id === lieu.id;
        const categorie = CATEGORIES_PAR_ID[lieu.categorie];

        return (
          <Marker
            key={lieu.id}
            position={position(lieu)}
            icon={icone(lieu, actif)}
            ref={(instance) => {
              markers.current[lieu.id] = instance;
            }}
            eventHandlers={{ click: () => onSelection(lieu.id) }}
            zIndexOffset={actif ? 1000 : 0}
            alt={lieu.nom}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              {lieu.nom}
            </Tooltip>
            <Popup>
              <p
                className="text-[0.65rem] uppercase tracking-[0.2em]"
                style={{ color: categorie.couleur }}
              >
                {categorie.nom}
              </p>
              <h3 className="mt-1 font-heading text-base text-bone">
                {lieu.nom}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{lieu.resume}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-gold/80">
                {ACCES_LABEL[lieu.acces]}
              </p>
            </Popup>
          </Marker>
        );
      })}

      <Recentrage lieu={lieuActif} markers={markers} />
    </MapContainer>
  );
}
