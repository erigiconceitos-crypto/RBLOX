import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  RobloxPart,
  GameMode,
  StudioTool,
  PlayerAvatarConfig,
  ToolItem,
  RobloxSettings,
} from '../types/roblox';
import { updatePlayerPhysics, PlayerPhysicsState } from '../game/physics';
import {
  createR6Character,
  animateR6Character,
  buildHeldTool,
  updateChatBubble,
  R6CharacterInstance,
} from '../game/character';
import { getRobloxStudTexture, getRobloxInletTexture } from '../utils/studTexture';
import { robloxAudio } from '../utils/audio';

interface Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  lifetime: number;
}

interface RobloxCanvasProps {
  parts: RobloxPart[];
  mode: GameMode;
  selectedPartId: string | null;
  onSelectPart: (id: string | null) => void;
  onUpdatePart: (part: RobloxPart) => void;
  onAddPart: (part: RobloxPart) => void;
  activeTool: ToolItem | null;
  avatarConfig: PlayerAvatarConfig;
  activeStudioTool: StudioTool;
  chatBubbleText: string | null;
  settings: RobloxSettings;
  onUpdatePlayerStats: (stats: { health: number; maxHealth: number; coins: number; stage: number }) => void;
  onLogOutput?: (msg: string) => void;
}

export const RobloxCanvas: React.FC<RobloxCanvasProps> = ({
  parts,
  mode,
  selectedPartId,
  onSelectPart,
  onUpdatePart,
  onAddPart,
  activeTool,
  avatarConfig,
  activeStudioTool,
  chatBubbleText,
  settings,
  onUpdatePlayerStats,
  onLogOutput,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const partsRef = useRef(parts);
  partsRef.current = parts;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;

  const selectedPartIdRef = useRef(selectedPartId);
  selectedPartIdRef.current = selectedPartId;

  const activeStudioToolRef = useRef(activeStudioTool);
  activeStudioToolRef.current = activeStudioTool;

  const avatarConfigRef = useRef(avatarConfig);
  avatarConfigRef.current = avatarConfig;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const onUpdatePlayerStatsRef = useRef(onUpdatePlayerStats);
  onUpdatePlayerStatsRef.current = onUpdatePlayerStats;

  const onSelectPartRef = useRef(onSelectPart);
  onSelectPartRef.current = onSelectPart;

  const onAddPartRef = useRef(onAddPart);
  onAddPartRef.current = onAddPart;

  const onUpdatePartRef = useRef(onUpdatePart);
  onUpdatePartRef.current = onUpdatePart;

  const onLogOutputRef = useRef(onLogOutput);
  onLogOutputRef.current = onLogOutput;

  // Scene references
  const characterRef = useRef<R6CharacterInstance | null>(null);
  const meshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const selectionBoxRef = useRef<THREE.BoxHelper | null>(null);
  const projectilesRef = useRef<Projectile[]>([]);

  // Shift lock state
  const isShiftLockedRef = useRef(false);

  // Input states
  const inputRef = useRef({
    forward: 0,
    strafe: 0,
    jump: false,
    sprint: false,
    cameraYaw: 0,
    cameraPitch: 0.35,
    cameraDistance: 16,
    isMouseDownRight: false,
    isMouseDownLeft: false,
    lastMouseX: 0,
    lastMouseY: 0,
    stepTimer: 0,
  });

  // Player physics state
  const physicsRef = useRef<PlayerPhysicsState>({
    x: 0,
    y: 0.5,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    isGrounded: true,
    health: 100,
    maxHealth: 100,
    speed: 16,
    jumpPower: 28,
    checkpoint: [0, 0.5, 0],
  });

  const progressRef = useRef({
    coins: 100,
    stage: 0,
  });

  // Effect to update chat bubble text when prop changes
  useEffect(() => {
    if (characterRef.current) {
      updateChatBubble(characterRef.current.chatBubble, chatBubbleText || '');
    }
  }, [chatBubbleText]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Scene & Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#82b1ff');
    scene.fog = new THREE.FogExp2('#82b1ff', 0.0035);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // 4. Lighting Rig
    const hemiLight = new THREE.HemisphereLight('#b3e5fc', '#388e3c', 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#fff9c4', 1.8);
    sunLight.position.set(60, 100, 40);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
      const d = 80;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 250;
    }
    scene.add(sunLight);

    // 5. Parts Container Group
    const partsGroup = new THREE.Group();
    partsGroup.name = 'WorkspaceParts';
    scene.add(partsGroup);

    // 6. Character Setup
    const charInstance = createR6Character(avatarConfigRef.current);
    characterRef.current = charInstance;
    scene.add(charInstance.root);

    // 7. Selection outline helper for Studio mode
    const selectionBox = new THREE.BoxHelper(new THREE.Mesh(), 0x00e5ff);
    selectionBox.visible = false;
    scene.add(selectionBox);
    selectionBoxRef.current = selectionBox;

    // Build or sync 3D meshes for parts
    const studTex = getRobloxStudTexture();
    const inletTex = getRobloxInletTexture();

    const buildPartMesh = (part: RobloxPart): THREE.Object3D => {
      let geo: THREE.BufferGeometry;
      const [sx, sy, sz] = part.size;

      if (part.shape === 'Ball') {
        geo = new THREE.SphereGeometry(sx / 2, 24, 18);
      } else if (part.shape === 'Cylinder') {
        geo = new THREE.CylinderGeometry(sx / 2, sx / 2, sy, 24);
      } else if (part.shape === 'Wedge') {
        geo = new THREE.BufferGeometry();
        const verts = new Float32Array([
          -sx/2, -sy/2, -sz/2,  sx/2, -sy/2, -sz/2,  sx/2, sy/2, -sz/2,
          -sx/2, -sy/2, -sz/2,  sx/2, sy/2, -sz/2, -sx/2, sy/2, -sz/2,
          -sx/2, -sy/2, -sz/2,  sx/2, -sy/2,  sz/2,  sx/2, -sy/2, -sz/2,
          -sx/2, -sy/2, -sz/2, -sx/2, -sy/2,  sz/2,  sx/2, -sy/2,  sz/2,
          -sx/2,  sy/2, -sz/2,  sx/2, -sy/2,  sz/2, -sx/2, -sy/2,  sz/2,
          -sx/2,  sy/2, -sz/2,  sx/2,  sy/2, -sz/2,  sx/2, -sy/2,  sz/2,
          -sx/2, -sy/2, -sz/2, -sx/2, -sy/2,  sz/2, -sx/2,  sy/2, -sz/2,
           sx/2, -sy/2, -sz/2,  sx/2,  sy/2, -sz/2,  sx/2, -sy/2,  sz/2,
        ]);
        geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        geo.computeVertexNormals();
      } else {
        geo = new THREE.BoxGeometry(sx, sy, sz);
      }

      let mat: THREE.Material;
      const color = new THREE.Color(part.color);

      if (part.material === 'Neon') {
        mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.95,
          roughness: 0.1,
          metalness: 0.0,
        });
      } else if (part.material === 'Glass') {
        mat = new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: 0.45,
          roughness: 0.1,
          metalness: 0.4,
        });
      } else if (part.material === 'Metal' || part.material === 'DiamondPlate') {
        mat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.85,
        });
      } else if (part.material === 'Wood' || part.material === 'WoodPlanks') {
        mat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          metalness: 0.0,
        });
      } else {
        if (part.shape === 'Block' && part.id !== 'baseplate') {
          const sideMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 });
          const topMat = new THREE.MeshStandardMaterial({
            color,
            map: studTex,
            roughness: 0.4,
            metalness: 0.1,
          });
          const bottomMat = new THREE.MeshStandardMaterial({
            color,
            map: inletTex,
            roughness: 0.4,
            metalness: 0.1,
          });
          mat = [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat] as unknown as THREE.Material;
        } else {
          mat = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.45,
            metalness: 0.05,
          });
        }
      }

      const mesh = Array.isArray(mat) ? new THREE.Mesh(geo, mat) : new THREE.Mesh(geo, mat);
      mesh.position.set(part.position[0], part.position[1], part.position[2]);
      mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
      mesh.castShadow = !isSoftwareGl && part.transparency < 0.5;
      mesh.receiveShadow = !isSoftwareGl;
      mesh.userData = { partId: part.id };
      return mesh;
    };

    const syncParts = () => {
      const currentIds = new Set(partsRef.current.map((p) => p.id));
      meshesMapRef.current.forEach((mesh, id) => {
        if (!currentIds.has(id)) {
          partsGroup.remove(mesh);
          meshesMapRef.current.delete(id);
        }
      });

      partsRef.current.forEach((part) => {
        let mesh = meshesMapRef.current.get(part.id);
        if (!mesh) {
          mesh = buildPartMesh(part);
          meshesMapRef.current.set(part.id, mesh);
          partsGroup.add(mesh);
        } else {
          mesh.position.set(part.position[0], part.position[1], part.position[2]);
          mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
        }
      });
    };

    syncParts();

    // 8. Event Listeners for Keyboard & Mouse Controls
    const keysDown: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      keysDown[e.code] = true;

      // Toggle Shift Lock on Shift key if enabled in settings
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && settingsRef.current.shiftLockEnabled) {
        isShiftLockedRef.current = !isShiftLockedRef.current;
        robloxAudio.playClick();
      }

      // Quick Emotes shortcut (.)
      if (e.key === '.') {
        // Handled in parent
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown[e.code] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        inputRef.current.isMouseDownRight = true;
      } else if (e.button === 0) {
        inputRef.current.isMouseDownLeft = true;
        handleLeftClickAction(e);
      }
      inputRef.current.lastMouseX = e.clientX;
      inputRef.current.lastMouseY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) inputRef.current.isMouseDownRight = false;
      if (e.button === 0) inputRef.current.isMouseDownLeft = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const sens = settingsRef.current.mouseSensitivity || 1.0;
      const deltaX = (e.clientX - inputRef.current.lastMouseX) * sens;
      const deltaY = (e.clientY - inputRef.current.lastMouseY) * sens;
      inputRef.current.lastMouseX = e.clientX;
      inputRef.current.lastMouseY = e.clientY;

      if (
        inputRef.current.isMouseDownRight ||
        isShiftLockedRef.current ||
        (modeRef.current === 'studio' && inputRef.current.isMouseDownLeft)
      ) {
        inputRef.current.cameraYaw -= deltaX * 0.005;
        inputRef.current.cameraPitch = Math.max(
          -0.2,
          Math.min(1.4, inputRef.current.cameraPitch + deltaY * 0.005)
        );
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Zoom limits: 1.0 is first-person, up to 45 studs
      inputRef.current.cameraDistance = Math.max(
        1.5,
        Math.min(45, inputRef.current.cameraDistance + e.deltaY * 0.02)
      );
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleLeftClickAction = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseCoord, camera);

      if (modeRef.current === 'studio') {
        const intersects = raycaster.intersectObjects(partsGroup.children, true);
        if (intersects.length > 0) {
          let hitObj = intersects[0].object;
          while (hitObj.parent && hitObj.parent !== partsGroup) {
            hitObj = hitObj.parent;
          }
          const partId = hitObj.userData.partId;
          if (partId) {
            onSelectPartRef.current(partId);
            robloxAudio.playClick();
          }
        } else {
          onSelectPartRef.current(null);
        }
      } else {
        const tool = activeToolRef.current;
        if (!tool) return;

        if (tool.type === 'weapon') {
          robloxAudio.playSlash();
          if (characterRef.current) {
            characterRef.current.rightArm.rotation.x = -Math.PI * 0.85;
          }
        } else if (tool.type === 'rocket') {
          // Fire Rocket Projectile!
          robloxAudio.playRocketFire();
          const charPos = characterRef.current?.root.position || new THREE.Vector3();
          const spawnPos = new THREE.Vector3(charPos.x, charPos.y + 3, charPos.z);
          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);

          const rocketGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8);
          const rocketMat = new THREE.MeshStandardMaterial({
            color: '#d32f2f',
            emissive: '#ff5722',
            emissiveIntensity: 0.6,
          });
          const rocketMesh = new THREE.Mesh(rocketGeo, rocketMat);
          rocketMesh.position.copy(spawnPos);
          rocketMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          scene.add(rocketMesh);

          projectilesRef.current.push({
            mesh: rocketMesh,
            velocity: dir.clone().multiplyScalar(45),
            lifetime: 3.0,
          });
        } else if (tool.type === 'trowel') {
          // Trowel: Build a protective wall in front of avatar
          robloxAudio.playClick();
          const charPos = characterRef.current?.root.position || new THREE.Vector3();
          const yaw = inputRef.current.cameraYaw;
          const forwardX = -Math.sin(yaw) * 4;
          const forwardZ = -Math.cos(yaw) * 4;

          const wallPart: RobloxPart = {
            id: `wall_${Date.now()}`,
            name: 'TrowelWall',
            shape: 'Block',
            size: [8, 4, 1.2],
            position: [charPos.x + forwardX, charPos.y + 2, charPos.z + forwardZ],
            rotation: [0, yaw, 0],
            color: '#757575',
            material: 'Brick',
            transparency: 0,
            reflectance: 0.1,
            anchored: true,
            canCollide: true,
          };
          onAddPartRef.current(wallPart);
        } else if (tool.type === 'coil') {
          robloxAudio.playBoing();
          physicsRef.current.jumpPower = 48;
        } else if (tool.type === 'speed_coil') {
          robloxAudio.playCheckpoint();
          physicsRef.current.speed = 32;
        } else if (tool.type === 'builder') {
          const intersects = raycaster.intersectObjects(partsGroup.children, true);
          if (intersects.length > 0) {
            const hit = intersects[0];
            const p = hit.point;
            const newPart: RobloxPart = {
              id: `user_brick_${Date.now()}`,
              name: 'Bricks',
              shape: 'Block',
              size: [4, 1.2, 2],
              position: [
                Math.round(p.x * 2) / 2,
                Math.round((p.y + 0.6) * 2) / 2,
                Math.round(p.z * 2) / 2,
              ],
              rotation: [0, 0, 0],
              color: '#0d69ac',
              material: 'Plastic',
              transparency: 0,
              reflectance: 0.1,
              anchored: true,
              canCollide: true,
            };
            onAddPartRef.current(newPart);
            robloxAudio.playClick();
          }
        } else if (tool.type === 'painter') {
          const intersects = raycaster.intersectObjects(partsGroup.children, true);
          if (intersects.length > 0) {
            let hitObj = intersects[0].object;
            while (hitObj.parent && hitObj.parent !== partsGroup) {
              hitObj = hitObj.parent;
            }
            const partId = hitObj.userData.partId;
            const targetPart = partsRef.current.find((p) => p.id === partId);
            if (targetPart) {
              const colors = ['#c4281c', '#0d69ac', '#f5cd30', '#00e676', '#e91e63', '#28272a'];
              const nextColor = colors[(colors.indexOf(targetPart.color) + 1) % colors.length];
              onUpdatePartRef.current({ ...targetPart, color: nextColor });
              robloxAudio.playClick();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('contextmenu', handleContextMenu);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let prevToolId = '';
    const updateHeldToolMesh = () => {
      const tool = activeToolRef.current;
      const toolId = tool ? tool.id : '';
      if (toolId !== prevToolId && characterRef.current) {
        prevToolId = toolId;
        buildHeldTool(characterRef.current.toolHolder, tool ? tool.type : '');
      }
    };

    // 9. ANIMATION & PHYSICS GAME LOOP
    let animationFrameId = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (partsRef.current.length !== meshesMapRef.current.size) {
        syncParts();
      }

      updateHeldToolMesh();

      // Read movement inputs
      let forward = 0;
      let strafe = 0;
      if (keysDown['KeyW'] || keysDown['ArrowUp']) forward += 1;
      if (keysDown['KeyS'] || keysDown['ArrowDown']) forward -= 1;
      if (keysDown['KeyA'] || keysDown['ArrowLeft']) strafe -= 1;
      if (keysDown['KeyD'] || keysDown['ArrowRight']) strafe += 1;
      const jumpKey = Boolean(keysDown['Space']);
      const sprintKey = Boolean(keysDown['ShiftLeft'] || keysDown['ShiftRight']);

      // Projectiles simulation
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];
        proj.mesh.position.addScaledVector(proj.velocity, dt);
        proj.lifetime -= dt;

        // Ground / part collision or timeout
        if (proj.mesh.position.y <= 0.2 || proj.lifetime <= 0) {
          robloxAudio.playExplosion();
          scene.remove(proj.mesh);
          proj.mesh.geometry.dispose();
          projectilesRef.current.splice(i, 1);
        }
      }

      // Apply physics when in Play mode
      if (modeRef.current === 'play') {
        const physResult = updatePlayerPhysics(
          physicsRef.current,
          {
            forward,
            strafe,
            jump: jumpKey,
            sprint: sprintKey && !isShiftLockedRef.current,
            cameraYaw: inputRef.current.cameraYaw,
          },
          partsRef.current,
          dt
        );
        physicsRef.current = physResult.state;

        if (physResult.events.tookDamage || physResult.events.died) {
          robloxAudio.playOof();
        }
        if (jumpKey && physResult.state.isGrounded) {
          robloxAudio.playJump();
        }
        if (physResult.events.bounced) {
          robloxAudio.playBoing();
        }
        if (physResult.events.reachedCheckpoint) {
          robloxAudio.playCheckpoint();
          progressRef.current.stage = physResult.events.checkpointId || 1;
          progressRef.current.coins += 50;
        }

        const isMoving = (forward !== 0 || strafe !== 0) && physResult.state.isGrounded;
        if (isMoving) {
          inputRef.current.stepTimer += dt;
          if (inputRef.current.stepTimer > 0.32) {
            robloxAudio.playStep();
            inputRef.current.stepTimer = 0;
          }
        }

        // Update Character 3D Position & Rotation
        if (characterRef.current) {
          const isFirstPerson = inputRef.current.cameraDistance < 2.5;
          characterRef.current.head.visible = !isFirstPerson;
          characterRef.current.hatGroup.visible = !isFirstPerson;
          characterRef.current.nameBillboard.visible = !isFirstPerson;

          characterRef.current.root.visible = true;
          characterRef.current.root.position.set(
            physResult.state.x,
            physResult.state.y,
            physResult.state.z
          );

          // Shift Lock: Character always faces camera direction!
          if (isShiftLockedRef.current) {
            characterRef.current.root.rotation.y = inputRef.current.cameraYaw;
          } else if (forward !== 0 || strafe !== 0) {
            const moveAngle = Math.atan2(forward, -strafe) - Math.PI / 2 + inputRef.current.cameraYaw;
            characterRef.current.root.rotation.y = THREE.MathUtils.lerp(
              characterRef.current.root.rotation.y,
              moveAngle,
              0.25
            );
          }

          animateR6Character(
            characterRef.current,
            isMoving,
            physResult.state.isGrounded,
            Boolean(activeToolRef.current),
            now / 1000,
            dt
          );
        }

        // Update Camera Position
        const targetX = physResult.state.x;
        const targetY = physResult.state.y + 3.0;
        const targetZ = physResult.state.z;

        const dist = inputRef.current.cameraDistance;
        const pitch = inputRef.current.cameraPitch;
        const yaw = inputRef.current.cameraYaw;

        const camX = targetX + Math.sin(yaw) * Math.cos(pitch) * dist;
        const camY = targetY + Math.sin(pitch) * dist;
        const camZ = targetZ + Math.cos(yaw) * Math.cos(pitch) * dist;

        camera.position.set(camX, camY, camZ);
        camera.lookAt(targetX, targetY, targetZ);

        onUpdatePlayerStatsRef.current({
          health: physResult.state.health,
          maxHealth: physResult.state.maxHealth,
          coins: progressRef.current.coins,
          stage: progressRef.current.stage,
        });

        if (selectionBoxRef.current) selectionBoxRef.current.visible = false;
      } else {
        // STUDIO MODE: Freecam Orbit & Selection Box
        const selId = selectedPartIdRef.current;
        if (selId && selectionBoxRef.current) {
          const selectedMesh = meshesMapRef.current.get(selId);
          if (selectedMesh) {
            selectionBoxRef.current.setFromObject(selectedMesh);
            selectionBoxRef.current.visible = true;
          } else {
            selectionBoxRef.current.visible = false;
          }
        } else if (selectionBoxRef.current) {
          selectionBoxRef.current.visible = false;
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Crosshair Center Reticle */}
      {mode === 'play' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {isShiftLockedRef.current ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/90 bg-transparent shadow-lg flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full border border-white/60 bg-white/20 shadow-sm" />
          )}
        </div>
      )}
    </div>
  );
};
