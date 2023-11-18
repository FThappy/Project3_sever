const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

//UPDATE
router.put("/uploadImage/:id",verifyTokenAndAuthorization,async (req,res)=>{
    console.log(req.body);
    try {
        const userUpdateImage = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              img: req.body.img,
            },
          },
          { new: true }
        );
        res
          .status(200)
          .json({
            msg: "Upload ảnh thành công",
            user : userUpdateImage,
            code: 0,
          });
    } catch (error) {
        res.status(500).json({msg: "Upload ảnh thất bại",code:1})
    }

})




module.exports = router;