const Contact = require("../model/contacts");
const { httpCode } = require("../helpers/constant");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contact.listContacts(userId, req.query);
    return res.json({
      status: "success",
      code: httpCode.OK,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const contactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contact.getContactById(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: "success",
        code: httpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: "error",
        code: httpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const createContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contact.addContact({ ...req.body, owner: userId });
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.json({
        status: "error",
        code: httpCode.BAD_REQUEST,
        message: "missing required name field",
      });
    }
    return res.json({
      status: "success",
      code: httpCode.CREATED,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contact.removeContact(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: "success",
        code: httpCode.OK,
        message: "contact deleted",
        data: {
          contact,
        },
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: "error",
        code: httpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contact.updateContact(
      req.params.contactId,
      req.body,
      userId
    );
    if (JSON.stringify(req.body) === "{}") {
      return res.json({
        status: "error",
        code: httpCode.BAD_REQUEST,
        message: "missing fields",
      });
    }
    if (contact) {
      return res.json({
        status: "success",
        code: httpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: "error",
        code: httpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  contactById,
  createContact,
  deleteContact,
  updateContact,
};
