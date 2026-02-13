/**
 * Generate a Game Boy Color 3D model (.glb) using @gltf-transform/core.
 * Run: bun scripts/generate-gbc.ts
 */
import {
  Document,
  NodeIO,
  Format,
} from '@gltf-transform/core';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Create box geometry arrays (positions, normals, indices) */
function createBoxGeometry(w: number, h: number, d: number) {
  const hw = w / 2, hh = h / 2, hd = d / 2;

  // 24 vertices (4 per face × 6 faces)
  const positions = new Float32Array([
    // Front (+Z)
    -hw, -hh, hd,  hw, -hh, hd,  hw, hh, hd,  -hw, hh, hd,
    // Back (-Z)
    hw, -hh, -hd,  -hw, -hh, -hd,  -hw, hh, -hd,  hw, hh, -hd,
    // Top (+Y)
    -hw, hh, hd,  hw, hh, hd,  hw, hh, -hd,  -hw, hh, -hd,
    // Bottom (-Y)
    -hw, -hh, -hd,  hw, -hh, -hd,  hw, -hh, hd,  -hw, -hh, hd,
    // Right (+X)
    hw, -hh, hd,  hw, -hh, -hd,  hw, hh, -hd,  hw, hh, hd,
    // Left (-X)
    -hw, -hh, -hd,  -hw, -hh, hd,  -hw, hh, hd,  -hw, hh, -hd,
  ]);

  const normals = new Float32Array([
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    0,1,0, 0,1,0, 0,1,0, 0,1,0,
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
    1,0,0, 1,0,0, 1,0,0, 1,0,0,
    -1,0,0, -1,0,0, -1,0,0, -1,0,0,
  ]);

  const indices = new Uint16Array([
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23,
  ]);

  return { positions, normals, indices };
}

