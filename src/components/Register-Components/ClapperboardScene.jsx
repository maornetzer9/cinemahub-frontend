/* eslint-disable react/no-unknown-property */
import { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import clapperboardGlb from "../../assets/models/cc0_-_clapperboard.glb";
import platformGlb from "../../assets/models/clipboard_display_platform.glb";

const MODEL_SCALE = 2.65;
const COMPOSITION_Y = 0.034;
const CLAPPERBOARD_LIFT = 0.09;
const STAND_SCALE = 0.42;
/** Level-space coords — stand sits outside POSE_ROTATION so it stays horizontal. */
const STAND_POSITION = [0.024, -0.653, 0.006];
/** Subtle front pitch toward camera (+Z) — presents the clapperboard without looking tilted. */
const STAND_ROTATION = [THREE.MathUtils.degToRad(-6), 0, 0];
const POSE_X = THREE.MathUtils.degToRad(-9);
const POSE_Y = THREE.MathUtils.degToRad(-32);
const POSE_Z = THREE.MathUtils.degToRad(2);
const POSE_ROTATION = new THREE.Euler(POSE_X, POSE_Y, POSE_Z, "YXZ");

const CYCLE_DURATION = 2.5;
const OPEN_PAUSE = 0.5;
const CLOSE_DURATION = 0.90;
const CLOSED_PAUSE = 0.16;
const OPEN_DURATION = 1;
const CLOSE_RANGE_SCALE = 2.25;
const CLOSED_SWING_FACTOR = 1.30;
const OPEN_SWING_FACTOR = -0.40;
const HINGE_Y_OFFSET = 0.034;
const CLOSED_ALIGN_AXIS = new THREE.Vector3(0, 0, 1);

const HINGE_AXIS = new THREE.Vector3(1, 1, 1);
const SWING_AXES = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
];

const STAND_LED_TORUS_SEGMENTS = 160;
const STAND_LED_UPLIGHT_COUNT = 12;
/** Radial-profile sampling of the whole stand (mesh-root space) to locate the groove. */
const STAND_LED_PROFILE_BINS = 48;
const STAND_LED_PROFILE_MAX_RADIUS = 1.06;
/** Below this radius fraction the top is the raised inner disc (used to read its height). */
const STAND_LED_INNER_SAMPLE_RADIUS = 0.8;
/** Vertical drop (world units) that marks the inner-disc edge where the groove begins. */
const STAND_LED_EDGE_DROP = 0.006;
/** Tube thickness as a fraction of the groove depth (inner top → outer floor). */
const STAND_LED_TUBE_GROOVE_FACTOR = 0.42;

useGLTF.preload(clapperboardGlb);
useGLTF.preload(platformGlb);

function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}

function flapOpenBlend(elapsed) {
    const cycleT = elapsed % CYCLE_DURATION;
    const closeStart = OPEN_PAUSE;
    const closeEnd = closeStart + CLOSE_DURATION;
    const closedEnd = closeEnd + CLOSED_PAUSE;
    const openEnd = closedEnd + OPEN_DURATION;

    if (cycleT < closeStart) return 1;
    if (cycleT < closeEnd) return 1 - easeInOutSine((cycleT - closeStart) / CLOSE_DURATION);
    if (cycleT < closedEnd) return 0;
    if (cycleT < openEnd) return easeInOutSine((cycleT - closedEnd) / OPEN_DURATION);
    return 1;
}

function tuneStandMaterials(object) {
    object.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
            mat.needsUpdate = true;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            if (mat.color) mat.color.multiply(new THREE.Color(0.68, 0.66, 0.78));
            if (mat.emissive) mat.emissive.set(0x06040c);
            if (typeof mat.emissiveIntensity === "number") mat.emissiveIntensity = 0.02;
            if (typeof mat.metalness === "number") mat.metalness = Math.min(mat.metalness, 0.28);
            if (typeof mat.roughness === "number") mat.roughness = Math.max(mat.roughness, 0.78);
            mat.envMapIntensity = 0.22;
        });
    });
}

function tuneMaterials(object) {
    object.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
            mat.needsUpdate = true;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            if (mat.emissive) mat.emissive.set(0, 0, 0);
            if (typeof mat.emissiveIntensity === "number") mat.emissiveIntensity = 0;
            if (typeof mat.metalness === "number") mat.metalness = Math.min(mat.metalness, 0.35);
            if (typeof mat.roughness === "number") mat.roughness = Math.max(mat.roughness, 0.72);
            mat.envMapIntensity = 0.35;
        });
    });
}

