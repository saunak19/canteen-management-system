
const Menu = require('../models/Menu')
// controllers/menuController.js
exports.updateMenuPricing = async (req, res) => {
    const { menuId } = req.params;
    const { price, subsidyAmount } = req.body;
  
    try {
      const menu = await Menu.findById(menuId);
      if (!menu) {
        return res.status(404).json({ error: "Menu item not found" });
      }
  
      menu.price = price;
      menu.subsidyAmount = subsidyAmount;
      menu.employeePayable = price - subsidyAmount;
  
      await menu.save();
      res.json({ success: true, message: "Pricing updated", menu });
    } catch (error) {
      res.status(500).json({ error: "Failed to update pricing" });
    }
  };
  