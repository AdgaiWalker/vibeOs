import { chapters } from "./content";

const visuals = [
  {
    src: "/media/hero-stage-v2.png",
    mobileSrc: "/media/hero-material-mobile.png",
    focus: [0.5, 0.5],
    mobileFocus: [0.48, 0.54],
    zoom: 0.96,
    mobileZoom: 0.94,
  },
  {
    src: "/media/direction-error.png",
    focus: [0.58, 0.5],
    mobileFocus: [0.7, 0.5],
    zoom: 0.96,
    mobileZoom: 0.82,
  },
  {
    src: "/media/vibe-loop.png",
    focus: [0.5, 0.5],
    mobileFocus: [0.5, 0.5],
    zoom: 0.96,
    mobileZoom: 0.78,
  },
  {
    src: "/media/three-gates.png",
    mobileSrc: "/media/three-gates-mobile.png",
    focus: [0.5, 0.5],
    mobileFocus: [0.5, 0.5],
    zoom: 0.96,
    mobileZoom: 0.96,
  },
  {
    src: "/media/agency-contract.png",
    focus: [0.58, 0.5],
    mobileFocus: [0.68, 0.48],
    zoom: 0.94,
    mobileZoom: 0.82,
  },
  {
    src: "/media/evidence-footer.png",
    focus: [0.56, 0.5],
    mobileFocus: [0.38, 0.5],
    zoom: 0.94,
    mobileZoom: 0.82,
  },
];

export const scenes = chapters.map((chapter, index) => ({
  ...chapter,
  index,
  mode: index,
  ...visuals[index],
}));

export const orbitTexture = "/media/encircling-ribbon-v1.png";
export const orbitTextureMobile = "/media/encircling-ribbon-mobile-v1.png";