function getFlapMesh(model) {
    let mesh = null;
    model.traverse((child) => {
        if (child.isMesh && child.name.includes("ClapperboardFlap")) mesh = child;
    });
    return mesh;
}

function getExistingHingePivot(model) {
    const pivot = model.getObjectByName("FlapHingePivot");
    return pivot?.userData?.baseQuat ? pivot : null;
}

function getBodyGroup(model) {
    let body = null;
    model.traverse((child) => {
        if (child.name === "Clapperboard") body = child;
    });
    return body;
}

function getHingeWorldPoints(mesh) {
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const { min, max } = mesh.geometry.boundingBox;
    const zMid = (min.z + max.z) * 0.5;

    const leftLocal = new THREE.Vector3(min.x, min.y + HINGE_Y_OFFSET, zMid);
    const rightLocal = new THREE.Vector3(max.x, min.y + HINGE_Y_OFFSET, zMid);

    mesh.updateMatrixWorld(true);
    return {
        leftWorld: leftLocal.clone().applyMatrix4(mesh.matrixWorld),
        rightWorld: rightLocal.clone().applyMatrix4(mesh.matrixWorld),
    };
}

function scoreLeftRightLevel(flapMesh, bodyGroup) {
    const bodyTop = new THREE.Box3().setFromObject(bodyGroup).max.y;
    if (!flapMesh.geometry.boundingBox) flapMesh.geometry.computeBoundingBox();
    const { min, max } = flapMesh.geometry.boundingBox;
    const zMid = (min.z + max.z) * 0.5;

    flapMesh.updateMatrixWorld(true);
    const leftY = new THREE.Vector3(min.x, min.y, zMid).applyMatrix4(flapMesh.matrixWorld).y;
    const rightY = new THREE.Vector3(max.x, min.y, zMid).applyMatrix4(flapMesh.matrixWorld).y;
    const midY = (leftY + rightY) * 0.5;

    return Math.abs(leftY - rightY) * 6 + Math.abs(midY - bodyTop) * 0.75;
}

function calibrateClosedAlignment(pivot, flapMesh, bodyGroup) {
    const baseQuat = pivot.userData.baseQuat.clone();
    const swingAxis = pivot.userData.swingAxis ?? SWING_AXES[0];
    const closedSwing = (pivot.userData.closedAngle ?? 0) * CLOSE_RANGE_SCALE * CLOSED_SWING_FACTOR;

    let bestTwist = 0;
    let bestScore = Infinity;

    for (let deg = -4.5; deg <= 4.5; deg += 0.5) {
        const twist = THREE.MathUtils.degToRad(deg);
        const swing = new THREE.Quaternion().setFromAxisAngle(swingAxis, closedSwing);
        const align = new THREE.Quaternion().setFromAxisAngle(CLOSED_ALIGN_AXIS, twist);
        pivot.quaternion.copy(baseQuat).multiply(swing).multiply(align);
        pivot.updateMatrixWorld(true);

        const score = scoreLeftRightLevel(flapMesh, bodyGroup);
        if (score < bestScore) {
            bestScore = score;
            bestTwist = twist;
        }
    }

    pivot.quaternion.copy(baseQuat);
    return bestTwist;
}

function scoreFlapClosure(flapMesh, bodyGroup) {
    const bodyBox = new THREE.Box3().setFromObject(bodyGroup);
    const flapBox = new THREE.Box3().setFromObject(flapMesh);

    const yGap = Math.abs(flapBox.min.y - bodyBox.max.y);
    const depthFold = Math.max(0, flapBox.max.z - bodyBox.max.z) + Math.max(0, bodyBox.min.z - flapBox.min.z);

    return yGap * 5 + depthFold * 4 + Math.abs(flapBox.min.x - bodyBox.min.x) * 0.5;
}

function calibrateSwing(pivot, flapMesh, bodyGroup) {
    const baseQuat = pivot.userData.baseQuat.clone();
    let best = { axis: SWING_AXES[0], angle: THREE.MathUtils.degToRad(-32), score: Infinity };

    for (const axis of SWING_AXES) {
        for (let deg = -70; deg <= 70; deg += 2) {
            if (Math.abs(deg) < 10) continue;

            const angle = THREE.MathUtils.degToRad(deg);
            const swing = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            pivot.quaternion.copy(baseQuat).multiply(swing);
            pivot.updateMatrixWorld(true);

            const score = scoreFlapClosure(flapMesh, bodyGroup);
            if (score < best.score) {
                best = { axis: axis.clone(), angle, score };
            }
        }
    }

    pivot.quaternion.copy(baseQuat);
    return best;
}

