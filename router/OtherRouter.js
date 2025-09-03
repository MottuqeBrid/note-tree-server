const expres = require("express");
const { verifyToken } = require("../lib/jwt");
const OtherSchema = require("../schema/OtherSchema");
const NewsletterSchema = require("../schema/NewsletterSchema");
const router = expres.Router();

router.post("/cover", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { coverDemo } = req.body;

    const cover = await OtherSchema.create({ coverDemo: { ...coverDemo } });

    await cover.save();
    res.status(201).json(cover);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/cover", verifyToken, async (req, res) => {
  try {
    const { coverDemo } = req.body;

    // Find the note by ID and update the coverDemo field
    const cover = await OtherSchema.find();

    if (!cover) {
      return res.status(404).json({ message: "Note not found" });
    }
    cover[0].coverDemo = { ...coverDemo };

    await cover[0].save();
    res.json({ success: true, cover: cover[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/cover", async (req, res) => {
  try {
    const cover = (await OtherSchema.find()).reverse();

    res.status(200).json({ cover: cover[0], success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/hero", verifyToken, async (req, res) => {
  try {
    const { hero } = req.body;

    // Find the note by ID and update the hero field
    const Hero = await OtherSchema.findOne();

    if (!Hero) {
      return res.status(404).json({ message: "Note not found" });
    }
    Hero.hero = { ...hero };

    await Hero.save();
    res.json({ success: true, hero: Hero.hero });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/hero", async (req, res) => {
  try {
    const Hero = await OtherSchema.findOne();

    if (!Hero) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ success: true, hero: Hero.hero });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    await NewsletterSchema.create({ email });
    res
      .status(201)
      .json({ success: true, message: "Email added to newsletter" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.delete("/newsletter/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await NewsletterSchema.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Email removed from newsletter" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.get("/newsletter", verifyToken, async (req, res) => {
  try {
    const newsletters = await NewsletterSchema.find();
    res.status(200).json({ success: true, newsletters });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
