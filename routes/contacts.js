const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
});

// @route   POST api/contacts
// @desc    Add a contact
// @access  Private
router.post(
  "/",
  [auth, body("name", "Name is required").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.status(200).json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error...");
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    
    if (!contact) return res.status(404).json({ msg: "No contact found" });
    
    if (req.user.id !== contact.user.toString()) return res.status(401).json({ msg: "Invalid request" });
    
    contact = await Contact.findByIdAndUpdate(req.params.id, 
        { $set: contactFields },
        { new: true });

    res.status(200).json(contact);    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({msg : "Unable to process your request"});
  }
});

// @route   POST api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete("/:id", auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);
    
        if (!contact) return res.status(404).json({ msg: "No contact found" });
        
        if (req.user.id !== contact.user.toString()) return res.status(401).json({ msg: "Invalid request" });
        
        await Contact.findByIdAndRemove(req.params.id);
    
        res.status(200).json({ msg: "Contact deleted succesfully!" });    
      } catch (err) {
        console.error(err.message);
        res.status(500).json({msg : "Unable to process your request"});
      }
});

module.exports = router;
