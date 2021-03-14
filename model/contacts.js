const Contact = require("./schemas/contact");

const listContacts = async (userId, { filter, limit = "20", page = "1" }) => {
  try {
    const result = await Contact.paginate(
      { owner: userId },
      {
        limit,
        page,
        select: filter ? filter.split("|").join(" ") : "",
        populate: {
          path: "owner",
          select: "name email",
        },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({
      path: "owner",
      select: "name email",
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const result = await Contact.findOneAndRemove({
      _id: contactId,
      owner: userId,
    }).populate({
      path: "owner",
      select: "name email",
    });
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

const updateContact = async (contactId, body, userId) => {
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true }
    ).populate({
      path: "owner",
      select: "name email",
    });
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
