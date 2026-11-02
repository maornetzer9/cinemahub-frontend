/**
 * Tiny early GLTF warm — pulls drei/three and seeds useGLTF cache
 * without mounting Canvas. Imported ASAP from registerHeroPreload.
 */
import { useGLTF } from "@react-three/drei";
import clapperboardGlb from "../../assets/models/cc0_-_clapperboard.glb";
import platformGlb from "../../assets/models/clipboard_display_platform.glb";

useGLTF.preload(clapperboardGlb);
useGLTF.preload(platformGlb);
