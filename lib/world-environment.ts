export enum TileType {
  GRASS = 'grass',
  WATER = 'water',
  PATH = 'path',
  BEACH = 'beach',
  FARMLAND = 'farmland',
  CLIFF = 'cliff'
}

export interface Tile {
  type: TileType
  x: number
  y: number
  width: number
  height: number
  walkable: boolean
}

export interface DecorationProps {
  type: string
  x: number
  y: number
  width: number
  height: number
  imagePath: string
  solid: boolean
  scale: number
  isDoor?: boolean
  targetRoomIndex?: number
  targetEntryPointKey?: string
}

export interface Room {
  name: string
  tileMap: Tile[][]
  decorations: DecorationProps[]
  entryPoints: { [key: string]: { x: number, y: number } }
}

export class Decoration {
  public type: string
  public x: number
  public y: number
  public width: number
  public height: number
  public imagePath: string
  public image: HTMLImageElement
  public solid: boolean // Whether characters can pass through
  public scale: number
  public loaded: boolean
  public isDoor?: boolean
  public targetRoomIndex?: number
  public targetEntryPointKey?: string
  
  constructor(props: DecorationProps) {
    this.type = props.type
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.imagePath = props.imagePath
    this.solid = props.solid
    this.scale = props.scale
    this.isDoor = props.isDoor
    this.targetRoomIndex = props.targetRoomIndex
    this.targetEntryPointKey = props.targetEntryPointKey
    this.loaded = false
    
    // Load image
    this.image = new Image()
    this.image.src = this.imagePath
    this.image.onload = () => {
      this.loaded = true
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.loaded) return
    
    ctx.drawImage(
      this.image,
      0, 0, this.width, this.height,
      this.x, this.y, this.width * this.scale, this.height * this.scale
    )
  }
  
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width * this.scale,
      height: this.height * this.scale
    }
  }
}

export class WorldEnvironment {
  public tiles: Tile[][]
  public decorations: Decoration[]
  public tileImages: Map<TileType, HTMLImageElement>
  public tileSize: number
  public mapWidth: number
  public mapHeight: number
  public tilesLoaded: boolean
  public backgroundImage: HTMLImageElement | null
  public backgroundLoaded: boolean
  public rooms: Room[]
  public currentRoomIndex: number
  
  constructor(width: number, height: number, tileSize: number = 64) {
    this.tileSize = tileSize
    // These will be set by loadRoom
    this.mapWidth = 0 
    this.mapHeight = 0
    this.tiles = []
    this.decorations = []
    this.tileImages = new Map()
    this.tilesLoaded = false
    this.backgroundImage = null
    this.backgroundLoaded = false
    this.rooms = []
    this.currentRoomIndex = 0
    
    // Load background image (can be common or room-specific)
    this.loadBackgroundImage()

    // Define the initial world as the first room
    const sampleRoom = this.createSampleWorld(width, height, tileSize)
    this.addRoom(sampleRoom)

    // Create and add the indoor house room
    const indoorHouseRoom = this.createIndoorHouseRoom(tileSize)
    this.addRoom(indoorHouseRoom)
    
    this.loadRoom(0) // Load the initial outdoor room
  }
  
  addRoom(room: Room): void {
    this.rooms.push(room)
  }

  loadRoom(roomIndex: number): void {
    if (roomIndex < 0 || roomIndex >= this.rooms.length) {
      console.error(`Invalid roomIndex: ${roomIndex}`)
      return
    }

    this.currentRoomIndex = roomIndex
    const room = this.rooms[roomIndex]

    // Clear existing tiles and decorations
    this.tiles = []
    this.decorations = []

    // Populate tiles
    this.tiles = room.tileMap.map(row => 
      row.map(tileData => ({ ...tileData }))
    )
    
    // Update map dimensions
    if (room.tileMap.length > 0) {
      this.mapHeight = room.tileMap.length
      this.mapWidth = room.tileMap[0].length
    } else {
      this.mapHeight = 0
      this.mapWidth = 0
    }
    
    // Populate decorations
    room.decorations.forEach(decorationProp => {
      this.addDecoration(new Decoration(decorationProp))
    })
  }
  private loadBackgroundImage(): void {
    this.backgroundImage = new Image()
    this.backgroundImage.src = '/images/assets/Tiles/Grass_Middle.png'
    this.backgroundImage.onload = () => {
      this.backgroundLoaded = true
    }
  }
  
