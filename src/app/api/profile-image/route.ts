import { NextRequest, NextResponse } from "next/server";

// Default profile images by role
const DEFAULT_PROFILES = {
  admin:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  seafarer:
    "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
  shipowner:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  user: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userType = searchParams.get("type") || "user";

    // For now, return default profile images
    // In production, this would fetch user profile images from database
    const profileImage =
      DEFAULT_PROFILES[userType as keyof typeof DEFAULT_PROFILES] ||
      DEFAULT_PROFILES.user;

    return NextResponse.json({
      userId,
      profileImage,
      userType,
    });
  } catch (error) {
    console.error("Profile image error:", error);
    return NextResponse.json(
      {
        error: "Failed to get profile image",
        profileImage: DEFAULT_PROFILES.user,
      },
      { status: 500 },
    );
  }
}
