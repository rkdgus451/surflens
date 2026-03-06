import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AdvisorResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getLongboardRecommendation = async (profile: UserProfile): Promise<AdvisorResult> => {
  const prompt = `
    Analyze this surfer's profile as 'SurfLens Personalized Advisor'.
    
    User Profile Data:
    - Gender: ${profile.gender}, Height: ${profile.height}cm, Weight: ${profile.weight}kg
    - Current Specific Skills: ${profile.currentSkills}
    - Target Mastery: ${profile.desiredTechniques}
    - Riding Style: ${profile.style}
    - Target Spot: ${profile.preferredLocation}
    - Current Equipment: ${profile.currentBoard || 'None'}
    
    [Localized Wave Intelligence & Spot Accuracy]
    - Jeju Jungmun: Powerful, steep, and hollow. Needs rocker and refined rails.
    - Jeju Iho/Woljeong: Mellow, gentle. Needs high-volume classic logs.
    - Busan Songjeong: Soft, consistent. Ideal for all-rounders/logs.
    - Busan Dadaepo: Sensitive to tides, wide fetch. Needs stability.
    - Yangyang Jukdo/Gisamun: Diverse conditions. Versatility is key.
    - Pohang Shinhangman: Clean lines, powerful rights. Performance/Refined logs.
    - West Sea Mallipo: Soft waves, long periods. High-volume floaters essential.

    [Logic]
    1. My Progress: Evaluate growth path from current skills to target mastery.
    2. Quiver Check: Score current board (1-100) vs physical specs.
    3. Recommendations: 3 models bridging the gap.
    
    Return the result in valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      systemInstruction: `당신은 대한민국 최고 권위의 서핑 데이터 분석가 'SurfLens AI'입니다. 
      사용자의 신체 데이터와 기술 수준을 바탕으로 한국 주요 스팟의 파도 특성에 최적화된 처방을 내립니다.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: { type: Type.STRING },
          localTrend: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                modelName: { type: Type.STRING },
                brand: { type: Type.STRING },
                specs: {
                  type: Type.OBJECT,
                  properties: {
                    length: { type: Type.STRING },
                    width: { type: Type.STRING },
                    thickness: { type: Type.STRING },
                    volume: { type: Type.STRING },
                    rail: { type: Type.STRING },
                    rocker: { type: Type.STRING }
                  },
                  required: ["length", "width", "thickness", "volume", "rail", "rocker"]
                },
                reason: { type: Type.STRING }
              },
              required: ["modelName", "brand", "specs", "reason"]
            }
          },
          setupTips: { type: Type.STRING },
          expertAdvice: { type: Type.STRING },
          myProgress: {
            type: Type.OBJECT,
            properties: {
              points: { type: Type.STRING },
              badge: { type: Type.STRING }
            },
            required: ["points", "badge"]
          },
          quiverCheck: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              analysis: { type: Type.STRING }
            },
            required: ["score", "analysis"]
          },
          logData: {
            type: Type.OBJECT,
            properties: {
              user_weight: { type: Type.NUMBER },
              location: { type: Type.STRING },
              style: { type: Type.STRING },
              stamina_level: { type: Type.STRING },
              recommended_models: { type: Type.ARRAY, items: { type: Type.STRING } },
              progress_score: { type: Type.NUMBER },
              wishlist_match: { type: Type.STRING }
            },
            required: ["user_weight", "location", "style", "stamina_level", "recommended_models", "progress_score", "wishlist_match"]
          }
        },
        required: ["diagnosis", "localTrend", "recommendations", "setupTips", "expertAdvice", "myProgress", "quiverCheck", "logData"]
      }
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate recommendations.");
  }
};

export const getSpecificBoardAnalysis = async (profile: UserProfile, query: string): Promise<string> => {
  const prompt = `
    Based on this user's profile, analyze their question: "${query}"
    
    User Profile:
    - Height: ${profile.height}cm, Weight: ${profile.weight}kg, Skill: ${profile.skill}, Style: ${profile.style}
    - Current Skills: ${profile.currentSkills}, Desired: ${profile.desiredTechniques}
    - Target Spot: ${profile.preferredLocation}
    
    The user is asking about a specific board or needs a comparison. Provide a technical, data-driven response in Korean. 
    Focus on geometry (Volume, Rocker, Rail) and whether it helps them achieve their goals in their target spot.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      systemInstruction: "당신은 서핑 보드 엔지니어 관점에서 특정 보드가 사용자에게 적합한지 분석하는 'SurfLens 전문 분석가'입니다. 매우 구체적이고 기술적인 근거를 들어 답변하세요.",
    },
  });

  return response.text || "분석 결과를 가져오지 못했습니다.";
};
