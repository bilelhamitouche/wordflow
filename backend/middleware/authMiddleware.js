import passport from "passport";

const authenticateJWT = passport.authenticate("jwt", { session: false });

async function authorizeAdmin(req, res, next) {
  if (req.user.role.toLowerCase() !== "admin")
    return res.status(403).json({ error: "Unauthorized" });
  next();
}

export { authenticateJWT, authorizeAdmin };