function setupHingePivot(model) {
    const existing = getExistingHingePivot(model);
    if (existing) return existing;

    const flapMesh = getFlapMesh(model);
    const bodyGroup = getBodyGroup(model);
    const flapGroup = flapMesh?.parent;
    if (!flapMesh || !flapGroup || flapGroup.name === "FlapHingePivot" || !flapGroup.parent || !bodyGroup) {
        return null;
    }

    const parent = flapGroup.parent;
    const { leftWorld, rightWorld } = getHingeWorldPoints(flapMesh);
    const hingeAxisWorld = rightWorld.clone().sub(leftWorld).normalize();

    parent.updateMatrixWorld(true);
    const parentQuatInv = parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    const hingeAxisParent = hingeAxisWorld.clone().applyQuaternion(parentQuatInv).normalize();
    const hingeParentLocal = parent.worldToLocal(leftWorld.clone());

    const meshWorldMatrix = flapMesh.matrixWorld.clone();

    const pivot = new THREE.Group();
    pivot.name = "FlapHingePivot";
    pivot.position.copy(hingeParentLocal);
    pivot.quaternion.setFromUnitVectors(HINGE_AXIS, hingeAxisParent);

    parent.remove(flapGroup);
    parent.add(pivot);
    pivot.add(flapMesh);

    pivot.updateMatrixWorld(true);
    flapMesh.matrix.multiplyMatrices(pivot.matrixWorld.clone().invert(), meshWorldMatrix);
    flapMesh.matrix.decompose(flapMesh.position, flapMesh.quaternion, flapMesh.scale);
    flapMesh.rotation.order = "XYZ";

    pivot.userData.baseQuat = pivot.quaternion.clone();
    pivot.userData.meshRestQuat = flapMesh.quaternion.clone();
    pivot.userData.meshRestPos = flapMesh.position.clone();
    pivot.userData.meshRestScale = flapMesh.scale.clone();
    pivot.userData.flapMesh = flapMesh;

    const { axis, angle } = calibrateSwing(pivot, flapMesh, bodyGroup);
    pivot.userData.swingAxis = axis;
    pivot.userData.closedAngle = angle;
    pivot.userData.closedAlignTwist = calibrateClosedAlignment(pivot, flapMesh, bodyGroup);

    return pivot;
}

function applyPivotSwing(pivot, openBlend) {
    const flapMesh = pivot.userData.flapMesh;
    if (flapMesh) {
        flapMesh.position.copy(pivot.userData.meshRestPos);
        flapMesh.quaternion.copy(pivot.userData.meshRestQuat);
        flapMesh.scale.copy(pivot.userData.meshRestScale);
    }

    const baseQuat = pivot.userData.baseQuat;
    const swingAxis = pivot.userData.swingAxis ?? SWING_AXES[0];
    const closedAngle = (pivot.userData.closedAngle ?? 0) * CLOSE_RANGE_SCALE;
    const swingFactor = CLOSED_SWING_FACTOR + (OPEN_SWING_FACTOR - CLOSED_SWING_FACTOR) * openBlend;
    const swing = new THREE.Quaternion().setFromAxisAngle(swingAxis, closedAngle * swingFactor);

    const closedWeight = (1 - openBlend) ** 3;
    const align = new THREE.Quaternion().setFromAxisAngle(
        CLOSED_ALIGN_AXIS,
        (pivot.userData.closedAlignTwist ?? 0) * closedWeight,
    );

    pivot.quaternion.copy(baseQuat).multiply(swing).multiply(align);
}

/**
 * Measure the whole stand (mesh-root space) with a radial top-surface profile to locate the
 * recessed groove between the raised inner disc and the lower outer platform. The LED sits in
 * this groove — resting on the outer platform floor and hugging the inner-disc side wall.
 * Returns concentric center, the groove-seated ring radius/height, and derived tube thickness.
 */
