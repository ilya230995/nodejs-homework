const express = require("express");
const router = express.Router();
const guard = require("../../../helpers/guard");
const contactsController = require("../../../controllers/contacts");
const validate = require("./validation");

router.get("/", guard, contactsController.getAll);

router.get("/:contactId", guard, contactsController.contactById);

router.post(
  "/",
  guard,
  validate.createContact,
  contactsController.createContact
);

router.delete("/:contactId", guard, contactsController.deleteContact);

router.patch(
  "/:contactId",
  guard,
  validate.updateContact,
  contactsController.updateContact
);

module.exports = router;
