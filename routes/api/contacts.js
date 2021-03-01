const express = require("express");
const router = express.Router();
const Contact = require("../../model/index");
const validate = require("./validation");

router.get("/", async (_req, res, next) => {
  try {
    const contacts = await Contact.listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", validate.createContact, async (req, res, next) => {
  try {
    const contact = await Contact.addContact(req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.json({
        status: "error",
        code: 400,
        message: "missing required name field",
      });
    }
    return res.json({
      status: "success",
      code: 201,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.removeContact(req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        message: "contact deleted",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.patch("/:contactId", validate.updateContact, async (req, res, next) => {
  try {
    const contact = await Contact.updateContact(req.params.contactId, req.body);
    if (JSON.stringify(req.body) === "{}") {
      return res.json({
        status: "error",
        code: 400,
        message: "missing fields",
      });
    }
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
