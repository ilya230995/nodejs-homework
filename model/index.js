const fs = require("fs").promises;
const path = require("path");
const { customAlphabet } = require("nanoid");

const contactPath = path.join(__dirname, "./contacts.json");

const nanoid = customAlphabet("1234567890", 3);

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactPath);
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactPath);
    const parsedData = JSON.parse(data);
    const contactById = parsedData.find(
      (contact) => contact.id.toString() === contactId
    );
    return contactById;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactPath);
    const parsedData = JSON.parse(data.toString());

    const deletedContact = parsedData.find(
      (contact) => contact.id.toString() === contactId
    );

    const filterById = parsedData.filter(
      (contact) => contact.id.toString() !== contactId
    );

    await fs.writeFile(contactPath, JSON.stringify(filterById));

    return deletedContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const data = await fs.readFile(contactPath);
    const parsedData = JSON.parse(data);

    const contact = { id: Number(nanoid()), ...body };
    parsedData.push(contact);

    await fs.writeFile(contactPath, JSON.stringify(parsedData));
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactPath);
    const parsedData = JSON.parse(data);

    const contactById = parsedData.find(
      (contact) => contact.id.toString() === contactId
    );
    const updatedContact = { ...contactById, ...body };

    const filterById = parsedData.filter(
      (contact) => contact.id.toString() !== contactId
    );
    const newContactList = [updatedContact, ...filterById];
    await fs.writeFile(contactPath, JSON.stringify(newContactList));
    return contactById;
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
