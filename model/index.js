const Contact = require("./schemas/contactsSchemas");

const listContacts = async () => {
  try {
    const result = await Contact.find({});
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const result = await Contact.find({ _id: contactId });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndRemove({ _id: contactId });
    return result;
  } catch (error) {
    console.log(error);
  }
};
const addContact = async (body) => {
  try {
    const result = await Contact.create(body);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
