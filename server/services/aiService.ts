import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "default_key"
});

interface SceneObject {
  assetId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  tags: string[];
}

interface GeneratedScene {
  objects: SceneObject[];
}

const AVAILABLE_ASSETS = [
  "bed_01",
  "table_01", 
  "lamp_01",
  "chair_01",
  "rug_01",
  "plant_01",
  "window_01",
  "frame_01"
];

const PLACEMENT_RULES = [
  "Rugs should be centered in the room or under furniture",
  "Lamps should be placed near beds, tables, or in corners",
  "Picture frames should be on walls (positive Z coordinates)",
  "Plants work well in corners or near windows",
  "Tables should have adequate space around them",
  "Beds are typically against walls",
  "Windows are usually on exterior walls"
];

export async function generateScene(prompt: string): Promise<GeneratedScene> {
  try {
    const systemPrompt = `You are an interior design AI that generates 3D room layouts. 

Available assets: ${AVAILABLE_ASSETS.join(", ")}

Placement rules:
${PLACEMENT_RULES.join("\n")}

Grid system: Objects snap to a grid with 0.5 unit increments. Room bounds are approximately -10 to +10 on X and Z axes.

Generate a scene layout based on the user's description. Respond with JSON in this exact format:
{
  "objects": [
    {
      "assetId": "bed_01",
      "position": [x, y, z],
      "rotation": [rx, ry, rz], 
      "scale": [sx, sy, sz],
      "tags": ["bed", "sleep"]
    }
  ]
}

Guidelines:
- Use realistic positioning and spacing
- Y position is usually 0 (floor level)
- Rotations are in radians
- Scale is usually [1, 1, 1] unless specified
- Include 3-8 objects for a balanced scene
- Follow proper interior design principles`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from AI");
    }

    const scene = JSON.parse(content);
    
    // Validate the scene structure
    if (!scene.objects || !Array.isArray(scene.objects)) {
      throw new Error("Invalid scene structure");
    }

    // Validate each object
    for (const obj of scene.objects) {
      if (!AVAILABLE_ASSETS.includes(obj.assetId)) {
        // Replace with a default asset if invalid
        obj.assetId = "table_01";
      }
      
      // Ensure position is valid
      if (!Array.isArray(obj.position) || obj.position.length !== 3) {
        obj.position = [0, 0, 0];
      }
      
      // Ensure rotation is valid
      if (!Array.isArray(obj.rotation) || obj.rotation.length !== 3) {
        obj.rotation = [0, 0, 0];
      }
      
      // Ensure scale is valid
      if (!Array.isArray(obj.scale) || obj.scale.length !== 3) {
        obj.scale = [1, 1, 1];
      }
      
      // Ensure tags exist
      if (!Array.isArray(obj.tags)) {
        obj.tags = [];
      }
    }

    return scene;
    
  } catch (error) {
    console.error("AI service error:", error);
    
    // Return a fallback scene
    return {
      objects: [
        {
          assetId: "table_01",
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          tags: ["table", "furniture"]
        }
      ]
    };
  }
}
