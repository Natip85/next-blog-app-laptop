import db from "@/db/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorTokenEmail = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twoFactorTokenEmail;
  } catch (error) {
    return null;
  }
};
