/**
 * Create demo users using BetterAuth's API directly
 * Run: npm run db:create-demo-users
 */

import { auth } from "@/lib/auth"

async function createDemoUsers() {
  console.log("👤 Creating demo users via BetterAuth...")

  try {
    // Create husband account
    const husband = await auth.api.signUpEmail({
      body: {
        email: "husband@familyfin.com",
        password: "password",
        name: "Husband",
      },
    })
    console.log("✅ Created husband account:", husband.user?.email)

    // Create wife account
    const wife = await auth.api.signUpEmail({
      body: {
        email: "wife@familyfin.com",
        password: "password",
        name: "Wife",
      },
    })
    console.log("✅ Created wife account:", wife.user?.email)

    console.log("\n📝 Login credentials:")
    console.log("   Email: husband@familyfin.com / Password: password")
    console.log("   Email: wife@familyfin.com / Password: password")
  } catch (error: any) {
    if (error.message?.includes("already exists") || error.code === "USER_ALREADY_EXISTS") {
      console.log("⚠️  Demo users already exist")
      console.log("\n📝 Login credentials:")
      console.log("   Email: husband@familyfin.com / Password: password")
      console.log("   Email: wife@familyfin.com / Password: password")
    } else {
      throw error
    }
  }
}

createDemoUsers()
  .catch((e) => {
    console.error("❌ Failed:", e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
