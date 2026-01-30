const service = require("../../service/import/importService");
const {responseHandler} = require("../../middleware/response-handler");

exports.getImportHistory = async (req, res, next) => {
  try {
    const query = req.query;
   
    const result = await service.histroy(query);
    console.log("🚀 ~ result:", result)
    
    return responseHandler(result, res, "Success", 200);
   
  } catch (err) {
    next(err);
  }
};
