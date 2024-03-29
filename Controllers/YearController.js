import Year from "../Models/Year.js";
import mongoose from "mongoose";
export const yearController = {

  createYear: async (req, res) => {
    const { value, modelId } = req.body
    try {
      const year = await Year.create({ value, modelId })
      return res.status(200).json(year)
    }
    catch (error) {
      return res.status(404).json({ status: 404, error: error })
    }
  }
  ,
  getYearById: async (req, res) => {
    const { id } = req.params
    try {
      const year = await Year.findById(id).populate(['modelId']);
      if (!year) {
        return res.status(400).json("year Not Found")
      }
      return res.status(200).json(year)
    }
    catch (error) {
      return res.status(404).json(error.message)
    }
  }
  ,
  getYears: async (req, res) => {
    try {
      const years = await Year.find().populate(['modelId']);
      if (!years) {
        return res.status(400).json("years Not Found")
      }
      return res.status(200).json(years)
    }
    catch (error) {
      return res.status(404).json(error.message)
    }
  }
  ,
  deleteYear: async (req, res) => {
    const { id } = req.params;

    try {
      // Find and remove the Year document by ID
      const deletedYear = await Year.findByIdAndDelete(id);

      if (!deletedYear) {
        // If the document with the given ID doesn't exist
        return res.status(404).json({ error: 'Year not found' });
      }

      // Successfully deleted
      return res.status(200).json({ status: 'Year deleted' });
    } catch (error) {
      // Handle other errors, e.g., database errors
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  ,
  editYear: async (req, res) => {

    const { id } = req.params;

    try {
      // Assuming req.body contains the updated data
      const { value, modelId } = req.body;

      // Validate that value is an array with two elements
      if (!Array.isArray(value) || value.length !== 2) {
        return res.status(400).json({ error: 'Invalid year range format' });
      }

      // Assuming modelId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(modelId)) {
        return res.status(400).json({ error: 'Invalid Model ID' });
      }

      // Check if the document with the given id exists
      const existingYear = await Year.findById(id);
      if (!existingYear) {
        return res.status(404).json({ error: 'Year not found' });
      }

      // Update the Year document
      existingYear.value = value;
      existingYear.modelId = modelId;

      // Save the updated document
      await existingYear.save();

      // Respond with the updated Year document
      return res.json(existingYear);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  ,
  getByModel: async (req, res) => {
    try {
      const modelId = req.params.modelId;
      const years = await Year.find({ modelId }).exec();

      if (!years || years.length === 0) {
        return res.status(404).json({ message: 'No years found for the specified model ID.' });
      }

      return res.status(200).json(years);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  ,



}
