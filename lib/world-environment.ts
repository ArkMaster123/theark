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
  
  constructor(props: DecorationProps) {
    this.type = props.type
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.imagePath = props.imagePath
    this.solid = props.solid
    this.scale = props.scale
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
  
  constructor(width: number, height: number, tileSize: number = 64) {
    this.tileSize = tileSize
    this.mapWidth = width
    this.mapHeight = height
    this.tiles = []
    this.decorations = []
    this.tileImages = new Map()
    this.tilesLoaded = false
    this.backgroundImage = null
    this.backgroundLoaded = false
    
    // Initialize empty tile grid
    for (let y = 0; y < height; y++) {
      this.tiles[y] = []
      for (let x = 0; x < width; x++) {
        // Default to grass tiles
        this.tiles[y][x] = {
          type: TileType.GRASS,
          x: x * tileSize,
          y: y * tileSize,
          width: tileSize,
          height: tileSize,
          walkable: true
        }
      }
    }
    
    // Load background image
    this.loadBackgroundImage()
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
          scale: decoration.scale
        });
        
        // Use the original loaded image for faster rendering
        adjustedDecoration.image = decoration.image;
        adjustedDecoration.loaded = decoration.loaded;
        
        adjustedDecoration.render(ctx);
      }
    }
  }
  
  // Create a sample world with a mix of different tiles and decorations
  createSampleWorld(): void {
    // Create a central grass area (already the default)
    
    // Add a water pond - make it larger so it's clearly visible
    this.createTileArea(5, 5, 6, 4, TileType.WATER, false)
    
    // Add a path that goes around the world
    // Horizontal path
    this.createTileArea(3, 10, 20, 1, TileType.PATH)
    // Vertical path 
    this.createTileArea(12, 10, 1, 10, TileType.PATH)
    
    // Add a larger farming area
    this.createTileArea(15, 5, 4, 3, TileType.FARMLAND)
    
    // Add cliffs in the top right corner
    this.createTileArea(20, 1, 5, 5, TileType.CLIFF, false)
    
    // Add a beach area at the bottom
    this.createTileArea(5, 15, 8, 3, TileType.BEACH)
    
    // Add decorations
    // Trees - place multiple trees to create a forest area
    for (let i = 0; i < 5; i++) {
      this.addDecoration(new Decoration({
        type: 'tree',
        x: 300 + i * 100,
        y: 150,
        width: 128,
        height: 128,
        imagePath: '/images/assets/Outdoor decoration/Oak_Tree.png',
        solid: true,
        scale: 1
      }))
    }
    
    // Small trees
    for (let i = 0; i < 3; i++) {
      this.addDecoration(new Decoration({
        type: 'tree-small',
        x: 350 + i * 80,
        y: 200,
        width: 64,
        height: 64,
        imagePath: '/images/assets/Outdoor decoration/Oak_Tree_Small.png',
        solid: true,
        scale: 1
      }))
    }
    
    // House
    this.addDecoration(new Decoration({
      type: 'house',
      x: 700,
      y: 300,
      width: 192,
      height: 192,
      imagePath: '/images/assets/Outdoor decoration/House.png',
      solid: true,
      scale: 1
    }))
    
    // Bridge crossing the water
    this.addDecoration(new Decoration({
      type: 'bridge',
      x: 350,
      y: 350,
      width: 64,
      height: 128,
      imagePath: '/images/assets/Outdoor decoration/Bridge_Wood.png',
      solid: false,
      scale: 1
    }))
    
    // Chest
    this.addDecoration(new Decoration({
      type: 'chest',
      x: 650,
      y: 400,
      width: 32,
      height: 32,
      imagePath: '/images/assets/Outdoor decoration/Chest.png',
      solid: true,
      scale: 1
    }))
    
    // Fences around the farm area
    for (let i = 0; i < 5; i++) {
      this.addDecoration(new Decoration({
        type: 'fence',
        x: 400 + i * 32,
        y: 500,
        width: 32,
        height: 32,
        imagePath: '/images/assets/Outdoor decoration/Fences.png',
        solid: true,
        scale: 1
      }))
    }
  }
} 