function measureStandGrooveSpec(root) {
    if (!root) return null;
    root.updateMatrixWorld(true);

    const bins = STAND_LED_PROFILE_BINS;
    const maxR = STAND_LED_PROFILE_MAX_RADIUS;
    const vertex = new THREE.Vector3();

    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    root.traverse((child) => {
        if (!child.isMesh || !child.geometry?.attributes?.position) return;
        const pos = child.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 1) {
            vertex.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
            if (vertex.x < minX) minX = vertex.x;
            if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.z < minZ) minZ = vertex.z;
            if (vertex.z > maxZ) maxZ = vertex.z;
        }
    });
    if (!Number.isFinite(minX)) return null;

    const centerX = (minX + maxX) * 0.5;
    const centerZ = (minZ + maxZ) * 0.5;

    const maxYbin = new Array(bins).fill(-Infinity);
    root.traverse((child) => {
        if (!child.isMesh || !child.geometry?.attributes?.position) return;
        const pos = child.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 1) {
            vertex.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
            const radial = Math.hypot(vertex.x - centerX, vertex.z - centerZ);
            const b = Math.floor((radial / maxR) * bins);
            if (b < 0 || b >= bins) continue;
            if (vertex.y > maxYbin[b]) maxYbin[b] = vertex.y;
        }
    });

    const binRadius = (index) => ((index + 1) / bins) * maxR;
    const innerBinLimit = Math.floor((STAND_LED_INNER_SAMPLE_RADIUS / maxR) * bins);

    let innerTopY = -Infinity;
    for (let i = 0; i < innerBinLimit; i += 1) {
        if (maxYbin[i] > innerTopY) innerTopY = maxYbin[i];
    }
    if (!Number.isFinite(innerTopY)) return null;

    // Inner-disc edge = last bin still at the raised-disc height before the groove drop.
    let edgeBin = innerBinLimit;
    for (let i = innerBinLimit; i < bins; i += 1) {
        if (Number.isFinite(maxYbin[i]) && maxYbin[i] >= innerTopY - STAND_LED_EDGE_DROP) {
            edgeBin = i;
        } else {
            break;
        }
    }
    const innerEdgeRadius = binRadius(edgeBin);

    // Groove/outer-platform floor = lowest top-surface height beyond the edge.
    let grooveFloorY = Infinity;
    for (let i = edgeBin + 1; i < bins; i += 1) {
        if (Number.isFinite(maxYbin[i]) && maxYbin[i] < grooveFloorY) grooveFloorY = maxYbin[i];
    }
    if (!Number.isFinite(grooveFloorY)) grooveFloorY = innerTopY - 0.03;

    const grooveDepth = Math.max(innerTopY - grooveFloorY, 0.006);
    const tubeCore = grooveDepth * STAND_LED_TUBE_GROOVE_FACTOR;

    return {
        centerX,
        centerZ,
        // Seat the tube against the inner wall and rest it on the outer platform floor.
        ringRadius: innerEdgeRadius + tubeCore,
        ringY: grooveFloorY + tubeCore,
        tubeCore,
        tubeBloom: tubeCore * 1.5,
        tubeHalo: tubeCore * 2.1,
    };
}

/** Flat concentric torus layers seated inside the stand groove (major ring in XZ). */
function createStandLedRingAssets(spec) {
    const torus = (tubeRadius) => new THREE.TorusGeometry(
        spec.ringRadius,
        tubeRadius,
        16,
        STAND_LED_TORUS_SEGMENTS,
    );

    return {
        geometries: {
            core: torus(spec.tubeCore),
            bloom: torus(spec.tubeBloom),
            halo: torus(spec.tubeHalo),
        },
        uplightPositions: Array.from({ length: STAND_LED_UPLIGHT_COUNT }, (_, index) => {
            const angle = (index / STAND_LED_UPLIGHT_COUNT) * Math.PI * 2;
            return [
                Math.cos(angle) * spec.ringRadius,
                0,
                Math.sin(angle) * spec.ringRadius,
            ];
        }),
    };
}

const ledRingMaterials = {
    core: new THREE.MeshStandardMaterial({
        color: 0x1a0a2e,
        emissive: 0xc084fc,
        emissiveIntensity: 2.75,
        metalness: 0,
        roughness: 1,
        toneMapped: false,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
    }),
    bloom: new THREE.MeshBasicMaterial({
        color: 0x9333ea,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
        side: THREE.DoubleSide,
    }),
    halo: new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
        side: THREE.DoubleSide,
    }),
};