/** Create cylinder geometry (along Y axis) */
function createCylinderGeometry(radius: number, height: number, segments: number = 24) {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const hh = height / 2;

  // Side vertices
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const nx = Math.cos(theta);
    const nz = Math.sin(theta);
    // Bottom
    positions.push(x, -hh, z);
    normals.push(nx, 0, nz);
    // Top
    positions.push(x, hh, z);
    normals.push(nx, 0, nz);
  }

  // Side faces
  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  // Top cap
  const topCenter = positions.length / 3;
  positions.push(0, hh, 0);
  normals.push(0, 1, 0);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(theta) * radius, hh, Math.sin(theta) * radius);
    normals.push(0, 1, 0);
  }
  for (let i = 0; i < segments; i++) {
    indices.push(topCenter, topCenter + 1 + i, topCenter + 2 + i);
  }

  // Bottom cap
  const botCenter = positions.length / 3;
  positions.push(0, -hh, 0);
  normals.push(0, -1, 0);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(theta) * radius, -hh, Math.sin(theta) * radius);
    normals.push(0, -1, 0);
  }
  for (let i = 0; i < segments; i++) {
    indices.push(botCenter, botCenter + 2 + i, botCenter + 1 + i);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

/** Create a rounded box by beveling edges using ExtrudeGeometry-like approach */
function createRoundedBoxGeometry(w: number, h: number, d: number, radius: number, segments: number = 4) {
  // Use a simple box with slightly adjusted geometry for now
  // (true rounded box would be very complex - the edge lines will give it character)
  return createBoxGeometry(w, h, d);
}

// ─── Build GBC Document ────────────────────────────────────────────────────────

function buildGBC(): Document {
  const doc = new Document();

  // Buffer for all binary data
  const buffer = doc.createBuffer();

  // Scale: GBC is ~75mm x 133mm x 27mm
  const W = 1.0;
  const H = 1.77;
  const D = 0.36;

  // Color palette (GBC Grape/Purple variant) - sRGB linear approx
  const colors: Record<string, [number, number, number, number]> = {
    body:       [0.126, 0.088, 0.392, 1],     // Purple body
    bodyBack:   [0.098, 0.072, 0.330, 1],     // Darker back
    bezel:      [0.055, 0.055, 0.085, 1],     // Dark bezel
    screenGlass:[0.010, 0.010, 0.020, 1],     // Dark glass
    lcd:        [0.240, 0.410, 0.004, 1],     // Green LCD
    dpad:       [0.020, 0.020, 0.035, 1],     // Dark d-pad
    buttonRed:  [0.500, 0.020, 0.010, 1],     // Red buttons
    startSel:   [0.035, 0.035, 0.055, 1],     // Start/select
    speaker:    [0.055, 0.055, 0.085, 1],     // Speaker
    label:      [0.170, 0.170, 0.330, 1],     // Label area
    led:        [0.900, 0.050, 0.050, 1],     // Red LED
    batteryCov: [0.108, 0.078, 0.350, 1],     // Battery cover
    irPort:     [0.020, 0.005, 0.005, 1],     // IR port
    cartSlot:   [0.035, 0.035, 0.055, 1],     // Cartridge slot
  };

  function makeMaterial(name: string, colorKey: string, metallic = 0.0, roughness = 0.5) {
    const c = colors[colorKey];
    return doc.createMaterial(name)
      .setBaseColorFactor(c)
      .setMetallicFactor(metallic)
      .setRoughnessFactor(roughness);
  }

  function addMesh(
    name: string,
    geo: { positions: Float32Array; normals: Float32Array; indices: Uint16Array },
    material: ReturnType<typeof makeMaterial>,
    translation: [number, number, number],
    rotation?: [number, number, number, number],
  ) {
    const posAccessor = doc.createAccessor()
      .setType('VEC3').setArray(geo.positions).setBuffer(buffer);
    const normAccessor = doc.createAccessor()
      .setType('VEC3').setArray(geo.normals).setBuffer(buffer);
    const idxAccessor = doc.createAccessor()
      .setType('SCALAR').setArray(geo.indices).setBuffer(buffer);

    const prim = doc.createPrimitive()
      .setAttribute('POSITION', posAccessor)
      .setAttribute('NORMAL', normAccessor)
      .setIndices(idxAccessor)
      .setMaterial(material);

    const mesh = doc.createMesh(name).addPrimitive(prim);

    const node = doc.createNode(name)
      .setMesh(mesh)
      .setTranslation(translation);

    if (rotation) node.setRotation(rotation);

    return node;
  }

  // ─── Materials ─────────────────────────────────────────────────────────────

  const matBody      = makeMaterial('body',       'body',       0.05, 0.4);
  const matBodyBack  = makeMaterial('body_back',  'bodyBack',   0.05, 0.45);
  const matBezel     = makeMaterial('bezel',      'bezel',      0.1,  0.3);
  const matGlass     = makeMaterial('screen_glass','screenGlass',0.0, 0.05);
  const matLcd       = makeMaterial('lcd',        'lcd',        0.0,  0.3);
  const matDpad      = makeMaterial('dpad',       'dpad',       0.05, 0.5);
  const matBtnRed    = makeMaterial('button_red', 'buttonRed',  0.05, 0.4);
  const matStartSel  = makeMaterial('start_sel',  'startSel',   0.05, 0.5);
  const matSpeaker   = makeMaterial('speaker',    'speaker',    0.1,  0.6);
  const matLabel     = makeMaterial('label',      'label',      0.0,  0.5);
  const matLed       = makeMaterial('led',        'led',        0.0,  0.2);
  const matBattery   = makeMaterial('battery',    'batteryCov', 0.05, 0.45);
  const matIr        = makeMaterial('ir_port',    'irPort',     0.0,  0.7);
  const matCartSlot  = makeMaterial('cart_slot',  'cartSlot',   0.1,  0.6);

  // ─── Root scene node ──────────────────────────────────────────────────────

  const root = doc.createNode('GameBoyColor');

  // ─── Body shells ──────────────────────────────────────────────────────────

  root.addChild(addMesh('body_front',
    createBoxGeometry(W, H, D * 0.55), matBody, [0, 0, D * 0.15]));

  root.addChild(addMesh('body_back',
    createBoxGeometry(W, H, D * 0.5), matBodyBack, [0, 0, -D * 0.15]));

  // Battery cover
  root.addChild(addMesh('battery_cover',
    createBoxGeometry(W * 0.65, H * 0.35, 0.03), matBattery, [0, -H * 0.2, -D * 0.41]));

  // ─── Screen area ──────────────────────────────────────────────────────────

  const bezelW = W * 0.72, bezelH = H * 0.38;
  root.addChild(addMesh('screen_bezel',
    createBoxGeometry(bezelW, bezelH, 0.04), matBezel, [0, H * 0.22, D * 0.43]));

  const glassW = bezelW * 0.88, glassH = bezelH * 0.82;
  root.addChild(addMesh('screen',
    createBoxGeometry(glassW, glassH, 0.015), matGlass, [0, H * 0.22, D * 0.46]));

  const lcdW = glassW * 0.72, lcdH = glassH * 0.72;
  root.addChild(addMesh('lcd',
    createBoxGeometry(lcdW, lcdH, 0.005), matLcd, [0, H * 0.22, D * 0.475]));

  // "COLOR" label strip
  root.addChild(addMesh('color_label',
    createBoxGeometry(bezelW * 0.5, 0.03, 0.005), matLabel, [0, H * 0.39, D * 0.46]));

  // Power LED
  const ledGeo = createCylinderGeometry(0.02, 0.015, 12);
  const qRotX90: [number, number, number, number] = [Math.sin(Math.PI / 4), 0, 0, Math.cos(Math.PI / 4)]; // 90° around X
  root.addChild(addMesh('power_led',
    ledGeo, matLed, [-bezelW * 0.38, H * 0.39, D * 0.46], qRotX90));

  // ─── D-Pad ────────────────────────────────────────────────────────────────

  const dpadNode = doc.createNode('dpad').setTranslation([-W * 0.22, -H * 0.05, D * 0.44]);

  // Horizontal bar
  const dpadHNode = addMesh('dpad_h', createBoxGeometry(0.22, 0.07, 0.04), matDpad, [0, 0, 0]);
  dpadNode.addChild(dpadHNode);

  // Vertical bar
  const dpadVNode = addMesh('dpad_v', createBoxGeometry(0.07, 0.22, 0.04), matDpad, [0, 0, 0]);
  dpadNode.addChild(dpadVNode);

  // Center disc
  const dpadCenterGeo = createCylinderGeometry(0.04, 0.045, 16);
  const dpadCenterNode = addMesh('dpad_center', dpadCenterGeo, matDpad, [0, 0, 0], qRotX90);
  dpadNode.addChild(dpadCenterNode);

  root.addChild(dpadNode);

  // ─── A & B Buttons ────────────────────────────────────────────────────────

  const btnGeo = createCylinderGeometry(0.055, 0.04, 24);
  root.addChild(addMesh('button_a', btnGeo, matBtnRed, [W * 0.28, -H * 0.02, D * 0.44], qRotX90));
  root.addChild(addMesh('button_b', btnGeo, matBtnRed, [W * 0.15, -H * 0.08, D * 0.44], qRotX90));

  // ─── START / SELECT ───────────────────────────────────────────────────────

  const startGeo = createBoxGeometry(0.12, 0.04, 0.025);
  // Slight tilt rotation (around Z axis by -0.3 rad)
  const sinZ = Math.sin(-0.15), cosZ = Math.cos(-0.15); // half-angle for quaternion
  const qRotZ: [number, number, number, number] = [0, 0, sinZ, cosZ];
  root.addChild(addMesh('button_start', startGeo, matStartSel, [W * 0.08, -H * 0.2, D * 0.43], qRotZ));
  root.addChild(addMesh('button_select', startGeo, matStartSel, [-W * 0.08, -H * 0.2, D * 0.43], qRotZ));

  // ─── Speaker grille ───────────────────────────────────────────────────────

  const speakerNode = doc.createNode('speaker').setTranslation([W * 0.28, -H * 0.32, D * 0.43]);
  const holeGeo = createCylinderGeometry(0.012, 0.02, 8);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 0.035 - 0.05;
      const y = row * 0.035 - 0.05;
      speakerNode.addChild(addMesh(
        `speaker_${row}_${col}`, holeGeo, matSpeaker, [x, y, 0], qRotX90
      ));
    }
  }
  root.addChild(speakerNode);

  // ─── Top edge features ────────────────────────────────────────────────────

  // Power switch
  root.addChild(addMesh('power_switch',
    createBoxGeometry(0.08, 0.04, 0.06), matDpad, [-W * 0.28, H * 0.885, 0]));

  // IR port
  root.addChild(addMesh('ir_port',
    createBoxGeometry(0.06, 0.02, 0.04), matIr, [0, H * 0.885, 0]));

  // ─── Bottom edge ──────────────────────────────────────────────────────────

  // Link cable port
  root.addChild(addMesh('link_port',
    createBoxGeometry(0.12, 0.02, 0.08), matDpad, [0, -H * 0.885, -D * 0.05]));

  // ─── Side rails ───────────────────────────────────────────────────────────

  root.addChild(addMesh('left_rail',
    createBoxGeometry(0.02, H * 0.3, D * 0.3), matBodyBack, [-W * 0.51, -H * 0.15, 0]));

  root.addChild(addMesh('right_rail',
    createBoxGeometry(0.02, H * 0.3, D * 0.3), matBodyBack, [W * 0.51, -H * 0.15, 0]));

  // ─── Cartridge slot ───────────────────────────────────────────────────────

  root.addChild(addMesh('cartridge_slot',
    createBoxGeometry(W * 0.55, 0.04, D * 0.25), matCartSlot, [0, H * 0.82, -D * 0.15]));

  // ─── Scene ────────────────────────────────────────────────────────────────

  const scene = doc.createScene('Scene').addChild(root);
  doc.getRoot().setDefaultScene(scene);

  return doc;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const doc = buildGBC();
  const io = new NodeIO();
  const glb = await io.writeBinary(doc);

  const outputPath = './public/gbc.glb';
  await Bun.write(outputPath, glb);
  console.log(`Generated ${outputPath} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