  async loadTileImages(): Promise<void> {
    const tileImagePaths = {
      [TileType.GRASS]: '/images/assets/Tiles/Grass_Middle.png',
      [TileType.WATER]: '/images/assets/Tiles/Water_Middle.png',
      [TileType.PATH]: '/images/assets/Tiles/Path_Middle.png',
      [TileType.BEACH]: '/images/assets/Tiles/Beach_Tile.png',
      [TileType.FARMLAND]: '/images/assets/Tiles/FarmLand_Tile.png',
      [TileType.CLIFF]: '/images/assets/Tiles/Cliff_Tile.png'
    }
    
    const promises = Object.entries(tileImagePaths).map(([type, path]) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
          this.tileImages.set(type as TileType, img)
          resolve()
        }
      })
    })
    
    await Promise.all(promises)
    this.tilesLoaded = true
  }
  
  // Set a specific tile type
  setTile(x: number, y: number, type: TileType, walkable: boolean = true): void {
    if (y >= 0 && y < this.tiles.length && x >= 0 && x < this.tiles[y].length) {
      this.tiles[y][x].type = type
      this.tiles[y][x].walkable = walkable
    }
  }
  
  // Create a rectangle of tiles
  createTileArea(startX: number, startY: number, width: number, height: number, type: TileType, walkable: boolean = true): void {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        this.setTile(x, y, type, walkable)
      }
    }
  }
  
  // Add a decoration to the world
  addDecoration(decoration: Decoration): void {
    this.decorations.push(decoration)
  }
  
  // Check if a position collides with any solid decoration
  checkDecorationCollision(bounds: { x: number, y: number, width: number, height: number }): boolean {
    for (const decoration of this.decorations) {
      if (!decoration.solid) continue
      
      const decorBounds = decoration.getBounds()
      
      // Simple AABB collision check
      if (
        bounds.x < decorBounds.x + decorBounds.width &&
        bounds.x + bounds.width > decorBounds.x &&
        bounds.y < decorBounds.y + decorBounds.height &&
        bounds.y + bounds.height > decorBounds.y
      ) {
        return true
      }
    }
    
    return false
  }
  
  // Check if a position is on a walkable tile
  isWalkable(worldX: number, worldY: number): boolean {
    // Convert world coordinates to tile coordinates
    const tileX = Math.floor(worldX / this.tileSize)
    const tileY = Math.floor(worldY / this.tileSize)
    
    // Check bounds
    if (tileY < 0 || tileY >= this.tiles.length || tileX < 0 || tileX >= this.tiles[tileY].length) {
      return false
    }
    
    return this.tiles[tileY][tileX].walkable
  }
  
  // Render the world
  render(ctx: CanvasRenderingContext2D, viewportX: number, viewportY: number, viewportWidth: number, viewportHeight: number): void {
    // First, fill the entire viewport with a background color
    ctx.fillStyle = '#0A1628'; // Dark blue background
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    
    // Render base grass background
    if (this.backgroundLoaded && this.backgroundImage) {
      // Use pattern to render background tiles
      const pattern = ctx.createPattern(this.backgroundImage, 'repeat');
      if (pattern) {
        ctx.save();
        // Adjust pattern for viewport offset
        ctx.translate(-viewportX % this.tileSize, -viewportY % this.tileSize);
        ctx.fillStyle = pattern;
        ctx.fillRect(
          -this.tileSize + (viewportX % this.tileSize), 
          -this.tileSize + (viewportY % this.tileSize), 
          viewportWidth + this.tileSize * 2, 
          viewportHeight + this.tileSize * 2
        );
        ctx.restore();
      }
    }
    
    if (!this.tilesLoaded) return;
    
    // Calculate visible tile range
    const startTileX = Math.max(0, Math.floor(viewportX / this.tileSize));
    const startTileY = Math.max(0, Math.floor(viewportY / this.tileSize));
    const endTileX = Math.min(this.mapWidth, Math.ceil((viewportX + viewportWidth) / this.tileSize));
    const endTileY = Math.min(this.mapHeight, Math.ceil((viewportY + viewportHeight) / this.tileSize));
    
    // Render visible tiles that are not grass (since grass is already rendered as background)
    for (let y = startTileY; y < endTileY; y++) {
      for (let x = startTileX; x < endTileX; x++) {
        const tile = this.tiles[y][x];
        // Skip grass tiles as they're rendered as background
        if (tile.type === TileType.GRASS) continue;
        
        const image = this.tileImages.get(tile.type);
        if (image) {
          // Render tile with proper size
          ctx.drawImage(
            image,
            0, 0, image.width, image.height, // Source rectangle (use full image)
            tile.x - viewportX, tile.y - viewportY, this.tileSize, this.tileSize // Destination rectangle
          );
        }
      }
    }
    
    // Render decorations that are in the viewport
    for (const decoration of this.decorations) {
      const bounds = decoration.getBounds()
      
      // Check if decoration is visible in viewport
      if (
        bounds.x + bounds.width > viewportX &&
        bounds.x < viewportX + viewportWidth &&
        bounds.y + bounds.height > viewportY &&
        bounds.y < viewportY + viewportHeight
      ) {
        // Create a copy of the decoration with position adjusted for viewport
        const adjustedDecoration = new Decoration({
          type: decoration.type,
          x: decoration.x - viewportX,
          y: decoration.y - viewportY,
          width: decoration.width,
          height: decoration.height,
          imagePath: decoration.imagePath,
          solid: decoration.solid,
          scale: decoration.scale,
          isDoor: decoration.isDoor,
          targetRoomIndex: decoration.targetRoomIndex,
          targetEntryPointKey: decoration.targetEntryPointKey
        });
        
        // Use the original loaded image for faster rendering
        adjustedDecoration.image = decoration.image;
        adjustedDecoration.loaded = decoration.loaded;
        
        adjustedDecoration.render(ctx);
      }
    }
  }
  
  // Create a sample world and return it as a Room object
  createSampleWorld(width: number, height: number, tileSize: number): Room {
    const tiles: Tile[][] = []
    // Initialize empty tile grid
    for (let y = 0; y < height; y++) {
      tiles[y] = []
      for (let x = 0; x < width; x++) {
        tiles[y][x] = {
          type: TileType.GRASS,
          x: x * tileSize,
          y: y * tileSize,
          width: tileSize,
          height: tileSize,
          walkable: true
        }
      }
    }

    // Helper to set a specific tile type in the local tiles array
    const setLocalTile = (loopX: number, loopY: number, type: TileType, walkable: boolean = true) => {
      if (loopY >= 0 && loopY < tiles.length && loopX >= 0 && loopX < tiles[loopY].length) {
        tiles[loopY][loopX].type = type
        tiles[loopY][loopX].walkable = walkable
      }
    }

    // Helper to create a rectangle of tiles in the local tiles array
    const createLocalTileArea = (startX: number, startY: number, areaWidth: number, areaHeight: number, type: TileType, walkable: boolean = true) => {
      for (let y = startY; y < startY + areaHeight; y++) {
        for (let x = startX; x < startX + areaWidth; x++) {
          setLocalTile(x, y, type, walkable)
        }
      }
    }

    // Add a water pond
    createLocalTileArea(5, 5, 6, 4, TileType.WATER, false)
    
    // Add paths
    createLocalTileArea(3, 10, 20, 1, TileType.PATH)
    createLocalTileArea(12, 10, 1, 10, TileType.PATH)
    createLocalTileArea(12, 20, 10, 1, TileType.PATH)
    createLocalTileArea(22, 10, 1, 10, TileType.PATH)
    createLocalTileArea(18, 15, 4, 1, TileType.PATH)
    createLocalTileArea(8, 15, 4, 1, TileType.PATH)
    
    // Add a farming area
    createLocalTileArea(15, 5, 4, 3, TileType.FARMLAND)
    
    // Add cliffs
    createLocalTileArea(20, 1, 5, 5, TileType.CLIFF, false)
    
    // Add a beach area
    createLocalTileArea(5, 15, 8, 3, TileType.BEACH)
    
    const decorations: DecorationProps[] = []
    // Add decorations
    for (let i = 0; i < 5; i++) {
      decorations.push({
        type: 'tree',
        x: 300 + i * 100,
        y: 150,
        width: 128,
        height: 128,
        imagePath: '/images/assets/Outdoor decoration/Oak_Tree.png',
        solid: true,
        scale: 1
      })
    }
    
    for (let i = 0; i < 3; i++) {
      decorations.push({
        type: 'tree-small',
        x: 350 + i * 80,
        y: 200,
        width: 64,
        height: 64,
        imagePath: '/images/assets/Outdoor decoration/Oak_Tree_Small.png',
        solid: true,
        scale: 1
      })
    }
    
    decorations.push({
      type: 'house',
      x: 700,
      y: 300,
      width: 192,
      height: 192,
      imagePath: '/images/assets/Outdoor decoration/House.png',
      solid: true, // Remains solid for appearance
      scale: 1,
      isDoor: true,
      targetRoomIndex: 1, // Points to the IndoorHouse room
      targetEntryPointKey: 'mainDoor'
    })
    
    decorations.push({
      type: 'bridge',
      x: 350,
      y: 350,
      width: 64,
      height: 128,
      imagePath: '/images/assets/Outdoor decoration/Bridge_Wood.png',
      solid: false,
      scale: 1
    })
    
    decorations.push({
      type: 'chest',
      x: 760,
      y: 480,
      width: 32,
      height: 32,
      imagePath: '/images/assets/Outdoor decoration/Chest.png',
      solid: true,
      scale: 1
    })
    
    for (let i = 0; i < 5; i++) {
      decorations.push({
        type: 'fence',
        x: 400 + i * 32,
        y: 500,
        width: 32,
        height: 32,
        imagePath: '/images/assets/Outdoor decoration/Fences.png',
        solid: true,
        scale: 1
      })
    }

    return {
      name: 'Outdoor World',
      tileMap: tiles,
      decorations: decorations,
      entryPoints: { 
        'default': { x: tileSize * 2, y: tileSize * 2 },
        'houseExit': { x: 700 + (192/2), y: 300 + 192 + 20 } // Entry point when exiting the house
      } 
    }
  }

  createIndoorHouseRoom(tileSize: number): Room {
    const roomWidth = 10
    const roomHeight = 8
    const tiles: Tile[][] = []

    // Initialize empty tile grid with PATH tiles
    for (let y = 0; y < roomHeight; y++) {
      tiles[y] = []
      for (let x = 0; x < roomWidth; x++) {
        tiles[y][x] = {
          type: TileType.PATH, // Using PATH as wood floor
          x: x * tileSize,
          y: y * tileSize,
          width: tileSize,
          height: tileSize,
          walkable: true
        }
      }
    }

    const decorations: DecorationProps[] = []

    // Add a table (using Chest.png as a placeholder)
    decorations.push({
      type: 'table',
      x: 3 * tileSize,
      y: 3 * tileSize,
      width: 64, // Actual image width for Chest.png
      height: 32, // Actual image height for Chest.png
      imagePath: '/images/assets/Outdoor decoration/Chest.png',
      solid: true,
      scale: 1 
    })

    // Add an exit door (using House.png scaled down)
    const exitDoorHeight = 64 // Scaled down height
    decorations.push({
      type: 'door_exit',
      x: 5 * tileSize - (32 / 2), // Centered
      y: (roomHeight -1) * tileSize - exitDoorHeight + tileSize/2, // Positioned at the bottom edge, slight offset up
      width: 192, // Original House.png width
      height: 192, // Original House.png height
      imagePath: '/images/assets/Outdoor decoration/House.png',
      solid: false, // Non-solid to allow interaction
      scale: 0.33, // Scaled down to represent an indoor door
      isDoor: true,
      targetRoomIndex: 0, // Points back to the Outdoor World
      targetEntryPointKey: 'houseExit'
    })

    return {
      name: 'IndoorHouse',
      tileMap: tiles,
      decorations: decorations,
      entryPoints: {
        'mainDoor': { x: 5 * tileSize, y: (roomHeight - 2) * tileSize } // Appear near the bottom, in front of the door
      }
    }
  }
}