/** Concentric emissive LED ring seated in the stand groove (mesh-root space). */
function StandLedRing({ spec }) {
    const ringAssets = useMemo(() => createStandLedRingAssets(spec), [spec]);

    useEffect(() => () => {
        Object.values(ringAssets.geometries).forEach((geometry) => geometry.dispose());
    }, [ringAssets]);

    return (
        <group position={[spec.centerX, spec.ringY, spec.centerZ]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
                {ringAssets.uplightPositions.map((position, index) => (
                    <pointLight
                        key={index}
                        position={position}
                        intensity={0.032}
                        color="#9d4edd"
                        distance={0.92}
                        decay={2}
                    />
                ))}
                <mesh geometry={ringAssets.geometries.halo} material={ledRingMaterials.halo} renderOrder={10} />
                <mesh geometry={ringAssets.geometries.bloom} material={ledRingMaterials.bloom} renderOrder={11} />
                <mesh geometry={ringAssets.geometries.core} material={ledRingMaterials.core} renderOrder={12} />
            </group>
        </group>
    );
}

function StandMesh() {
    const { scene } = useGLTF(platformGlb);
    const { stand, ledSpec } = useMemo(() => {
        const clone = SkeletonUtils.clone(scene);
        tuneStandMaterials(clone);
        const led = measureStandGrooveSpec(clone);
        return { stand: clone, ledSpec: led };
    }, [scene]);

    return (
        <group position={STAND_POSITION} rotation={STAND_ROTATION} scale={STAND_SCALE}>
            <primitive object={stand} />
            {ledSpec ? <StandLedRing spec={ledSpec} /> : null}
        </group>
    );
}

function ClapperboardMesh({ animate }) {
    const floatRef = useRef();
    const scaleRef = useRef();

    const { scene } = useGLTF(clapperboardGlb);

    const { model, hingePivot } = useMemo(() => {
        const clone = SkeletonUtils.clone(scene);
        tuneMaterials(clone);
        clone.updateMatrixWorld(true);
        const pivot = setupHingePivot(clone);
        return { model: clone, hingePivot: pivot };
    }, [scene]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        if (floatRef.current && animate) {
            floatRef.current.position.y = Math.sin(t * 0.38) * 0.012;
        }

        if (scaleRef.current && animate) {
            const breath = 1 + Math.sin(t * 1.52) * 0.020;
            scaleRef.current.scale.setScalar(MODEL_SCALE * breath);
        } else if (scaleRef.current) {
            scaleRef.current.scale.setScalar(MODEL_SCALE);
        }

        if (hingePivot) {
            const openBlend = animate ? flapOpenBlend(t) : 1;
            applyPivotSwing(hingePivot, openBlend);
        }
    });

    return (
        <group position={[0, COMPOSITION_Y, 0]}>
            <group ref={floatRef}>
                <StandMesh />
                <group rotation={POSE_ROTATION}>
                    <Center>
                        <group ref={scaleRef} scale={MODEL_SCALE} position={[0, CLAPPERBOARD_LIFT, 0]}>
                            <primitive object={model} />
                        </group>
                    </Center>
                </group>
            </group>
        </group>
    );
}

function SceneReadyNotifier({ onReady }) {
    const sentRef = useRef(false);
    const frameRef = useRef(0);

    useFrame(() => {
        if (sentRef.current) return;
        frameRef.current += 1;
        // First valid rendered frames after GLB Suspense resolves — no pixel sampling.
        // Bounded: always fire by frame 2 (GLB already mounted in this Suspense tree).
        if (frameRef.current < 2) return;
        sentRef.current = true;
        onReady?.();
    });

    return null;
}

export default function ClapperboardScene({ animate, onSceneReady }) {
    return (
        <Canvas
            frameloop="always"
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance", premultipliedAlpha: true }}
            onCreated={({ gl, scene }) => {
                gl.setClearColor(0x000000, 0);
                scene.background = null;
                const el = gl.domElement;
                el.style.setProperty("background", "transparent", "important");
                el.style.setProperty("background-color", "transparent", "important");
                if (el.parentElement) {
                    el.parentElement.style.setProperty("background", "transparent", "important");
                    el.parentElement.style.setProperty("background-color", "transparent", "important");
                }
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.12;
                gl.outputColorSpace = THREE.SRGBColorSpace;
            }}
            camera={{ position: [0.22, 0.06, 2.85], fov: 30, near: 0.01, far: 100 }}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                pointerEvents: "none",
                background: "transparent",
                backgroundColor: "transparent",
            }}
            dpr={[1, 1.75]}
        >
            <ambientLight intensity={0.42} color="#c8d0ea" />
            <hemisphereLight intensity={0.28} color="#dde4ff" groundColor="#0a0814" />
            <directionalLight position={[0.5, 4.5, 3]} intensity={1.35} color="#f4f6ff" />
            <directionalLight position={[-3.5, 1.5, 2]} intensity={0.55} color="#5b8fd9" />
            <directionalLight position={[3.5, 0.8, 2]} intensity={0.45} color="#9b6fd4" />
            <pointLight position={[0, -1.2, 1.4]} intensity={0.32} color="#7c3aed" />
            <Suspense fallback={null}>
                <ClapperboardMesh animate={animate} />
                <SceneReadyNotifier onReady={onSceneReady} />
            </Suspense>
        </Canvas>
    );
}
